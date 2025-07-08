
import ImportLog from '../models/ImportLog.js';

export const getAllImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch import logs' });
  }
};

export const getImportLogById = async (req, res) => {
  try {
    const log = await ImportLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch log' });
  }
};
