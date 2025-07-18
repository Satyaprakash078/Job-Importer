
import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  fileName: {type: String, required: true},
  timestamp: { type: Date, default: Date.now },
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [
    {
      jobId: String,
      reason: String
    }
  ]
});

export default mongoose.model('ImportLog', importLogSchema);
