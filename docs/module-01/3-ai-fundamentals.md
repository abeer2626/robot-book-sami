---
title: "Chapter 3: AI Fundamentals"
description: "Essential machine learning concepts for robotics applications"
learningObjectives:
  - Understand basic machine learning principles
  - Learn about neural networks and deep learning
  - Explore computer vision fundamentals
  - Apply reinforcement learning to robotics
estimatedReadingTime: 35
---

# Chapter 3: AI Fundamentals

## Introduction

Artificial Intelligence (AI) gives robots the ability to learn, adapt, and make intelligent decisions. This chapter covers the fundamental AI concepts that power modern robotic systems, from basic machine learning to advanced deep learning techniques.

## What is Machine Learning?

### Definition

Machine Learning is a subset of AI where systems learn patterns from data without being explicitly programmed. Instead of following rigid rules, ML models improve through experience.

### Types of Machine Learning

#### 1. Supervised Learning

Learning from labeled examples to make predictions on new data.

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

class ObjectClassifier:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
        self.labels = ['cup', 'bottle', 'phone', 'book']

    def train(self, features, labels):
        """Train the classifier with labeled data

        Args:
            features: Array of object features (size, weight, color, etc.)
            labels: Array of object names
        """
        # Split data for validation
        X_train, X_val, y_train, y_val = train_test_split(
            features, labels, test_size=0.2, random_state=42
        )

        # Train the model
        self.model.fit(X_train, y_train)

        # Validate performance
        y_pred = self.model.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        print(f"Validation accuracy: {accuracy:.2f}")

    def predict(self, features):
        """Predict object class from features"""
        prediction = self.model.predict([features])[0]
        confidence = max(self.model.predict_proba([features])[0])
        return prediction, confidence

    def extract_features(self, image):
        """Extract features from camera image"""
        # Simplified feature extraction
        # In reality, would use more sophisticated methods
        size = np.count_nonzero(image)  # Approximate size
        mean_color = np.mean(image)     # Average color
        aspect_ratio = image.shape[1] / image.shape[0]

        return [size, mean_color, aspect_ratio]
```

**Example Applications**:
- Object recognition
- Speech recognition
- Quality inspection

#### 2. Unsupervised Learning

Finding patterns in unlabeled data.

```python
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

class TerrainAnalyzer:
    def __init__(self, n_clusters=3):
        self.n_clusters = n_clusters
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.terrain_types = ['smooth', 'rough', 'obstacle']

    def analyze_terrain(self, sensor_data):
        """Analyze terrain from sensor measurements

        Args:
            sensor_data: Array of terrain measurements
                         (height variation, texture, hardness)
        """
        # Perform clustering
        clusters = self.kmeans.fit_predict(sensor_data)

        # Visualize results
        pca = PCA(n_components=2)
        reduced_data = pca.fit_transform(sensor_data)

        return clusters, reduced_data

    def classify_point(self, point):
        """Classify a single terrain point"""
        cluster_id = self.kmeans.predict([point])[0]
        return self.terrain_types[cluster_id]

    def create_navigation_map(self, sensor_grid):
        """Create a navigation map from terrain analysis"""
        nav_map = np.zeros(sensor_grid.shape[:2])

        for i in range(sensor_grid.shape[0]):
            for j in range(sensor_grid.shape[1]):
                point = sensor_grid[i, j]
                terrain_type = self.classify_point(point)

                if terrain_type == 'obstacle':
                    nav_map[i, j] = 1  # Impassable
                elif terrain_type == 'rough':
                    nav_map[i, j] = 0.5  # Difficult
                else:  # smooth
                    nav_map[i, j] = 0  # Easy

        return nav_map
```

#### 3. Reinforcement Learning

Learning through interaction with environment using rewards.

```python
import numpy as np
import random

class QLearningAgent:
    def __init__(self, state_size, action_size, learning_rate=0.1):
        self.state_size = state_size
        self.action_size = action_size
        self.learning_rate = learning_rate
        self.discount_factor = 0.95  # Future reward discount
        self.epsilon = 1.0  # Exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995

        # Q-table: [state, action] -> value
        self.q_table = np.zeros((state_size, action_size))

    def get_action(self, state):
        """Choose action using epsilon-greedy policy"""
        if random.random() < self.epsilon:
            # Explore: choose random action
            return random.randrange(self.action_size)
        else:
            # Exploit: choose best known action
            return np.argmax(self.q_table[state])

    def update_q_table(self, state, action, reward, next_state):
        """Update Q-values using Bellman equation"""
        current_q = self.q_table[state, action]
        max_next_q = np.max(self.q_table[next_state])
        new_q = current_q + self.learning_rate * (
            reward + self.discount_factor * max_next_q - current_q
        )
        self.q_table[state, action] = new_q

    def decay_epsilon(self):
        """Reduce exploration over time"""
        self.epsilon = max(self.epsilon_min,
                          self.epsilon * self.epsilon_decay)

    def train_episode(self, env, max_steps=1000):
        """Train for one episode"""
        state = env.reset()
        total_reward = 0

        for step in range(max_steps):
            # Choose action
            action = self.get_action(state)

            # Take action
            next_state, reward, done = env.step(action)

            # Update Q-table
            self.update_q_table(state, action, reward, next_state)

            state = next_state
            total_reward += reward

            if done:
                break

        self.decay_epsilon()
        return total_reward


class RobotEnvironment:
    """Simple grid world for robot navigation"""

    def __init__(self, grid_size=10):
        self.grid_size = grid_size
        self.robot_pos = [0, 0]
        self.goal_pos = [grid_size-1, grid_size-1]
        self.obstacles = self.generate_obstacles()

    def generate_obstacles(self):
        """Generate random obstacles"""
        obstacles = set()
        for _ in range(self.grid_size // 3):
            x, y = random.randint(0, self.grid_size-1), \
                   random.randint(0, self.grid_size-1)
            if [x, y] != [0, 0] and [x, y] != self.goal_pos:
                obstacles.add((x, y))
        return obstacles

    def reset(self):
        """Reset environment to initial state"""
        self.robot_pos = [0, 0]
        return self.pos_to_state(self.robot_pos)

    def pos_to_state(self, pos):
        """Convert position to state index"""
        return pos[0] * self.grid_size + pos[1]

    def state_to_pos(self, state):
        """Convert state index to position"""
        return [state // self.grid_size, state % self.grid_size]

    def step(self, action):
        """Execute one step in environment

        Actions: 0=up, 1=right, 2=down, 3=left
        """
        # Update position
        if action == 0:  # up
            self.robot_pos[1] = max(0, self.robot_pos[1] - 1)
        elif action == 1:  # right
            self.robot_pos[0] = min(self.grid_size-1, self.robot_pos[0] + 1)
        elif action == 2:  # down
            self.robot_pos[1] = min(self.grid_size-1, self.robot_pos[1] + 1)
        elif action == 3:  # left
            self.robot_pos[0] = max(0, self.robot_pos[0] - 1)

        # Calculate reward
        if self.robot_pos == self.goal_pos:
            reward = 100  # Reached goal
            done = True
        elif tuple(self.robot_pos) in self.obstacles:
            reward = -10  # Hit obstacle
            done = True
        else:
            reward = -1  # Step penalty
            done = False

        next_state = self.pos_to_state(self.robot_pos)
        return next_state, reward, done
```

## Neural Networks and Deep Learning

### Perceptron: The Basic Building Block

```python
import numpy as np

class Perceptron:
    def __init__(self, input_size):
        self.weights = np.random.randn(input_size)
        self.bias = np.random.randn()
        self.learning_rate = 0.1

    def forward(self, x):
        """Forward pass: compute output"""
        weighted_sum = np.dot(x, self.weights) + self.bias
        return self.activation(weighted_sum)

    def activation(self, x):
        """Step activation function"""
        return 1 if x > 0 else 0

    def train(self, X, y, epochs=100):
        """Train the perceptron"""
        for epoch in range(epochs):
            for xi, target in zip(X, y):
                # Forward pass
                output = self.forward(xi)
                error = target - output

                # Update weights
                self.weights += self.learning_rate * error * xi
                self.bias += self.learning_rate * error
```

### Multi-Layer Perceptron (MLP)

```python
class NeuralNetwork:
    def __init__(self, layer_sizes):
        """Initialize neural network

        Args:
            layer_sizes: List of layer sizes [input, hidden1, hidden2, ..., output]
        """
        self.weights = []
        self.biases = []

        # Initialize weights and biases
        for i in range(len(layer_sizes) - 1):
            w = np.random.randn(layer_sizes[i], layer_sizes[i+1]) * 0.1
            b = np.random.randn(layer_sizes[i+1]) * 0.1
            self.weights.append(w)
            self.biases.append(b)

    def sigmoid(self, x):
        """Sigmoid activation function"""
        return 1 / (1 + np.exp(-np.clip(x, -500, 500)))

    def sigmoid_derivative(self, x):
        """Derivative of sigmoid"""
        s = self.sigmoid(x)
        return s * (1 - s)

    def forward(self, x):
        """Forward propagation"""
        self.activations = [x]
        self.z_values = []

        for w, b in zip(self.weights, self.biases):
            z = np.dot(self.activations[-1], w) + b
            self.z_values.append(z)
            activation = self.sigmoid(z)
            self.activations.append(activation)

        return self.activations[-1]

    def backward(self, y, output):
        """Backpropagation"""
        m = len(y)

        # Calculate gradients for output layer
        d_output = (output - y) / m
        d_weights_output = np.dot(self.activations[-2].T, d_output)
        d_biases_output = np.sum(d_output, axis=0)

        # Store gradients
        self.d_weights = [d_weights_output]
        self.d_biases = [d_biases_output]

        # Backpropagate through hidden layers
        d = d_output

        for i in range(len(self.weights) - 2, -1, -1):
            d = np.dot(d, self.weights[i+1].T) * \
                self.sigmoid_derivative(self.z_values[i])

            d_w = np.dot(self.activations[i].T, d)
            d_b = np.sum(d, axis=0)

            self.d_weights.insert(0, d_w)
            self.d_biases.insert(0, d_b)

    def train_step(self, X, y, learning_rate=0.01):
        """One training step"""
        # Forward pass
        output = self.forward(X)

        # Backward pass
        self.backward(y, output)

        # Update weights and biases
        for i in range(len(self.weights)):
            self.weights[i] -= learning_rate * self.d_weights[i]
            self.biases[i] -= learning_rate * self.d_biases[i]

        # Calculate loss
        loss = np.mean((output - y) ** 2)
        return loss

    def train(self, X, y, epochs=1000, learning_rate=0.01):
        """Train the neural network"""
        losses = []

        for epoch in range(epochs):
            loss = self.train_step(X, y, learning_rate)
            losses.append(loss)

            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

        return losses


# Example: Train a neural network for robot control
def create_training_data():
    """Create training data for wall following behavior"""
    data = []
    labels = []

    # Generate scenarios
    for _ in range(1000):
        # Random sensor readings (left, center, right distances)
        left_dist = random.uniform(0, 2)
        center_dist = random.uniform(0, 2)
        right_dist = random.uniform(0, 2)

        # Determine optimal action
        if center_dist < 0.3:  # Too close to center wall
            if left_dist > right_dist:
                action = [1, 0, 0]  # Turn left
            else:
                action = [0, 0, 1]  # Turn right
        elif left_dist < 0.3:  # Too close to left wall
            action = [0, 0, 1]  # Turn right
        elif right_dist < 0.3:  # Too close to right wall
            action = [1, 0, 0]  # Turn left
        else:
            action = [0, 1, 0]  # Go straight

        data.append([left_dist, center_dist, right_dist])
        labels.append(action)

    return np.array(data), np.array(labels)

# Create and train the network
X_train, y_train = create_training_data()
network = NeuralNetwork([3, 10, 3])  # 3 inputs, 10 hidden, 3 outputs
losses = network.train(X_train, y_train, epochs=1000, learning_rate=0.1)
```

## Convolutional Neural Networks (CNNs) for Computer Vision

### CNN Architecture

```python
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F

class RobotCNN(nn.Module):
    """CNN for object detection in robotics"""

    def __init__(self, num_classes=4):
        super(RobotCNN, self).__init__()

        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)

        # Pooling layer
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)

        # Fully connected layers
        self.fc1 = nn.Linear(128 * 28 * 28, 512)  # Assuming 224x224 input
        self.fc2 = nn.Linear(512, num_classes)

        # Dropout for regularization
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        # Convolutional layers with ReLU activation
        x = F.relu(self.conv1(x))
        x = self.pool(x)

        x = F.relu(self.conv2(x))
        x = self.pool(x)

        x = F.relu(self.conv3(x))
        x = self.pool(x)

        # Flatten for fully connected layers
        x = x.view(x.size(0), -1)

        # Fully connected layers
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)

        return x

    def predict(self, x):
        """Make predictions with confidence scores"""
        with torch.no_grad():
            outputs = self.forward(x)
            probabilities = F.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            return predicted, confidence


def train_robot_cnn(train_loader, test_loader, num_epochs=10):
    """Train the CNN for object detection"""

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = RobotCNN(num_classes=4).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    train_losses = []
    test_accuracies = []

    for epoch in range(num_epochs):
        # Training phase
        model.train()
        running_loss = 0.0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            # Forward pass
            outputs = model(images)
            loss = criterion(outputs, labels)

            # Backward pass and optimize
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

        # Evaluation phase
        model.eval()
        correct = 0
        total = 0

        with torch.no_grad():
            for images, labels in test_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

        accuracy = 100 * correct / total
        avg_loss = running_loss / len(train_loader)

        train_losses.append(avg_loss)
        test_accuracies.append(accuracy)

        print(f'Epoch [{epoch+1}/{num_epochs}], '
              f'Loss: {avg_loss:.4f}, '
              f'Test Accuracy: {accuracy:.2f}%')

    return model, train_losses, test_accuracies


class ObjectDetector:
    """Object detection system for robots"""

    def __init__(self, model_path=None):
        self.model = RobotCNN(num_classes=4)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        if model_path:
            self.model.load_state_dict(torch.load(model_path))
            self.model.eval()

        self.class_names = ['cup', 'bottle', 'phone', 'book']

    def detect_objects(self, image):
        """Detect objects in camera image"""
        # Preprocess image
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])

        image_tensor = transform(image).unsqueeze(0).to(self.device)

        # Make prediction
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = F.softmax(outputs, dim=1)

        # Process results
        detections = []
        for i, prob in enumerate(probabilities[0]):
            if prob > 0.5:  # Confidence threshold
                detections.append({
                    'class': self.class_names[i],
                    'confidence': prob.item()
                })

        return detections

    def track_objects(self, frame_sequence):
        """Track objects across multiple frames"""
        detections_history = []

        for frame in frame_sequence:
            frame_detections = self.detect_objects(frame)
            detections_history.append(frame_detections)

        # Simple tracking: maintain object IDs across frames
        tracked_objects = self.associate_detections(detections_history)

        return tracked_objects

    def associate_detections(self, detections_history):
        """Associate detections across frames"""
        # Simplified tracking based on proximity
        tracked_objects = []

        for frame_idx, frame_detections in enumerate(detections_history):
            frame_objects = []

            for detection in frame_detections:
                obj_id = f"{detection['class']}_{len(tracked_objects)}"
                frame_objects.append({
                    'id': obj_id,
                    'class': detection['class'],
                    'confidence': detection['confidence'],
                    'frame': frame_idx
                })

            tracked_objects.extend(frame_objects)

        return tracked_objects
```

## Deep Reinforcement Learning

### Deep Q-Network (DQN)

```python
import random
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque

class DQN(nn.Module):
    """Deep Q-Network for reinforcement learning"""

    def __init__(self, state_size, action_size, hidden_size=64):
        super(DQN, self).__init__()

        self.fc1 = nn.Linear(state_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, action_size)

        self.activation = nn.ReLU()

    def forward(self, x):
        x = self.activation(self.fc1(x))
        x = self.activation(self.fc2(x))
        return self.fc3(x)


class DQNAgent:
    """DQN Agent with experience replay"""

    def __init__(self, state_size, action_size, memory_size=10000):
        self.state_size = state_size
        self.action_size = action_size

        # Neural networks
        self.q_network = DQN(state_size, action_size)
        self.target_network = DQN(state_size, action_size)
        self.update_target_network()

        # Training parameters
        self.learning_rate = 0.001
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=self.learning_rate)
        self.discount_factor = 0.95
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995

        # Experience replay
        self.memory = deque(maxlen=memory_size)
        self.batch_size = 64

        # Training control
        self.update_target_every = 10
        self.train_step = 0

    def update_target_network(self):
        """Copy weights from Q-network to target network"""
        self.target_network.load_state_dict(self.q_network.state_dict())

    def remember(self, state, action, reward, next_state, done):
        """Store experience in replay memory"""
        self.memory.append((state, action, reward, next_state, done))

    def get_action(self, state, training=True):
        """Choose action using epsilon-greedy policy"""
        if training and random.random() < self.epsilon:
            return random.randrange(self.action_size)

        with torch.no_grad():
            state_tensor = torch.FloatTensor(state).unsqueeze(0)
            q_values = self.q_network(state_tensor)
            return q_values.argmax().item()

    def replay_experience(self):
        """Train model using experience replay"""
        if len(self.memory) < self.batch_size:
            return

        # Sample random batch from memory
        batch = random.sample(self.memory, self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        # Convert to tensors
        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.BoolTensor(dones)

        # Current Q-values
        current_q_values = self.q_network(states).gather(1, actions.unsqueeze(1))

        # Next Q-values from target network
        with torch.no_grad():
            next_q_values = self.target_network(next_states).max(1)[0]
            target_q_values = rewards + (1 - dones.float()) * self.discount_factor * next_q_values

        # Compute loss
        loss = nn.MSELoss()(current_q_values.squeeze(), target_q_values)

        # Optimize
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        # Decay epsilon
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

        # Update target network periodically
        self.train_step += 1
        if self.train_step % self.update_target_every == 0:
            self.update_target_network()


class RobotNavigationEnv:
    """Complex navigation environment for robot"""

    def __init__(self, grid_size=20):
        self.grid_size = grid_size
        self.robot_pos = [0, 0]
        self.goal_pos = [grid_size-1, grid_size-1]
        self.obstacles = self.generate_complex_obstacles()
        self.max_steps = grid_size * 2

    def generate_complex_obstacles(self):
        """Generate complex obstacle patterns"""
        obstacles = set()

        # Add wall sections
        for i in range(5, 15):
            obstacles.add((i, 5))
            obstacles.add((5, i))

        # Add random obstacles
        for _ in range(self.grid_size):
            x, y = random.randint(0, self.grid_size-1), \
                   random.randint(0, self.grid_size-1)
            if [x, y] != [0, 0] and [x, y] != self.goal_pos:
                obstacles.add((x, y))

        return obstacles

    def get_state(self):
        """Get current state representation"""
        # Create feature vector
        state = []

        # Robot position
        state.extend(self.robot_pos)

        # Goal position
        state.extend(self.goal_pos)

        # Distance to goal
        dist_x = self.goal_pos[0] - self.robot_pos[0]
        dist_y = self.goal_pos[1] - self.robot_pos[1]
        state.extend([dist_x, dist_y])

        # Nearby obstacles (8 directions)
        directions = [(0, 1), (1, 1), (1, 0), (1, -1),
                     (0, -1), (-1, -1), (-1, 0), (-1, 1)]

        for dx, dy in directions:
            check_x = self.robot_pos[0] + dx
            check_y = self.robot_pos[1] + dy

            if (check_x, check_y) in self.obstacles:
                state.append(1)
            else:
                state.append(0)

        return state

    def step(self, action):
        """Execute action in environment"""
        # Actions: 0=up, 1=up-right, 2=right, 3=down-right,
        #          4=down, 5=down-left, 6=left, 7=up-left
        moves = [(0, -1), (1, -1), (1, 0), (1, 1),
                (0, 1), (-1, 1), (-1, 0), (-1, -1)]

        dx, dy = moves[action]
        new_x = self.robot_pos[0] + dx
        new_y = self.robot_pos[1] + dy

        # Check boundaries and obstacles
        if (0 <= new_x < self.grid_size and
            0 <= new_y < self.grid_size and
            (new_x, new_y) not in self.obstacles):
            self.robot_pos = [new_x, new_y]

        # Calculate reward
        if self.robot_pos == self.goal_pos:
            reward = 100
            done = True
        elif tuple(self.robot_pos) in self.obstacles:
            reward = -50
            done = True
        else:
            # Distance-based reward
            old_dist = abs(self.robot_pos[0] - dx - self.goal_pos[0]) + \
                      abs(self.robot_pos[1] - dy - self.goal_pos[1])
            new_dist = abs(self.robot_pos[0] - self.goal_pos[0]) + \
                      abs(self.robot_pos[1] - self.goal_pos[1])

            if new_dist < old_dist:
                reward = 1  # Moving closer to goal
            else:
                reward = -1  # Moving away from goal

            done = False

        next_state = self.get_state()

        return next_state, reward, done

    def train_dqn_agent(episodes=1000):
        """Train DQN agent for robot navigation"""
        env = RobotNavigationEnv()
        state_size = len(env.get_state())
        action_size = 8  # 8 movement directions

        agent = DQNAgent(state_size, action_size)
        scores = []

        for episode in range(episodes):
            state = env.reset()
            total_reward = 0
            done = False

            while not done:
                # Choose action
                action = agent.get_action(state)

                # Take action
                next_state, reward, done = env.step(action)

                # Store experience
                agent.remember(state, action, reward, next_state, done)

                # Learn
                agent.replay_experience()

                state = next_state
                total_reward += reward

            scores.append(total_reward)

            if episode % 100 == 0:
                avg_score = sum(scores[-100:]) / 100
                print(f"Episode {episode}, "
                      f"Avg Score (last 100): {avg_score:.2f}, "
                      f"Epsilon: {agent.epsilon:.2f}")

        return agent, scores
```

## Transfer Learning in Robotics

### Pretrained Models for Robot Vision

```python
import torchvision.models as models
import torchvision.transforms as transforms

class TransferLearningVision:
    """Use pretrained models for robot vision tasks"""

    def __init__(self, model_name='resnet18', num_classes=10):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Load pretrained model
        if model_name == 'resnet18':
            self.model = models.resnet18(pretrained=True)
        elif model_name == 'mobilenet_v2':
            self.model = models.mobilenet_v2(pretrained=True)
        else:
            raise ValueError("Unsupported model")

        # Modify final layer for custom classes
        num_features = self.model.fc.in_features
        self.model.fc = nn.Linear(num_features, num_classes)
        self.model.to(self.device)

        # Freeze early layers
        for param in list(self.model.parameters())[:-10]:
            param.requires_grad = False

    def fine_tune(self, train_loader, test_loader, epochs=20):
        """Fine-tune the pretrained model"""
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(self.model.parameters(), lr=0.0001)

        for epoch in range(epochs):
            # Training
            self.model.train()
            running_loss = 0.0

            for images, labels in train_loader:
                images, labels = images.to(self.device), labels.to(self.device)

                optimizer.zero_grad()
                outputs = self.model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            # Validation
            self.model.eval()
            correct = 0
            total = 0

            with torch.no_grad():
                for images, labels in test_loader:
                    images, labels = images.to(self.device), labels.to(self.device)
                    outputs = self.model(images)
                    _, predicted = torch.max(outputs.data, 1)
                    total += labels.size(0)
                    correct += (predicted == labels).sum().item()

            accuracy = 100 * correct / total
            avg_loss = running_loss / len(train_loader)

            print(f'Epoch {epoch+1}, Loss: {avg_loss:.4f}, Accuracy: {accuracy:.2f}%')

    def extract_features(self, image):
        """Extract features from image for other ML tasks"""
        self.model.eval()

        # Remove final layer
        feature_extractor = nn.Sequential(*list(self.model.children())[:-1])

        with torch.no_grad():
            features = feature_extractor(image.unsqueeze(0).to(self.device))
            return features.flatten().cpu().numpy()


class Sim2RealTransfer:
    """Transfer learning from simulation to real robots"""

    def __init__(self):
        self.sim_model = None
        self.real_model = None
        self.domain_randomization = True

    def train_in_simulation(self, sim_env, episodes=5000):
        """Train model in simulation with domain randomization"""
        state_size = sim_env.get_state_size()
        action_size = sim_env.get_action_size()

        self.sim_model = DQN(state_size, action_size)

        for episode in range(episodes):
            if self.domain_randomization:
                # Randomize simulation parameters
                self.randomize_environment(sim_env)

            # Train episode
            state = sim_env.reset()
            done = False

            while not done:
                action = self.sim_model.get_action(state)
                next_state, reward, done = sim_env.step(action)

                self.sim_model.remember(state, action, reward, next_state, done)
                self.sim_model.replay_experience()

                state = next_state

            if episode % 500 == 0:
                print(f"Sim training episode {episode}")

    def randomize_environment(self, env):
        """Apply domain randomization to simulation"""
        # Randomize visual properties
        env.randomize_lighting()
        env.randomize_textures()
        env.randomize_camera_angle()

        # Randomize physics
        env.randomize_friction()
        env.randomize_gravity()
        env.randomize_noise_level()

    def transfer_to_real(self, real_env, adaptation_episodes=100):
        """Adapt trained model to real robot"""
        # Initialize real model with simulation weights
        self.real_model = DQN(real_env.get_state_size(), real_env.get_action_size())
        self.real_model.q_network.load_state_dict(self.sim_model.q_network.state_dict())
        self.real_model.target_network.load_state_dict(self.sim_model.target_network.state_state_dict())

        # Fine-tune on real robot with reduced learning rate
        self.real_model.learning_rate = 0.0001
        self.real_model.epsilon = 0.1  # Low exploration for safety

        for episode in range(adaptation_episodes):
            state = real_env.reset()
            done = False
            episode_reward = 0

            while not done:
                action = self.real_model.get_action(state)
                next_state, reward, done = real_env.step(action)

                self.real_model.remember(state, action, reward, next_state, done)
                self.real_model.replay_experience()

                state = next_state
                episode_reward += reward

            print(f"Real adaptation episode {episode}, Reward: {episode_reward}")
```

## Summary

In this chapter, we've covered:

- **Machine Learning Fundamentals**: Supervised, unsupervised, and reinforcement learning
- **Neural Networks**: From perceptrons to deep networks
- **Computer Vision**: CNNs for object detection and tracking
- **Deep Reinforcement Learning**: DQN for complex decision making
- **Transfer Learning**: Adapting models from simulation to real robots

These AI techniques enable robots to learn from experience, adapt to new situations, and perform complex tasks autonomously.

## Key Terms

- **Neural Network**: Computing system inspired by biological neural networks
- **Backpropagation**: Algorithm for training neural networks
- **Convolutional Neural Network (CNN)**: Specialized NN for image processing
- **Reinforcement Learning**: Learning through interaction with environment
- **Transfer Learning**: Adapting pretrained models to new tasks

## Discussion Questions

1. When should you use supervised vs reinforcement learning for a robot task?
2. How can you ensure safety when training robots with reinforcement learning?
3. What are the challenges of applying deep learning to real-time robot control?
4. How does domain randomization help with sim-to-real transfer?

---

## Next Steps

Ready to continue? Move on to [Chapter 4: Mathematics for Robotics](4-mathematics-for-robotics.md) to understand the mathematical foundations that underpin all the AI techniques we've discussed.

*Use the chat assistant to ask questions about any concept in this chapter!*