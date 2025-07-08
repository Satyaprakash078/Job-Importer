import express from 'express';
import { getAllImportLogs, getImportLogById } from '../controllers/importLog.controller.js';


const router = express.Router();

router.get('/import-logs', getAllImportLogs);
router.get('/import-logs/:id', getImportLogById);

export default router;
