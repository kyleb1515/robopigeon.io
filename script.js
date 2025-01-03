// Utility function for API calls
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Daily Quote for Wellness Tip
async function updateWellnessTip() {
    const quoteData = await fetchData('https://api.quotable.io/random?tags=wisdom|inspirational');
    if (quoteData) {
        const tipElement = document.querySelector('#daily-wellness .data-content');
        tipElement.innerHTML = `
            <blockquote>
                <p>${quoteData.content}</p>
                <footer>— ${quoteData.author}</footer>
            </blockquote>
        `;
    }
}

// Weather and Air Quality
async function updateWeatherQuality() {
    // Note: You'll need to sign up for a free API key
    const weatherElement = document.querySelector('#weather-quality .data-content');
    weatherElement.innerHTML = `
        <div class="weather-info">
            <p>Loading weather data...</p>
        </div>
    `;
    // You'll implement actual API call here
}

// Meditation Timer
function setupMeditationTimer() {
    const timerButton = document.querySelector('.start-timer');
    let timeLeft = 300; // 5 minutes in seconds
    let timerInterval;

    timerButton.addEventListener('click', () => {
        if (timerButton.textContent === 'Start 5-Min Meditation') {
            timerButton.textContent = '5:00';
            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerButton.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerButton.textContent = 'Start 5-Min Meditation';
                    timeLeft = 300;
                }
            }, 1000);
        }
    });
}

// News Carousel
async function updateWellnessNews() {
    const carouselTrack = document.querySelector('.carousel-track');
    // You'll implement news API call here
    // For now, adding placeholder content
    const placeholderNews = [
        { title: 'New Study Shows Benefits of Meditation', summary: 'Research indicates daily meditation can improve focus and reduce stress.' },
        { title: 'Seasonal Wellness Tips', summary: 'Expert advice on staying healthy during changing seasons.' },
        { title: 'Community Wellness Programs Launch', summary: 'Local initiatives to promote health and wellness in communities.' }
    ];

    carouselTrack.innerHTML = placeholderNews.map(news => `
        <div class="carousel-item">
            <h4>${news.title}</h4>
            <p>${news.summary}</p>
        </div>
    `).join('');
}

// Resources Grid
function populateResources() {
    const resourcesGrid = document.querySelector('#resources-grid');
    const resources = [
        { title: 'Meditation Guides', icon: 'fas fa-om' },
        { title: 'Nutrition Resources', icon: 'fas fa-apple-alt' },
        { title: 'Exercise Library', icon: 'fas fa-running' },
        { title: 'Mental Health Support', icon: 'fas fa-brain' }
    ];

    resourcesGrid.innerHTML = resources.map(resource => `
        <div class="resource-item">
            <i class="${resource.icon}"></i>
            <h4>${resource.title}</h4>
        </div>
    `).join('');
}

// Initialize all components
function initializeApp() {
    updateWellnessTip();
    updateWeatherQuality();
    setupMeditationTimer();
    updateWellnessNews();
    populateResources();

    // Refresh data periodically
    setInterval(updateWellnessTip, 3600000); // Every hour
    setInterval(updateWeatherQuality, 1800000); // Every 30 minutes
    setInterval(updateWellnessNews, 3600000); // Every hour
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
