---
title: "Chapter 3: Path Planning"
description: "Algorithms and techniques for robot navigation and trajectory planning"
learningObjectives:
  - Understand configuration space concepts
  - Apply graph-based planning algorithms
  - Implement sampling-based planners
  - Generate smooth trajectories
estimatedReadingTime: 55
---

# Chapter 3: Path Planning

## Introduction

Path planning involves finding a collision-free path from start to goal in an environment with obstacles. It's fundamental to mobile robot navigation and manipulator motion.

## Configuration Space (C-Space)

### Definition

Configuration space represents all possible robot configurations:
- **Free space (C_free)**: Collision-free configurations
- **Obstacle space (C_obs)**: Configurations in collision

### Example: Point Robot

For a 2D point robot:
- C-space = 2D workspace
- Obstacles expanded by robot radius

### Example: Mobile Robot

```python
import numpy as np
import matplotlib.pyplot as plt

def expand_obstacles(obstacles, robot_radius):
    """Expand obstacles for robot footprint"""
    expanded = []
    for obs in obstacles:
        # Minkowski sum with robot circle
        expanded.append({
            'center': obs['center'],
            'radius': obs['radius'] + robot_radius
        })
    return expanded
```

## Graph-Based Planning

### Visibility Graph

1. Connect start and goal to all visible vertices
2. Connect all visible vertices to each other
3. Find shortest path using Dijkstra/A*

```python
import heapq

def dijkstra(graph, start, goal):
    """Dijkstra's shortest path algorithm"""
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    visited = set()
    pq = [(0, start)]

    while pq:
        dist, current = heapq.heappop(pq)

        if current == goal:
            break

        if current in visited:
            continue

        visited.add(current)

        for neighbor, weight in graph[current].items():
            if neighbor not in visited:
                new_dist = dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    heapq.heappush(pq, (new_dist, neighbor))

    return distances[goal]
```

### Cell Decomposition

- **Exact cell decomposition**: Divide space into simple regions
- **Approximate cell decomposition**: Use grid representation
- **Advantage**: Complete for finite grid

## Sampling-Based Planning

### Probabilistic Roadmaps (PRM)

1. **Learning phase**:
   - Sample random configurations
   - Connect nearby configurations
   - Build roadmap graph

2. **Query phase**:
   - Connect start/goal to roadmap
   - Find path in graph

```python
import random

def build_prm(num_samples, space, connection_radius):
    """Build Probabilistic Roadmap"""
    nodes = []
    edges = []

    # Sample nodes
    for _ in range(num_samples):
        config = sample_configuration(space)
        if is_collision_free(config):
            nodes.append(config)

    # Connect nearby nodes
    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes[i+1:], i+1):
            if distance(node1, node2) < connection_radius:
                if is_path_collision_free(node1, node2):
                    edges.append((i, j))

    return nodes, edges
```

### Rapidly-exploring Random Trees (RRT)

1. Start with initial configuration
2. Sample random point
3. Find nearest node in tree
4. Extend toward random point
5. Repeat until goal reached

```python
class RRT:
    def __init__(self, start, goal, space):
        self.start = start
        self.goal = goal
        self.space = space
        self.tree = [start]
        self.parent = {start: None}

    def sample(self):
        """Sample random configuration"""
        return random_configuration(self.space)

    def nearest(self, config):
        """Find nearest node in tree"""
        distances = [distance(config, node) for node in self.tree]
        return self.tree[np.argmin(distances)]

    def steer(self, from_config, to_config, step_size):
        """Move from toward to by step_size"""
        dist = distance(from_config, to_config)
        if dist <= step_size:
            return to_config

        ratio = step_size / dist
        new_config = []
        for i in range(len(from_config)):
            new_config.append(
                from_config[i] + ratio * (to_config[i] - from_config[i])
            )
        return tuple(new_config)

    def expand(self, iterations=1000):
        """Expand RRT tree"""
        for _ in range(iterations):
            random_config = self.sample()
            nearest_node = self.nearest(random_config)
            new_node = self.steer(nearest_node, random_config, 0.1)

            if is_collision_free(nearest_node, new_node):
                self.tree.append(new_node)
                self.parent[new_node] = nearest_node

                if distance(new_node, self.goal) < 0.1:
                    # Goal reached
                    return self.reconstruct_path(new_node)

        return None
```

## Trajectory Planning

### Path vs Trajectory

- **Path**: Geometric curve through space
- **Trajectory**: Path with time parameterization

### Polynomial Trajectories

```python
import numpy as np

def cubic_polynomial(t, t0, tf, q0, qf, qd0, qdf):
    """Generate cubic polynomial trajectory"""
    # Time normalization
    s = (t - t0) / (tf - t0)

    # Cubic polynomial coefficients
    a0 = q0
    a1 = qd0
    a2 = 3*(qf - q0) - 2*qd0 - qdf
    a3 = 2*(q0 - qf) + qd0 + qdf

    # Position, velocity, acceleration
    q = a0 + a1*s + a2*s**2 + a3*s**3
    qd = (a1 + 2*a2*s + 3*a3*s**2) / (tf - t0)
    qdd = (2*a2 + 6*a3*s) / (tf - t0)**2

    return q, qd, qdd
```

### Minimum Jerk Trajectories

Minimize integral of squared jerk (3rd derivative):
- Smoother motion
- Reduces vibration
- Better for human-robot interaction

## Applications

1. **Autonomous vehicles**: Highway navigation
2. **Industrial robots**: Pick and place operations
3. **Drone navigation**: 3D path planning
4. **Video games**: Character movement

## Common Challenges

- High-dimensional spaces
- Dynamic obstacles
- Differential constraints
- Real-time requirements

## Key Takeaways

1. Trade-off: completeness vs computational efficiency
2. Sampling methods handle high dimensions well
3. Trajectory planning adds time dimension to paths
4. Real-time adaptation needed for dynamic environments

## Practice Problems

1. Implement A* algorithm for grid-based planning
2. Compare PRM vs RRT performance in 2D space
3. Generate smooth trajectory through waypoints
4. Handle dynamic obstacle avoidance

---

*Next: [Control Systems](4-control-systems.md) - Feedback control for robot motion*