# Impact Auto — Automotive Repair & Restoration Showcase

A high-performance, responsive web showcase designed for automotive collision repair, body restoration, and spray booth paintwork facilities.

Built with lightweight semantic HTML5, modern CSS custom properties, and vanilla ES modules powered by Vite for instant development and optimized static delivery.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or newer)

### Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (with instant hot reload)
npm run dev
```
Open **`http://localhost:3000`** in your browser. Any edits to HTML, CSS, or JS reflect instantly without manual refreshing.

### Production Build
```bash
# Build optimized static bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Fast Customization Guide

To adapt this codebase for a new client or shop location in under 15 minutes:

### 1. Branding & Colors (`style.css`)
Open `style.css` and modify the root design tokens at the top:
```css
:root {
  --red: #d73532;       /* Primary Accent (Badges, Buttons, Timeline) */
  --blue: #113a57;      /* Form Section Background & Highlights */
  --ink: #101518;       /* Dark Backgrounds */
  --paper: #f4f2eb;     /* Light Warm Backgrounds */
}
```

### 2. Business Details (`index.html`)
* **Header & Footer Wordmark:** Update the `AUTOMOVERS` brand text in `<header>` and `<footer>`.
* **Location & Coverage:** Update city and region in `.hero-service` and `.about-location`.
* **Social & Phone Contact:** Update phone number format in `#estimate-form` and social links in `<section class="about">` and `<section class="location">`.

### 3. Estimate Form Backend
The estimate form currently processes submissions and photo validation locally for demonstration previews. To connect it to real email notifications or CRM webhook:
* In `index.html`, add your endpoint URL:
  ```html
  <form id="estimate-form" action="https://api.web3forms.com/submit" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
  ```

---

## 📁 Project Architecture

```text
├── assets/                  # High-resolution WebP and photography assets
│   ├── innova-before.webp   # Featured Case 01: Damage photo
│   ├── innova-after.webp    # Featured Case 01: Restored photo
│   ├── utility-before.webp  # Hero & Supporting Case 02: Damage
│   ├── utility-after.webp   # Hero & Supporting Case 02: Restored
│   ├── van-before.webp      # Supporting Case 03: Damage
│   ├── van-after.webp       # Supporting Case 03: Restored (with privacy censor)
│   ├── van-bodywork.webp    # Teardown & bodywork photo
│   ├── workshop-booth.jpg   # Spray booth facility photo
│   └── manrope-*.ttf        # Variable typography
├── index.html               # Main single-page application structure
├── style.css                # Modular design system and responsive styles
├── app.js                   # Interactive logic (Before/After toggle, timeline, upload preview)
├── package.json             # Vite dev server and build scripts
└── .gitignore               # Excludes node_modules and build artifacts
```

---

## 🌐 1-Click Deployment

* **Netlify:** Drag and drop the project folder directly to [app.netlify.com/drop](https://app.netlify.com/drop).
* **Vercel:** Run `npx vercel` or connect your GitHub repository for automated deployment.
* **GitHub Pages:** Push to GitHub and enable Pages in repository settings pointing to `/` or `/dist`.
