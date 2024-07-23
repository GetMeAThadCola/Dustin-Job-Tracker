const jobData = {
    status: 'No',
    duration: 0,
    lastUpdated: new Date().toISOString(),
  };
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      // Calculate the current duration based on last update
      const currentDate = new Date();
      const lastUpdatedDate = new Date(jobData.lastUpdated);
      const daysDifference = Math.floor((currentDate - lastUpdatedDate) / (1000 * 60 * 60 * 24));
      const duration = jobData.duration + daysDifference;
      res.status(200).json({ status: jobData.status, duration });
    } else if (req.method === 'POST') {
      // Update job status and duration
      const { status, duration } = req.body;
      jobData.status = status;
      jobData.duration = duration;
      jobData.lastUpdated = new Date().toISOString();
      res.status(200).json({ message: 'Job data updated successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  