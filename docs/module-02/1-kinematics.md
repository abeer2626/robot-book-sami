---
title: "Chapter 1: Robot Kinematics"
description: "Understanding robot motion through forward and inverse kinematics"
learningObjectives:
  - Define forward and inverse kinematics
  - Apply transformation matrices to robot arms
  - Solve basic kinematic equations
  - Understand workspace and singularities
estimatedReadingTime: 45
---

# Chapter 1: Robot Kinematics

## Introduction

Kinematics is the study of motion without considering forces. In robotics, it deals with how robots move and how we can describe and control their positions.

## Forward Kinematics

### Definition
Forward kinematics calculates the end-effector position given joint angles or positions.

### Transformation Matrices

For a 2D robot arm:
- Position: `x = L1cos(θ1) + L2cos(θ1 + θ2)`
- Position: `y = L1sin(θ1) + L2sin(θ1 + θ2)`

### Example: 2-Link Planar Arm

```python
import numpy as np

def forward_kinematics(theta1, theta2, L1=1, L2=1):
    """Calculate end-effector position for 2-link arm"""
    x = L1 * np.cos(theta1) + L2 * np.cos(theta1 + theta2)
    y = L1 * np.sin(theta1) + L2 * np.sin(theta1 + theta2)
    return x, y

# Example usage
x, y = forward_kinematics(np.pi/4, np.pi/4)
print(f"End-effector position: ({x:.2f}, {y:.2f})")
```

## Inverse Kinematics

### Definition
Inverse kinematics finds joint angles to reach a desired end-effector position.

### Geometric Approach

For a 2-link planar arm reaching position (x, y):

1. Calculate distance to target:
   - `d = sqrt(x² + y²)`

2. Use law of cosines for second joint:
   - `cos(θ2) = (d² - L1² - L2²) / (2 × L1 × L2)`

3. Calculate first joint angle:
   - `θ1 = atan2(y, x) - atan2(L2sin(θ2), L1 + L2cos(θ2))`

### Workspace Considerations

- **Reachable workspace**: All positions the robot can reach
- **Dexterous workspace**: Positions reachable with all orientations
- **Singularities**: Configurations where robot loses DOF

## Practical Applications

1. **Manufacturing**: Precise positioning of tools
2. **Animation**: Character joint positioning
3. **Medical**: Surgical instrument placement
4. **Construction**: Automated building systems

## Common Challenges

- Multiple solutions for inverse kinematics
- Singularities causing control issues
- Joint limits constraining reachable positions
- Computational complexity for redundant robots

## Key Takeaways

1. Forward kinematics is deterministic (unique solution)
2. Inverse kinematics may have multiple or no solutions
3. Workspace determines robot's reach
4. Singularities require special handling

## Practice Problems

1. Calculate end-effector position for θ₁ = 30°, θ₂ = 45° with L₁ = 2, L₂ = 1
2. Determine if point (3, 0) is reachable for L₁ = L₂ = 2
3. Identify singular configurations for a 2-link arm

---

*Next: [Robot Dynamics](2-dynamics.md) - Understanding forces and torques in robot motion*