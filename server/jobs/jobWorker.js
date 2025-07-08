import Queue from 'bull';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import ImportLog from '../models/ImportLog.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const jobQueue = new Queue('job-import-queue', process.env.REDIS_URL);

// Counters
let totalFetched = 0;
let totalImported = 0;
let newJobs = 0;
let updatedJobs = 0;
let failedJobs = [];
let sourceUrl = ''; // Store URL for fileName

jobQueue.process(5, async (job) => {
  try {
    const data = job.data;
    // console.log('Processing job:', data.title);

    
    if (!sourceUrl && data?.source) {
      sourceUrl = data.source;
    }

    totalFetched++;

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
    failedJobs.push({
      jobId: job?.data?.jobId || 'unknown',
      reason: err.message,
    });
  }
});

jobQueue.on('drained', async () => {
  try {
    const log = new ImportLog({
      fileName: sourceUrl || 'Unknown Source',
      timestamp: new Date(),
      totalFetched,
      totalImported,
      newJobs,
      updatedJobs,
      failedJobs,
    });

    await log.save();
    console.log(' Import log saved:', log);

    // Reset counters
    totalFetched = 0;
    totalImported = 0;
    newJobs = 0;
    updatedJobs = 0;
    failedJobs = [];
    sourceUrl = '';
  } catch (err) {
    console.error('Failed to save import log:', err.message);
  }
});
