import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  generateAdaptivePlan,
  generateGuardianAdvice,
  generateGentleMercy,
  generateWeeklyReport,
} from './src/server/geminiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.post('/api/ai/onboarding-plan', async (req, res) => {
  try {
    const result = await generateAdaptivePlan(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

app.post('/api/ai/guardian-advice', async (req, res) => {
  try {
    const result = await generateGuardianAdvice(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

app.post('/api/ai/gentle-mercy', async (req, res) => {
  try {
    const result = await generateGentleMercy(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

app.post('/api/ai/weekly-report', async (req, res) => {
  try {
    const result = await generateWeeklyReport(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Serve frontend dist in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Mood Garden AI server running on port ${port}`);
});
