To Run Server:

.env file needs "NODE_ENV=development"
--- if its anything else, it will be production mode

Commands to Run: 

npx tsc
node dist/index.js


# Set up PostgreSQL Database

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

# Login to new user and set up the tables
psql -U dev_user -d dev_db

CREATE TABLE tubs (
  id SERIAL PRIMARY KEY,
  encoded_id TEXT NOT NULL,
  name TEXT,
  date_created TIMESTAMPTZ DEFAULT NOW(),
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
  CONSTRAINT fk_tub FOREIGN KEY (tub_id) REFERENCES tubs(id) ON DELETE CASCADE
);

==========================================

# Set up MongoDB

install mongodb on your machine

sudo systemctl status mongod
-check that mongodb is active

mongosh
-new mongodb shell

use requesttub
-Switch to (or create if it doesn’t exist) a database called requesttub

=========================================

Make env file 
--- we each have our own
--- ignored by .gitignore on purpose
--- look at .env.example that is here
--- you can copy that to your .env file