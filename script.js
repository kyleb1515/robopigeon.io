// script.js
// Configuration and DOM Elements stay the same
const CONFIG = {
    API_KEY: 'f419889b9a3046afabbb3326fc455f2f',
    API_URL: 'https://newsapi.org/v2/top-headlines',
    COUNTRY: 'us',
    CATEGORY: 'technology',
    PAGE_SIZE: 8
};

const DOM = {
    randomPostBtn: document.getElementById('random-post-btn'),
    bigStory: document.querySelector('.big-story'),
    mainContent: document.querySelector('.main-content')
};

// Updated News API Service
const NewsService = {
    async fetchNews() {
        const url = `${CONFIG.API_URL}?country=${CONFIG.COUNTRY}&category=${CONFIG.CATEGORY}&pageSize=${CONFIG.PAGE_SIZE}&apiKey=${CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error('Error fetching news:', error);
            return null;
        }
    },

    async populateCarousel(carouselContainer = null) {
        const articles = await this.fetchNews();
        if (!articles) return;

        // If no specific container is provided, use the initial carousel
        const container = carouselContainer || document.getElementById('featured-carousel');
        if (!container) return;

        const boxes = container.querySelectorAll('.small-box');
        articles.forEach((article, index) => {
            if (boxes[index]) {
                boxes[index].innerHTML = this.createArticleHTML(article);
            }
        });
    },

    createArticleHTML(article) {
        return `
            <img src="${article.urlToImage || 'https://via.placeholder.com/200'}" class="story-image">
            <h4>${article.title}</h4>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
    }
};

// Random Post Feature stays the same
// Update the RandomPost object
const RandomPost = {
    handleClick() {
        // Get a fresh selection of all posts
        const posts = document.querySelectorAll('.trending, .small-box');
        
        if (posts.length === 0) {
            alert('No posts available!');
            return;
        }

        const randomPost = this.getRandomPost(Array.from(posts));
        this.updateBigStory(randomPost);
        this.scrollToPost(randomPost);
        this.highlightPost(randomPost);
    },

    getRandomPost(posts) {
        const randomIndex = Math.floor(Math.random() * posts.length);
        return posts[randomIndex];
    },

    updateBigStory(post) {
        // Get content from either h3 (trending) or h4 (carousel)
        const title = post.querySelector('h3, h4')?.textContent || "Random Story";
        const description = post.querySelector('p')?.textContent || "Details unavailable.";
        
        const bigStoryTitle = DOM.bigStory.querySelector('h2');
        const bigStoryDesc = DOM.bigStory.querySelector('p');
        
        if (bigStoryTitle) bigStoryTitle.textContent = title;
        if (bigStoryDesc) bigStoryDesc.textContent = description;
    },

    scrollToPost(post) {
        post.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    highlightPost(post) {
        post.style.transition = 'box-shadow 0.3s, transform 0.3s';
        post.style.boxShadow = '0 0 15px rgba(233, 114, 221, 0.8)';
        post.style.transform = 'scale(1.05)';

        setTimeout(() => {
            post.style.boxShadow = '';
            post.style.transform = '';
        }, 1000);
    }
};


// Updated Infinite Scroll
const InfiniteScroll = {
    appendedCount: 0,
    isLoading: false,
    storyCounter: 5,
    maxStories: 100,
    
    init() {
        if (typeof _ === 'undefined' || !_.debounce) {
            console.error('Lodash not loaded. Please include lodash in your HTML.');
            return;
        }
        
        this.debouncedScroll = _.debounce(() => this.handleScroll(), 150);
        window.addEventListener('scroll', () => this.debouncedScroll());
    },

    handleScroll() {
        if (this.isLoading || this.storyCounter >= this.maxStories) return;
        
        const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
        const threshold = 100;
        
        if (scrollTop + clientHeight >= scrollHeight - threshold) {
            this.appendContent();
        }
    },

    createNewStoryHTML(storyNumber) {
        return `
            <div class="trending-stories-container">
                <article class="my-box trending">
                    <h3>Trending Story #${storyNumber}</h3>
                    <p>Short and intriguing summary for story ${storyNumber}.</p>
                </article>
            </div>
        `;
    },

    createCarouselHTML() {
        const carouselId = `carousel-${this.appendedCount}`;
        return `
            <section class="carousel-container" id="${carouselId}">
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
                <div class="small-box"></div>
            </section>
        `;
    },

    async appendContent() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            // First add a carousel
            const carouselHTML = this.createCarouselHTML();
            DOM.mainContent.insertAdjacentHTML('beforeend', carouselHTML);
            
            // Get the newly added carousel and populate it
            const newCarouselId = `carousel-${this.appendedCount}`;
            const newCarousel = document.getElementById(newCarouselId);
            await NewsService.populateCarousel(newCarousel);

            // Then add 10 trending stories
            for(let i = 0; i < 10 && this.storyCounter < this.maxStories; i++) {
                this.storyCounter++;
                const newStoryHTML = this.createNewStoryHTML(this.storyCounter);
                DOM.mainContent.insertAdjacentHTML('beforeend', newStoryHTML);
            }
            
            this.appendedCount += 10;

        } catch (error) {
            console.error('Error appending content:', error);
        } finally {
            this.isLoading = false;
        }
    },

    cleanup() {
        if (this.debouncedScroll) {
            window.removeEventListener('scroll', this.debouncedScroll);
        }
    }
};

// Initialize Application stays the same
function initializeApp() {
    NewsService.populateCarousel();
    DOM.randomPostBtn.addEventListener('click', () => RandomPost.handleClick());
    InfiniteScroll.init();
}

document.addEventListener('DOMContentLoaded', initializeApp);
