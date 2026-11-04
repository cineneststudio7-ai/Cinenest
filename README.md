# CineNest Studio — Where Imagination Becomes Animation

Autonomous 3D CGI cartoon series production platform and Hollywood-quality animation management system. CineNest Studio produces 105 episodes in Disney-Pixar style (720p 3D CGI, 330 seconds exact runtime) featuring **Rutti & Putti** alongside **Puchu & Puku**, integrated with US Pre-K early childhood education curriculum, coworker encouragement stickers, and an autonomous multi-platform social media distribution engine.

---

## 🌟 Project Highlights

- **Visual Identity:** 100% faithful recreation of the CineNest Studio production artwork and branding.
- **Characters:**
  - **Rutti & Putti:** Sisters, friends forever, exploring Bangladesh courtyards and beyond.
  - **Robo-C & Neel Bird:** High-tech companion and cheerful guide.
  - **Puchu & Puku:** Toddler baby girl with curly brown pigtails & green ribbons, paired with her smiling ceramic mug companion whose heart glows warm golden-pink.
- **105-Episode Continuity Bible:** Strict 330-second timeline (20s Opening, 240s Adventure/Rhyme, 40s Lesson/Glow, 30s Outro/Cliffhanger).
- **Super Admin Control Center:** Full-authority administrative suite for primary owner (`cinenest.studio7@gmail.com`).
- **Runway Video Pipeline:** Generation readiness for 3D CGI video shots with seed locking and camera parameters.
- **Google Drive Cloud Sync:** Structured production asset organization (`CineNest Studio Production/...`).
- **Social Cut Agent:** Autonomous multi-ratio video framing (9:16 Vertical Shorts, 16:9 Master, 1:1 Square) with dynamic punchy subtitles.
- **Strict Approval Engine:** Zero unvetted posts or replies; all social publishing requires Super Admin sign-off.
- **Encrypted Local Storage:** PBKDF2 + AES-GCM 256-bit client-side encryption for personal production notes and favorites.

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# Or run with tsx backend:
npx tsx server.ts
```

The application runs on `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

See `.env.example`:
- `GEMINI_API_KEY`: API key for Gemini 2.5/3.8 Flash model calls.
- `RUNWAY_API_KEY`: API key for Runway Gen-2/Gen-3 video generation.
- `APP_URL`: Service hosting URL.

---

## 👑 Super Admin Access

- **Owner Email:** `cinenest.studio7@gmail.com`
- Super Admin dashboard accessible via the navigation header or **Login Modal** with the Super Admin credentials.
