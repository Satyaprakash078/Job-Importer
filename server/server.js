import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchAndQueueJobs } from './services/fetchJobs.service.js';
import jobRoutes from './routers/jobs.routes.js'; 
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
};

startServer();
await fetchAndQueueJobs();