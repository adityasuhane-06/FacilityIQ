CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(255),
    specialization VARCHAR(255)
);

CREATE TABLE tickets (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    suggested_category VARCHAR(50),
    suggested_priority VARCHAR(50),
    suggested_resolution_steps TEXT,
    estimated_complexity VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP,
    resolved_at TIMESTAMP,
    breached_at TIMESTAMP,
    assigned_to_id BIGINT REFERENCES users(id),
    raised_by_id BIGINT NOT NULL REFERENCES users(id),
    llm_overridden BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_status ON tickets(status);
CREATE INDEX idx_priority ON tickets(priority);
CREATE INDEX idx_category ON tickets(category);
CREATE INDEX idx_assigned_to ON tickets(assigned_to_id);
CREATE INDEX idx_created_at ON tickets(created_at);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id),
    field VARCHAR(100) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    changed_by_id BIGINT NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    message VARCHAR(500) NOT NULL,
    ticket_id BIGINT REFERENCES tickets(id),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sla_breaches (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets(id),
    breached_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notified_manager BOOLEAN NOT NULL DEFAULT FALSE
);
