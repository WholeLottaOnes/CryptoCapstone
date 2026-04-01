const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const cryptoContainer = document.getElementById('crypto-container');
const cryptoGrid = document.getElementById('crypto-grid');
const retryBtn = document.getElementById('retry-btn');

let cryptoData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();

    retryBtn.addEventListener('click', () => {
        errorContainer.classList.add('hidden');
        loadingContainer.classList.remove('hidden');
        fetchCryptoData();
    });
});

async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        cryptoData = data;

        loadingContainer.classList.add('hidden');
        cryptoContainer.classList.remove('hidden');

        renderCryptoCards(cryptoData);

    } catch (error) {
        console.error('Error fetching crypto data:', error);
        loadingContainer.classList.add('hidden');
        errorContainer.classList.remove('hidden');
    }
}

function renderCryptoCards(data) {
    cryptoGrid.innerHTML = '';

    data.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full';

        const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500';
        const priceChangeIcon = coin.price_change_percentage_24h >= 0 ? '▲' : '▼';

        const currentPrice = formatCurrency(coin.current_price);
        const marketCap = formatCompactNumber(coin.market_cap);
        const priceChange = Math.abs(coin.price_change_percentage_24h).toFixed(2) + '%';

        card.innerHTML = `
            <div class="p-5 flex-grow">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <img src="${coin.image}" alt="${coin.name}" class="w-10 h-10 object-contain">
                        <div>
                            <h2 class="font-bold text-lg leading-tight">${coin.name}</h2>
                            <span class="text-sm text-gray-500 uppercase font-medium">${coin.symbol}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <p class="text-gray-500 text-sm mb-1">Price</p>
                    <p class="text-2xl font-bold">${currentPrice}</p>
                </div>
                
                <div class="flex justify-between items-end">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">24h Change</p>
                        <p class="font-medium ${priceChangeClass} flex items-center gap-1">
                            <span>${priceChangeIcon}</span> ${priceChange}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-500 text-sm mb-1">Market Cap</p>
                        <p class="font-medium text-gray-700">${marketCap}</p>
                    </div>
                </div>
            </div>
        `;

        cryptoGrid.appendChild(card);
    });
}

function formatCurrency(value) {
    if (value < 0.01) {
        return '$' + value.toFixed(6);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatCompactNumber(value) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value);
}
