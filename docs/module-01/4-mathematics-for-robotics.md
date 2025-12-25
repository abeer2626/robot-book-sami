---
title: "Chapter 4: Mathematics for Robotics"
description: "Essential mathematical concepts for robot control and motion planning"
learningObjectives:
  - Master linear algebra for robotics
  - Apply calculus to robot motion
  - Use probability and statistics for uncertainty
  - Understand coordinate transformations
estimatedReadingTime: 40
---

# Chapter 4: Mathematics for Robotics

## Introduction

Mathematics is the language of robotics. It provides the tools to describe robot motion, analyze sensor data, plan paths, and control behavior. This chapter covers the essential mathematical concepts that every robotics engineer must know.

## Linear Algebra: The Foundation

### Vectors and Matrices in Robotics

#### Position Vectors

A position vector represents a point in 3D space:

```python
import numpy as np

class Position:
    def __init__(self, x, y, z):
        self.vector = np.array([x, y, z])

    def distance_to(self, other):
        """Calculate Euclidean distance to another position"""
        diff = self.vector - other.vector
        return np.linalg.norm(diff)

    def __add__(self, other):
        """Add two positions"""
        return Position(*(self.vector + other.vector))

    def __sub__(self, other):
        """Subtract two positions"""
        return Position(*(self.vector - other.vector))

    def rotate(self, rotation_matrix):
        """Apply rotation matrix to position"""
        rotated = rotation_matrix @ self.vector
        return Position(*rotated)


# Example usage
p1 = Position(1, 2, 3)
p2 = Position(4, 6, 8)
distance = p1.distance_to(p2)
print(f"Distance: {distance:.2f}")  # Output: 7.07
```

#### Rotation Matrices

Rotation matrices describe 3D rotations:

```python
class Rotation3D:
    """3D rotation operations using rotation matrices"""

    @staticmethod
    def rotation_x(theta):
        """Rotation matrix around X-axis"""
        c, s = np.cos(theta), np.sin(theta)
        return np.array([
            [1, 0, 0],
            [0, c, -s],
            [0, s, c]
        ])

    @staticmethod
    def rotation_y(theta):
        """Rotation matrix around Y-axis"""
        c, s = np.cos(theta), np.sin(theta)
        return np.array([
            [c, 0, s],
            [0, 1, 0],
            [-s, 0, c]
        ])

    @staticmethod
    def rotation_z(theta):
        """Rotation matrix around Z-axis"""
        c, s = np.cos(theta), np.sin(theta)
        return np.array([
            [c, -s, 0],
            [s, c, 0],
            [0, 0, 1]
        ])

    @staticmethod
    def euler_to_matrix(roll, pitch, yaw):
        """Convert Euler angles to rotation matrix"""
        R_x = Rotation3D.rotation_x(roll)
        R_y = Rotation3D.rotation_y(pitch)
        R_z = Rotation3D.rotation_z(yaw)

        # Combine rotations (order matters!)
        return R_z @ R_y @ R_x

    @staticmethod
    def axis_angle(axis, theta):
        """Rotation matrix from axis-angle representation"""
        axis = np.array(axis) / np.linalg.norm(axis)
        a = np.cos(theta / 2)
        b, c, d = -axis * np.sin(theta / 2)

        return np.array([
            [a*a+b*b-c*c-d*d, 2*(b*c-a*d), 2*(b*d+a*c)],
            [2*(b*c+a*d), a*a+c*c-b*b-d*d, 2*(c*d-a*b)],
            [2*(b*d-a*c), 2*(c*d+a*b), a*a+d*d-b*b-c*c]
        ])


# Example: Apply multiple rotations
rot = Rotation3D()
combined = rot.euler_to_matrix(np.pi/4, np.pi/6, np.pi/3)
print("Combined rotation matrix:")
print(combined)
```

### Homogeneous Transformations

Homogeneous transformations combine rotation and translation in a single 4x4 matrix:

```python
class Transform:
    """Homogeneous transformation for robot kinematics"""

    def __init__(self, rotation=np.eye(3), translation=np.zeros(3)):
        """Create transformation from rotation matrix and translation vector"""
        self.matrix = np.eye(4)
        self.matrix[:3, :3] = rotation
        self.matrix[:3, 3] = translation

    def __matmul__(self, other):
        """Matrix multiplication for combining transformations"""
        result = self.matrix @ other.matrix
        return Transform(result[:3, :3], result[:3, 3])

    def inverse(self):
        """Compute inverse transformation"""
        R_inv = self.matrix[:3, :3].T
        t_inv = -R_inv @ self.matrix[:3, 3]
        return Transform(R_inv, t_inv)

    def transform_point(self, point):
        """Transform a 3D point"""
        p_homogeneous = np.append(point, 1)
        p_transformed = self.matrix @ p_homogeneous
        return p_transformed[:3]

    @staticmethod
    def from_xyzrpy(x, y, z, roll, pitch, yaw):
        """Create transformation from position and Euler angles"""
        R = Rotation3D.euler_to_matrix(roll, pitch, yaw)
        t = np.array([x, y, z])
        return Transform(R, t)

    def get_position(self):
        """Extract position from transformation"""
        return self.matrix[:3, 3]

    def get_rotation(self):
        """Extract rotation matrix from transformation"""
        return self.matrix[:3, :3]


# Example: Robot arm kinematics
class RobotArm:
    """2-DOF planar robot arm kinematics"""

    def __init__(self, l1=2.0, l2=1.5):
        self.l1 = l1  # Length of first link
        self.l2 = l2  # Length of second link

    def forward_kinematics(self, theta1, theta2):
        """Calculate end-effector position from joint angles"""
        # Transformation from base to joint 1
        T01 = Transform.from_xyzrpy(0, 0, 0, 0, 0, theta1)

        # Transformation from joint 1 to joint 2
        T12 = Transform.from_xyzrpy(self.l1, 0, 0, 0, 0, theta2)

        # Transformation from joint 2 to end-effector
        T2E = Transform.from_xyzrpy(self.l2, 0, 0, 0, 0, 0)

        # Combined transformation
        T0E = T01 @ T12 @ T2E

        # Extract end-effector position
        return T0E.get_position()

    def inverse_kinematics(self, x, y):
        """Calculate joint angles from end-effector position"""
        # Distance to target
        d = np.sqrt(x**2 + y**2)

        # Check if target is reachable
        if d > self.l1 + self.l2 or d < abs(self.l1 - self.l2):
            raise ValueError("Target position is not reachable")

        # Law of cosines for theta2
        cos_theta2 = (d**2 - self.l1**2 - self.l2**2) / (2 * self.l1 * self.l2)
        theta2 = np.arccos(np.clip(cos_theta2, -1, 1))

        # Calculate theta1
        k1 = self.l1 + self.l2 * np.cos(theta2)
        k2 = self.l2 * np.sin(theta2)
        theta1 = np.arctan2(y, x) - np.arctan2(k2, k1)

        return theta1, theta2


# Example usage
arm = RobotArm()
x, y = 2.5, 1.5

# Inverse kinematics
theta1, theta2 = arm.inverse_kinematics(x, y)
print(f"Joint angles: theta1={theta1:.2f}, theta2={theta2:.2f}")

# Forward kinematics (verification)
end_pos = arm.forward_kinematics(theta1, theta2)
print(f"End-effector position: x={end_pos[0]:.2f}, y={end_pos[1]:.2f}")
```

## Calculus: Motion and Dynamics

### Kinematics: Describing Motion

#### Velocity and Acceleration

```python
class Trajectory:
    """Trajectory planning using calculus"""

    def __init__(self, waypoints, duration):
        self.waypoints = waypoints
        self.duration = duration
        self.spline = self.compute_spline()

    def compute_spline(self):
        """Compute cubic spline through waypoints"""
        from scipy.interpolate import CubicSpline
        t = np.linspace(0, self.duration, len(self.waypoints))
        return CubicSpline(t, self.waypoints)

    def position(self, t):
        """Get position at time t"""
        return self.spline(t)

    def velocity(self, t):
        """Get velocity at time t (first derivative)"""
        return self.spline(t, 1)

    def acceleration(self, t):
        """Get acceleration at time t (second derivative)"""
        return self.spline(t, 2)

    def generate_time_optimal_trajectory(self, max_vel, max_acc):
        """Generate time-optimal trajectory with constraints"""
        # Simplified trapezoidal velocity profile
        trajectory = []

        for i in range(len(self.waypoints) - 1):
            start = self.waypoints[i]
            end = self.waypoints[i + 1]
            distance = np.linalg.norm(end - start)

            # Calculate times for acceleration, constant velocity, deceleration
            t_acc = max_vel / max_acc
            d_acc = 0.5 * max_acc * t_acc**2

            if distance < 2 * d_acc:
                # Triangle profile (no constant velocity phase)
                t_peak = np.sqrt(distance / max_acc)
                segment = self.triangle_profile(start, end, t_peak, max_acc)
            else:
                # Trapezoidal profile
                d_const = distance - 2 * d_acc
                t_const = d_const / max_vel
                segment = self.trapezoid_profile(start, end, t_acc, t_const, max_vel)

            trajectory.extend(segment)

        return np.array(trajectory)

    def triangle_profile(self, start, end, t_peak, max_acc):
        """Generate triangular velocity profile"""
        direction = (end - start) / np.linalg.norm(end - start)
        distance = np.linalg.norm(end - start)

        trajectory = []
        dt = 0.01  # Time step

        # Acceleration phase
        for t in np.arange(0, t_peak, dt):
            s = 0.5 * max_acc * t**2
            pos = start + direction * s
            trajectory.append(pos)

        # Deceleration phase
        for t in np.arange(t_peak, 2*t_peak, dt):
            s = distance - 0.5 * max_acc * (2*t_peak - t)**2
            pos = start + direction * s
            trajectory.append(pos)

        return trajectory
```

### Dynamics: Forces and Torques

#### Newton-Euler Dynamics

```python
class RigidBodyDynamics:
    """Rigid body dynamics for robotics"""

    def __init__(self, mass, inertia_matrix):
        self.mass = mass
        self.inertia = np.array(inertia_matrix)
        self.inertia_inv = np.linalg.inv(self.inertia)

    def newton_euler(self, forces, torques, linear_acc, angular_acc):
        """Newton-Euler equations for rigid body dynamics"""
        # Linear motion: F = ma
        net_force = sum(forces) - self.mass * linear_acc

        # Angular motion: τ = Iα + ω × Iω
        net_torque = sum(torques) - self.inertia @ angular_acc

        return net_force, net_torque


class ManipulatorDynamics:
    """Dynamics for robot manipulators"""

    def __init__(self, link_masses, link_lengths, link_inertias):
        self.masses = link_masses
        self.lengths = link_lengths
        self.inertias = link_inertias
        self.n = len(link_masses)

    def compute_mass_matrix(self, q):
        """Compute mass matrix M(q)"""
        M = np.zeros((self.n, self.n))

        # Simplified 2-DOF planar manipulator
        m1, m2 = self.masses[0], self.masses[1]
        l1, l2 = self.lengths[0], self.lengths[1]

        M[0, 0] = (m1 + m2) * l1**2 + m2 * l2**2 + 2*m2*l1*l2*np.cos(q[1])
        M[0, 1] = m2 * l2**2 + m2*l1*l2*np.cos(q[1])
        M[1, 0] = M[0, 1]
        M[1, 1] = m2 * l2**2

        return M

    def compute_coriolis_matrix(self, q, q_dot):
        """Compute Coriolis and centrifugal matrix C(q, q_dot)"""
        C = np.zeros((self.n, self.n))

        m2 = self.masses[1]
        l1, l2 = self.lengths[0], self.lengths[1]

        C[0, 0] = -m2 * l1 * l2 * q_dot[1] * np.sin(q[1])
        C[0, 1] = -m2 * l1 * l2 * (q_dot[0] + q_dot[1]) * np.sin(q[1])
        C[1, 0] = m2 * l1 * l2 * q_dot[0] * np.sin(q[1])
        C[1, 1] = 0

        return C

    def compute_gravity_vector(self, q):
        """Compute gravity vector g(q)"""
        g = np.zeros(self.n)

        m1, m2 = self.masses[0], self.masses[1]
        l1, l2 = self.lengths[0], self.lengths[1]
        gravity = 9.81

        g[0] = (m1 + m2) * gravity * l1 * np.cos(q[0]) + \
               m2 * gravity * l2 * np.cos(q[0] + q[1])
        g[1] = m2 * gravity * l2 * np.cos(q[0] + q[1])

        return g

    def inverse_dynamics(self, q, q_dot, q_ddot):
        """Compute required torques for desired motion"""
        M = self.compute_mass_matrix(q)
        C = self.compute_coriolis_matrix(q, q_dot)
        g = self.compute_gravity_vector(q)

        # τ = M(q)q̈ + C(q, q̇)q̇ + g(q)
        tau = M @ q_ddot + C @ q_dot + g

        return tau

    def forward_dynamics(self, q, q_dot, tau):
        """Compute acceleration from applied torques"""
        M = self.compute_mass_matrix(q)
        C = self.compute_coriolis_matrix(q, q_dot)
        g = self.compute_gravity_vector(q)

        # q̈ = M^(-1)(τ - C(q, q̇)q̇ - g(q))
        M_inv = np.linalg.inv(M)
        q_ddot = M_inv @ (tau - C @ q_dot - g)

        return q_ddot


# Example: Compute torques for trajectory tracking
manipulator = ManipulatorDynamics([2, 1], [1, 0.5], [0.1, 0.05])

# Desired motion
q = np.array([0.5, 0.3])
q_dot = np.array([0.2, 0.1])
q_ddot = np.array([0.1, 0.05])

# Compute required torques
tau = manipulator.inverse_dynamics(q, q_dot, q_ddot)
print(f"Required torques: τ1={tau[0]:.3f}, τ2={tau[1]:.3f}")
```

## Probability and Statistics: Dealing with Uncertainty

### Sensor Fusion with Kalman Filter

```python
class KalmanFilter:
    """Kalman filter for sensor fusion and state estimation"""

    def __init__(self, dim_x, dim_z):
        """Initialize Kalman filter

        Args:
            dim_x: State dimension
            dim_z: Measurement dimension
        """
        self.dim_x = dim_x
        self.dim_z = dim_z

        # State variables
        self.x = np.zeros(dim_x)  # State estimate
        self.P = np.eye(dim_x)    # State covariance
        self.Q = np.eye(dim_x)    # Process noise
        self.R = np.eye(dim_z)    # Measurement noise

        # System matrices
        self.F = np.eye(dim_x)    # State transition
        self.H = np.zeros((dim_z, dim_x))  # Measurement matrix

    def predict(self, u=None, F=None, Q=None):
        """Predict next state"""
        if F is not None:
            self.F = F
        if Q is not None:
            self.Q = Q

        # State prediction
        if u is not None:
            self.x = self.F @ self.x + u
        else:
            self.x = self.F @ self.x

        # Covariance prediction
        self.P = self.F @ self.P @ self.F.T + self.Q

        return self.x

    def update(self, z, H=None, R=None):
        """Update with measurement"""
        if H is not None:
            self.H = H
        if R is not None:
            self.R = R

        # Innovation
        y = z - self.H @ self.x

        # Innovation covariance
        S = self.H @ self.P @ self.H.T + self.R

        # Kalman gain
        K = self.P @ self.H.T @ np.linalg.inv(S)

        # State update
        self.x = self.x + K @ y

        # Covariance update
        I_KH = np.eye(self.dim_x) - K @ self.H
        self.P = I_KH @ self.P @ I_KH.T + K @ self.R @ K.T

        return self.x


class RobotLocalization:
    """2D robot localization using Kalman filter"""

    def __init__(self):
        # State: [x, y, theta, vx, vy, vtheta]
        self.kf = KalmanFilter(dim_x=6, dim_z=3)

        # State transition matrix (constant velocity model)
        dt = 0.1
        self.kf.F = np.array([
            [1, 0, 0, dt, 0, 0],
            [0, 1, 0, 0, dt, 0],
            [0, 0, 1, 0, 0, dt],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 1]
        ])

        # Measurement matrix (position and orientation)
        self.kf.H = np.array([
            [1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0]
        ])

        # Process and measurement noise
        self.kf.Q = np.eye(6) * 0.01
        self.kf.R = np.eye(3) * 0.1

    def predict(self, control_input):
        """Predict robot motion"""
        # control_input: [ax, ay, atheta] - accelerations
        u = np.zeros(6)
        u[3:] = control_input * 0.1  # Convert to velocity change

        self.kf.predict(u=u)
        return self.kf.x[:3]  # Return position

    def update(self, measurement):
        """Update with GPS/IMU measurement"""
        self.kf.update(measurement)
        return self.kf.x[:3]  # Return position


# Example usage
localizer = RobotLocalization()

# Initial state
localizer.kf.x = np.array([0, 0, 0, 1, 0, 0])  # x, y, theta, vx, vy, vtheta

# Simulate robot motion
true_path = []
estimated_path = []

for step in range(100):
    # True motion (with some noise)
    true_accel = np.array([0.1, 0.05, 0.01])
    true_pos = localizer.predict(true_accel)
    true_path.append(true_pos)

    # Noisy measurement
    measurement = true_pos + np.random.normal(0, 0.1, 3)

    # Update filter
    estimated_pos = localizer.update(measurement)
    estimated_path.append(estimated_pos)

print(f"Final position error: {np.linalg.norm(true_pos - estimated_pos):.3f}")
```

### Particle Filter for Monte Carlo Localization

```python
class ParticleFilter:
    """Particle filter for non-linear, non-Gaussian state estimation"""

    def __init__(self, num_particles=1000):
        self.num_particles = num_particles
        self.particles = None
        self.weights = None

    def initialize(self, bounds, state_dim=3):
        """Initialize particles uniformly in bounds"""
        self.particles = np.random.uniform(
            low=bounds[:, 0],
            high=bounds[:, 1],
            size=(self.num_particles, state_dim)
        )
        self.weights = np.ones(self.num_particles) / self.num_particles

    def predict(self, motion_model, motion_args):
        """Predict particle positions with motion model"""
        for i in range(self.num_particles):
            # Add motion and noise
            motion = motion_model(self.particles[i], *motion_args)
            noise = np.random.normal(0, motion_args[-1], size=len(motion))
            self.particles[i] += motion + noise

    def update_weights(self, measurement, sensor_model):
        """Update particle weights based on sensor measurements"""
        for i in range(self.num_particles):
            # Calculate likelihood
            expected_measurement = sensor_model(self.particles[i])
            likelihood = np.exp(-0.5 * np.sum(
                (measurement - expected_measurement)**2 / 0.1**2
            ))
            self.weights[i] *= likelihood

        # Normalize weights
        self.weights /= np.sum(self.weights)

    def resample(self):
        """Resample particles based on weights"""
        # Systematic resampling
        indices = np.random.choice(
            self.num_particles,
            size=self.num_particles,
            p=self.weights,
            replace=True
        )

        self.particles = self.particles[indices]
        self.weights = np.ones(self.num_particles) / self.num_particles

    def estimate(self):
        """Estimate state from particles"""
        if self.particles is None:
            return None

        # Weighted mean
        state = np.average(self.particles, weights=self.weights, axis=0)

        # Weighted covariance
        diff = self.particles - state
        cov = np.cov(diff.T, aweights=self.weights)

        return state, cov


class MonteCarloLocalization:
    """Monte Carlo Localization for mobile robots"""

    def __init__(self, num_particles=1000):
        self.pf = ParticleFilter(num_particles)
        self.map = None

    def set_map(self, occupancy_grid):
        """Set environment map"""
        self.map = occupancy_grid

    def initialize_uniform(self, x_bounds, y_bounds, theta_bounds):
        """Initialize particles uniformly in bounds"""
        bounds = np.array([
            x_bounds,
            y_bounds,
            theta_bounds
        ])
        self.pf.initialize(bounds, state_dim=3)

    def motion_model(self, state, v, omega, dt, noise_std):
        """Differential drive motion model"""
        x, y, theta = state

        # Add noise to velocities
        v_noisy = v + np.random.normal(0, noise_std)
        omega_noisy = omega + np.random.normal(0, noise_std)

        # Update position
        x_new = x + v_noisy * np.cos(theta) * dt
        y_new = y + v_noisy * np.sin(theta) * dt
        theta_new = theta + omega_noisy * dt

        return np.array([x_new, y_new, theta_new])

    def sensor_model(self, state):
        """Range finder sensor model"""
        if self.map is None:
            return np.array([5, 5, 5, 5])  # Default ranges

        x, y, theta = state
        angles = np.array([theta - np.pi/4, theta, theta + np.pi/4])
        ranges = []

        for angle in angles:
            # Cast ray and find intersection with obstacles
            ray_end = self.cast_ray(x, y, angle, max_range=10)
            distance = np.linalg.norm(ray_end - np.array([x, y]))
            ranges.append(distance)

        return np.array(ranges)

    def cast_ray(self, x, y, angle, max_range=10):
        """Cast ray in map to find obstacle distance"""
        # Simplified ray casting
        steps = 100
        dx = np.cos(angle) * max_range / steps
        dy = np.sin(angle) * max_range / steps

        for i in range(steps):
            check_x = x + i * dx
            check_y = y + i * dy

            if self.is_occupied(check_x, check_y):
                return np.array([check_x, check_y])

        return np.array([x + max_range*np.cos(angle), y + max_range*np.sin(angle)])

    def is_occupied(self, x, y):
        """Check if position is occupied in map"""
        # Simplified: circular obstacles
        obstacles = [(3, 3), (7, 5), (2, 8)]
        for obs_x, obs_y in obstacles:
            if np.sqrt((x-obs_x)**2 + (y-obs_y)**2) < 1:
                return True
        return False

    def localize(self, v, omega, ranges):
        """Perform one localization step"""
        # Predict motion
        self.pf.predict(self.motion_model, (v, omega, 0.1, 0.1))

        # Update weights
        self.pf.update_weights(ranges, self.sensor_model)

        # Resample if needed
        effective_n = 1 / np.sum(self.pf.weights**2)
        if effective_n < self.num_particles / 2:
            self.pf.resample()

        # Return estimate
        return self.pf.estimate()


# Example usage
mcl = MonteCarloLocalization(num_particles=1000)
mcl.initialize_uniform([0, 10], [0, 10], [-np.pi, np.pi])

# Simulate robot motion and localization
true_states = []
estimated_states = []

true_state = np.array([1, 1, 0])  # Initial position

for step in range(50):
    # Simulate robot motion
    v, omega = 0.5, 0.1
    true_state = mcl.motion_model(true_state, v, omega, 0.1, 0.01)
    true_states.append(true_state)

    # Simulate sensor readings
    ranges = mcl.sensor_model(true_state) + np.random.normal(0, 0.1, 4)

    # Localize
    estimate = mcl.localize(v, omega, ranges)
    estimated_states.append(estimate[0])

    if step % 10 == 0:
        error = np.linalg.norm(true_state - estimate[0])
        print(f"Step {step}, Position error: {error:.3f}")

print(f"Average localization error: {np.mean([np.linalg.norm(t-e) for t, e in zip(true_states, estimated_states)]):.3f}")
```

## Optimization in Robotics

### Trajectory Optimization

```python
import scipy.optimize as opt

class TrajectoryOptimizer:
    """Optimize robot trajectories for smoothness and efficiency"""

    def __init__(self, waypoints, num_waypoints=10):
        self.waypoints = waypoints
        self.num_waypoints = num_waypoints
        self.dimension = len(waypoints[0])

    def objective(self, trajectory_flat):
        """Objective function for trajectory optimization"""
        # Reshape flat array to trajectory
        trajectory = trajectory_flat.reshape(-1, self.dimension)

        # Minimize acceleration (second derivative)
        acceleration = np.diff(trajectory, n=2, axis=0)
        accel_cost = np.sum(acceleration**2)

        # Minimize jerk (third derivative)
        jerk = np.diff(trajectory, n=3, axis=0)
        jerk_cost = np.sum(jerk**2)

        # Minimize path length
        path_diff = np.diff(trajectory, axis=0)
        path_length = np.sum(np.linalg.norm(path_diff, axis=1))

        return accel_cost + 0.1 * jerk_cost + 0.01 * path_length

    def constraints(self, trajectory_flat):
        """Constraints for trajectory optimization"""
        trajectory = trajectory_flat.reshape(-1, self.dimension)

        constraints = []

        # Start and end constraints
        constraints.append(trajectory[0] - self.waypoints[0])
        constraints.append(trajectory[-1] - self.waypoints[-1])

        # Velocity constraints
        velocities = np.diff(trajectory, axis=0)
        max_velocity = 2.0
        constraints.extend(velocities.flatten() - max_velocity)
        constraints.extend(-velocities.flatten() - max_velocity)

        # Avoidance constraints (simplified)
        obstacle = np.array([5, 5, 0])
        min_distance = 1.0

        for point in trajectory:
            dist_to_obstacle = np.linalg.norm(point[:2] - obstacle[:2])
            constraints.append(min_distance - dist_to_obstacle)

        return constraints

    def optimize_trajectory(self):
        """Optimize trajectory using constrained optimization"""
        # Initial guess: linear interpolation
        initial_trajectory = np.linspace(
            self.waypoints[0],
            self.waypoints[-1],
            self.num_waypoints
        )

        # Flatten for optimization
        initial_flat = initial_trajectory.flatten()

        # Bounds for each dimension
        bounds = []
        for i in range(self.dimension):
            dim_min = min(wp[i] for wp in self.waypoints) - 1
            dim_max = max(wp[i] for wp in self.waypoints) + 1
            bounds.extend([(dim_min, dim_max)] * self.num_waypoints)

        # Constraints
        constraints = {
            'type': 'ineq',
            'fun': self.constraints
        }

        # Optimize
        result = opt.minimize(
            self.objective,
            initial_flat,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints,
            options={'maxiter': 1000}
        )

        if result.success:
            optimized = result.x.reshape(-1, self.dimension)
            return optimized
        else:
            print("Optimization failed:", result.message)
            return initial_trajectory


# Example: Optimize robot arm trajectory
optimizer = TrajectoryOptimizer(
    waypoints=[np.array([0, 0, 0]), np.array([2, 3, np.pi/2])],
    num_waypoints=20
)

optimized_trajectory = optimizer.optimize_trajectory()

print("Optimized trajectory:")
for i, point in enumerate(optimized_trajectory[::5]):
    print(f"Point {i*5}: x={point[0]:.2f}, y={point[1]:.2f}, theta={point[2]:.2f}")
```

### Inverse Kinematics Optimization

```python
class IKSolver:
    """Inverse kinematics using numerical optimization"""

    def __init__(self, robot_model):
        self.robot = robot_model

    def forward_kinematics(self, joint_angles):
        """Forward kinematics function"""
        return self.robot.forward_kinematics(*joint_angles)

    def jacobian(self, joint_angles):
        """Numerical Jacobian computation"""
        epsilon = 1e-6
        n = len(joint_angles)
        m = 3  # 3D position

        J = np.zeros((m, n))
        base_pos = self.forward_kinematics(joint_angles)

        for i in range(n):
            angles_plus = joint_angles.copy()
            angles_plus[i] += epsilon

            pos_plus = self.forward_kinematics(angles_plus)
            J[:, i] = (pos_plus - base_pos) / epsilon

        return J

    def ik_numerical(self, target_position, initial_guess=None, max_iter=100):
        """Solve IK using numerical optimization"""
        if initial_guess is None:
            initial_guess = np.zeros(self.robot.n)

        current_angles = initial_guess.copy()

        for iteration in range(max_iter):
            # Current end-effector position
            current_pos = self.forward_kinematics(current_angles)

            # Position error
            error = target_position - current_pos

            # Check convergence
            if np.linalg.norm(error) < 1e-6:
                print(f"Converged in {iteration} iterations")
                return current_angles

            # Compute Jacobian
            J = self.jacobian(current_angles)

            # Damped least squares (Levenberg-Marquardt)
            damping = 0.1
            J_T = J.T
            delta_angles = J_T @ np.linalg.inv(J @ J_T + damping * np.eye(3)) @ error

            # Update joint angles
            current_angles += delta_angles

            # Apply joint limits
            current_angles = np.clip(current_angles, -np.pi, np.pi)

        print("Warning: Maximum iterations reached")
        return current_angles

    def ik_optimization(self, target_position, weights=None):
        """Solve IK using optimization"""
        if weights is None:
            weights = np.ones(3)

        def objective(joint_angles):
            pos = self.forward_kinematics(joint_angles)
            error = (pos - target_position) * weights
            return np.sum(error**2)

        def constraint(joint_angles):
            pos = self.forward_kinematics(joint_angles)
            return pos - target_position

        # Initial guess
        initial_guess = np.zeros(self.robot.n)

        # Bounds
        bounds = [(-np.pi, np.pi)] * self.robot.n

        # Optimize
        result = opt.minimize(
            objective,
            initial_guess,
            method='SLSQP',
            bounds=bounds,
            constraints={'type': 'eq', 'fun': constraint},
            options={'ftol': 1e-6, 'maxiter': 1000}
        )

        if result.success:
            return result.x
        else:
            print("IK optimization failed")
            return initial_guess

    def redundancy_resolution(self, target_position, secondary_task):
        """Resolve redundancy for redundant manipulators"""
        def objective(joint_angles):
            # Primary task: reach target
            pos = self.forward_kinematics(joint_angles)
            primary_error = np.linalg.norm(pos - target_position)**2

            # Secondary task: minimize joint movement
            secondary_cost = secondary_task(joint_angles)

            return primary_error + 0.1 * secondary_cost

        initial_guess = np.zeros(self.robot.n)
        bounds = [(-np.pi, np.pi)] * self.robot.n

        result = opt.minimize(
            objective,
            initial_guess,
            method='SLSQP',
            bounds=bounds,
            options={'ftol': 1e-6, 'maxiter': 1000}
        )

        return result.x if result.success else initial_guess


# Example usage
arm = RobotArm()  # From earlier example
ik_solver = IKSolver(arm)

# Target position
target = np.array([2.5, 1.5, 0])

# Solve IK
joint_angles1 = ik_solver.ik_numerical(target)
joint_angles2 = ik_solver.ik_optimization(target)

print(f"Numerical IK solution: {joint_angles1}")
print(f"Optimization IK solution: {joint_angles2}")

# Verify solutions
pos1 = arm.forward_kinematics(*joint_angles1)
pos2 = arm.forward_kinematics(*joint_angles2)

print(f"Verification 1: {np.linalg.norm(pos1 - target):.6f}")
print(f"Verification 2: {np.linalg.norm(pos2 - target):.6f}")
```

## Summary

In this chapter, we've covered the essential mathematical foundations for robotics:

- **Linear Algebra**: Vectors, matrices, rotations, and transformations
- **Calculus**: Kinematics, dynamics, and trajectory planning
- **Probability**: Kalman filters, particle filters, and uncertainty
- **Optimization**: Trajectory optimization and inverse kinematics

These mathematical tools enable precise robot control, accurate state estimation, and intelligent decision-making.

## Key Terms

- **Homogeneous Transformation**: 4x4 matrix combining rotation and translation
- **Jacobian**: Matrix of partial derivatives relating joint velocities to end-effector velocity
- **Kalman Filter**: Recursive algorithm for state estimation with Gaussian noise
- **Particle Filter**: Sequential Monte Carlo method for non-linear estimation
- **Optimization**: Finding the best solution among possible alternatives

## Discussion Questions

1. Why are homogeneous transformations preferred over separate rotation and translation matrices?
2. When would you use a Kalman filter vs a particle filter for state estimation?
3. How do numerical IK methods handle singularities compared to analytical solutions?
4. What trade-offs exist between computational complexity and accuracy in robot mathematics?

---

## Module 1 Summary

You've completed Module 1: Foundations! Let's review what you've learned:

### Key Achievements

1. **Robotics Fundamentals**: Defined what makes a robot and explored its history and applications
2. **Robot Components**: Understood sensors, actuators, control systems, and power requirements
3. **AI Fundamentals**: Learned machine learning, neural networks, and reinforcement learning
4. **Mathematical Foundations**: Mastered the mathematical tools for robotics

### Ready for More?

You now have the foundational knowledge to tackle more advanced topics. Move on to [Module 2: Core Concepts](../module-02/index.md) to dive deeper into robot kinematics, dynamics, planning, and control.

*Use the chat assistant to ask questions about any concept from this module!*