let jobData = {
    status: 'No',
    duration: 0,
    lastUpdated: new Date().toISOString(),
    lastJobTime: null,
  };
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      const currentDate = new Date();
      const lastUpdatedDate = new Date(jobData.lastUpdated);
      const daysDifference = Math.floor((currentDate - lastUpdatedDate) / (1000 * 60 * 60 * 24));
      const duration = jobData.duration + daysDifference;
  
      let hoursSinceLastJob = null;
      if (jobData.lastJobTime) {
        const lastJobTime = new Date(jobData.lastJobTime);
        hoursSinceLastJob = Math.floor((currentDate - lastJobTime) / (1000 * 60 * 60));
      }
  
      res.status(200).json({ status: jobData.status, duration, hoursSinceLastJob });
    } else if (req.method === 'POST') {
      const { status, duration, lastJobTime } = req.body;
      jobData = {
        status,
        duration,
        lastUpdated: new Date().toISOString(),
        lastJobTime: lastJobTime ? new Date(lastJobTime).toISOString() : null,
      };
      res.status(200).json({ message: 'Job data updated successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  