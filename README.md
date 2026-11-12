# alijonov.uz — Terminal Portfolio

Interactive Linux terminal-style developer portfolio website for Abdulbosit Alijonov (Backend Developer). Built with React 18, Vite, CSS custom properties, and Vercel Serverless Functions.

Live URL: https://alijonov.uz

---

## Overview

alijonov.uz is a web-based desktop environment simulating an authentic Unix/Linux terminal interface. It combines tactile terminal keyboard navigation with multi-window desktop window management, command-line tools, interactive email messaging, theme switching, and easter eggs.

---

## Features

### 1. Terminal Simulation
- Interactive prompt: `root@alijonov:~#` with active directory tracking.
- Authentic block cursor with smooth character traversal and text selection.
- Full Bash Readline keybindings (`Ctrl+A`, `Ctrl+E`, `Ctrl+U`, `Ctrl+K`, `Ctrl+W`, `Ctrl+L`, `Ctrl+C`).
- Command history recall via `ArrowUp` and `ArrowDown`.
- Context-aware Tab completion and cycling for files, directories, commands, and domains.
- Native terminal output streaming without page-scroll jumps.

### 2. Multi-Window Desktop Manager
- Multiple independent terminal windows (draggable by header bar, 8-directional edge resizing).
- Window controls: Close, Minimize, Maximize / Restore (macOS-style controls).
- Window tab navigation in the bottom status bar with active and minimized indicators.
- Up to 10 concurrent terminal sessions with isolated history and execution state.
- Fallback Tux desktop state with instant restore when all windows are closed or minimized.
- Proportional mobile layout with responsive touch ergonomics.

### 3. Built-in Commands

| Command | Description |
|---|---|
| `help` | Display list of available terminal commands |
| `ls [-la]` | List directory contents |
| `cd [dir]` | Change directory (`about`, `projects`, `resume`, `contact`, `~`, `..`) |
| `cat <file.md>` | View markdown documentation files |
| `pwd` | Print current working directory path |
| `ping <host> [-c N]` | Stream realistic ICMP reply packets with RTT stats |
| `send-mail [options]` | Interactive or parameterized email wizard via Resend API |
| `whoami` | Print active shell user |
| `uname [-a]` | Display system kernel information |
| `uptime` | Show uptime and system load average |
| `date` | Print current date and time |
| `history` | Display list of executed commands |
| `clear` | Clear terminal output buffer |
| `new` / `open [dir]` | Spawn a new terminal window |
| `exit` | Close current terminal window |

### 4. Easter Eggs & Safety Safeguards
- `sudo` -> Explains that session already runs with root privileges.
- `rm`, `rm -rf`, `mkdir`, `rmdir`, `touch` -> Read-only filesystem notifications.
- `vim`, `nano` -> Read-only portfolio notifications without locking navigation.
- `shutdown`, `reboot`, `kill` -> Server 24/7 online safeguards.

### 5. Themes & Visual Effects
- 6 syntax themes: `dark`, `light`, `dracula`, `nord`, `gruvbox`, `tokyo`.
- CRT monitor scanline & phosphor glow effect.
- Systemd boot sequence simulation on first arrival.
- Quick command palette (`Ctrl+/`).

### 6. Interactive Contact & Email API
- Two modes: interactive wizard (`send-mail`) and CLI argument flags (`-n`, `-e`, `-m`).
- Backend endpoint (`/api/send`) powered by Resend API with rate limiting, duplicate protection, and input sanitization.

---

## Tech Stack

- **Frontend:** React 18, Vite 5, JavaScript (ESM)
- **Styling:** Vanilla CSS with CSS Custom Properties, JetBrains Mono font
- **Backend / Serverless:** Vercel Serverless Function (`api/send.js`), Resend API
- **Tooling:** Git, Node.js

---

## Project Structure

```
├── api/
│   └── send.js              # Serverless function for email sending (Resend API)
├── public/
│   ├── og-image.png         # Social media preview card (1200x630)
│   ├── og-image.svg         # Source vector graphic for OG image
│   ├── resume.pdf           # Downloadable curriculum vitae
│   ├── robots.txt           # Search engine crawling rules
│   └── sitemap.xml          # XML sitemap for SEO
├── src/
│   ├── App.jsx              # Core application, window manager, terminal emulator
│   ├── extras.jsx           # Themes, CRT effect, boot screen, command palette
│   ├── main.jsx             # React DOM root entry point
│   └── style.css            # Layout, terminal, themes, and responsive rules
├── index.html               # Main HTML document with SEO meta & fonts
├── package.json             # NPM dependencies and build scripts
├── vercel.json              # Vercel deployment configuration
└── vite.config.js           # Vite build config with local dev API middleware
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm (or yarn / pnpm)

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/AlijonovUz/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for local email testing):
   Create a `.env.local` file in the root directory:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. Production build:
   ```bash
   npm run build
   ```
   Output files will be generated in the `dist/` directory.

---

## Deployment

### Vercel Deployment

1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `RESEND_API_KEY`: Your Resend API secret key for the contact form.
6. Configure custom domain: `alijonov.uz`.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
