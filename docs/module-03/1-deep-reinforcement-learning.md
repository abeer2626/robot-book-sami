---
title: "Chapter 1: Deep Reinforcement Learning"
description: "Advanced machine learning techniques for robotic control"
learningObjectives:
  - Master DRL algorithms and architectures
  - Implement value-based and policy-based methods
  - Apply DRL to robotic systems
  - Handle exploration-exploitation tradeoffs
estimatedReadingTime: 75
---

# Chapter 1: Deep Reinforcement Learning

## Introduction

Deep Reinforcement Learning (DRL) combines deep neural networks with reinforcement learning principles to enable robots to learn complex behaviors from high-dimensional sensory inputs.

## Fundamentals of Reinforcement Learning

### Key Components

1. **Agent**: The robot or decision-maker
2. **Environment**: The world the agent operates in
3. **State (S)**: Current situation representation
4. **Action (A)**: What the agent can do
5. **Reward (R)**: Feedback signal
6. **Policy (π)**: Agent's strategy for choosing actions

### Markov Decision Process (MDP)

```
(S, A, P, R, γ)
```
- S: State space
- A: Action space
- P: State transition probabilities
- R: Reward function
- γ: Discount factor (0 ≤ γ ≤ 1)

## Deep Q-Networks (DQN)

### Architecture

```python
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from collections import deque
import random

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_size=256):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_dim, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, action_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        return self.fc3(x)

class DQNAgent:
    def __init__(self, state_dim, action_dim, lr=0.001):
        self.state_dim = state_dim
        self.action_dim = action_dim

        # Main network
        self.q_network = DQN(state_dim, action_dim)
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=lr)

        # Target network
        self.target_network = DQN(state_dim, action_dim)
        self.update_target_network()

        # Experience replay
        self.replay_buffer = deque(maxlen=10000)
        self.batch_size = 64
        self.gamma = 0.99
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995

    def select_action(self, state):
        """Epsilon-greedy action selection"""
        if random.random() < self.epsilon:
            return random.randrange(self.action_dim)

        with torch.no_grad():
            state = torch.FloatTensor(state).unsqueeze(0)
            q_values = self.q_network(state)
            return q_values.argmax().item()

    def store_experience(self, state, action, reward, next_state, done):
        """Store experience in replay buffer"""
        self.replay_buffer.append((state, action, reward, next_state, done))

    def train(self):
        """Train the network"""
        if len(self.replay_buffer) < self.batch_size:
            return

        # Sample batch
        batch = random.sample(self.replay_buffer, self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        # Convert to tensors
        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.BoolTensor(dones)

        # Current Q values
        current_q = self.q_network(states).gather(1, actions.unsqueeze(1))

        # Next Q values from target network
        next_q = self.target_network(next_states).max(1)[0].detach()
        target_q = rewards + (self.gamma * next_q * ~dones)

        # Compute loss
        loss = nn.MSELoss()(current_q.squeeze(), target_q)

        # Optimize
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        # Decay epsilon
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

    def update_target_network(self):
        """Update target network weights"""
        self.target_network.load_state_dict(self.q_network.state_dict())
```

### Improvements to DQN

1. **Double DQN**: Separate action selection from evaluation
2. **Dueling DQN**: Separate state value and advantage functions
3. **Prioritized Experience Replay**: Sample important experiences more often
4. **Noisy Networks**: Add noise for exploration

## Policy Gradient Methods

### REINFORCE Algorithm

```python
class PolicyGradient(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_size=256):
        super(PolicyGradient, self).__init__()
        self.fc1 = nn.Linear(state_dim, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, action_dim)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return torch.softmax(self.fc3(x), dim=-1)

class REINFORCEAgent:
    def __init__(self, state_dim, action_dim, lr=0.001):
        self.policy = PolicyGradient(state_dim, action_dim)
        self.optimizer = optim.Adam(self.policy.parameters(), lr=lr)
        self.gamma = 0.99
        self.reset_memory()

    def reset_memory(self):
        self.states = []
        self.actions = []
        self.rewards = []

    def select_action(self, state):
        state = torch.FloatTensor(state)
        action_probs = self.policy(state)
        dist = torch.distributions.Categorical(action_probs)
        action = dist.sample()

        self.states.append(state)
        self.actions.append(action)

        return action.item()

    def store_reward(self, reward):
        self.rewards.append(reward)

    def update(self):
        """Update policy using REINFORCE"""
        # Calculate discounted rewards
        discounted_rewards = []
        R = 0
        for r in reversed(self.rewards):
            R = r + self.gamma * R
            discounted_rewards.insert(0, R)

        # Normalize rewards
        discounted_rewards = torch.FloatTensor(discounted_rewards)
        discounted_rewards = (discounted_rewards - discounted_rewards.mean()) / \
                           (discounted_rewards.std() + 1e-8)

        # Calculate loss
        states = torch.stack(self.states)
        actions = torch.tensor(self.actions)

        action_probs = self.policy(states)
        log_probs = torch.log(action_probs.gather(1, actions.unsqueeze(1)))

        loss = -(log_probs.squeeze() * discounted_rewards).mean()

        # Optimize
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        self.reset_memory()
```

### Actor-Critic Methods

```python
class ActorCritic(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_size=256):
        super(ActorCritic, self).__init__()

        # Actor (policy)
        self.actor = nn.Sequential(
            nn.Linear(state_dim, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, action_dim),
            nn.Softmax(dim=-1)
        )

        # Critic (value function)
        self.critic = nn.Sequential(
            nn.Linear(state_dim, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, 1)
        )

    def forward(self, x):
        action_probs = self.actor(x)
        state_value = self.critic(x)
        return action_probs, state_value

class A2CAgent:
    def __init__(self, state_dim, action_dim, lr=0.001):
        self.ac_network = ActorCritic(state_dim, action_dim)
        self.optimizer = optim.Adam(self.ac_network.parameters(), lr=lr)
        self.gamma = 0.99
        self.reset_memory()

    def reset_memory(self):
        self.states = []
        self.actions = []
        self.rewards = []
        self.log_probs = []
        self.values = []

    def select_action(self, state):
        state = torch.FloatTensor(state)
        action_probs, value = self.ac_network(state)

        dist = torch.distributions.Categorical(action_probs)
        action = dist.sample()
        log_prob = dist.log_prob(action)

        self.states.append(state)
        self.actions.append(action)
        self.log_probs.append(log_prob)
        self.values.append(value)

        return action.item()

    def store_reward(self, reward):
        self.rewards.append(reward)

    def update(self):
        """Update using Advantage Actor-Critic"""
        # Calculate returns and advantages
        returns = []
        advantages = []
        R = 0

        for r, v in zip(reversed(self.rewards), reversed(self.values)):
            R = r + self.gamma * R
            returns.insert(0, R)
            advantages.insert(0, R - v.item())

        returns = torch.FloatTensor(returns)
        advantages = torch.FloatTensor(advantages)

        # Normalize advantages
        advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

        # Calculate loss
        states = torch.stack(self.states)
        actions = torch.tensor(self.actions)
        log_probs = torch.stack(self.log_probs)
        values = torch.cat(self.values)

        action_probs, new_values = self.ac_network(states)
        new_log_probs = torch.log(action_probs.gather(1, actions.unsqueeze(1)))

        # Actor loss
        actor_loss = -(log_probs * advantages).mean()

        # Critic loss
        critic_loss = nn.MSELoss()(new_values.squeeze(), returns)

        # Entropy loss for exploration
        entropy_loss = -(action_probs * torch.log(action_probs + 1e-8)).sum(dim=-1).mean()

        # Total loss
        total_loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy_loss

        # Optimize
        self.optimizer.zero_grad()
        total_loss.backward()
        self.optimizer.step()

        self.reset_memory()
```

## Robotic Applications

### Robotic Arm Control

```python
class RoboticArmEnv:
    def __init__(self):
        # Robot arm parameters
        self.num_joints = 3
        self.joint_limits = [(-np.pi, np.pi)] * self.num_joints
        self.target_pos = None
        self.max_steps = 100
        self.current_step = 0

    def reset(self):
        """Reset environment to initial state"""
        self.joint_angles = np.random.uniform(-np.pi/4, np.pi/4, self.num_joints)
        self.target_pos = np.random.uniform(-1, 1, 2)  # 2D target position
        self.current_step = 0
        return self.get_state()

    def get_state(self):
        """Get current state representation"""
        return np.concatenate([
            self.joint_angles,
            self.target_pos,
            self.get_end_effector_pos()
        ])

    def get_end_effector_pos(self):
        """Calculate end effector position"""
        x = 0
        y = 0
        angle_sum = 0

        for i, angle in enumerate(self.joint_angles):
            angle_sum += angle
            link_length = 1.0  # All links have length 1
            x += link_length * np.cos(angle_sum)
            y += link_length * np.sin(angle_sum)

        return np.array([x, y])

    def step(self, action):
        """Execute action and return observation, reward, done"""
        # Apply action (change joint angles)
        action = np.clip(action, -0.1, 0.1)  # Limit action size
        self.joint_angles += action

        # Apply joint limits
        for i in range(self.num_joints):
            self.joint_angles[i] = np.clip(
                self.joint_angles[i],
                self.joint_limits[i][0],
                self.joint_limits[i][1]
            )

        # Calculate reward
        end_effector_pos = self.get_end_effector_pos()
        distance_to_target = np.linalg.norm(end_effector_pos - self.target_pos)

        # Reward function
        reward = -distance_to_target  # Negative distance

        # Bonus for reaching target
        if distance_to_target < 0.1:
            reward += 100

        # Check if done
        self.current_step += 1
        done = (distance_to_target < 0.1) or (self.current_step >= self.max_steps)

        return self.get_state(), reward, done

# Training loop
def train_robotic_arm():
    env = RoboticArmEnv()
    agent = DQNAgent(state_dim=7, action_dim=3)  # 3 joint actions

    episodes = 1000
    scores = []

    for episode in range(episodes):
        state = env.reset()
        total_reward = 0
        done = False

        while not done:
            action = agent.select_action(state)
            next_state, reward, done = env.step(action)

            agent.store_experience(state, action, reward, next_state, done)
            agent.train()

            state = next_state
            total_reward += reward

        scores.append(total_reward)

        if episode % 100 == 0:
            print(f"Episode {episode}, Average Score: {np.mean(scores[-100:]):.2f}")
            agent.update_target_network()

    return agent, scores
```

## Advanced Topics

### Multi-Agent Reinforcement Learning

1. **Cooperative**: Agents work together towards common goal
2. **Competitive**: Agents compete against each other
3. **Mixed**: Both cooperation and competition

### Hierarchical RL

- High-level policy selects subgoals
- Low-level policies execute actions
- Enables learning of complex behaviors

### Sim-to-Real Transfer

1. **Domain Randomization**: Vary simulation parameters
2. **Domain Adaptation**: Fine-tune on real data
3. **System Identification**: Model real-world dynamics

## Challenges and Solutions

### Sample Efficiency

- Use model-based RL for planning
- Implement curriculum learning
- Transfer learning from simulation

### Safety

- Constrained RL for safety constraints
- Reward shaping for desired behaviors
- Shielding policies with safety layers

### Exploration

- Intrinsic motivation for curiosity
- Count-based exploration
- Parameter noise for exploration

## Key Takeaways

1. DRL enables learning from raw sensor data
2. Value-based and policy-based methods have trade-offs
3. Experience replay stabilizes training
4. Sim-to-real transfer is crucial for robotics

## Practice Problems

1. Implement Double DQN with target networks
2. Create policy gradient for continuous actions
3. Design multi-robot cooperation task
4. Apply DRL to real robot simulation

---

*Next: [Human-Robot Interaction](2-human-robot-interaction.md) - Designing intuitive robot interfaces*