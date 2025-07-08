Job Importer with Queue and History Tracking

📦 Overview

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that:

Fetches job listings from multiple XML APIs

Converts XML to JSON

Queues each job in Redis using Bull

Processes jobs in a background worker

Stores and updates jobs in MongoDB

Logs every import run with history and failure tracking

Provides an admin UI to view logs and job import details

🔧 Tech Stack

Backend:

Node.js + Express

MongoDB + Mongoose

Bull + Redis

xml2js, axios

Frontend:

React (CRA)

Tailwind CSS

Axios + React Router DOM

📁 Project Structure

/job-importer
├── client               # React frontend
├── server               # Node.js backend
│   ├── models           # Mongoose schemas
│   ├── routes           # Express API routes
│   ├── controllers      # Route handlers
│   ├── services         # XML fetcher logic
│   ├── jobs             # Queue setup and worker
│   └── server.js        # Entry point
|                 
├── README.md
└── /docs/architecture.md

🚀 Setup Instructions

Prerequisites:

Node.js

MongoDB

Docker (for Redis)

1. Clone the repo

git clone <your-repo-url>
cd job-importer

2. Backend Setup

cd server
npm install

Create .env file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/job_importer
REDIS_URL=redis://127.0.0.1:6379

Start Redis via Docker:

docker run -d --name redis-server -p 6379:6379 redis

Run the backend:npm start

Run the queue worker:node jobs/jobWorker.js

3. Frontend Setup

cd ../client
npm install
npm start

🌐 API Endpoints

GET /api/jobs/import-logs

Returns all import history logs

GET /api/jobs/import-logs/:id

Returns details of a specific import run

✅ Features Implemented

Fetch jobs from multiple RSS/XML feeds

Convert to JSON and queue each job

Process jobs in background (insert/update MongoDB)

Log every import with timestamp, stats, and failures

Admin panel to view logs and filter by failure

Pagination, failure filters, and detailed view

📄 Docs

See /docs/architecture.md for system design, flow, and reasoning