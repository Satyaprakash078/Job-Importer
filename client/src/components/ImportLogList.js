import React, { useEffect, useState } from "react";
import axios from "axios";

const ImportLogList = () => {
  const [logs, setLogs] = useState([]);
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/import-logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = showOnlyFailed
    ? logs.filter((log) => log.failedJobs.length > 0)
    : logs;

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Import History</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyFailed}
            onChange={(e) => {
              setShowOnlyFailed(e.target.checked);
              setCurrentPage(1); // Reset page when filtering
            }}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm">Show only failed logs</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Fetched</th>
              <th className="p-2 border">Imported</th>
              <th className="p-2 border">New</th>
              <th className="p-2 border">Updated</th>
              <th className="p-2 border">Failed</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log) => (
              <tr key={log._id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{log.totalFetched}</td>
                <td className="p-2 border">{log.totalImported}</td>
                <td className="p-2 border">{log.newJobs}</td>
                <td className="p-2 border">{log.updatedJobs}</td>
                <td className="p-2 border text-red-600">{log.failedJobs.length}</td>
                <td className="p-2 border">
                  <a
                    href={`/logs/${log._id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportLogList;
