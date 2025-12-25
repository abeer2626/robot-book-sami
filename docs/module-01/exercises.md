---
title: "Module 1 Exercises"
description: "Hands-on exercises to reinforce your learning"
---

# Module 1 Exercises

These exercises will help you apply the concepts learned in Module 1. Solutions are provided for self-assessment.

## Chapter 1: What is Robotics?

### Exercise 1.1: Robot Classification
**Task**: Research and classify 10 different robots based on their primary application.
Categorize each into: Industrial, Service, Medical, Educational, or Military.

**Requirements**:
- Find real robot examples
- Include their main purpose
- Explain your classification

### Exercise 1.2: History Timeline
**Task**: Create a timeline of robotics history from 1950 to present.

**Requirements**:
- Include at least 15 major milestones
- Highlight significant technological advances
- Note societal impact of key developments

## Chapter 2: Robot Components

### Exercise 2.1: Sensor Selection
**Task**: For a home assistant robot, select appropriate sensors for these tasks:
- Navigation in a cluttered environment
- Object recognition and manipulation
- Human interaction and safety

**Requirements**:
- Justify each sensor choice
- Consider cost vs performance
- Address potential limitations

### Exercise 2.2: Actuator Design
**Task**: Design the actuator system for a 2-DOF robotic arm that can lift 1kg.

**Requirements**:
- Calculate required torques
- Select appropriate motor types
- Design gear ratios if needed
- Consider safety factors

## Chapter 3: AI Fundamentals

### Exercise 3.1: Simple Neural Network
**Task**: Implement a simple neural network for binary classification.

**Requirements**:
- Create a network with one hidden layer
- Use Python with NumPy only (no ML frameworks)
- Train on a simple dataset
- Achieve >80% accuracy

### Exercise 3.2: Q-Learning Grid World
**Task**: Implement Q-learning for a simple grid world navigation problem.

**Requirements**:
- 5x5 grid with obstacles
- Start and goal positions
- Include discount factor
- Plot learning curve

## Chapter 4: Mathematics for Robotics

### Exercise 4.1: Forward Kinematics
**Task**: Implement forward kinematics for a 3-DOF planar arm.

**Requirements**:
- Use homogeneous transformations
- Handle joint limits
- Visualize arm configuration
- Calculate end-effector position

### Exercise 4.2: Path Planning
**Task**: Implement A* path planning in 2D.

**Requirements**:
- Grid-based map with obstacles
- Include diagonal movement
- Optimize for shortest path
- Visualize result

## Programming Project: Module 1

### Project: Simple Mobile Robot Simulator
**Objective**: Create a 2D simulator for a differential drive robot.

**Requirements**:
1. **Robot Model**:
   - Differential drive kinematics
   - Simple sensor simulation (range sensors)
   - Basic physics (velocity limits)

2. **Control**:
   - Implement a simple wall-following behavior
   - Add obstacle avoidance
   - Include goal-seeking capability

3. **Visualization**:
   - Real-time visualization of robot
   - Display sensor readings
   - Show planned path

4. **Testing**:
   - Test in different environments
   - Measure success rate
   - Document limitations

### Evaluation Criteria
- **Functionality (40%)**: Does it meet requirements?
- **Code Quality (20%)**: Is it well-structured?
- **Documentation (20%)**: Is it properly documented?
- **Creativity (20%)**: Does it go beyond requirements?

## Solution Guidelines

### Chapter 1 Solutions
- **1.1**: Look at industrial robots (KUKA, Fanuc), service robots (Roomba, Pepper), medical robots (da Vinci, TUG)
- **1.2**: Key dates: 1954 (Unimate), 1969 (Shakey), 2000 (ASIMO), 2011 (Watson)

### Chapter 2 Solutions
- **2.1**: Consider LiDAR for navigation, cameras for vision, microphones for interaction
- **2.2**: Use torque calculations: τ = r × F, consider dynamic vs static loads

### Chapter 3 Solutions
- **3.1**: Start with perceptron, add hidden layer with sigmoid activation
- **3.2**: Implement Q-table, epsilon-greedy policy, reward shaping

### Chapter 4 Solutions
- **4.1**: Build transformation matrices T01, T12, T23, multiply for final pose
- **4.2**: Use priority queue for open set, heuristic (Manhattan or Euclidean distance)

## Additional Resources

### Code Templates
Check the [GitHub repository](https://github.com/robotic-book/robotic-book) for starter code and templates.

### Community Support
- Discuss exercises on the [community forum](https://github.com/robotic-book/robotic-book/discussions)
- Share your solutions and learn from others

### Extensions
- Try adding ROS integration to your projects
- Experiment with different ML frameworks
- Build physical implementations using Arduino/Raspberry Pi