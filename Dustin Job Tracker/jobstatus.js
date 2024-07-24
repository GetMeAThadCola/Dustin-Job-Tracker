import fs from 'fs';
import path from 'path';

const dataFilePath = path.resolve('./data/jobData.json');

function readJobData() {
  if (!fs.existsSync(dataFilePath)) {
    return { status: 'No', lastJobTime: null };
  }
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

function writeJobData(jobData) {
  fs.writeFileSync(dataFilePath, JSON.stringify(jobData), 'utf-8');
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const currentDate = new Date();
    const jobData = readJobData();
    let daysSinceLastJob = 0;
    let hoursSinceLastJob = 0;
    let minutesSinceLastJob = 0;
    let secondsSinceLastJob = 0;

    if (jobData.lastJobTime) {
      const lastJobDate = new Date(jobData.lastJobTime);
      const diffMilliseconds = currentDate - lastJobDate;

      daysSinceLastJob = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
      hoursSinceLastJob = Math.floor(diffMilliseconds / (1000 * 60 * 60)) % 24;
      minutesSinceLastJob = Math.floor(diffMilliseconds / (1000 * 60)) % 60;
      secondsSinceLastJob = Math.floor(diffMilliseconds / 1000) % 60;
    }

    res.status(200).json({ status: jobData.status, daysSinceLastJob, hoursSinceLastJob, minutesSinceLastJob, secondsSinceLastJob });
  } else if (req.method === 'POST') {
    const { status } = req.body;
    const jobData = readJobData();
    const updatedJobData = {
      status,
      lastJobTime: status === 'Yes' ? new Date().toISOString() : jobData.lastJobTime,
    };
    writeJobData(updatedJobData);
    res.status(200).json({ message: 'Job data updated successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
