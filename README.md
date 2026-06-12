# 💚 MindSpace - Mental Health Support Platform

![MindSpace Banner](https://via.placeholder.com/1200x400/4CAF50/white?text=MindSpace+-+Mental+Health+Support)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black)](https://socket.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

![Chat Screenshot](/screenshots/chat.gif)
*Figure 1: chat 

![Mood](/screenshots/mood.png)
*Figure 2: mood

![Assessment](./screenshots/assesment.png)
*Figure 3: assessment


## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 About The Project

**MindSpace** is a full-stack mental health support platform that provides anonymous access to mental health resources, peer support, and professional help. Built with privacy and accessibility in mind, MindSpace helps users track their mood, connect with others anonymously, and find professional help when needed.

### Why I Built This

Mental health struggles affect millions of people, but many hesitate to seek help due to stigma, cost, or privacy concerns. MindSpace addresses these barriers by providing:

- **Complete anonymity** - No personal information required
- **Free access** - All core features are free
- **24/7 availability** - Support whenever you need it
- **Professional resources** - Clinically validated tools

---

## ✨ Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| 💬 **Anonymous Chat** | Real-time support chat with complete anonymity | ✅ Live |
| 📔 **Mood Journal** | Track daily moods with analytics and insights | ✅ Live |
| 📋 **PHQ-9 Assessment** | Clinically validated depression screening | ✅ Live |
| 🧘 **Mindfulness Tools** | Breathing exercises, meditation timer, grounding techniques | ✅ Live |
| 👨‍⚕️ **Therapist Directory** | Find licensed mental health professionals | ✅ Live |
| 🆘 **Crisis Resources** | One-click access to emergency support | ✅ Live |
| 📚 **Resource Library** | Articles, videos, and guides | ✅ Live |
| 📊 **Analytics Dashboard** | Visual insights into mood patterns | ✅ Live |
| 🔔 **Daily Reminders** | Push notifications for check-ins | Coming Soon |
| 🤖 **AI Support** | GPT-powered chat assistance | Coming Soon |

### Technical Features

- ✅ Real-time WebSocket communication
- ✅ RESTful API with rate limiting
- ✅ MongoDB Atlas cloud database
- ✅ JWT authentication (optional)
- ✅ Production security middleware
- ✅ Comprehensive error handling
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Compression for faster responses
- ✅ PWA support for mobile installation

---

## 🛠️ Tech Stack

### Frontend

```bash
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── Socket.io Client
├── Chart.js
├── Lucide React Icons
└── React Hook Form
```

```bash
### Backend
├── Node.js + Express
├── MongoDB + Mongoose
├── Socket.io
├── JWT (optional auth)
├── Helmet (security)
├── CORS
├── Rate Limiting
├── Compression
├── Winston (logging)
└── Morgan (HTTP logging)
```

```bash
### DevOps & Tools
├── Git & GitHub
├── MongoDB Atlas
├── Vercel (frontend)
├── Render (backend)
├── Cypress (testing)
└── Postman (API testing)
```
## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Bethelhem-Yirga/Mental-Health-Support.git
cd Mental
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../frontend-next
npm install
```

#### 4. Set up Environment Variables
#### Backend (.env):

```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT (optional)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

#### Frontend (.env.local):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### 5. Seed the Database

```bash
cd backend
npm run seed
```

#### 6. Run the Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend-next
npm run dev
```

#### 7. Open your browser

```bash
http://localhost:3000
```






