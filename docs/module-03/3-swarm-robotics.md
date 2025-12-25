---
title: "Chapter 3: Swarm Robotics"
description: "Coordinated behavior in multi-agent robotic systems"
learningObjectives:
  - Understand swarm intelligence principles
  - Implement distributed algorithms
  - Design emergent behaviors
  - Apply swarm strategies to real problems
estimatedReadingTime: 80
---

# Chapter 3: Swarm Robotics

## Introduction

Swarm robotics draws inspiration from social insects and animal collectives to coordinate large groups of relatively simple robots. Instead of central control, swarm robotics relies on local interactions to produce intelligent global behavior.

## Swarm Intelligence Principles

### Key Characteristics

1. **Decentralization**: No central controller
2. **Self-organization**: Global patterns from local rules
3. **Scalability**: System works with varying numbers
4. **Flexibility**: Adapt to changing conditions
5. **Robustness**: Fault tolerance through redundancy

### Emergent Behaviors

- **Aggregation**: Robots group together
- **Dispersion**: Robots spread out evenly
- **Pattern Formation**: Create geometric shapes
- **Chain Formation**: Connect points in space
- **Task Allocation**: Distribute work among robots

## Communication in Swarms

### Local Communication

```python
class LocalCommunication:
    def __init__(self, communication_range=2.0):
        self.range = communication_range
        self.neighbors = []

    def discover_neighbors(self, robot_position, all_robots):
        """Find robots within communication range"""
        self.neighbors = []
        for robot in all_robots:
            if robot.id != self.id:
                distance = np.linalg.norm(robot.position - robot_position)
                if distance <= self.range:
                    self.neighbors.append({
                        'id': robot.id,
                        'position': robot.position,
                        'distance': distance
                    })
        return self.neighbors

    def broadcast_message(self, message, robot_position, all_robots):
        """Send message to all neighbors"""
        neighbors = self.discover_neighbors(robot_position, all_robots)
        for neighbor in neighbors:
            # Simulate message transmission
            all_robots[neighbor['id']].receive_message(message, self.id)

    def pheromone_communication(self, robot, environment):
        """Leave and detect pheromone trails"""
        # Deposit pheromone at current location
        current_cell = environment.get_cell(robot.position)
        current_cell.add_pheromone(robot.pheromone_type, strength=1.0)

        # Detect pheromone in surrounding cells
        detected_pheromones = []
        for cell in environment.get_neighbors(robot.position):
            if cell.pheromone_level > 0.1:
                detected_pheromones.append({
                    'type': cell.pheromone_type,
                    'level': cell.pheromone_level,
                    'direction': cell.position - robot.position
                })
        return detected_pheromones
```

### Stigmergy

```python
class StigmergicCoordination:
    def __init__(self):
        self.environment_grid = None
        self.pheromone_decay = 0.99

    def update_environment(self):
        """Update pheromone levels in environment"""
        for cell in self.environment_grid:
            # Decay pheromone over time
            cell.pheromone_level *= self.pheromone_decay

            # Diffuse pheromone to neighbors
            if cell.pheromone_level > 0.1:
                for neighbor in self.environment_grid.get_neighbors(cell.position):
                    transfer = cell.pheromone_level * 0.1
                    cell.pheromone_level -= transfer
                    neighbor.pheromone_level += transfer

    def follow_pheromone_gradient(self, robot, pheromone_type):
        """Move along pheromone gradient"""
        best_direction = None
        max_pheromone = 0

        # Check all possible directions
        directions = self.get_possible_directions(robot)
        for direction in directions:
            next_position = robot.position + direction * 0.1
            cell = self.environment_grid.get_cell(next_position)

            if cell and cell.pheromone_type == pheromone_type:
                if cell.pheromone_level > max_pheromone:
                    max_pheromone = cell.pheromone_level
                    best_direction = direction

        return best_direction
```

## Swarm Algorithms

### Flocking Behavior

```python
class FlockingAlgorithm:
    def __init__(self, separation_radius=0.5, alignment_radius=1.0, cohesion_radius=2.0):
        self.separation_r = separation_radius
        self.alignment_r = alignment_radius
        self.cohesion_r = cohesion_radius
        self.weights = {
            'separation': 2.0,
            'alignment': 1.0,
            'cohesion': 1.0,
            'goal': 0.5
        }

    def compute_flocking_force(self, robot, neighbors):
        """Calculate flocking forces"""
        separation_force = self.separation(robot, neighbors)
        alignment_force = self.alignment(robot, neighbors)
        cohesion_force = self.cohesion(robot, neighbors)

        total_force = (self.weights['separation'] * separation_force +
                      self.weights['alignment'] * alignment_force +
                      self.weights['cohesion'] * cohesion_force)

        return total_force

    def separation(self, robot, neighbors):
        """Avoid crowding neighbors"""
        force = np.zeros(2)

        for neighbor in neighbors:
            distance = np.linalg.norm(neighbor.position - robot.position)
            if distance < self.separation_r and distance > 0:
                # Repulsion force inversely proportional to distance
                diff = robot.position - neighbor.position
                force += diff / (distance ** 2)

        return self.normalize(force)

    def alignment(self, robot, neighbors):
        """Steer towards average heading of neighbors"""
        avg_velocity = np.zeros(2)
        count = 0

        for neighbor in neighbors:
            distance = np.linalg.norm(neighbor.position - robot.position)
            if distance < self.alignment_r:
                avg_velocity += neighbor.velocity
                count += 1

        if count > 0:
            avg_velocity /= count
            return avg_velocity - robot.velocity

        return np.zeros(2)

    def cohesion(self, robot, neighbors):
        """Move towards average position of neighbors"""
        center_of_mass = np.zeros(2)
        count = 0

        for neighbor in neighbors:
            distance = np.linalg.norm(neighbor.position - robot.position)
            if distance < self.cohesion_r:
                center_of_mass += neighbor.position
                count += 1

        if count > 0:
            center_of_mass /= count
            desired = center_of_mass - robot.position
            return desired - robot.velocity

        return np.zeros(2)

    def normalize(self, vector):
        """Normalize vector to unit length"""
        norm = np.linalg.norm(vector)
        if norm > 0:
            return vector / norm
        return vector
```

### Ant Colony Optimization for Robotics

```python
class AntColonyRobotics:
    def __init__(self, num_robots, environment):
        self.num_robots = num_robots
        self.environment = environment
        self.pheromone_trails = {}
        self.q0 = 0.9  # Exploration/exploitation parameter
        self.alpha = 1.0  # Pheromone importance
        self.beta = 2.0  # Heuristic importance
        self.rho = 0.1  # Evaporation rate

    def ant_foraging(self, robots, food_sources, nest_position):
        """Implement ant-inspired foraging behavior"""
        for robot in robots:
            if robot.carrying_food:
                # Return to nest
                direction = self.navigate_to_nest(robot, nest_position)
                robot.move(direction)

                # Leave pheromone trail
                self.leave_pheromone(robot.position, 'food', strength=1.0)

                if np.linalg.norm(robot.position - nest_position) < 0.1:
                    robot.carrying_food = False
            else:
                # Search for food
                if self.detect_food(robot, food_sources):
                    robot.carrying_food = True
                    robot.target_food = self.get_nearest_food(robot, food_sources)
                else:
                    # Follow pheromone or explore
                    direction = self.choose_direction(robot, food_sources)
                    robot.move(direction)

        # Update pheromone trails
        self.update_pheromones()

    def choose_direction(self, robot, food_sources):
        """Choose direction based on pheromones and heuristics"""
        possible_directions = self.get_possible_directions(robot)

        if np.random.random() < self.q0:
            # Exploitation: Choose best direction
            best_direction = None
            max_value = -1

            for direction in possible_directions:
                next_pos = robot.position + direction * 0.1
                value = self.calculate_direction_value(next_pos, food_sources)

                if value > max_value:
                    max_value = value
                    best_direction = direction

            return best_direction
        else:
            # Exploration: Probabilistic choice
            probabilities = []
            values = []

            for direction in possible_directions:
                next_pos = robot.position + direction * 0.1
                value = self.calculate_direction_value(next_pos, food_sources)
                values.append(value)

            total = sum(values)
            if total > 0:
                probabilities = [v/total for v in values]
                return np.random.choice(possible_directions, p=probabilities)

        # Random exploration if no pheromones
        return np.random.choice(possible_directions)

    def calculate_direction_value(self, position, food_sources):
        """Calculate attractiveness of position"""
        pheromone_level = self.get_pheromone_level(position, 'food')

        # Heuristic: distance to nearest food
        min_distance = float('inf')
        for food in food_sources:
            distance = np.linalg.norm(position - food.position)
            min_distance = min(min_distance, distance)

        heuristic = 1.0 / (1.0 + min_distance)

        # Combined value
        value = (pheromone_level ** self.alpha) * (heuristic ** self.beta)
        return value

    def update_pheromones(self):
        """Update pheromone levels with evaporation"""
        for position in self.pheromone_trails:
            self.pheromone_trails[position] *= (1 - self.rho)

            # Remove weak trails
            if self.pheromone_trails[position] < 0.01:
                del self.pheromone_trails[position]
```

### Task Allocation

```python
class TaskAllocation:
    def __init__(self):
        self.task_types = ['foraging', 'building', 'cleaning', 'surveillance']
        self.robot_capabilities = {}
        self.task_requirements = {}
        self.information_matrix = {}

    def threshold_based_allocation(self, robot, environment):
        """Simple threshold-based task selection"""
        # Stimuli from environment
        stimuli = {
            'foraging': environment.food_density,
            'building': environment.construction_sites,
            'cleaning': environment.debris_level,
            'surveillance': environment.unexplored_areas
        }

        # Response thresholds for this robot
        thresholds = self.robot_capabilities[robot.id]['thresholds']

        # Calculate responses
        responses = {}
        for task in self.task_types:
            s = stimuli[task]
            theta = thresholds[task]
            response = s**2 / (s**2 + theta**2)
            responses[task] = response

        # Select task with highest response
        selected_task = max(responses, key=responses.get)
        return selected_task

    def auction_based_allocation(self, tasks, robots):
        """Auction-based task assignment"""
        assignments = {}
        remaining_tasks = tasks.copy()

        while remaining_tasks:
            # Each robot bids on tasks
            bids = {}
            for robot in robots:
                if not robot.busy:
                    for task in remaining_tasks:
                        bid_value = self.calculate_bid(robot, task)
                        if task not in bids:
                            bids[task] = []
                        bids[task].append((robot.id, bid_value))

            # Award tasks to highest bidders
            awarded = []
            for task in remaining_tasks:
                if task in bids and bids[task]:
                    bids[task].sort(key=lambda x: x[1], reverse=True)
                    winner_id, _ = bids[task][0]
                    assignments[task] = winner_id
                    awarded.append(task)
                    robots[winner_id].busy = True

            # Remove awarded tasks
            for task in awarded:
                remaining_tasks.remove(task)

        return assignments

    def calculate_bid(self, robot, task):
        """Calculate bid value for task"""
        # Factors affecting bid:
        # 1. Distance to task
        distance = np.linalg.norm(robot.position - task.location)
        distance_cost = distance * 0.1

        # 2. Robot capability for task
        capability = self.robot_capabilities[robot.id]['skills'][task.type]

        # 3. Current workload
        workload_cost = robot.current_workload * 0.2

        # 4. Task urgency
        urgency_bonus = task.urgency * 0.3

        # Total bid value (higher is better)
        bid_value = capability - distance_cost - workload_cost + urgency_bonus
        return bid_value
```

## Pattern Formation

### Morphogenesis

```python
class Morphogenesis:
    def __init__(self, target_pattern):
        self.pattern = target_pattern
        self.gradient_field = None

    def create_formation(self, robots):
        """Self-organize robots into target pattern"""
        # Initialize virtual gradient field
        self.initialize_gradient_field(robots)

        # Each robot follows gradient to position
        for robot in robots:
            gradient_direction = self.get_gradient_at_position(robot.position)
            desired_velocity = gradient_direction * 0.1

            # Add inter-robot repulsion to maintain spacing
            neighbors = self.get_nearby_robots(robot, robots, radius=0.5)
            repulsion = self.calculate_repulsion(robot, neighbors)

            # Combined velocity
            robot.velocity = desired_velocity + repulsion
            robot.position += robot.velocity * 0.1

    def initialize_gradient_field(self, robots):
        """Create gradient field representing target pattern"""
        self.gradient_field = np.zeros((100, 100, 2))  # 100x100 grid

        # Each robot that knows pattern becomes a source
        pattern_robots = [r for r in robots if r.knows_pattern]
        for robot in pattern_robots:
            self.propagate_pattern_gradient(robot)

    def propagate_pattern_gradient(self, source_robot):
        """Propagate pattern information from source"""
        # BFS to spread gradient information
        queue = [source_robot.position]
        visited = set()

        while queue:
            current = queue.pop(0)
            if current in visited:
                continue
            visited.add(current)

            # Get neighbors in grid
            for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
                neighbor = current + np.array([dx, dy])

                if 0 <= neighbor[0] < 100 and 0 <= neighbor[1] < 100:
                    if neighbor not in visited:
                        # Calculate gradient direction
                        direction = self.calculate_pattern_direction(neighbor)
                        self.gradient_field[int(neighbor[0]), int(neighbor[1])] = direction
                        queue.append(neighbor)

    def calculate_pattern_direction(self, position):
        """Calculate desired direction from pattern"""
        # Simplified: direction towards pattern center
        pattern_center = np.array([50, 50])
        direction = pattern_center - position
        return self.normalize(direction)
```

## Real-World Applications

### Disaster Response

```python
class SwarmSearchAndRescue:
    def __init__(self, num_drones, search_area):
        self.drones = [Drone(i) for i in range(num_drones)]
        self.search_area = search_area
        self.victim_locations = []
        self.base_station = np.array([50, 50])

    def coordinated_search(self):
        """Coordinate swarm for search and rescue"""
        # Divide search area among drones
        sectors = self.divide_search_area(len(self.drones))

        for drone, sector in zip(self.drones, sectors):
            # Assign search sector
            drone.assigned_sector = sector
            drone.search_pattern = self.generate_search_pattern(sector)

        # Main search loop
        while not self.search_complete():
            for drone in self.drones:
                if drone.status == 'searching':
                    # Execute search pattern
                    self.execute_search(drone)

                    # Detect victims
                    victims = drone.scan_for_victims()
                    if victims:
                        self.report_victims(drone, victims)

                elif drone.status == 'returning':
                    # Return to base with victim info
                    self.return_to_base(drone)

                # Maintain communication with nearby drones
                self.maintain_swarm_connectivity()

    def divide_search_area(self, num_sectors):
        """Divide search area into equal sectors"""
        sectors = []
        side_length = int(np.sqrt(num_sectors))

        for i in range(side_length):
            for j in range(side_length):
                sector = {
                    'x_range': (i * 100/side_length, (i+1) * 100/side_length),
                    'y_range': (j * 100/side_length, (j+1) * 100/side_length)
                }
                sectors.append(sector)

        return sectors[:num_sectors]

    def execute_search(self, drone):
        """Execute search pattern for drone"""
        target = drone.search_pattern[drone.pattern_index]
        drone.move_towards(target)

        if np.linalg.norm(drone.position - target) < 1.0:
            drone.pattern_index = (drone.pattern_index + 1) % len(drone.search_pattern)

    def maintain_swarm_connectivity(self):
        """Ensure swarm remains connected"""
        for drone1 in self.drones:
            for drone2 in self.drones:
                if drone1.id != drone2.id:
                    distance = np.linalg.norm(drone1.position - drone2.position)

                    # If too far, intermediate drones relay communication
                    if distance > drone1.communication_range:
                        self.find_relay_drones(drone1, drone2)
```

### Agricultural Monitoring

```python
class SwarmAgriculture:
    def __init__(self, field_size, num_scouts, num_workers):
        self.field_size = field_size
        self.scout_drones = [ScoutDrone(i) for i in range(num_scouts)]
        self.worker_drones = [WorkerDrone(i) for i in range(num_workers)]
        self.crop_health_map = np.zeros(field_size)

    def crop_monitoring(self):
        """Monitor crop health with coordinated swarm"""
        # Phase 1: Scout drones survey field
        self.field_survey()

        # Phase 2: Analyze data and identify issues
        problem_areas = self.identify_problems()

        # Phase 3: Deploy worker drones for treatment
        self.deploy_workers(problem_areas)

        # Phase 4: Continuous monitoring
        self.continuous_monitoring()

    def field_survey(self):
        """Scout drones survey entire field"""
        # Assign regions to each scout
        regions = self.partition_field(len(self.scout_drones))

        for scout, region in zip(self.scout_drones, regions):
            scout.assign_region(region)
            scout.start_survey()

        # Coordinate survey to ensure coverage
        while not self.survey_complete():
            for scout in self.scout_drones:
                scout.execute_survey_step()

            # Share information between scouts
            self.share_crop_data()

    def identify_problems(self):
        """Identify areas needing attention"""
        problems = []

        # Find areas with poor crop health
        threshold = 0.3  # Health threshold
        for i in range(self.field_size[0]):
            for j in range(self.field_size[1]):
                if self.crop_health_map[i, j] < threshold:
                    problems.append({
                        'location': np.array([i, j]),
                        'severity': 1 - self.crop_health_map[i, j],
                        'type': self.diagnose_problem(i, j)
                    })

        # Cluster nearby problems
        clustered_problems = self.cluster_problems(problems)
        return clustered_problems

    def deploy_workers(self, problems):
        """Deploy worker drones to treat problems"""
        # Assign workers to problems based on severity and distance
        assignments = self.assign_workers_to_problems(problems)

        for worker, problems_list in assignments.items():
            worker.assign_tasks(problems_list)
            worker.start_treatment()

        # Monitor treatment progress
        self.monitor_treatment()

    def adaptive_monitoring(self):
        """Adjust monitoring based on findings"""
        # Increase monitoring frequency in problematic areas
        high_risk_areas = self.identify_high_risk_areas()

        # Redistribute drones for focused monitoring
        self.redistribute_drones(high_risk_areas)

        # Update survey patterns
        self.update_survey_patterns()
```

## Key Takeaways

1. Simple local rules create complex global behaviors
2. Communication range affects swarm performance
3. Scalability is a key advantage of swarms
4. Fault tolerance through redundancy
5. Trade-off between individual complexity and swarm intelligence

## Practice Problems

1. Implement flocking algorithm with collision avoidance
2. Design swarm exploration strategy for unknown environment
3. Create adaptive task allocation system
4. Simulate swarm construction behavior

---

*Next: [Robot Ethics](4-robot-ethics.md) - Safety, privacy, and societal impact*