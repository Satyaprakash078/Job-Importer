// /services/fetchJobs.service.js
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { jobQueue } from '../jobs/jobQueue.js';

const jobFeedUrls = [
  "https://jobicy.com/?feed=job_feed",
 "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
" https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
" https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
" https://jobicy.com/?feed=job_feed&job_categories=data-science",
" https://jobicy.com/?feed=job_feed&job_categories=copywriting",
 "https://jobicy.com/?feed=job_feed&job_categories=business",
" https://jobicy.com/?feed=job_feed&job_categories=management"
];

export const fetchAndQueueJobs = async () => {
  let totalJobs = 0;

  for (const url of jobFeedUrls) {
    try {
      const { data } = await axios.get(url);
      const json = await parseStringPromise(data, { explicitArray: false });

      const jobs = json.rss?.channel?.item || [];

      const jobList = Array.isArray(jobs) ? jobs : [jobs];

      for (const job of jobList) {
        const jobData = {
          jobId: typeof job.guid === 'object' ? job.guid._ : job.guid || job.link,
          title: job.title,
          company: job['dc:creator'] || job.author || 'Unknown',
          location: job.location || 'Remote',
          description: job.description,
          category: job.category,
          type: job.type || 'Full-Time',
          url: job.link,
          publishedAt: job.pubDate ? new Date(job.pubDate) : new Date(),
          source: url
        };

        await jobQueue.add(jobData); // Push job to Redis queue
        totalJobs++;
      }

    } catch (err) {
      console.error(`Failed fetching from ${url}`, err.message);
    }
  }

  console.log(`Total Jobs Queued: ${totalJobs}`);
};
