task-application
A Node.js CRUD API built with Fastify, featuring authentication using JSON Web Tokens (JWT), task management with filtering, sorting, and tagging functionality. This application uses Sequelize ORM with a PostgreSQL database.

Features
User Authentication

Sign-up with a unique email and password.

Securely hashed passwords.

Login endpoint returns a JWT token for authentication.

Task Management

Create, read, update, and delete tasks.

Assign tasks to users and update task statuses.

Tasks include attributes: title, description, due date, priority, etc.

Tagging Functionality

Tag tasks on the fly.

Tags are stored in a separate table with many-to-many associations.

Filtering and Sorting

Filter tasks based on their status (e.g., open, in progress, completed).

Sort tasks based on due date or priority.

Technologies
Node.js (22+)

Fastify framework

Sequelize ORM

PostgreSQL database

JWT for authentication

Additional plugins: @fastify/jwt, @fastify/swagger, @fastify/swagger-ui

1. Setup and Installation
Clone the repository:
git clone https://github.com/yourusername/task-application.git
cd task-application

2. Install dependencies:
npm install

3. Configure Environment Variables Create a .env file in the root directory with the following content:
PORT=3000
DB_NAME=task-application
DB_USER=postgres
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=supersecret

4. Create the PostgreSQL Database: 
createdb -U postgres task-application

Or create it via pgAdmin.

5. Synchronize the Database and Start the Server:
npm run start
OR
npm run dev

API Documentation:
http://localhost:3000/api/v1

Additionally, the raw Swagger JSON can be found at:

http://localhost:3000/documentation

Testing the API in A Postman:
{
  "title": "Implement new filtering feature",
  "description": "Add filtering and sorting functionality to the task management module.",
  "dueDate": "2025-06-01T12:00:00Z",
  "priority": "medium",
  "assignedUserId": 1,
  "tags": ["feature", "filtering", "backend"]
}
