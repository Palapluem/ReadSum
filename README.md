# ReadSum - AI-Powered Study Assistant 

> **"Summarize. Learn Faster."** 
> Turn anything into notes, flashcards, quizzes, and more with the power of Gemini AI.

![ReadSum Banner](https://placehold.co/1200x600/050505/FFFFFF?text=ReadSum+AI)

## 🌟 Overview
ReadSum is a modern educational platform designed to help students and professionals digest complex information instantly. By leveraging **Google's Gemini 2.0 Flash**, ReadSum can summarize documents, generate interactive quizzes, create flashcards, and even act as a live tutor via a chat interface.

## ✨ Key Features
- **AI Chat Assistant**: A "Gemini-like" fluent chat interface for querying your documents.
- **Auto-Summarization**: Upload PDFs or paste text to get instant summaries.
- **Study Aids Generation**: Automatically create:
  - 📝 **Quizzes** (Multiple Choice)
  - 🗂️ **Flashcards** (Front/Back)
  - 🎓 **Study Guides**
- **Smart Renaming**: Conversations automatically rename themselves based on context.
- **Dark Mode UI**: A premium, high-performance "Turbolearn-inspired" interface.

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & CSS Variables (for high-performance mouse tracking)
- **Icons**: Lucide React

### Backend (API & Logic)
- **Language**: [Go](https://go.dev/) (Golang)
- **Framework**: [Fiber](https://gofiber.io/) (Fast HTTP Web Framework)
- **Database**: PostgreSQL (via GORM)
- **AI Engine**: Google Gemini 2.0 Flash API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.20+)
- PostgreSQL
- Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/readsum.git
    cd readsum
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    # Configure your DB connection in config/db.go or .env (if applicable)
    go mod tidy
    go run server.go
    ```
    *Server runs on `http://localhost:8080`*

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *App runs on `http://localhost:3000`*

## 📂 Project Structure
```
ReadSum/
├── backend/            # Go Fiber Application
│   ├── handlers/       # Controllers (Chat, User, Message)
│   ├── middleware/     # Auth & Token Logic
│   ├── models/         # Database Structs (GORM)
│   ├── routes/         # API Endpoint Definitions
│   └── server.go       # Entry Point
│
└── frontend/           # Next.js Application
    ├── src/app/        # App Router Pages (Home, Chat, Login)
    ├── src/components/ # Reusable UI (SpotlightCard, MouseBackground)
    └── src/services/   # API Client (Axios)
```

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by the ReadSum Team*