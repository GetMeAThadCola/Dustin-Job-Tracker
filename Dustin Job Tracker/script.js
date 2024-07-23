document.addEventListener('DOMContentLoaded', () => {
    const jobStatusElement = document.getElementById('job-status');
    const jobDurationElement = document.getElementById('job-duration');
    const hoursSinceLastJobElement = document.getElementById('hours-since-last-job');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const updateForm = document.getElementById('update-form');
    const jobStatusSelect = document.getElementById('job-status-select');
    const jobDurationInput = document.getElementById('job-duration-input');
    const lastJobTimeInput = document.getElementById('last-job-time');
    const clockElement = document.getElementById('clock');

    async function fetchJobData() {
        const response = await fetch('/api/jobStatus');
        if (response.ok) {
            const data = await response.json();
            updateUI(data.status, data.duration, data.hoursSinceLastJob);
        } else {
            console.error('Failed to fetch job data');
        }
    }

    function updateUI(status, duration, hoursSinceLastJob) {
        jobStatusElement.textContent = status;
        jobDurationElement.textContent = duration;
        hoursSinceLastJobElement.textContent = hoursSinceLastJob !== null ? hoursSinceLastJob : 'N/A';

        if (status === 'Yes') {
            jobStatusElement.classList.add('yes');
            jobStatusElement.classList.remove('no');
            jobDurationElement.classList.add('yes');
            jobDurationElement.classList.remove('no');
        } else {
            jobStatusElement.classList.add('no');
            jobStatusElement.classList.remove('yes');
            jobDurationElement.classList.add('no');
            jobDurationElement.classList.remove('yes');
        }
    }

    async function saveData(status, duration, lastJobTime) {
        const response = await fetch('/api/jobStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, duration, lastJobTime }),
        });
        if (!response.ok) {
            console.error('Failed to update job data');
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
        const duration = parseInt(jobDurationInput.value);
        const lastJobTime = lastJobTimeInput.value;

        const lastJobTimeFormatted = lastJobTime ? new Date(lastJobTime).toISOString() : null;
        updateUI(status, duration, lastJobTimeFormatted ? Math.floor((new Date() - new Date(lastJobTimeFormatted)) / (1000 * 60 * 60)) : 'N/A');
        await saveData(status, duration, lastJobTimeFormatted);
    });

    fetchJobData();

    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();
});
