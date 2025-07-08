import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import { jobQueue } from './jobQueue.js';
import Job from '../models/Job.js';
import ImportLog from '../models/ImportLog.js';



await mongoose.connect(process.env.MONGO_URI);

let totalFetched = 0;
let totalImported = 0;
let newJobs = 0;
let updatedJobs = 0;
let failedJobs = [];

jobQueue.process(5, async (job) => {
    console.log(' Processing job:', job.data.title);
  totalFetched++;

  const data = job.data;
  try {
    const existing = await Job.findOne({ jobId: data.jobId });

    if (existing) {
      await Job.updateOne({ jobId: data.jobId }, data);
      updatedJobs++;
    } else {
      await Job.create(data);
      newJobs++;
    }

    totalImported++;
  } catch (err) {
    failedJobs.push({ jobId: data.jobId, reason: err.message });
  }
});

jobQueue.on('drained', async () => {
  // Once queue is empty, log the summary
  const log = new ImportLog({
    totalFetched,
    totalImported,
    newJobs,
    updatedJobs,
    failedJobs
  });

  await log.save();

  console.log('Import log saved.');
  process.exit(0); // Stop the worker when done
});
