-- Insert users (password is 'password' hashed with BCrypt)
INSERT INTO users (name, email, password, role, department, specialization) VALUES
('Manager User', 'manager@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'MANAGER', 'Management', NULL),
('Tech John', 'tech1@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'IT', 'technical,infrastructure'),
('Tech Sarah', 'tech2@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'Facilities', 'hvac,infrastructure'),
('Tech Mike', 'tech3@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'TECHNICIAN', 'Finance', 'billing,account'),
('Employee Alice', 'emp1@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'EMPLOYEE', 'Sales', NULL),
('Employee Bob', 'emp2@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'EMPLOYEE', 'Marketing', NULL),
('Employee Carol', 'emp3@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'EMPLOYEE', 'HR', NULL);

-- Insert sample tickets
INSERT INTO tickets (title, description, category, priority, status, created_at, due_at, raised_by_id, assigned_to_id, breached_at) VALUES
('Server room temperature critical', 'The server room AC is not working and temperature is rising rapidly', 'HVAC', 'CRITICAL', 'ESCALATED', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '3 hours', 5, 3, NOW() - INTERVAL '3 hours'),
('Cannot access billing portal', 'Getting 404 error when trying to access the billing dashboard', 'BILLING', 'HIGH', 'IN_PROGRESS', NOW() - INTERVAL '2 days', NOW() + INTERVAL '6 hours', 6, 4, NULL),
('Password reset not working', 'The password reset email is not being received', 'ACCOUNT', 'MEDIUM', 'ASSIGNED', NOW() - INTERVAL '1 day', NOW() + INTERVAL '23 hours', 7, 4, NULL),
('Request for new software license', 'Need Adobe Creative Cloud license for new designer', 'GENERAL', 'LOW', 'OPEN', NOW() - INTERVAL '12 hours', NOW() + INTERVAL '2 days', 5, NULL, NULL),
('Network switch in Building B down', 'Complete network outage in Building B affecting 50+ employees', 'INFRASTRUCTURE', 'CRITICAL', 'RESOLVED', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '8 hours', 6, 2, NULL),
('HVAC making loud noise', 'The HVAC unit on floor 3 is making unusual grinding sounds', 'HVAC', 'MEDIUM', 'ASSIGNED', NOW() - INTERVAL '6 hours', NOW() + INTERVAL '18 hours', 7, 3, NULL),
('Incorrect invoice amount', 'Last month invoice shows wrong amount for our subscription', 'BILLING', 'HIGH', 'IN_PROGRESS', NOW() - INTERVAL '3 hours', NOW() + INTERVAL '5 hours', 5, 4, NULL),
('VPN connection issues', 'Cannot connect to VPN from home, getting timeout errors', 'TECHNICAL', 'MEDIUM', 'ASSIGNED', NOW() - INTERVAL '4 hours', NOW() + INTERVAL '20 hours', 6, 2, NULL),
('Update company directory', 'Need to add new employees to the company directory', 'GENERAL', 'LOW', 'OPEN', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '3 days', 7, NULL, NULL),
('Fire alarm system test', 'Schedule fire alarm system test for next week', 'INFRASTRUCTURE', 'MEDIUM', 'OPEN', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '1 day', 5, NULL, NULL);

-- Update resolved tickets
UPDATE tickets SET resolved_at = NOW() - INTERVAL '2 hours' WHERE status = 'RESOLVED';

-- Insert some comments
INSERT INTO comments (ticket_id, user_id, message, created_at) VALUES
(1, 3, 'On my way to check the AC unit now', NOW() - INTERVAL '4 hours'),
(1, 3, 'AC compressor has failed, ordering replacement part', NOW() - INTERVAL '3 hours'),
(2, 4, 'Investigating the routing issue', NOW() - INTERVAL '1 day'),
(2, 6, 'Any update on this? Still cannot access', NOW() - INTERVAL '12 hours'),
(5, 2, 'Issue resolved. Faulty cable replaced', NOW() - INTERVAL '2 hours');

-- Insert audit logs
INSERT INTO audit_logs (ticket_id, field, old_value, new_value, changed_by_id, changed_at) VALUES
(1, 'status', 'OPEN', 'ASSIGNED', 1, NOW() - INTERVAL '5 hours'),
(1, 'assignedTo', NULL, 'Tech Sarah', 1, NOW() - INTERVAL '5 hours'),
(1, 'status', 'ASSIGNED', 'ESCALATED', 1, NOW() - INTERVAL '3 hours'),
(5, 'status', 'OPEN', 'ASSIGNED', 1, NOW() - INTERVAL '10 hours'),
(5, 'status', 'ASSIGNED', 'IN_PROGRESS', 2, NOW() - INTERVAL '9 hours'),
(5, 'status', 'IN_PROGRESS', 'RESOLVED', 2, NOW() - INTERVAL '2 hours');

-- Insert SLA breach
INSERT INTO sla_breaches (ticket_id, breached_at, notified_manager) VALUES
(1, NOW() - INTERVAL '3 hours', TRUE);
