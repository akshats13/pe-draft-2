import express from 'express';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const draftDir = path.join(projectRoot, 'draft');
const canonDir = path.join(projectRoot, 'canon');
const draftFilePath = path.join(draftDir, 'draft.json');
const censusDataPath = path.join(__dirname, 'data', 'census-data.json');

const ensureDirs = () => {
  try {
    [draftDir, canonDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  } catch (error) {
    console.error('Failed to create directories:', error);
  }
};

ensureDirs();

app.get('/api/census-data', async (req, res) => {
  console.log('Get census-data called at:', new Date().toISOString());
  try {
    const data = await fsPromises.readFile(censusDataPath, 'utf-8');
    res.status(200).send(JSON.parse(data));
  } catch (err) {
    console.error('Error getting census data:', err);
    res.status(500).send({ message: 'Error getting census data' });
  }
});

app.post('/api/save_draft', async (req, res) => {
  console.log('Save draft called at:', new Date().toISOString());
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).send({ message: 'No data provided' });
    }
    await fsPromises.writeFile(draftFilePath, JSON.stringify(data, null, 2));
    res.status(200).send({ message: 'Draft saved successfully' });
  } catch (err) {
    console.error('Error saving draft:', err);
    res.status(500).send({ message: 'Error saving draft' });
  }
});

app.get('/api/get_draft', async (req, res) => {
  console.log('Get draft called at:', new Date().toISOString());
  try {
    if (fs.existsSync(draftFilePath)) {
      const stats = await fsPromises.stat(draftFilePath);
      const ageInMinutes = (new Date().getTime() - new Date(stats.mtime).getTime()) / 1000 / 60;
      if (ageInMinutes < 20) {
        const data = await fsPromises.readFile(draftFilePath, 'utf-8');
        res.status(200).send({ data: JSON.parse(data) });
        return;
      }
    }
    res.status(200).send({ data: [] });
  } catch (err) {
    console.error('Error getting draft:', err);
    res.status(500).send({ message: 'Error getting draft' });
  }
});

app.post('/api/submit', async (req, res) => {
  console.log('Submit endpoint hit');
  console.log('Request body:', req.body);
  try {
    const { data } = req.body;
    if (!data || data.length === 0) {
      console.error('No data provided in submit request or data is empty');
      return res.status(400).send({ message: 'No data provided or data is empty' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const canonFilePath = path.join(canonDir, `record_${timestamp}.json`);
    
    await fsPromises.writeFile(canonFilePath, JSON.stringify(data, null, 2));
    console.log(`Final record saved to: ${canonFilePath}`);

    if (fs.existsSync(draftFilePath)) {
      await fsPromises.unlink(draftFilePath);
      console.log('Draft file deleted.');
    }

    res.status(200).send({ message: 'Record submitted successfully' });
  } catch (err) {
    console.error('Error submitting record:', err);
    res.status(500).send({ message: 'Error submitting record', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
