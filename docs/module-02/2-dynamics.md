---
title: "Chapter 2: Robot Dynamics"
description: "Forces, torques, and motion equations in robotic systems"
learningObjectives:
  - Understand Newton-Euler formulation
  - Apply Lagrangian dynamics to robots
  - Calculate dynamic parameters
  - Model friction and disturbances
estimatedReadingTime: 50
---

# Chapter 2: Robot Dynamics

## Introduction

Robot dynamics studies the relationship between forces/torques and resulting motion. Unlike kinematics, dynamics considers the masses, inertias, and forces involved in robot motion.

## Newton-Euler Formulation

### Recursive Newton-Euler Algorithm

The algorithm consists of two passes:
1. **Forward pass**: Calculate velocities and accelerations
2. **Backward pass**: Calculate forces and torques

### Basic Equations

For a single link:
- Linear acceleration: `a = α × r + ω × (ω × r)`
- Force: `F = ma + mg + F_external`
- Torque: `τ = Iα + ω × Iω + r × F`

## Lagrangian Dynamics

### Energy Methods

1. **Kinetic Energy**: `K = ½mv² + ½Iω²`
2. **Potential Energy**: `P = mgh`
3. **Lagrangian**: `L = K - P`

### Euler-Lagrange Equation

`d/dt(∂L/∂q̇) - ∂L/∂q = τ`

### Example: Single Pendulum

```python
import numpy as np
from scipy.integrate import odeint

def pendulum_dynamics(state, t, L=1, m=1, g=9.81):
    """Dynamics of a simple pendulum"""
    theta, theta_dot = state

    # Equation of motion
    theta_ddot = -(g/L) * np.sin(theta)

    return [theta_dot, theta_ddot]

# Simulate pendulum motion
t = np.linspace(0, 10, 100)
initial_state = [np.pi/4, 0]  # 45 degrees, zero velocity
solution = odeint(pendulum_dynamics, initial_state, t)
```

## Dynamic Parameters

### Mass Properties

- **Mass**: Total weight of each link
- **Center of Mass**: Balance point of each link
- **Inertia Tensor**: Resistance to angular acceleration

### Joint Properties

- **Friction**: Resistance to joint motion
  - Viscous friction: `τ_friction = b·q̇`
  - Coulomb friction: `τ_friction = sign(q̇)·τ_static`
- **Gear ratios**: Amplify/reduce torque and speed

## Dynamic Modeling in Practice

### Denavit-Hartenberg Parameters

Extended DH parameters for dynamics:
- Mass (m)
- Center of mass (cx, cy, cz)
- Inertia components (Ixx, Iyy, Izz, Ixy, Ixz, Iyz)

### Dynamic Equations of Motion

Standard form: `M(q)q̈ + C(q, q̇)q̇ + G(q) = τ`

Where:
- M(q): Inertia matrix
- C(q, q̇): Coriolis and centrifugal terms
- G(q): Gravity vector
- τ: Joint torques

## Control Implications

### Computed Torque Control

`τ = M(q)(q̈_des + K_d(q̇_des - q̇) + K_p(q_des - q)) + C(q, q̇)q̇ + G(q)`

### Adaptive Control

- Estimate unknown parameters online
- Adapt to changing payloads
- Compensate for model uncertainties

## Applications

1. **Industrial robots**: Precise force control
2. **Humanoid robots**: Balanced walking
3. **Space robots**: Low-gravity dynamics
4. **Underwater robots**: Fluid dynamics

## Common Challenges

- Parameter identification complexity
- Real-time computation requirements
- Model inaccuracies
- External disturbances

## Key Takeaways

1. Dynamics enables accurate motion control
2. Parameter identification is crucial for performance
3. Real-time constraints limit model complexity
4. Friction and disturbances must be accounted for

## Practice Problems

1. Derive equations of motion for a 2-link planar arm
2. Calculate inertia matrix for a uniform rod
3. Analyze effect of payload changes on dynamics
4. Design computed torque controller for single joint

---

*Next: [Path Planning](3-path-planning.md) - Navigation and trajectory planning*