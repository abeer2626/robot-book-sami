---
title: "Chapter 5: Simultaneous Localization and Mapping (SLAM)"
description: "Building maps while localizing within them"
learningObjectives:
  - Understand SLAM problem formulation
  - Implement EKF-SLAM algorithm
  - Learn particle filter approaches
  - Explore visual SLAM techniques
estimatedReadingTime: 65
---

# Chapter 5: Simultaneous Localization and Mapping (SLAM)

## Introduction

SLAM solves the chicken-and-egg problem of robotics: a robot needs a map to localize itself, but needs to know its location to build a map. This chapter explores how robots simultaneously build maps and track their position.

## Problem Formulation

### Mathematical Definition

Given:
- Control inputs `u₁:t`
- Sensor measurements `z₁:t`

Estimate:
- Robot pose `x₁:t`
- Map `m`

### SLAM Types

1. **Online SLAM**: Estimate current pose and map
2. **Full SLAM**: Estimate entire trajectory and map
3. **Graph SLAM**: Poses as nodes, constraints as edges

## EKF-SLAM

### Extended Kalman Filter

```python
import numpy as np

class EKF_SLAM:
    def __init__(self, num_landmarks):
        # State vector: [x, y, theta, l1_x, l1_y, l2_x, l2_y, ...]
        self.state_size = 3 + 2 * num_landmarks
        self.state = np.zeros(self.state_size)

        # Covariance matrix
        self.P = np.eye(self.state_size) * 0.1

        # Process and measurement noise
        self.Q = np.eye(3) * 0.01  # Motion noise
        self.R = np.eye(2) * 0.1    # Measurement noise

    def predict(self, u):
        """Prediction step"""
        v, omega = u  # Linear and angular velocity
        dt = 0.1  # Time step

        # Current robot pose
        x, y, theta = self.state[:3]

        # Motion model
        self.state[0] += v * np.cos(theta) * dt
        self.state[1] += v * np.sin(theta) * dt
        self.state[2] += omega * dt

        # Jacobian of motion model
        G = np.eye(self.state_size)
        G[0, 2] = -v * np.sin(theta) * dt
        G[1, 2] = v * np.cos(theta) * dt

        # Update covariance
        self.P = G @ self.P @ G.T + self.Q_extended

    def update(self, z):
        """Update step with landmark measurement"""
        landmark_id = int(z[2])

        if landmark_id >= 0:  # Known landmark
            # Expected measurement
            x, y, theta = self.state[:3]
            lx = self.state[3 + 2*landmark_id]
            ly = self.state[4 + 2*landmark_id]

            dx = lx - x
            dy = ly - y
            d = np.sqrt(dx**2 + dy**2)

            z_expected = np.array([d, np.arctan2(dy, dx) - theta])

            # Measurement Jacobian
            H = np.zeros((2, self.state_size))
            H[0, 0] = -dx/d
            H[0, 1] = -dy/d
            H[0, 3+2*landmark_id] = dx/d
            H[0, 4+2*landmark_id] = dy/d
            H[1, 0] = dy/d**2
            H[1, 1] = -dx/d**2
            H[1, 2] = -1
            H[1, 3+2*landmark_id] = -dy/d**2
            H[1, 4+2*landmark_id] = dx/d**2

            # Kalman gain
            S = H @ self.P @ H.T + self.R
            K = self.P @ H.T @ np.linalg.inv(S)

            # Update state and covariance
            innovation = z[:2] - z_expected
            self.state += K @ innovation
            self.P = (np.eye(self.state_size) - K @ H) @ self.P

        else:  # New landmark
            # Initialize landmark position
            x, y, theta = self.state[:3]
            d = z[0]
            bearing = z[1] + theta

            lx = x + d * np.cos(bearing)
            ly = y + d * np.sin(bearing)

            # Add to state
            landmark_idx = len(self.state) - 3
            self.state = np.append(self.state, [lx, ly])

            # Expand covariance matrix
            new_size = len(self.state)
            new_P = np.zeros((new_size, new_size))
            new_P[:self.P.shape[0], :self.P.shape[1]] = self.P
            self.P = new_P
```

## Particle Filter SLAM

### FastSLAM

```python
class Particle:
    def __init__(self):
        self.pose = np.array([0, 0, 0])  # x, y, theta
        self.landmarks = {}  # {id: [mean, covariance]}
        self.weight = 1.0

class FastSLAM:
    def __init__(self, num_particles=100):
        self.particles = [Particle() for _ in range(num_particles)]
        self.num_particles = num_particles

    def predict(self, u):
        """Motion prediction for all particles"""
        for particle in self.particles:
            # Add motion noise
            v = u[0] + np.random.normal(0, 0.1)
            omega = u[1] + np.random.normal(0, 0.05)

            # Update pose
            particle.pose[0] += v * np.cos(particle.pose[2]) * 0.1
            particle.pose[1] += v * np.sin(particle.pose[2]) * 0.1
            particle.pose[2] += omega * 0.1

    def update(self, z):
        """Measurement update"""
        for particle in self.particles:
            landmark_id = int(z[2])

            if landmark_id in particle.landmarks:
                # Update known landmark with EKF
                self.update_landmark(particle, landmark_id, z)
            else:
                # Initialize new landmark
                particle.landmarks[landmark_id] = self.initialize_landmark(
                    particle.pose, z
                )

            # Update particle weight
            particle.weight *= self.calculate_likelihood(
                particle.pose, particle.landmarks[landmark_id], z
            )

    def resample(self):
        """Resample particles based on weights"""
        weights = [p.weight for p in self.particles]
        total_weight = sum(weights)

        if total_weight > 0:
            weights = [w/total_weight for w in weights]

            # Low variance resampling
            new_particles = []
            r = np.random.uniform(0, 1/self.num_particles)
            c = weights[0]
            i = 0

            for m in range(self.num_particles):
                u = r + m/self.num_particles
                while u > c:
                    i += 1
                    c += weights[i]

                new_particles.append(copy.deepcopy(self.particles[i]))

            self.particles = new_particles
```

## Visual SLAM

### Feature Detection and Matching

```python
import cv2
import numpy as np

class VisualSLAM:
    def __init__(self):
        self.feature_detector = cv2.ORB_create()
        self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

        self.keypoints = []
        self.descriptors = []
        self.poses = []

    def process_frame(self, frame):
        """Process a single frame"""
        # Detect features
        kp, des = self.feature_detector.detectAndCompute(frame, None)

        if len(self.descriptors) > 0:
            # Match with previous frame
            matches = self.matcher.match(des, self.descriptors[-1])

            # Filter good matches
            good_matches = sorted(matches, key=lambda x: x.distance)[:50]

            if len(good_matches) > 10:
                # Estimate motion
                self.estimate_motion(good_matches, kp, self.keypoints[-1])

        # Store current features
        self.keypoints.append(kp)
        self.descriptors.append(des)

    def estimate_motion(self, matches, kp1, kp2):
        """Estimate camera motion from feature matches"""
        pts1 = np.float32([kp1[m.queryIdx].pt for m in matches]).reshape(-1, 2)
        pts2 = np.float32([kp2[m.trainIdx].pt for m in matches]).reshape(-1, 2)

        # Essential matrix
        E, mask = cv2.findEssentialMat(pts1, pts2, focal=1.0, pp=(0, 0),
                                      method=cv2.RANSAC, prob=0.999, threshold=1.0)

        # Recover pose
        _, R, t, mask = cv2.recoverPose(E, pts1, pts2)

        # Store pose (simplified)
        if len(self.poses) == 0:
            self.poses.append(np.eye(4))
        else:
            T = np.eye(4)
            T[:3, :3] = R
            T[:3, 3] = t.flatten()

            self.poses.append(self.poses[-1] @ T)
```

## Loop Closure Detection

### Visual Place Recognition

```python
class LoopClosure:
    def __init__(self):
        self.vocab = self.create_vocabulary()
        self.database = {}

    def create_vocabulary(self):
        """Create visual vocabulary"""
        # In practice: Use bag of visual words
        return {}

    def detect_loop(self, frame, frame_id):
        """Detect if current frame matches previous location"""
        features = self.extract_features(frame)

        # Compare with database
        for id, stored_features in self.database.items():
            similarity = self.calculate_similarity(features, stored_features)

            if similarity > 0.8 and abs(id - frame_id) > 100:  # Loop found
                return id

        # Add to database
        self.database[frame_id] = features
        return -1
```

## Optimization-Based SLAM

### Graph Optimization

```python
import g2o

class GraphSLAM:
    def __init__(self):
        self.optimizer = g2o.SparseOptimizer()
        self.solver = g2o.OptimizationAlgorithmLevenberg(
            g2o.BlockSolverSE2(g2o.LinearSolverDenseSE2())
        )
        self.optimizer.set_algorithm(self.solver)

        # Add robot pose vertex
        self.pose_vertex = g2o.VertexSE2()
        self.pose_vertex.set_id(0)
        self.pose_vertex.set_estimate(g2o.SE2())
        self.optimizer.add_vertex(self.pose_vertex)

    def add_odometry_constraint(self, odom):
        """Add odometry measurement"""
        edge = g2o.EdgeSE2()
        edge.set_vertex(0, self.pose_vertex)
        edge.set_measurement(g2o.SE2(odom[0], odom[1], odom[2]))

        information = np.eye(3)
        edge.set_information(information)

        self.optimizer.add_edge(edge)

    def optimize(self, iterations=10):
        """Optimize the graph"""
        self.optimizer.initialize_optimization()
        self.optimizer.optimize(iterations)
```

## Applications

1. **Autonomous vehicles**: HD mapping and localization
2. **AR/VR**: Real-world understanding
3. **Robotics**: Navigation in unknown environments
4. **Drones**: 3D mapping and inspection

## Challenges

1. **Computational complexity**: Real-time requirements
2. **Data association**: Correct feature matching
3. **Drift**: Error accumulation
4. **Dynamic environments**: Moving objects

## Key Takeaways

1. SLAM is essential for autonomous navigation
2. Multiple approaches: EKF, particle filter, graph-based
3. Visual SLAM uses camera features
4. Loop closure is critical for reducing drift

## Practice Problems

1. Implement 2D EKF-SLAM with range-bearing sensors
2. Design particle filter for large-scale mapping
3. Create visual odometry system
4. Optimize pose graph with constraints

---

*Module 2 Complete! [Continue to Module 3: Advanced Topics](../module-03/index.md)*