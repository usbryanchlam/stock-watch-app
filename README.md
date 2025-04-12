# 📊 Stock Watch App

A responsive React.js frontend for Stock Watch — a US stock tracking platform with OAuth2 login (Google Account) and email alerting. Users can search and watch stocks, view key info (current price, previous closing, % change), and set alerts for price conditions. This app calls "Stock-Watch-API" Spring Boot API to fetch data. Please visit [https://github.com/usbryanchlam/stock-watch-app](https://github.com/usbryanchlam/stock-watch-app) for details.

---

## ✨ Features

- 🔐 Google OAuth2 login (via Spring Boot API)
- 🎯 Watchlist management & price alerts
- 📈 Real-time stock data (via Spring Boot API)
- 🎨 Tailwind CSS for responsive design
- 🧠 Global state via Context API + `useReducer`
- 🔌 Axios with JWT token for secure API calls
- 🌐 Deployed to Azure Static Web Apps

---

## 🔧 Tech Stack

- Vite
- React 19.0.0
- Tailwind CSS 4.0.17
- React Router v6.30.0
- Axios v1.8.4
- Context API + useReducer
- Deployed on Azure Static Web App

---

## 📦 Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/your-username/stock-watch-app.git
cd stock-watch-app
npm install
```

### 2. Configure environment

Create a .env file:

```properties
# Change to https://your_spring_boot_api/api for production
VITE_API_BASE_URL=http://localhost:8080/api
# Change to https://your_spring_boot_api/oauth2/authorization/google for production
VITE_GOOGLE_OAUTH2_URL=http://localhost:8080/oauth2/authorization/google
```

### 3. Run locally

```bash
npm run dev
```

## 🧠 Context State Management

### 🔐 AuthContext

Stores user info & token:

```js
{
  id, name, email, picture, token;
}
```

### 📈 StockContext

Tracks watchlist and alert settings:

```js
{
    watchedStocks,
    lastRefreshDatetime,
    isLoading,
    queryString,
    searchResult,
    currentStock,
    stockAlert,
    error,
}
```

## 🔌 API Calls

Add Authorization: Bearer <token> to every request:

```js
axios.get(API_BASE_URL + END_POINT_WATCHLIST, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 📄 License

MIT License.
