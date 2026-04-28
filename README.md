# AI Judge — Frontend

A high-end, minimalist AI comparison chat interface designed to evaluate and compare LLM solutions side-by-side with an automated judge's analysis.

![AI Judge Preview](https://img.shields.io/badge/UI-Aether%20Silk-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

- **Side-by-Side Comparison**: View two independent AI solutions for any coding challenge simultaneously.
- **Automated Judge Analysis**: Each comparison includes a detailed breakdown from a "Judge" AI, providing scores and reasoning.
- **Modern Minimalist UI**: Built with the "Aether Silk" design philosophy—clean lines, curated typography, and smooth transitions.
- **Rich Markdown Support**: Full support for code snippets, lists, and formatted text using `react-markdown`.
- **Responsive & Interactive**: Glassmorphism headers, auto-scrolling message history, and elegant loading states.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Typography**: Inter (Sans) & JetBrains Mono (Code)
- **Content Parsing**: `react-markdown`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/     # UI Components (ChatInput, MessageGroup, etc.)
│   ├── App.jsx         # Main application logic and layout
│   └── App.css         # Design system tokens and global styles
└── main.jsx            # Entry point
```

## 🎨 Design Philosophy

This project follows a **curated editorial aesthetic**:
- **Typography-first**: Prioritizing readability with Inter and JetBrains Mono.
- **Subtle Interactions**: Using `animate-fade-up` and micro-animations for a "live" feel.
- **Intentional Spacing**: Wide margins and generous line heights to reduce cognitive load.
- **Clean Color Palette**: A soft `#fafafa` surface with indigo accents for a premium look.

---

Built with ❤️ for AI enthusiasts.
