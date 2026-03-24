// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // === Initialize Icons ===
    lucide.createIcons();

    // === DOM Elements ===
    const grid = document.getElementById("crypto-grid");
    const searchInput = document.getElementById("search-input");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sort-select");
    const loadingState = document.getElementById("loading-state");
    const errorState = document.getElementById("error-state");
    const retryBtn = document.getElementById("retry-btn");
    const themeToggleBtn = document.getElementById("theme-toggle");

    // === State Variables ===
    let cryptoData = [];
    let favorites = JSON.parse(localStorage.getItem("crypto_favorites")) || [];
    let currentFilter = "all"; // all, gainers, losers, favorites
    let currentSort = "market_cap_desc";

    // === API Config ===
    const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

    // === Initialization ===
    initTheme();
    fetchMarketData();

    // === API Integration (Milestone 2) ===
    async function fetchMarketData() {
        showLoading();
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Network response was not ok");
            cryptoData = await response.json();
            
            errorState.classList.remove("active");
            renderUI();
        } catch (error) {
            console.error("Fetch Error:", error);
            showError();
        } finally {
            hideLoading();
        }
    }

    // === Render Logic (Milestone 3) ===
    function renderUI() {
        // We use Array Higher-Order Functions for logic as requested
        
        // 1. Filter by Search Query
        const searchTerm = searchInput.value.trim().toLowerCase();
        let processedData = cryptoData.filter(coin => 
            coin.name.toLowerCase().includes(searchTerm) || 
            coin.symbol.toLowerCase().includes(searchTerm)
        );

        // 2. Filter by Category
        processedData = processedData.filter(coin => {
            if (currentFilter === "gainers") return coin.price_change_percentage_24h > 0;
            if (currentFilter === "losers") return coin.price_change_percentage_24h < 0;
            if (currentFilter === "favorites") return favorites.includes(coin.id);
            return true; // 'all' fallback
        });

        // 3. Sort Data
        processedData = processedData.sort((a, b) => {
            switch (currentSort) {
                case "market_cap_desc": return b.market_cap - a.market_cap;
                case "market_cap_asc": return a.market_cap - b.market_cap;
                case "price_desc": return b.current_price - a.current_price;
                case "price_asc": return a.current_price - b.current_price;
                case "name_asc": return a.name.localeCompare(b.name);
                case "name_desc": return b.name.localeCompare(a.name);
                default: return 0;
            }
        });

        // 4. Map to HTML Strings
        const htmlStrings = processedData.map(coin => createCoinCard(coin));
        
        // Display
        if (processedData.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-sec)">No coins found matching your criteria.</p>`;
        } else {
            grid.innerHTML = htmlStrings.join("");
            lucide.createIcons(); // Re-initialize icons for new DOM elements
            attachFavoriteListeners();
        }
    }

    // Component Renderer
    function createCoinCard(coin) {
        const isFav = favorites.includes(coin.id);
        const change = coin.price_change_percentage_24h || 0;
        const changeClass = change >= 0 ? 'change-up' : 'change-down';
        const changeIcon = change >= 0 ? 'trending-up' : 'trending-down';

        // Format currency softly
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
            maximumFractionDigits: coin.current_price < 1 ? 6 : 2
        }).format(coin.current_price);

        const mktCap = new Intl.NumberFormat('en-US', {
            notation: "compact", 
            compactDisplay: "short"
        }).format(coin.market_cap);

        return `
            <div class="coin-card" id="card-${coin.id}">
                <div class="card-header">
                    <div class="coin-identity">
                        <img src="${coin.image}" alt="${coin.name}" class="coin-img" loading="lazy">
                        <div>
                            <div class="coin-symbol">${coin.symbol}</div>
                            <div class="coin-name">${coin.name}</div>
                        </div>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="coin-price">${formattedPrice}</div>
                    <div class="coin-change ${changeClass}">
                        <i data-lucide="${changeIcon}" style="width:14px; height:14px;"></i>
                        ${Math.abs(change).toFixed(2)}%
                    </div>
                </div>

                <div class="card-footer">
                    <span>Mkt Cap: $${mktCap}</span>
                    <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${coin.id}" aria-label="Toggle Favorite">
                        <i data-lucide="heart" style="fill: ${isFav ? 'var(--danger)' : 'none'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // === Event Listeners ===

    // Debouncing for Search Input (Bonus)
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderUI();
        }, 400); // 400ms debounce
    });

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // UI Toggle
            filterBtns.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            // Logic state
            currentFilter = e.currentTarget.dataset.filter;
            renderUI();
        });
    });

    // Sort Dropdown
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderUI();
    });

    // Favorites Logic
    function attachFavoriteListeners() {
        const favButtons = document.querySelectorAll(".fav-btn");
        favButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const coinId = e.currentTarget.dataset.id;
                
                if (favorites.includes(coinId)) {
                    // Remove from favorites filtering Array
                    favorites = favorites.filter(id => id !== coinId);
                } else {
                    // Add
                    favorites = [...favorites, coinId];
                }
                
                // Save to local storage (Bonus)
                localStorage.setItem("crypto_favorites", JSON.stringify(favorites));
                
                // If we are currently viewing favorites only and we un-fav something, we'd like to remove it instantly
                if(currentFilter === "favorites") {
                   renderUI(); 
                } else {
                   // Just toggle button visually to avoid re-rendering entire grid
                   const isNowFav = favorites.includes(coinId);
                   e.currentTarget.classList.toggle("active", isNowFav);
                   const icon = e.currentTarget.querySelector('i');
                   if(isNowFav) {
                       icon.style.fill = 'var(--danger)';
                   } else {
                       icon.style.fill = 'none';
                   }
                }
            });
        });
    }

    // Error Retry
    retryBtn.addEventListener("click", fetchMarketData);

    // === Theme Handling (Dark Mode) ===
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem("crypto_theme", isDark ? "dark" : "light");
    });

    function initTheme() {
        const savedTheme = localStorage.getItem("crypto_theme");
        if (savedTheme === "light") {
            document.body.classList.remove("dark-theme");
        } else {
            document.body.classList.add("dark-theme"); // Default to dark premium UI
        }
    }

    // UI Helpers
    function showLoading() {
        loadingState.classList.add("active");
        grid.innerHTML = "";
    }
    function hideLoading() {
        loadingState.classList.remove("active");
    }
    function showError() {
        errorState.classList.add("active");
    }
});
