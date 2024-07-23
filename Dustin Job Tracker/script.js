document.addEventListener('DOMContentLoaded', () => {
    const jobStatusElement = document.getElementById('job-status');
    const daysSinceLastJobElement = document.getElementById('days-since-last-job');
    const hoursSinceLastJobElement = document.getElementById('hours-since-last-job');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const updateForm = document.getElementById('update-form');
    const jobStatusSelect = document.getElementById('job-status-select');
    const lastJobTimeInput = document.getElementById('last-job-time');
    const clockElement = document.getElementById('clock');

    async function fetchJobData() {
        const response = await fetch('/api/jobStatus');
        const data = await response.json();
        updateUI(data.status, data.daysSinceLastJob, data.hoursSinceLastJob);
    }

    function updateUI(status, daysSinceLastJob, hoursSinceLastJob) {
        jobStatusElement.textContent = status;
        daysSinceLastJobElement.textContent = daysSinceLastJob;
        hoursSinceLastJobElement.textContent = hoursSinceLastJob !== null ? hoursSinceLastJob : 'N/A';

        if (status === 'Yes') {
            jobStatusElement.classList.add('yes');
            jobStatusElement.classList.remove('no');
            daysSinceLastJobElement.classList.add('yes');
            daysSinceLastJobElement.classList.remove('no');
        } else {
            jobStatusElement.classList.add('no');
            jobStatusElement.classList.remove('yes');
            daysSinceLastJobElement.classList.add('no');
            daysSinceLastJobElement.classList.remove('yes');
        }
    }

    async function saveData(status, lastJobTime) {
        await fetch('/api/jobStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, lastJobTime }),
        });
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
        const lastJobTime = lastJobTimeInput.value;

        updateUI(status, 0, 0); // Placeholder values for initial update
        await saveData(status, lastJobTime);
        fetchJobData(); // Refresh the data after saving
    });

    fetchJobData();

    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();
});
