# AI Judge — Frontend

A high-end, minimalist AI comparison chat interface designed to evaluate and compare LLM solutions side-by-side with an automated judge's analysis.

![AI Judge Preview](https://img.shields.io/badge/UI-Aether%20Silk-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

- **Side-by-Side Comparison**: View multiple independent AI solutions for any coding challenge simultaneously in real-time.
- **Real-Time Streaming**: Connects via Server-Sent Events (SSE) to stream model responses instantly.
- **Authentication & Guest Mode**: Seamless Perplexity-style authentication flow alongside Guest chat support for unauthenticated users.
- **Automated Judge Analysis**: Detailed breakdown and evaluation from an AI judge, providing scores and reasoning.
- **Modern Minimalist UI**: Built with the "Aether Silk" design philosophy—clean lines, curated typography, glassmorphism, and smooth transitions.
- **Rich Markdown Support**: Full support for code snippets, lists, and formatted text using `react-markdown`.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Content Parsing**: `react-markdown`
- **Typography**: Inter (Sans) & JetBrains Mono (Code)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd langraph-comparison/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Add your frontend environment variables
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── api/          # API client and endpoints
├── components/   # Reusable UI components (ChatInput, MessageGroup, etc.)
├── hooks/        # Custom React hooks
├── lib/          # Utilities and configurations
├── pages/        # Route pages (ChatPage, LoginPage, RegisterPage, HistoryPage)
├── store/        # Zustand state stores (authStore)
├── utils/        # Helper functions
├── App.jsx       # Main application component
├── router.jsx    # Application routing configuration
├── index.css     # Design system tokens and Tailwind styles
└── main.jsx      # React DOM entry point
```

## 🎨 Design Philosophy

This project follows a **curated editorial aesthetic**:
- **Typography-first**: Prioritizing readability with Inter and JetBrains Mono.
- **Subtle Interactions**: Clean transitions and loading states for a "live" feel.
- **Intentional Spacing**: Wide margins and generous line heights to reduce cognitive load.
- **Clean Color Palette**: A sleek, focused interface built for prolonged usage.

---

Built with ❤️ for AI enthusiasts.
