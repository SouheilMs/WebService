-- Initialize separate databases for each microservice
-- This script runs once when the PostgreSQL container is first started

CREATE DATABASE auth_db;
CREATE DATABASE vehicle_db;
CREATE DATABASE traffic_db;
CREATE DATABASE incident_db;
CREATE DATABASE notification_db;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON DATABASE auth_db TO traffic_user;
GRANT ALL PRIVILEGES ON DATABASE vehicle_db TO traffic_user;
GRANT ALL PRIVILEGES ON DATABASE traffic_db TO traffic_user;
GRANT ALL PRIVILEGES ON DATABASE incident_db TO traffic_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO traffic_user;
