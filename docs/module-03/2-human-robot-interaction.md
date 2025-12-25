---
title: "Chapter 2: Human-Robot Interaction"
description: "Designing intuitive and effective interfaces for human-robot collaboration"
learningObjectives:
  - Understand HRI principles and frameworks
  - Design multimodal interaction systems
  - Implement collaborative robot behaviors
  - Evaluate usability and user experience
estimatedReadingTime: 70
---

# Chapter 2: Human-Robot Interaction

## Introduction

Human-Robot Interaction (HRI) focuses on creating natural, intuitive, and effective interfaces between humans and robots. This field combines robotics, psychology, computer science, and design to enable seamless collaboration.

## Fundamentals of HRI

### Interaction Modalities

1. **Verbal Communication**
   - Speech recognition and synthesis
   - Natural language understanding
   - Dialogue management

2. **Non-verbal Communication**
   - Gestures and body language
   - Facial expressions
   - Eye gaze and attention

3. **Physical Interaction**
   - Direct manipulation
   - Force feedback and haptics
   - Proxemics (personal space)

4. **Visual Interfaces**
   - Graphical user interfaces
   - Augmented reality displays
   - Visual feedback systems

### Human Factors in HRI

1. **Trust**: Confidence in robot's capabilities
2. **Transparency**: Understanding robot's intentions
3. **Predictability**: Anticipating robot behavior
4. **Workload**: Mental and physical demands on user

## Collaborative Robotics

### Cobots (Collaborative Robots)

```python
class CobotSafetySystem:
    def __init__(self, workspace_limits):
        self.workspace = workspace_limits
        self.speed_limit = 0.25  # m/s for collaborative mode
        self.force_limit = 150  # N for safe operation
        self.emergency_stop = False

    def monitor_human_presence(self, human_positions):
        """Monitor human proximity and adjust behavior"""
        min_distance = float('inf')

        for human_pos in human_positions:
            # Calculate distance to robot
            robot_pos = self.get_robot_position()
            distance = np.linalg.norm(human_pos - robot_pos)
            min_distance = min(min_distance, distance)

        # Adjust robot speed based on distance
        if min_distance < 0.5:  # Very close
            self.reduce_speed(0.1)
            self.activate_safe_mode()
        elif min_distance < 1.0:  # Close
            self.reduce_speed(0.25)
        else:  # Safe distance
            self.resume_normal_speed()

        return min_distance

    def collision_avoidance(self, human_trajectory):
        """Predict and avoid collisions with humans"""
        robot_trajectory = self.predict_robot_path()

        # Check for potential collisions
        for t in range(10):  # Check 10 time steps ahead
            robot_pos = robot_trajectory[t] if t < len(robot_trajectory) else robot_trajectory[-1]
            human_pos = human_trajectory[t] if t < len(human_trajectory) else human_trajectory[-1]

            if np.linalg.norm(robot_pos - human_pos) < 0.3:  # Collision threshold
                # Plan alternative path
                return self.replan_path(robot_pos, human_pos)

        return robot_trajectory

class CollaborativeTaskPlanner:
    def __init__(self):
        self.task_queue = []
        self.human_capabilities = []
        self.robot_capabilities = []

    def allocate_tasks(self, tasks):
        """Allocate tasks between human and robot based on capabilities"""
        allocation = {'human': [], 'robot': [], 'collaborative': []}

        for task in tasks:
            if self.requires_human_judgment(task):
                allocation['human'].append(task)
            elif self.is_robot_optimal(task):
                allocation['robot'].append(task)
            else:
                allocation['collaborative'].append(task)

        return allocation

    def requires_human_judgment(self, task):
        """Check if task requires human decision-making"""
        judgment_tasks = [
            'quality_inspection',
            'error_handling',
            'creative_adjustments'
        ]
        return task['type'] in judgment_tasks

    def is_robot_optimal(self, task):
        """Check if robot can perform task optimally"""
        optimal_tasks = [
            'precision_placement',
            'repetitive_motion',
            'heavy_lifting',
            'continuous_operation'
        ]
        return task['type'] in optimal_tasks
```

### Shared Autonomy

```python
class SharedAutonomyController:
    def __init__(self):
        self.user_input = None
        self.robot_belief = None
        self.confidence_threshold = 0.7

    def fuse_inputs(self, user_command, robot_perception):
        """Fuse human input with robot autonomy"""
        user_confidence = self.estimate_user_confidence(user_command)
        robot_confidence = self.estimate_robot_confidence(robot_perception)

        # Weighted combination based on confidence
        if user_confidence > self.confidence_threshold:
            # Trust human input more
            alpha = 0.7
        elif robot_confidence > self.confidence_threshold:
            # Trust robot perception more
            alpha = 0.3
        else:
            # Balanced approach
            alpha = 0.5

        fused_command = alpha * user_command + (1 - alpha) * robot_perception
        return fused_command

    def arbitration_strategy(self, user_intent, robot_capability):
        """Decide control allocation strategy"""
        strategies = {
            'direct': 'Human has full control',
            'assisted': 'Robot assists human',
            'supervised': 'Human supervises robot',
            'autonomous': 'Robot operates autonomously'
        }

        if user_intent['confidence'] > 0.8:
            return strategies['direct']
        elif robot_capability['level'] > 0.8:
            return strategies['supervised']
        elif user_intent['confidence'] > 0.5:
            return strategies['assisted']
        else:
            return strategies['autonomous']
```

## Multimodal Interaction

### Gesture Recognition

```python
import cv2
import numpy as np
import mediapipe as mp

class GestureRecognizer:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5
        )
        self.gestures = {
            'point': self.detect_pointing,
            'grasp': self.detect_grasping,
            'stop': self.detect_stop,
            'thumbs_up': self.detect_thumbs_up
        }

    def detect_gestures(self, frame):
        """Detect hand gestures from video frame"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)

        detected_gestures = []

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Extract hand landmarks
                landmarks = []
                for landmark in hand_landmarks.landmark:
                    landmarks.append([landmark.x, landmark.y, landmark.z])
                landmarks = np.array(landmarks)

                # Recognize gestures
                for gesture_name, gesture_func in self.gestures.items():
                    if gesture_func(landmarks):
                        detected_gestures.append(gesture_name)

        return detected_gestures

    def detect_pointing(self, landmarks):
        """Detect pointing gesture"""
        # Index finger extended, other fingers curled
        index_tip = landmarks[8]
        index_mcp = landmarks[5]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]

        # Check if index finger is extended
        index_extended = index_tip[1] < index_mcp[1]

        # Check if other fingers are curled
        middle_curled = middle_tip[1] > landmarks[10][1]
        ring_curled = ring_tip[1] > landmarks[14][1]
        pinky_curled = pinky_tip[1] > landmarks[18][1]

        return index_extended and middle_curled and ring_curled and pinky_curled

    def detect_stop(self, landmarks):
        """Detect stop gesture (open palm)"""
        # All fingers extended
        palm_base = landmarks[0]

        fingers_extended = []
        finger_indices = [4, 8, 12, 16, 20]  # Thumb, index, middle, ring, pinky tips
        finger_bases = [2, 5, 9, 13, 17]    # Corresponding finger bases

        for tip_idx, base_idx in zip(finger_indices, finger_bases):
            if tip_idx == 4:  # Thumb is different
                extended = abs(landmarks[tip_idx][0] - landmarks[base_idx][0]) > 0.1
            else:
                extended = landmarks[tip_idx][1] < landmarks[base_idx][1]
            fingers_extended.append(extended)

        return all(fingers_extended)
```

### Speech Interface

```python
import speech_recognition as sr
import pyttsx3
from transformers import pipeline

class SpeechInterface:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.engine = pyttsx3.init()
        self.nlp = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

        # Robot-specific vocabulary
        self.commands = {
            'move': ['move', 'go', 'travel', 'navigate'],
            'grab': ['grab', 'pick', 'take', 'get'],
            'place': ['place', 'put', 'drop', 'release'],
            'stop': ['stop', 'halt', 'wait', 'pause']
        }

    def listen_for_command(self):
        """Listen for and process voice commands"""
        with self.microphone as source:
            print("Listening...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)

        try:
            # Convert speech to text
            text = self.recognizer.recognize_google(audio)
            print(f"Recognized: {text}")

            # Extract command and entities
            command = self.extract_command(text)
            entities = self.extract_entities(text)

            return {'command': command, 'entities': entities, 'text': text}

        except sr.UnknownValueError:
            print("Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"Error: {e}")
            return None

    def extract_command(self, text):
        """Extract robot command from speech"""
        text_lower = text.lower()

        for command_type, keywords in self.commands.items():
            if any(keyword in text_lower for keyword in keywords):
                return command_type

        return 'unknown'

    def extract_entities(self, text):
        """Extract named entities from speech"""
        entities = self.nlp(text)

        extracted = {}
        for entity in entities:
            label = entity['entity']
            if label not in extracted:
                extracted[label] = []
            extracted[label].append(entity['word'])

        return extracted

    def speak(self, text):
        """Convert text to speech"""
        self.engine.say(text)
        self.engine.runAndWait()

    def confirm_action(self, action):
        """Ask for confirmation before executing action"""
        confirmation = f"Are you sure you want to {action}?"
        self.speak(confirmation)

        response = self.listen_for_command()
        if response and 'yes' in response['text'].lower():
            return True
        elif response and 'no' in response['text'].lower():
            return False
        else:
            self.speak("I didn't understand. Please say yes or no.")
            return self.confirm_action(action)
```

## Augmented Reality Interface

```python
import cv2
import numpy as np
import pybullet as p

class ARInterface:
    def __init__(self):
        self.camera = cv2.VideoCapture(0)
        self.aruco_dict = cv2.aruco.Dictionary_get(cv2.aruco.DICT_4X4_50)
        self.aruco_params = cv2.aruco.DetectorParameters_create()
        self.robot_model = None

    def project_robot_trajectory(self, camera_frame, robot_trajectory):
        """Project robot trajectory onto camera view"""
        # Detect AR markers
        corners, ids, rejected = cv2.aruco.detectMarkers(
            camera_frame, self.aruco_dict, parameters=self.aruco_params
        )

        if ids is not None and 0 in ids:  # Check if workspace marker is detected
            # Get camera pose from marker
            rvec, tvec, _ = cv2.aruco.estimatePoseSingleMarkers(
                corners, 0.05, self.camera_matrix, self.dist_coeffs
            )

            # Project 3D robot trajectory to 2D image
            projected_points = []
            for point_3d in robot_trajectory:
                point_2d, _ = cv2.projectPoints(
                    point_3d, rvec[0], tvec[0],
                    self.camera_matrix, self.dist_coeffs
                )
                projected_points.append(point_2d[0][0])

            # Draw trajectory on image
            for i in range(len(projected_points) - 1):
                cv2.line(camera_frame,
                        tuple(projected_points[i].astype(int)),
                        tuple(projected_points[i+1].astype(int)),
                        (0, 255, 0), 2)

        return camera_frame

    def visualize_robot_state(self, frame, robot_state):
        """Overlay robot state information on camera view"""
        # Robot status
        status_text = f"Status: {robot_state['status']}"
        cv2.putText(frame, status_text, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Joint angles
        for i, angle in enumerate(robot_state['joint_angles']):
            joint_text = f"Joint {i+1}: {np.degrees(angle):.1f}°"
            cv2.putText(frame, joint_text, (10, 70 + i*30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        # End effector position
        ee_pos = robot_state['end_effector_position']
        pos_text = f"Position: ({ee_pos[0]:.2f}, {ee_pos[1]:.2f}, {ee_pos[2]:.2f})"
        cv2.putText(frame, pos_text, (10, 200),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        return frame
```

## Trust and Transparency

### Explainable Robot Behavior

```python
class ExplainableRobot:
    def __init__(self):
        self.action_history = []
        self.explanations = {
            'safety_stop': 'Stopped to avoid collision with human',
            'obstacle_avoidance': 'Rerouting to avoid detected obstacle',
            'task_completion': 'Successfully completed task',
            'error_recovery': 'Attempting to recover from error'
        }

    def explain_action(self, action, context):
        """Generate explanation for robot action"""
        explanation_type = self.classify_action(action, context)
        explanation = self.explanations.get(explanation_type, 'Executing planned action')

        # Add contextual details
        if explanation_type == 'obstacle_avoidance':
            obstacle_info = self.get_obstacle_info(context)
            explanation += f" - {obstacle_info}"
        elif explanation_type == 'error_recovery':
            error_info = self.get_error_info(context)
            explanation += f" - {error_info}"

        return explanation

    def predict_future_actions(self, horizon=5):
        """Predict and explain future actions"""
        predictions = []

        current_state = self.get_current_state()
        plan = self.generate_plan(current_state)

        for i, action in enumerate(plan[:horizon]):
            confidence = self.calculate_action_confidence(action)
            explanation = self.explain_action(action, None)

            predictions.append({
                'time_step': i,
                'action': action,
                'confidence': confidence,
                'explanation': explanation
            })

        return predictions

    def visualize_intentions(self, display_surface):
        """Display robot's intentions on visual interface"""
        predictions = self.predict_future_actions()

        y_offset = 50
        for pred in predictions:
            # Action with confidence
            text = f"Step {pred['time_step']}: {pred['action']} (conf: {pred['confidence']:.2f})"
            cv2.putText(display_surface, text, (10, y_offset),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

            # Explanation
            explanation = pred['explanation']
            cv2.putText(display_surface, explanation, (10, y_offset + 25),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

            y_offset += 60
```

## Evaluation Methods

### User Studies

1. **Task Completion Time**: Measure efficiency
2. **Error Rates**: Assess accuracy
3. **User Satisfaction**: Survey questionnaires
4. **Workload Assessment**: NASA-TLX index
5. **Trust Metrics**: Trust in Automation Scale

### Objective Metrics

```python
class HRIEvaluator:
    def __init__(self):
        self.metrics = {
            'response_time': [],
            'task_success': [],
            'collaboration_efficiency': [],
            'user_satisfaction': []
        }

    def calculate_fluency(self, human_actions, robot_actions):
        """Measure interaction fluency"""
        # Temporal coordination
        time_delays = []
        for h_action, r_action in zip(human_actions, robot_actions):
            delay = abs(h_action['timestamp'] - r_action['timestamp'])
            time_delays.append(delay)

        fluency_score = 1 / (1 + np.mean(time_delays))
        return fluency_score

    def assess_safety(self, interactions):
        """Evaluate safety during interactions"""
        safety_events = 0
        total_time = 0

        for interaction in interactions:
            # Count safety violations
            if interaction['min_distance'] < 0.3:  # Too close
                safety_events += 1
            total_time += interaction['duration']

        safety_score = 1 - (safety_events / (total_time / 60))  # Events per minute
        return max(0, safety_score)

    def compute_usability(self, task_data):
        """Calculate overall usability score"""
        # Efficiency
        efficiency = task_data['tasks_completed'] / task_data['time_spent']

        # Effectiveness
        effectiveness = task_data['success_rate']

        # Satisfaction (1-5 scale normalized)
        satisfaction = task_data['user_rating'] / 5

        # Weighted average
        usability = (0.4 * efficiency + 0.4 * effectiveness + 0.2 * satisfaction)
        return usability
```

## Applications

1. **Manufacturing**: Worker-robot collaboration
2. **Healthcare**: Surgical assistance and patient care
3. **Service Industry**: Customer service robots
4. **Education**: Teaching and tutoring robots
5. **Assistive**: Help for elderly and disabled

## Key Takeaways

1. Effective HRI requires multimodal communication
2. Safety and trust are critical for collaboration
3. Context-aware interfaces improve user experience
4. Explainability builds user confidence
5. Continuous evaluation drives improvement

## Practice Problems

1. Design gesture interface for robot control
2. Implement shared autonomy for teleoperation
3. Create AR overlay for robot programming
4. Conduct user study for interface evaluation

---

*Next: [Swarm Robotics](3-swarm-robotics.md) - Multi-agent robotic systems*