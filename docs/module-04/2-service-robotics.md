---
title: "Chapter 2: Service Robotics"
description: "Robots in healthcare, retail, hospitality, and customer service"
learningObjectives:
  - Design service robot interactions
  - Implement navigation in human environments
  - Handle complex social interactions
  - Integrate with service industry systems
estimatedReadingTime: 65
---

# Chapter 2: Service Robotics

## Introduction

Service robots work alongside humans in non-industrial environments, providing assistance, information, and services. These robots must navigate complex social and physical environments while maintaining safety and user comfort.

## Healthcare Robotics

### Medical Assistance Robots

```python
class HealthcareRobot:
    def __init__(self, robot_id):
        self.robot_id = robot_id
        self.navigation_system = HospitalNavigationSystem()
        self.medication_manager = MedicationManager()
        self.patient_monitor = PatientMonitor()
        self.emergency_handler = EmergencyHandler()
        self.hipaa_compliance = HIPAAComplianceManager()

    def assist_patient_care(self, patient_id, care_plan):
        """Provide patient care assistance"""
        # Get patient information (HIPAA compliant)
        patient_info = self.hipaa_compliance.get_patient_data(patient_id)

        # Navigate to patient room
        room_location = self.navigation_system.find_patient_room(patient_id)
        self.navigate_to(room_location)

        # Execute care tasks
        for task in care_plan['tasks']:
            if task['type'] == 'medication_delivery':
                self.deliver_medication(patient_id, task['medication'])
            elif task['type'] == 'vital_signs':
                self.monitor_vital_signs(patient_info)
            elif task['type'] == 'mobility_assistance':
                self.assist_mobility(patient_info, task['assistance_type'])
            elif task['type'] == 'communication':
                self.facilitate_communication(patient_info, task['contact'])

        # Update care records
        self.update_care_records(patient_id, care_plan)

        return {'status': 'completed', 'timestamp': datetime.now()}

    def deliver_medication(self, patient_id, medication_order):
        """Safely deliver medication to patient"""
        # Verify medication authorization
        if not self.medication_manager.verify_order(medication_order):
            raise SecurityError("Unauthorized medication request")

        # Retrieve medication from pharmacy
        medication = self.medication_manager.retrieve_medication(medication_order)

        # Double-check with barcode/QR scan
        verification = self.verify_medication(medication, medication_order)
        if not verification['match']:
            self.handle_medication_error(medication, verification['discrepancy'])
            return

        # Navigate to patient
        patient_location = self.navigation_system.find_patient_room(patient_id)
        self.navigate_to(patient_location)

        # Verify patient identity
        patient_identity = self.verify_patient_identity(patient_id)
        if not patient_identity['verified']:
            return {'status': 'failed', 'reason': 'Patient identity not verified'}

        # Deliver medication with documentation
        delivery_result = self.medication_manager.deliver_to_patient(
            medication, patient_identity
        )

        # Log delivery (HIPAA compliant)
        self.hipaa_compliance.log_medication_delivery(
            patient_id, medication_order, delivery_result
        )

        return delivery_result

    def monitor_vital_signs(self, patient_info):
        """Monitor and record patient vital signs"""
        vital_readings = {}

        # Connect to patient monitoring devices
        devices = self.patient_monitor.connect_devices(patient_info['device_ids'])

        # Take readings
        for device in devices:
            readings = device.read_vitals()
            vital_readings[device.type] = readings

        # Analyze readings for anomalies
        anomalies = self.patient_monitor.analyze_vitals(vital_readings, patient_info)

        # Alert medical staff if needed
        if anomalies:
            alerts = self.generate_medical_alerts(anomalies, patient_info)
            self.emergency_handler.send_alerts(alerts)

        # Store readings (HIPAA compliant)
        self.hipaa_compliance.store_vital_signs(patient_info['id'], vital_readings)

        return {
            'vitals': vital_readings,
            'anomalies': anomalies,
            'timestamp': datetime.now()
        }

    def assist_surgery(self, surgical_team, procedure):
        """Assist during surgical procedures"""
        # Sterile navigation to operating room
        self.enter_sterile_mode()
        or_location = self.navigation_system.find_operating_room(procedure['or_id'])
        self.sterile_navigate_to(or_location)

        # Surgical instrument management
        instrument_tracker = SurgicalInstrumentTracker()

        # Assist with tasks
        for phase in procedure['phases']:
            if phase['type'] == 'instrument_delivery':
                # Deliver requested instruments
                for instrument in phase['instruments']:
                    self.deliver_surgical_instrument(instrument, instrument_tracker)

            elif phase['type'] == 'suction':
                # Provide suction assistance
                self.activate_suction(phase['settings'])

            elif phase['type'] == 'retraction':
                # Assist with tissue retraction
                self.assist_retraction(phase['retraction_params'])

            elif phase['type'] == 'imaging':
                # Position imaging equipment
                self.position_imaging_equipment(phase['imaging_type'])

            # Track instrument usage
            instrument_tracker.update_usage(phase)

        # Complete procedure documentation
        self.document_surgical_procedure(procedure, instrument_tracker)

        return {'status': 'completed', 'completion_time': datetime.now()}
```

### Rehabilitation Robotics

```python
class RehabilitationRobot:
    def __init__(self):
        self.therapy_manager = TherapyManager()
        self.adaptive_system = AdaptiveTherapySystem()
        self.progress_tracker = ProgressTracker()
        self.safety_monitor = SafetyMonitor()

    def deliver_rehabilitation_therapy(self, patient_id, therapy_plan):
        """Deliver personalized rehabilitation therapy"""
        # Load patient profile and progress
        patient_profile = self.therapy_manager.get_patient_profile(patient_id)
        current_progress = self.progress_tracker.get_progress(patient_id)

        # Adapt therapy based on progress
        adapted_plan = self.adaptive_system.adapt_therapy(
            therapy_plan, patient_profile, current_progress
        )

        # Execute therapy sessions
        session_results = []
        for session in adapted_plan['sessions']:
            # Configure robot for session
            self.configure_therapy_mode(session['type'], session['parameters'])

            # Execute therapy with safety monitoring
            result = self.execute_therapy_session(session, patient_profile)
            session_results.append(result)

            # Update progress
            self.progress_tracker.update_progress(patient_id, session, result)

        # Generate therapy report
        report = self.generate_therapy_report(patient_id, session_results)

        return report

    def execute_therapy_session(self, session, patient_profile):
        """Execute single therapy session"""
        session_data = {
            'start_time': datetime.now(),
            'movements': [],
            'assistance_levels': [],
            'patient_effort': []
        }

        # Initialize safety monitoring
        self.safety_monitor.start_monitoring(patient_profile['safety_limits'])

        # Execute therapy movements
        for movement in session['movements']:
            # Provide guidance and assistance
            guidance = self.calculate_movement_guidance(
                movement, patient_profile['capabilities']
            )

            # Execute movement with adaptive assistance
            execution_result = self.execute_with_assistance(
                movement, guidance, patient_profile
            )

            # Monitor for safety issues
            safety_status = self.safety_monitor.check_safety(execution_result)
            if not safety_status['safe']:
                self.handle_safety_issue(safety_status)
                break

            # Record session data
            session_data['movements'].append(execution_result)
            session_data['assistance_levels'].append(execution_result['assistance'])
            session_data['patient_effort'].append(execution_result['patient_effort'])

        session_data['end_time'] = datetime.now()
        session_data['duration'] = session_data['end_time'] - session_data['start_time']

        # Stop safety monitoring
        self.safety_monitor.stop_monitoring()

        return session_data

    def gait_training(self, patient_id, gait_parameters):
        """Provide gait training assistance"""
        # Set up gait training environment
        self.setup_gait_training_environment(gait_parameters)

        # Body weight support system
        bws_system = BodyWeightSupportSystem()
        bws_level = self.calculate_optimal_support(patient_id, gait_parameters)
        bws_system.set_support_level(bws_level)

        # Gait pattern training
        for step in gait_parameters['training_steps']:
            # Guided stepping
            guidance = self.generate_step_guidance(step, patient_id)
            self.execute_guided_step(guidance)

            # Real-time feedback
            gait_quality = self.assess_gait_quality(step)
            self.provide_gait_feedback(gait_quality)

            # Adapt support level
            new_bws = self.adapt_support_level(bws_level, gait_quality)
            bws_system.set_support_level(new_bws)

        return {
            'gait_quality': gait_quality,
            'improvement': self.calculate_gait_improvement(patient_id)
        }
```

## Retail and Hospitality Robotics

### Customer Service Robots

```python
class CustomerServiceRobot:
    def __init__(self, store_id):
        self.store_id = store_id
        self.inventory_system = InventorySystem(store_id)
        self.customer_interface = CustomerInterface()
        self.navigation_system = StoreNavigationSystem(store_id)
        self.payment_system = PaymentProcessor()

    def assist_customer(self, customer_request):
        """Handle customer service requests"""
        # Understand customer need
        intent = self.customer_interface.understand_request(customer_request)

        # Handle different request types
        if intent['type'] == 'product_location':
            return self.locate_product(intent['product'])
        elif intent['type'] == 'product_information':
            return self.provide_product_info(intent['product'])
        elif intent['type'] == 'price_check':
            return self.check_price(intent['product'])
        elif intent['type'] == 'stock_availability':
            return self.check_availability(intent['product'])
        elif intent['type'] == 'purchase_assistance':
            return self.assist_purchase(intent['products'])
        elif intent['type'] == 'general_help':
            return self.provide_general_assistance(intent['query'])
        else:
            return self.transfer_to_human(customer_request)

    def locate_product(self, product_info):
        """Guide customer to product location"""
        # Check inventory
        inventory = self.inventory_system.check_product(product_info['id'])
        if not inventory['in_stock']:
            return self.handle_out_of_stock(product_info)

        # Get location in store
        location = self.inventory_system.get_product_location(product_info['id'])

        # Create navigation path
        path = self.navigation_system.create_path(
            self.get_current_position(), location
        )

        # Guide customer
        guidance = {
            'product': product_info,
            'location': location,
            'path': path,
            'directions': self.generate_directions(path)
        }

        # Offer to escort customer
        escort_offer = self.offer_customer_escort(location)

        return {
            'guidance': guidance,
            'escort_offered': escort_offer,
            'estimated_time': self.calculate_travel_time(path)
        }

    def assist_purchase(self, product_list):
        """Assist customer with purchase process"""
        # Verify product availability
        available_products = []
        for product in product_list:
            if self.inventory_system.check_availability(product['id']):
                available_products.append(product)

        if len(available_products) < len(product_list):
            self.notify_unavailable_products(product_list, available_products)

        # Calculate total
        total = self.calculate_total(available_products)

        # Check for promotions/discounts
        discounts = self.check_promotions(available_products)
        discounted_total = self.apply_discounts(total, discounts)

        # Process payment
        payment_result = self.payment_system.process_payment(
            discounted_total, self.get_payment_method()
        )

        if payment_result['success']:
            # Prepare order for pickup/delivery
            order = self.prepare_order(available_products)
            return {
                'status': 'success',
                'order_id': order['id'],
                'total': discounted_total,
                'pickup_location': order['pickup_location']
            }
        else:
            return {
                'status': 'failed',
                'reason': payment_result['error'],
                'suggestions': self.get_payment_alternatives()
            }

    def perform_inventory_check(self):
        """Autonomous inventory checking and restocking alerts"""
        # Navigate store systematically
        store_map = self.navigation_system.get_store_layout()
        inventory_status = {}

        for aisle in store_map['aisles']:
            for shelf in aisle['shelves']:
                # Scan shelf with sensors
                shelf_inventory = self.scan_shelf_inventory(shelf)

                # Compare with expected inventory
                expected = self.inventory_system.get_expected_inventory(shelf['id'])
                discrepancies = self.find_discrepancies(shelf_inventory, expected)

                if discrepancies:
                    inventory_status[shelf['id']] = {
                        'actual': shelf_inventory,
                        'expected': expected,
                        'discrepancies': discrepancies,
                        'restock_needed': self.calculate_restock_level(discrepancies)
                    }

        # Generate restocking recommendations
        restock_plan = self.generate_restock_plan(inventory_status)

        # Send alerts to staff
        self.send_restock_alerts(restock_plan)

        return {
            'inventory_check_time': datetime.now(),
            'discrepancies_found': len([s for s in inventory_status.values() if s['discrepancies']]),
            'restock_plan': restock_plan
        }
```

### Hotel Service Robots

```python
class HotelServiceRobot:
    def __init__(self, hotel_id):
        self.hotel_id = hotel_id
        self.room_manager = RoomManager(hotel_id)
        self.guest_services = GuestServiceManager()
        self.housekeeping = HousekeepingManager()
        self.navigation = HotelNavigationSystem(hotel_id)

    def deliver_room_service(self, order_details):
        """Deliver room service to guest"""
        # Verify order
        if not self.guest_services.verify_order(order_details):
            return {'status': 'error', 'message': 'Invalid order'}

        # Pick up order from kitchen
        pickup_result = self.pickup_room_service(order_details)
        if not pickup_result['success']:
            return pickup_result

        # Navigate to guest room
        room_location = self.navigation.find_room_location(order_details['room_id'])
        navigation_result = self.navigate_to_room(room_location)

        if navigation_result['obstacle']:
            # Handle navigation issues
            self.handle_navigation_issue(order_details['room_id'])
            return {'status': 'delayed', 'reason': 'Navigation issue'}

        # Announce arrival
        self.announce_arrival(order_details['room_id'])

        # Wait for guest response
        guest_response = self.wait_for_guest_response(timeout=60)

        if guest_response['response'] == 'enter':
            # Enter room and deliver service
            delivery_result = self.deliver_to_room(order_details)
            self.update_order_status(order_details['order_id'], 'delivered')
            return delivery_result
        elif guest_response['response'] == 'leave_outside':
            # Leave outside door
            self.leave_outside_door(order_details)
            self.notify_guest_delivery(order_details['room_id'])
            return {'status': 'delivered_outside'}
        else:
            # No response - return to kitchen
            self.return_to_kitchen(pickup_result['items'])
            return {'status': 'return_to_kitchen', 'reason': 'No guest response'}

    def perform_housekeeping_assistance(self, task_type, room_id):
        """Assist with housekeeping tasks"""
        if task_type == 'linen_delivery':
            return self.deliver_linens(room_id)
        elif task_type == 'amenity_restock':
            return self.restock_amenities(room_id)
        elif task_type == 'trash_removal':
            return self.remove_trash(room_id)
        elif task_type == 'room_inspection':
            return self.inspect_room(room_id)
        else:
            return {'status': 'error', 'message': 'Unknown housekeeping task'}

    def assist_guest_inquiries(self, guest_location, inquiry):
        """Handle guest inquiries and provide assistance"""
        # Navigate to guest location
        self.navigate_to_location(guest_location)

        # Process inquiry
        intent = self.process_inquiry(inquiry)

        if intent['type'] == 'directions':
            return self.provide_directions(intent['destination'])
        elif intent['type'] == 'hotel_info':
            return self.provide_hotel_information(intent['topic'])
        elif intent['type'] == 'service_request':
            return self.handle_service_request(intent['service'])
        elif intent['type'] == 'complaint':
            return self.handle_complaint(intent['complaint'])
        elif intent['type'] == 'general_question':
            return self.answer_general_question(intent['question'])

    def escort_guests(self, guest_list, destination):
        """Safely escort guests to destination"""
        # Plan optimal route
        route = self.navigation.plan_route(guest_list, destination)

        # Guide group with attention to mobility needs
        for guest in guest_list:
            if 'mobility_assistance' in guest['needs']:
                self.adjust_pace_for_accessibility(guest['needs'])

        # Navigate with group awareness
        while not self.at_destination(destination):
            # Monitor group cohesion
            group_status = self.monitor_group_cohesion(guest_list)

            if group_status['stragglers']:
                self.wait_for_stragglers(group_status['stragglers'])
                self.provide_directions_to_catch_up()

            # Provide沿途 commentary
            self.provide_route_information(self.get_current_location())

            # Check for obstacles
            obstacles = self.detect_path_obstacles()
            if obstacles:
                self.handle_obstacles_and_reroute(obstacles)

            self.move_to_next_waypoint(route)

        return {
            'status': 'arrived',
            'destination': destination,
            'guests_accompanied': len(guest_list)
        }

    def emergency_response(self, emergency_type, location):
        """Respond to emergency situations"""
        # Alert hotel security/management
        self.emergency_alert(emergency_type, location)

        # Navigate to emergency location
        emergency_path = self.navigation.calculate_emergency_path(location)
        self.navigate_emergency_path(emergency_path)

        # Assess situation
        situation = self.assess_emergency_situation(emergency_type, location)

        # Provide appropriate assistance
        if emergency_type == 'medical':
            self.provide_medical_assistance(situation)
            self.guide_medical_personnel(location)
        elif emergency_type == 'security':
            self.monitor_security_situation(situation)
            self.preserve_evidence_if_needed(situation)
        elif emergency_type == 'fire':
            self.assist_evacuation(situation)
            self.check_for_trapped_guests()

        # Document incident
        self.document_emergency_response(emergency_type, location, situation)

        return {
            'response_initiated': datetime.now(),
            'situation_assessment': situation,
            'actions_taken': self.get_emergency_actions(emergency_type)
        }
```

## Key Takeaways

1. Service robots must prioritize human safety and comfort
2. Compliance with regulations (HIPAA, safety standards) is essential
3. Navigation in human environments requires sophisticated perception
4. Adaptability to different situations and user needs is critical
5. Integration with existing service systems enables seamless operation

## Practice Problems

1. Design patient care workflow for hospital robot
2. Implement customer service conversation system
3. Create inventory tracking and restocking algorithm
4. Design emergency response protocol for service robot

---

*Next: [Autonomous Systems](3-autonomous-systems.md) - Self-driving vehicles and drones*