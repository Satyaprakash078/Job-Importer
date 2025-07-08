# Architecture & System Design — Job Importer

---

## 🧭 Overview

This document describes the system architecture and flow of the **Job Importer with Queue Processing and History Tracking**.

The goal is to build a scalable system that:
- Fetches job listings from multiple public XML feeds
- Converts them to JSON
- Queues them in Redis
- Processes them via a background worker
- Stores and tracks results in MongoDB
- Displays history in a React-based UI

---

## 🔄 System Flow Diagram (Text-Based)

┌────────────────────────┐
│ XML Job Feed URLs │
└────────┬───────────────┘
↓
┌────────────────────────┐
│ fetchAndQueueJobs() │ ← Axios + xml2js
│ - Fetch XML feeds │
│ - Parse XML to JSON │
│ - Normalize fields │
│ - Push jobs to Queue │
└────────┬───────────────┘
↓
┌────────────────────────┐
│ Redis + Bull Queue │ ← Redis via Docker
└────────┬───────────────┘
↓
┌────────────────────────┐
│ Queue Worker (Bull) │
│ - Pull jobs from queue │
│ - Insert/update jobs │
│ - Track new/updated │
│ - Catch + log failures │
└────────┬───────────────┘
↓
┌────────────────────────┐
│ MongoDB (Mongoose) │
│ - jobs collection │
│ - import_logs │
└────────┬───────────────┘
↓
┌────────────────────────┐
│ React Admin UI │ ← Tailwind + Axios
│ - View all logs │
│ - View failed jobs │
│ - Paginate/filter logs │
└────────────────────────┘


---

## 🧱 Key Components

### 1. **XML Fetcher**
- Uses `axios` to call multiple public XML feed URLs
- Converts XML to JSON with `xml2js`
- Normalizes job fields
- Pushes each job to Redis queue

### 2. **Redis Queue (Bull)**
- Bull is used for queue management with Redis
- Concurrency is configurable (currently set to 5)
- Supports retries and scalable background job handling

### 3. **Job Worker**
- Listens to the Bull queue
- For each job:
  - Inserts new or updates existing records in MongoDB
  - Tracks:
    - `newJobs`
    - `updatedJobs`
    - `totalFetched`
    - `totalImported`
    - `failedJobs[]` (with reason)

- On `queue.on('drained')`, logs a summary in `import_logs`

### 4. **MongoDB**
- **jobs**: Stores all job data by `jobId`
- **import_logs**: Stores import summary per run (timestamp, counts, failures)

### 5. **React Admin UI**
- Built with React + Tailwind CSS
- Fetches logs from backend
- Shows:
  - Logs table with all key stats
  - View Details link (per log)
  - Pagination (10 logs/page)
  - Filter: show only logs with failures

---

## ⚙️ Environment Variables

Used in `/server/.env`:

