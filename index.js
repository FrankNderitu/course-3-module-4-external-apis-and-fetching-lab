// index.js


// Your code here!
async function  fetchWeatherAlerts(state) {
    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather alerts data:', data);
        displayAlerts(data);
    } catch (error) {
        console.error('Error fetching weather alerts:', error.message);
        showError(error.message);
    }
}

function displayAlerts(data) {
    const alertsDisplay = document.getElementById('alerts-display');
    const features = data.features || [];

    // Clear previous content
    alertsDisplay.innerHTML = '';

    // Display summary of alerts
    const stateAbbr = document.getElementById('state-input').value.trim().toUpperCase();
    const alertCount = features.length;
    
    const summary = document.createElement('h2');
    summary.textContent = `Current watches, warnings, and advisories for ${stateAbbr}: ${alertCount}`;
    alertsDisplay.appendChild(summary);

    // If no alerts
    if (alertCount === 0) {
        const noAlerts = document.createElement('p');
        noAlerts.textContent = 'No active alerts at this time for this state.';
        noAlerts.style.color = 'green';
        alertsDisplay.appendChild(noAlerts);
        return;
    }

    // Create list of alert headlines
    const list = document.createElement('ul');
    
    features.forEach(feature => {
        const headline = feature.properties?.headline || 'No headline available';
        
        const listItem = document.createElement('li');
        listItem.textContent = headline;
        listItem.style.margin = '10px 0';
        list.appendChild(listItem);
    });

    alertsDisplay.appendChild(list);

    document.getElementById('state-input').value = '';   
}   
// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Clear the alerts display when there's an error
    document.getElementById('alerts-display').innerHTML = '';
}
document.getElementById('fetch-alerts').addEventListener('click', () => {
    const stateInput = document.getElementById('state-input').value.trim().toUpperCase();
    
    if (!stateInput || stateInput.length !== 2) {
        showError('Please enter a valid two-letter state abbreviation (e.g., MN, CA, NY).');
        return;
    }

    fetchWeatherAlerts(stateInput);
});

// Allow pressing Enter Key to trigger the fetch
document.getElementById('state-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('fetch-alerts').click();
    }
});
