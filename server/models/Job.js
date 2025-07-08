
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, // unique ID from feed
  title: String,
  company: String,
  location: String,
  description: String,
  category: String,
  type: String,
  url: String,
  publishedAt: Date,
  source: String,
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
