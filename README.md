# 💰 CryptoCapstone

## 📌 Overview
CryptoCapstone is a modern, responsive web application that tracks real-time cryptocurrency data. It utilizes a public API to display live market metrics and features advanced filtering, sorting, and searching capabilities. Designed with a premium "glassmorphism" aesthetic, it supports both dark and light themes seamlessly.

## 🚀 Features
* **Real-time Data:** Fetches live cryptocurrency market data directly from the CoinGecko API.
* **Search:** Quickly find coins by name or ticker using debounced search. 
* **Filter:** View Top Gainers, Top Losers, or just your personalized "Favorites" lists.
* **Sort:** Arrange coins by Market Cap, Price, or Alphabetical Order (Ascending / Descending).
* **Favorites:** Save your favorite coins locally in your browser to check them effortlessly.
* **Premium UI:** Hand-crafted Vanilla CSS with CSS Variables, Dark Mode / Light Mode toggle, Grid Layouts, and Glassmorphism design elements.
* **Responsive State Handling:** Loading spinners and error fallback mechanisms.

## 🔗 API Used
* CoinGecko API (`/api/v3/coins/markets`)

## 🛠️ Technologies Used
* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom properties (variables), Flexbox, Grid, transitions, animations. No external UI frameworks used.
* **JavaScript (ES6+):** Async/Await for API fetching, LocalStorage, Array Higher-Order Functions (`map`, `filter`, `sort`), debouncing.
* **Lucide Icons:** Clean, modern SVG icons.

## ▶️ How to Run
1. Clone the repository locally: `git clone https://github.com/shauryanegi099/CryptoCapstone.git`
2. Open `index.html` in any modern web browser or use a tool like VS Code Live Server.
3. No API key or backend required! The app is entirely client-side.

## 📅 Project Milestones Addressed
- **Milestone 1:** Project setup, foundation, defining requirements, GitHub repo setup and this README.
- **Milestone 2:** API integration, responsive visual grid structure, and handling of loading states.
- **Milestone 3 (Core Features):** Added search, custom filtering (gainers/losers/favorites), dynamic sorting, dark mode toggling, using pure Array Higher-Order Functions as per requirements.
- **Milestone 4:** Full documentation via README, refactored and cleanly written modular vanilla codebase.

## 🌟 Bonus Features Implemented
- **Debouncing:** Applied to the search input to limit excessive execution and repetitive API lookups.
- **Throttling:** Implemented on the window scroll event for a high-performance "Scroll to Top" button.
- **Pagination:** Structured large data sets into manageable pages for better performance and UX.
- **Local Storage:** Used for saving user preferences such as Dark Mode theme and Favorite Coins.
- **Loading Indicators:** A visual spinner gives immediate feedback during data fetch cycles.
- **Progressive Web App (PWA):** Fully installable with offline support via Service Workers and a Manifest file.

## 🫂 Author
prathem verma
