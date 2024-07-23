let jobData = {
    status: 'No',
    lastJobTime: null,
  };
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      const currentDate = new Date();
      let daysSinceLastJob = 0;
      let hoursSinceLastJob = 'N/A';
  
      if (jobData.lastJobTime) {
        const lastJobDate = new Date(jobData.lastJobTime);
        const diffMilliseconds = currentDate - lastJobDate;
        daysSinceLastJob = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
        hoursSinceLastJob = hours % 24;
      }
  
      res.status(200).json({ status: jobData.status, daysSinceLastJob, hoursSinceLastJob });
    } else if (req.method === 'POST') {
      const { status, lastJobTime } = req.body;
      jobData = {
        status,
        lastJobTime: lastJobTime ? new Date(lastJobTime).toISOString() : null,
      };
      res.status(200).json({ message: 'Job data updated successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  