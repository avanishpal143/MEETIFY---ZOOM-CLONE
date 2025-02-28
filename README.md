# MEETIFY

# MERN Stack Video Conferencing App

## Live Demo

Check out the live demo of Meetify here:   [Meetify Live Demo]([[https://meetify-zoom-clone.vercel.app/]])

## Overview
A **MERN Stack Video Conferencing App** that provides:
- **High-quality video and audio calls**
- **Secure authentication and authorization**
- **Real-time chat during video conferences**
- **Screen sharing functionality**
- **Meeting recording support**
- **User-friendly interface with a responsive design**

## Tech Stack

### Frontend:
- **React.js** - For building the user interface
- **Redux/Context API** - For state management
- **Material-UI/Tailwind CSS** - For UI styling
- **Socket.io-client** - For real-time communication
- **WebRTC** - For video and audio streaming


---

## Features

### 1. **User Authentication**
- Secure sign-up, login, and logout
- OAuth (Google, Facebook) authentication support

### 2. **Video Conferencing**
- High-quality video and audio
- Support for multiple participants
- Room-based meetings
- Screen sharing

### 3. **Real-time Chat**
- Text messaging in meetings
- Emojis, file sharing, and message reactions

### 4. **Meeting Recording**
- Record meetings and save them for future use
- Store recordings securely in cloud storage

### 5. **Responsive UI**
- Works seamlessly on desktop, tablet, and mobile

---
📦 MEETIFY
├── 📂 node_modules          # Node.js dependencies (auto-generated)
├── 📂 src
│   ├── 📂 components        # Reusable UI components
│   │   ├── 📜 Chat.tsx      # Chat component
│   │   ├── 📜 IncomingCall.tsx # Incoming call component
│   │   ├── 📜 JoinRoom.tsx  # Room joining component
│   │   └── 📜 VideoPlayer.tsx # Video player component
│   ├── 📂 context           # Context providers
│   │   └── 📜 SocketContext.tsx # Socket.io context for real-time communication
│   ├── 📜 App.tsx           # Main React application component
│   ├── 📜 index.css         # Global CSS styles
│   ├── 📜 main.tsx          # Entry point for the React app
│   ├── 📜 types.ts          # TypeScript type definitions
│   └── 📜 vite-env.d.ts     # Vite environment type definitions for TypeScript
├── 📜 .eslintrc.cjs         # ESLint configuration file
├── 📜 .gitignore           # Git ignore file
├── 📜 index.html           # HTML entry point for Vite
├── 📜 package-lock.json    # Lock file for npm dependencies
├── 📜 package.json         # Project dependencies and scripts
├── 📜 postcss.config.js    # PostCSS configuration for Tailwind CSS
├── 📜 tailwind.config.js   # Tailwind CSS configuration
├── 📜 tsconfig.app.json    # TypeScript configuration for the app
├── 📜 tsconfig.json        # Main TypeScript configuration
├── 📜 tsconfig.node.json   # TypeScript configuration for Node.js
└── 📜 vite.config.ts       # Vite configuration file (TypeScript)

## Installation & Setup

### 1. **Clone the Repository**
```sh
git clone https://[github.com/your-username/mern-video-conferencing-app.git](https://github.com/avanishpal143/MEETIFY---ZOOM-CLONE)
cd mern-video-conferencing-app
```

### 3. **Set Up Frontend**
```sh
npm install
npm run dev
```

---

## Testing

### **Unit Testing**
- **Frontend:** Jest, React Testing Library


### **Cloud Deployment (AWS/GCP)**
- **Frontend:** Deploy using Netlify / Vercel

---

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit changes (`git commit -m "Added feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## License
MIT License
