
import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

export const jobQueue = new Bull('job-import-queue', process.env.REDIS_URL);
