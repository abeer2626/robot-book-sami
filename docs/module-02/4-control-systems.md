---
title: "Chapter 4: Control Systems"
description: "Feedback control theory and applications in robotics"
learningObjectives:
  - Master PID control design and tuning
  - Understand state-space representation
  - Apply Model Predictive Control (MPC)
  - Implement adaptive control strategies
estimatedReadingTime: 60
---

# Chapter 4: Control Systems

## Introduction

Control systems enable robots to execute desired motions accurately by adjusting inputs based on feedback from sensors. This chapter covers fundamental control theories and their robotic applications.

## PID Control

### Components

1. **Proportional (P)**: Responds to current error
   - `P_out = K_p × e(t)`

2. **Integral (I)**: Accumulates past errors
   - `I_out = K_i × ∫e(t)dt`

3. **Derivative (D)**: Predicts future error
   - `D_out = K_d × de(t)/dt`

### PID Controller Implementation

```python
class PIDController:
    def __init__(self, Kp, Ki, Kd, setpoint):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.setpoint = setpoint

        self.integral = 0
        self.previous_error = 0
        self.last_time = None

    def update(self, current_value, current_time):
        """Calculate PID output"""
        error = self.setpoint - current_value

        if self.last_time is None:
            dt = 0
        else:
            dt = current_time - self.last_time

        # Proportional term
        P = self.Kp * error

        # Integral term
        self.integral += error * dt
        I = self.Ki * self.integral

        # Derivative term
        if dt > 0:
            derivative = (error - self.previous_error) / dt
        else:
            derivative = 0
        D = self.Kd * derivative

        # Calculate total output
        output = P + I + D

        # Update variables
        self.previous_error = error
        self.last_time = current_time

        return output

    def reset(self):
        """Reset controller state"""
        self.integral = 0
        self.previous_error = 0
        self.last_time = None
```

### Tuning Methods

1. **Ziegler-Nichols Method**:
   - Set Ki and Kd to zero
   - Increase Kp until oscillation
   - Use table for final gains

2. **Manual Tuning**:
   - Start with Kp
   - Add Ki to eliminate steady-state error
   - Add Kd to reduce overshoot

## State-Space Control

### Representation

Linear state-space model:
```
ẋ = Ax + Bu
y = Cx + Du
```

Where:
- x: state vector
- u: input vector
- y: output vector
- A: system matrix
- B: input matrix
- C: output matrix
- D: feedthrough matrix

### Example: Inverted Pendulum

```python
import numpy as np
import control as ctrl

# Define system matrices (simplified inverted pendulum)
g = 9.81
L = 1
m = 1
M = 2

# State: [theta, theta_dot, x, x_dot]
A = np.array([
    [0, 1, 0, 0],
    [g/L, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 0]
])

B = np.array([
    [0],
    [1/(m*L**2)],
    [0],
    [1/(m + M)]
])

C = np.eye(4)  # All states measured
D = np.zeros((4, 1))

# Create state-space system
sys = ctrl.ss(A, B, C, D)

# Design LQR controller
Q = np.diag([10, 1, 1, 1])  # State weighting
R = np.eye(1)  # Input weighting

K, S, E = ctrl.lqr(A, B, Q, R)
print(f"LQR gains: {K}")
```

### Pole Placement

Place closed-loop poles at desired locations:
1. Determine desired pole locations
2. Calculate state feedback gains
3. Verify closed-loop stability

## Model Predictive Control (MPC)

### Concept

Solve optimization problem at each time step:
1. Predict future behavior
2. Optimize control sequence
3. Apply first control input
4. Repeat

```python
def mpc_controller(x, ref_horizon, sys, constraints):
    """Simple MPC implementation"""
    horizon = 10

    # Optimization variables
    U = np.zeros((horizon, 1))  # Control inputs
    X = np.zeros((horizon + 1, 4))  # States
    X[0] = x

    # Predict future states
    for k in range(horizon):
        # State update (simplified)
        X[k+1] = sys.A @ X[k] + sys.B @ U[k]

        # Cost function
        cost = np.sum((X[k+1] - ref_horizon[k])**2)

        # Constraints
        if U[k] > constraints['u_max']:
            U[k] = constraints['u_max']
        elif U[k] < constraints['u_min']:
            U[k] = constraints['u_min']

    # Return first control input
    return U[0]
```

### Advantages

- Handles constraints naturally
- Multi-variable control
- Predictive behavior
- Systematic tuning

## Adaptive Control

### Types

1. **Model Reference Adaptive Control (MRAC)**
2. **Self-Tuning Regulators (STR)**
3. **Gain Scheduling**

### Adaptive PID Example

```python
class AdaptivePID:
    def __init__(self):
        self.base_pid = PIDController(1.0, 0.1, 0.05, 0)
        self.adaptation_rate = 0.01

    def update(self, current_value, current_time):
        """Update adaptive PID gains"""
        # Measure performance
        error = self.base_pid.setpoint - current_value
        error_change = error - self.base_pid.previous_error

        # Adapt gains based on error
        if abs(error) > 0.1:  # Large error
            self.base_pid.Kp += self.adaptation_rate * error
            self.base_pid.Ki += self.adaptation_rate * error * 0.1

        # Anti-windup for integral
        if self.base_pid.integral > 10:
            self.base_pid.integral = 10
        elif self.base_pid.integral < -10:
            self.base_pid.integral = -10

        return self.base_pid.update(current_value, current_time)
```

## Robotic Applications

### Joint Control

```python
class RobotJointController:
    def __init__(self, joint_params):
        self.joints = []
        for params in joint_params:
            controller = PIDController(
                params['Kp'],
                params['Ki'],
                params['Kd'],
                params['setpoint']
            )
            self.joints.append({
                'controller': controller,
                'encoder': params['encoder'],
                'motor': params['motor']
            })

    def update(self):
        """Update all joint controllers"""
        commands = []
        for joint in self.joints:
            position = joint['encoder'].read()
            command = joint['controller'].update(position, time.time())
            joint['motor'].set(command)
            commands.append(command)
        return commands
```

### Trajectory Tracking

1. Feedforward control based on dynamics
2. Feedback compensation for errors
3. Gain scheduling for different speeds

## Common Issues

1. **Sensor noise**: Filtering required
2. **Actuator saturation**: Anti-windup needed
3. **Time delays**: Phase margin considerations
4. **Nonlinearities**: Linearization or nonlinear control

## Key Takeaways

1. PID control is sufficient for many applications
2. State-space handles multi-variable systems
3. MPC manages constraints explicitly
4. Adaptive control handles changing dynamics

## Practice Problems

1. Tune PID controller for second-order system
2. Design LQR controller for 2DOF robot arm
3. Implement MPC with input constraints
4. Develop adaptive controller for varying payload

---

*Next: [SLAM](5-slam.md) - Simultaneous Localization and Mapping*