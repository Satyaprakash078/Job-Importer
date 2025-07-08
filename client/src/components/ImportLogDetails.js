// /client/src/components/ImportLogDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ImportLogDetails = () => {
  const { id } = useParams();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/import-logs/${id}`);
        setLog(res.data);
      } catch (err) {
        console.error("Failed to fetch log details", err);
      }
    };

    fetchLog();
  }, [id]);

  if (!log) return <div className="p-8 text-lg">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Import Log Details</h2>
      <p className="mb-2"><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
      <p className="mb-2"><strong>Total Fetched:</strong> {log.totalFetched}</p>
      <p className="mb-2"><strong>New Jobs:</strong> {log.newJobs}</p>
      <p className="mb-2"><strong>Updated Jobs:</strong> {log.updatedJobs}</p>
      <p className="mb-2"><strong>Failed Jobs:</strong> {log.failedJobs.length}</p>

      {log.failedJobs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Failed Jobs</h3>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Job ID</th>
                <th className="p-2 border">Reason</th>
              </tr>
            </thead>
            <tbody>
              {log.failedJobs.map((fail, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{fail.jobId}</td>
                  <td className="p-2 border text-red-600">{fail.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/" className="mt-4 inline-block text-blue-600 underline">
        ← Back to History
      </Link>
    </div>
  );
};

export default ImportLogDetails;
