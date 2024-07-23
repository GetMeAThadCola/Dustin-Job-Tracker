document.addEventListener('DOMContentLoaded', () => {
    const jobStatusElement = document.getElementById('job-status');
    const jobDurationElement = document.getElementById('job-duration');
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const updateForm = document.getElementById('update-form');
    const jobStatusSelect = document.getElementById('job-status-select');
    const jobDurationInput = document.getElementById('job-duration-input');
    const clockElement = document.getElementById('clock');

    async function fetchJobData() {
        const response = await fetch('/api/jobStatus');
        const data = await response.json();
        updateUI(data.status, data.duration);
    }

    function updateUI(status, duration) {
        jobStatusElement.textContent = status;
        jobDurationElement.textContent = duration;

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

    async function saveData(status, duration) {
        await fetch('/api/jobStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, duration }),
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
        const duration = parseInt(jobDurationInput.value);

        updateUI(status, duration);
        await saveData(status, duration);
    });

    fetchJobData();

    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();
});
