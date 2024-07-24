document.addEventListener('DOMContentLoaded', () => {
    const jobStatusElement = document.getElementById('job-status');
    const daysSinceLastJobElement = document.getElementById('days-since-last-job');
    const hoursSinceLastJobElement = document.getElementById('hours-since-last-job');
    const minutesSinceLastJobElement = document.getElementById('minutes-since-last-job');
    const secondsSinceLastJobElement = document.getElementById('seconds-since-last-job');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const updateForm = document.getElementById('update-form');
    const jobStatusSelect = document.getElementById('job-status-select');
    const clockElement = document.getElementById('clock');

    async function fetchJobData() {
        try {
            const response = await fetch('/api/jobStatus');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateUI(data.status, data.daysSinceLastJob, data.hoursSinceLastJob, data.minutesSinceLastJob, data.secondsSinceLastJob);
        } catch (error) {
            console.error('Failed to fetch job data:', error);
        }
    }

    function updateUI(status, daysSinceLastJob, hoursSinceLastJob, minutesSinceLastJob, secondsSinceLastJob) {
        jobStatusElement.textContent = status;
        daysSinceLastJobElement.textContent = daysSinceLastJob;
        hoursSinceLastJobElement.textContent = hoursSinceLastJob;
        minutesSinceLastJobElement.textContent = minutesSinceLastJob;
        secondsSinceLastJobElement.textContent = secondsSinceLastJob;

        if (status === 'Yes') {
            jobStatusElement.classList.add('yes');
            jobStatusElement.classList.remove('no');
            daysSinceLastJobElement.classList.add('yes');
            daysSinceLastJobElement.classList.remove('no');
            hoursSinceLastJobElement.classList.add('yes');
            hoursSinceLastJobElement.classList.remove('no');
            minutesSinceLastJobElement.classList.add('yes');
            minutesSinceLastJobElement.classList.remove('no');
            secondsSinceLastJobElement.classList.add('yes');
            secondsSinceLastJobElement.classList.remove('no');
        } else {
            jobStatusElement.classList.add('no');
            jobStatusElement.classList.remove('yes');
            daysSinceLastJobElement.classList.add('no');
            daysSinceLastJobElement.classList.remove('yes');
            hoursSinceLastJobElement.classList.add('no');
            hoursSinceLastJobElement.classList.remove('yes');
            minutesSinceLastJobElement.classList.add('no');
            minutesSinceLastJobElement.classList.remove('yes');
            secondsSinceLastJobElement.classList.add('no');
            secondsSinceLastJobElement.classList.remove('yes');
        }
    }

    async function saveData(status) {
        try {
            const response = await fetch('/api/jobStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
        } catch (error) {
            console.error('Failed to save job data:', error);
        }
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if (username === 'admin' && password === 'P@ssw0rd1234!') {
            adminPanel.style.display = 'block';
            loginForm.style.display = 'none';
        } else {
            alert('Invalid login credentials!');
        }
    });

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const status = jobStatusSelect.value;

        await saveData(status);
        fetchJobData(); // Refresh the data after saving
    });

    fetchJobData(); // Initial fetch on load

    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Fetch data every minute to keep it updated in real-time
    setInterval(fetchJobData, 60000);
});
