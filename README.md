# bookMoth 

**Collaborative group project built using Agile methodologies.**

A modern full-stack book discovery and personal library web application. Users can search books via Open Library API, browse new arrivals, save favorites to their personal shelf, and view detailed book information.

## Features

- **Book Search** – Real-time search powered by Open Library API
- **Personal Shelf** – Save and manage your favorite books
- **Book Details** – Rich information pages for each title
- **Responsive Design** – Clean, elegant UI with consistent design tokens
- **RESTful Backend** – Express + TypeScript + MongoDB
- **Agile Development** – Sprints, issue tracking, code reviews, CI-friendly setup

## Tech Stack

**Frontend (AnnaBook)**
- React 19 + TypeScript
- Vite
- React Router DOM
- Lucide React icons
- CSS Custom Properties (Design Tokens)

**Backend (server)**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Open Library API integration
- Rate limiting, security middleware (Helmet, CORS)

**Shared**
- TypeScript types
- Prettier + ESLint + Husky

## 📁 Project Structure
agile-group-assignment/
├── AnnaBook/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── ...
│   └── package.json
├── shared/types/          # Shared TypeScript definitions
├── DESIGN.md
└── README.md

##  Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- MongoDB (local or Atlas)

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
Frontend
Bashcd AnnaBook
npm install
npm run dev
Open http://localhost:5173