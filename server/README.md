# Request Tubs Backend (Express + PostgreSQL + MongoDB)

# Setup postgreSQL Database

# Navigate to server folder in command line (Ubuntu in my case):
npm install
npm install pg
npm install --save-dev @types/pg
npm install dotenv
Make env file 
--- we each have our own
--- ignored by .gitignore on purpose
--- look at .env.example that is here
--- you can copy that to your .env file
Install postgres on your machine
--- by default, you should have a superuser postgres and a 
    database called postgres (needed for next steps)

# Make the user and database
sudo -i -u postgres 
psql 
CREATE ROLE dev_user LOGIN PASSWORD 'dev_password';
ALTER ROLE dev_user CREATEDB;
CREATE DATABASE dev_db OWNER dev_user;
\q to exit postgres
quit to exit super user

# Login to new user and add some sample data
psql -U dev_user -d dev_db

CREATE TABLE tubs (
  id SERIAL PRIMARY KEY,
  encoded_id TEXT NOT NULL,
  CONSTRAINT encoded_id_format CHECK (
    encoded_id ~ '^[a-zA-Z0-9]{6}$'
  )
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  tub_id INTEGER NOT NULL,
  method TEXT NOT NULL,
  headers JSONB,
  body_id TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_tub FOREIGN KEY (tub_id) REFERENCES tubs(id)
);


INSERT INTO tubs (encoded_id) VALUES ('abc123');
INSERT INTO tubs (encoded_id) VALUES ('def456');
INSERT INTO tubs (encoded_id) VALUES ('ghi789');


INSERT INTO requests (tub_id, method, headers, body_id)
VALUES (
  1,
  'GET',
  '{"User-Agent": "PostmanRuntime/7.29.2", "Accept": "*/*"}',
  'body_001'
);

INSERT INTO requests (tub_id, method, headers, body_id)
VALUES (
  1,
  'POST',
  '{"Content-Type": "application/json", "Authorization": "Bearer abc123"}',
  'body_002'
);

INSERT INTO requests (tub_id, method, headers, body_id)
VALUES (
  1,
  'DELETE',
  '{"User-Agent": "curl/7.68.0", "Accept": "application/json"}',
  'body_003'
);

# Test out the API!
start the express server (npm run dev)
http://localhost:3000/api/requests2
http://localhost:3000/api/tubs2

==========================================

# Set up MongoDB Stuff

install mongodb
-find instructions online

sudo systemctl status mongod
-check that mongodb is active

mongosh
-new mongodb shell

show dbs
-shows all existing databases

use requesttub
-Switch to (or create if it doesn’t exist) a database called requestbin

db.bodies.insertOne({ body: { bodydata1: "fake", bodydata2: "also fake" } })
db.bodies.insertOne({ body: { bodydata1: "fake again", bodydata2: "also more fake"} })
-db is the currently selected database
-bodies is the collection name (think of it like a table in SQL).
-If test_items doesn't exist yet, MongoDB creates it automatically.
-insertOne(...) is a method that adds a single document (record in SQL (row)) to the collection.

TEST IT!
start the server then...
http://localhost:3000/api/mongo-test