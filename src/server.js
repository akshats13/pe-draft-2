import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempRecordsDir = path.join(__dirname, '..', 'temp_records');

// Create the directory if it doesn't exist
if (!fs.existsSync(tempRecordsDir)) {
  fs.mkdirSync(tempRecordsDir, { recursive: true });
}

app.use(express.json());

app.post('/api/save_record', (req, res) => {
  const { data, version } = req.body;
  const fileName = `record_v${version}.json`;
  const filePath = path.join(tempRecordsDir, fileName);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send({ message: 'Error saving record' });
    }
    res.status(200).send({ message: 'Record saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
