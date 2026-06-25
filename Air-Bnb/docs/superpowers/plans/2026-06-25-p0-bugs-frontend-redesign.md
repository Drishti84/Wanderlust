# P0 Bugs + Dark Luxury Frontend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 9 active bugs and completely redesign the Wanderlust frontend to a dark luxury aesthetic with glassmorphism cards, gold accents, and Playfair Display typography.

**Architecture:** Deep CSS override — Bootstrap grid/layout is kept, but every visual default is overridden via CSS custom properties. All inline `<style>` blocks are removed from EJS files and consolidated into `style.css`. No schema changes, no new backend routes.

**Tech Stack:** Node.js/Express, EJS + ejs-mate, Bootstrap 5.3, custom CSS (CSS variables), Font Awesome 6, Google Fonts (Playfair Display + Inter)

## Global Constraints

- Do NOT add new npm packages — use only existing dependencies
- Do NOT change any route, model schema, or controller logic beyond the bug fixes listed
- All CSS goes into `public/css/style.css` — no inline `<style>` blocks in EJS files
- Keep Bootstrap classes for grid (`row`, `col-*`, `container-fluid`) — override only visuals
- Google Fonts loaded via `<link>` in `boilerplate.ejs`, no local font files
- Working directory for all commands: `C:/Users/admin/Desktop/projects/New folder/Air-Bnb/Air-Bnb`

---

### Task 1: Fix all P0 bugs (non-visual files)

**Files:**
- Modify: `models/review.js`
- Modify: `middleware.js`
- Modify: `controllers/users.js`
- Modify: `cloudConfig.js`

**Interfaces:**
- Produces: correct `Date.now` default, working `validateReview`, correct `next` params, correct `allowedFormats` array

- [ ] **Step 1: Fix `Date.now()` in review schema**

In `models/review.js`, line 13, change `Date.now()` to `Date.now` (remove parentheses — `Date.now` is a reference to the function, called per-document; `Date.now()` is evaluated once at server start):

```js
// models/review.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now   // ← no parentheses
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Reviews", reviewSchema);
```

- [ ] **Step 2: Fix `validateReview` in middleware.js**

The current code has no `throw` on error, so bad reviews pass silently. Add the throw:

```js
// middleware.js — replace the validateReview function
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};
```

- [ ] **Step 3: Fix `next` missing in users controller**

`signup` and `logout` reference `next` but never declare it. Add it to both signatures:

```js
// controllers/users.js — full file replacement
const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully.");
        res.redirect("/listings");
    });
};
```

- [ ] **Step 4: Fix `allowedFormats` in cloudConfig.js**

The comma operator in `('png','jpg','jpeg')` returns only `'jpeg'`. Change to a proper array:

```js
// cloudConfig.js — full file replacement
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_dev',
        allowed_formats: ['png', 'jpg', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };
```

- [ ] **Step 5: Remove console.log leaks in listing controller**

In `controllers/listing.js`, remove the three `console.log` statements:
- Line 26: `console.log(listing);` → delete
- Line 72: `console.log(deletedListing);` → delete

- [ ] **Step 6: Remove console.log leak in middleware**

In `middleware.js` line 7, remove `console.log(req.user);`

- [ ] **Step 7: Verify the app still starts**

```bash
node app.js
```

Expected output:
```
✅ MongoDB connected
🚀 Server listening on 8080
```

No crashes. Navigate to `http://localhost:8080/listings` — page loads.

- [ ] **Step 8: Commit bug fixes**

```bash
git add models/review.js middleware.js controllers/users.js controllers/listing.js cloudConfig.js
git commit -m "fix: P0 bugs — Date.now ref, validateReview throws, next params, allowedFormats array, remove console.log leaks"
```

---

### Task 2: CSS Design System — Full `style.css` Rewrite

**Files:**
- Modify: `public/css/style.css` (full rewrite)
- Modify: `public/css/rating.css` (dark overrides appended)

**Interfaces:**
- Produces: CSS custom properties used by all EJS files, all utility classes (`btn-gold`, `btn-ghost`, `btn-danger-ghost`, `glass-card`, `wl-navbar`, `listing-card`, `auth-layout`, `form-card`, `show-layout`, `booking-card`, `review-card`, `filter-pill`, `wl-footer`, `flash-success`, `flash-error`, `error-page`)

- [ ] **Step 1: Replace `public/css/style.css` with the full design system**

Replace the entire file with:

```css
/* ============================================================
   1. CSS Custom Properties
   ============================================================ */
:root {
  --bg-primary:    #0D0D0D;
  --bg-card:       #1A1A1A;
  --bg-elevated:   #242424;
  --accent-gold:   #D4AF37;
  --accent-muted:  #8B7522;
  --text-primary:  #F5F5F0;
  --text-secondary:#9A9A8E;
  --border:        rgba(212, 175, 55, 0.15);
  --glass-bg:      rgba(26, 26, 26, 0.7);
  --radius-card:   16px;
  --radius-btn:    8px;
  --radius-input:  8px;
}

/* ============================================================
   2. Base Resets
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  margin: 0;
}

.container, .container-fluid { flex: 1; }
a { color: inherit; text-decoration: none; }
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  color: var(--text-primary);
}

/* ============================================================
   3. Bootstrap Overrides
   ============================================================ */
.form-control, .form-select {
  background-color: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-primary) !important;
  border-radius: var(--radius-input) !important;
  padding: 0.75rem 1rem !important;
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.35) !important;
  border-color: var(--accent-gold) !important;
  background-color: var(--bg-card) !important;
  color: var(--text-primary) !important;
}

.form-control::placeholder { color: var(--text-secondary) !important; }

textarea.form-control { min-height: 120px; resize: vertical; }

.form-label {
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

.form-check-input:checked {
  background-color: var(--accent-gold) !important;
  border-color: var(--accent-gold) !important;
}

.dropdown-menu {
  background-color: var(--bg-elevated) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-card) !important;
  padding: 0.5rem;
}

.dropdown-item {
  color: var(--text-primary) !important;
  font-size: 0.9rem;
  border-radius: 8px;
}

.dropdown-item:hover, .dropdown-item:focus {
  background-color: rgba(212, 175, 55, 0.1) !important;
  color: var(--accent-gold) !important;
}

.dropdown-divider { border-color: var(--border) !important; }

/* ============================================================
   4. Button Variants
   ============================================================ */
.btn-gold {
  background-color: var(--accent-gold);
  color: #0D0D0D;
  border: none;
  border-radius: var(--radius-btn);
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  padding: 0.65rem 1.5rem;
  transition: background-color 0.2s ease, transform 0.1s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-gold:hover {
  background-color: var(--accent-muted);
  color: #0D0D0D;
  transform: translateY(-1px);
}

.btn-ghost {
  background-color: transparent;
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  border-radius: var(--radius-btn);
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  padding: 0.65rem 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-ghost:hover {
  background-color: rgba(212, 175, 55, 0.1);
  color: var(--accent-gold);
}

.btn-danger-ghost {
  background-color: transparent;
  border: 1px solid rgba(220, 53, 69, 0.4);
  color: #f87171;
  border-radius: var(--radius-btn);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  padding: 0.4rem 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-danger-ghost:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #f87171;
}

/* ============================================================
   5. Navbar
   ============================================================ */
.wl-navbar {
  background-color: rgba(17, 17, 17, 0.96);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  height: 5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.wl-navbar-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.wl-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--accent-gold) !important;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}

.wl-brand i { font-size: 1.5rem; color: var(--accent-gold); }

.wl-search {
  flex: 1;
  max-width: 400px;
  margin: 0 1.5rem;
}

.wl-search .form-control {
  border-radius: 50px !important;
  padding: 0.5rem 1.25rem !important;
  background-color: var(--bg-elevated) !important;
}

.wl-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
  flex-shrink: 0;
}

.nav-link-wl {
  color: var(--text-secondary) !important;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  white-space: nowrap;
}

.nav-link-wl:hover { color: var(--text-primary) !important; }

.avatar-circle {
  width: 36px;
  height: 36px;
  background-color: var(--accent-gold);
  color: #0D0D0D;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  padding: 0;
}

.mobile-nav-panel {
  position: absolute;
  top: 5rem;
  left: 0;
  right: 0;
  background: rgba(17, 17, 17, 0.98);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  z-index: 999;
}

.mobile-toggler {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: var(--radius-btn);
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  flex-shrink: 0;
}

/* ============================================================
   6. Filter Bar (Index Page)
   ============================================================ */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 1.5rem 0 0.75rem;
  scrollbar-width: none;
}

.filter-bar::-webkit-scrollbar { display: none; }

.filter-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--border);
  border-radius: 50px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.72rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: 72px;
  font-family: 'Inter', sans-serif;
}

.filter-pill i { font-size: 1.1rem; }

.filter-pill:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.07);
}

.tax-toggle-wrapper {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* ============================================================
   7. Listing Cards (Index Grid)
   ============================================================ */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 0 3rem;
}

@media (max-width: 991px) { .listings-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 575px) { .listings-grid { grid-template-columns: 1fr; } }

.listing-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  text-decoration: none;
  color: var(--text-primary);
  display: block;
}

.listing-card:hover {
  transform: translateY(-5px);
  border-color: rgba(212, 175, 55, 0.45);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: var(--text-primary);
}

.listing-card-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.listing-card-body { padding: 1rem 1.15rem 1.15rem; }

.listing-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.listing-card-location {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.listing-card-price {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.listing-card-price .per-night {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 0.82rem;
}

.tax-info {
  display: none;
  font-size: 0.72rem;
  color: var(--text-secondary);
}

/* ============================================================
   8. Show Page — Two-Column Layout
   ============================================================ */
.show-layout {
  display: grid;
  grid-template-columns: 60% 1fr;
  gap: 2.5rem;
  padding: 2.5rem 0 4rem;
  align-items: start;
}

@media (max-width: 768px) {
  .show-layout { grid-template-columns: 1fr; }
  .show-right { order: -1; }
}

.show-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin-bottom: 0.4rem;
  line-height: 1.2;
}

.show-owner {
  color: var(--text-secondary);
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
}

.show-owner .owner-name {
  color: var(--accent-gold);
  font-weight: 500;
}

.show-hero {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius-card);
  margin-bottom: 1.75rem;
  display: block;
}

.show-description {
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.show-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.show-meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.show-meta-item i { color: var(--accent-gold); }

.show-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 1.75rem;
  color: var(--text-primary);
}

.show-price small {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.show-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

/* Right panel — booking card */
.booking-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 1.75rem;
  position: sticky;
  top: 6.5rem;
}

.booking-card-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.booking-card-price small {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.booking-coming-soon {
  border: 1px dashed var(--border);
  border-radius: var(--radius-btn);
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.82rem;
  margin: 1.25rem 0;
}

.booking-divider { border-top: 1px solid var(--border); margin: 1.5rem 0; }

/* Review form inside booking card */
.review-form-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

/* Reviews section (full width below) */
.reviews-section { padding: 1rem 0 3rem; }

.reviews-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.review-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.review-author {
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: 0.15rem;
  font-size: 0.95rem;
}

.review-date {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
}

.review-comment {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.review-actions { display: flex; justify-content: flex-end; }

/* ============================================================
   9. Form Pages (New / Edit Listing)
   ============================================================ */
.form-page {
  min-height: calc(100vh - 5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.form-card {
  width: 100%;
  max-width: 680px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 2.5rem;
}

.form-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.form-card-subtitle {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 2rem;
}

.image-preview-thumb {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  display: none;
  margin-top: 0.75rem;
}

.current-image-label {
  font-size: 0.72rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.current-image-thumb {
  height: 110px;
  border-radius: var(--radius-btn);
  border: 1px solid var(--border);
  object-fit: cover;
  display: block;
  margin-bottom: 1rem;
}

/* ============================================================
   10. Auth Pages (Login / Signup)
   ============================================================ */
.auth-layout {
  min-height: calc(100vh - 5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
  .auth-layout { grid-template-columns: 1fr; }
  .auth-image { display: none; }
}

.auth-image {
  background-image: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  min-height: 400px;
}

.auth-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,13,13,0.5), rgba(212,175,55,0.08));
}

.auth-image-text {
  position: absolute;
  bottom: 2.5rem;
  left: 2.5rem;
  color: #fff;
  z-index: 1;
}

.auth-image-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.auth-image-text p {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: var(--bg-primary);
}

.auth-form-inner { width: 100%; max-width: 400px; }

.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.88rem;
  margin-bottom: 2rem;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.auth-switch a { color: var(--accent-gold); font-weight: 500; }

/* ============================================================
   11. Footer
   ============================================================ */
.wl-footer {
  background-color: #111;
  border-top: 1px solid var(--border);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--accent-gold);
  font-weight: 700;
}

.footer-copy {
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.footer-socials { display: flex; gap: 1rem; }
.footer-socials i {
  font-size: 1.1rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.footer-socials i:hover { color: var(--accent-gold); }

.footer-links { display: flex; gap: 1.25rem; }
.footer-links a {
  color: var(--text-secondary);
  font-size: 0.78rem;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover { color: var(--accent-gold); }

/* ============================================================
   12. Flash Messages
   ============================================================ */
.flash-success {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--accent-gold);
  border-radius: var(--radius-btn);
  padding: 0.85rem 1.25rem;
  margin: 0.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.flash-error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #f87171;
  border-radius: var(--radius-btn);
  padding: 0.85rem 1.25rem;
  margin: 0.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.flash-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.6;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
  margin-left: 1rem;
  flex-shrink: 0;
}

.flash-close:hover { opacity: 1; }

/* ============================================================
   13. Error Page
   ============================================================ */
.error-page {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
}

.error-code {
  font-family: 'Playfair Display', serif;
  font-size: 7rem;
  font-weight: 700;
  color: var(--accent-gold);
  line-height: 1;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.error-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
}

.error-body {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 380px;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ============================================================
   14. Utilities
   ============================================================ */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
}

.text-gold { color: var(--accent-gold) !important; }
.text-muted-wl { color: var(--text-secondary) !important; }
.divider { border-top: 1px solid var(--border); margin: 1.5rem 0; }
.w-full { width: 100%; }
```

- [ ] **Step 2: Append dark-mode overrides to `public/css/rating.css`**

Open `public/css/rating.css`, scroll to the very end, and append:

```css
/* Dark theme overrides for starability */
.starability-slot > label,
.starability-result::before,
.starability-slot > label::before {
  color: var(--accent-gold, #D4AF37) !important;
}
```

- [ ] **Step 3: Verify CSS loads without errors**

Start the server: `node app.js`
Open `http://localhost:8080/listings` in browser.
Open DevTools → Console tab — no CSS errors. Page background should now be `#0D0D0D` (near-black). Bootstrap default white is gone.

- [ ] **Step 4: Commit**

```bash
git add public/css/style.css public/css/rating.css
git commit -m "style: full CSS rewrite — dark luxury design system with CSS custom properties"
```

---

### Task 3: Boilerplate + Navbar + Footer + Flash

**Files:**
- Modify: `views/layouts/boilerplate.ejs`
- Modify: `views/includes/navbar.ejs`
- Modify: `views/includes/footer.ejs`
- Modify: `views/includes/flash.ejs`

**Interfaces:**
- Consumes: CSS classes from Task 2 (`wl-navbar`, `wl-brand`, `wl-search`, `wl-nav-actions`, `btn-gold`, `btn-ghost`, `nav-link-wl`, `avatar-circle`, `wl-footer`, `flash-success`, `flash-error`)
- Produces: consistent dark shell rendered on every page

- [ ] **Step 1: Update `views/layouts/boilerplate.ejs`**

Add Google Fonts, keep Bootstrap and Font Awesome links:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wanderlust</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="/css/rating.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <%- include("../includes/navbar.ejs") %>

    <div class="container" style="max-width: 1200px; padding: 0 1.5rem;">
        <%- include("../includes/flash.ejs") %>
        <%- body %>
    </div>

    <%- include("../includes/footer.ejs") %>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="/js/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Rewrite `views/includes/navbar.ejs`**

Replace the entire file (fix broken nested divs, remove inline style block):

```html
<nav class="wl-navbar">
  <div class="wl-navbar-inner">

    <!-- Brand -->
    <a class="wl-brand" href="/listings">
      <i class="fa-solid fa-compass"></i>
      Wanderlust
    </a>

    <!-- Search (hidden on mobile) -->
    <div class="wl-search d-none d-md-block">
      <form action="/listings" method="GET">
        <input class="form-control" type="search" name="q" placeholder="Search destinations...">
      </form>
    </div>

    <!-- Right-side actions -->
    <div class="wl-nav-actions">
      <a href="/listings/new" class="btn-ghost d-none d-md-inline-flex">
        <i class="fa-solid fa-plus"></i> Add Listing
      </a>

      <% if(!currUser) { %>
        <a href="/login" class="nav-link-wl d-none d-md-inline">Login</a>
        <a href="/signup" class="btn-gold">Sign Up</a>
      <% } else { %>
        <div class="dropdown">
          <button class="avatar-circle dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <%= currUser.username.charAt(0).toUpperCase() %>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <span class="dropdown-item-text text-muted-wl" style="font-size:0.75rem; padding:0.5rem 1rem; display:block;">
                @<%= currUser.username %>
              </span>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/listings/new"><i class="fa-solid fa-plus me-2"></i>Add Listing</a></li>
            <li><a class="dropdown-item" href="/logout"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout</a></li>
          </ul>
        </div>
      <% } %>

      <!-- Mobile toggler -->
      <button class="mobile-toggler d-md-none" onclick="toggleMobileNav()" aria-label="Toggle menu">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>

  </div>

  <!-- Mobile dropdown panel -->
  <div class="mobile-nav-panel d-md-none" id="mobileNavPanel" style="display:none !important;">
    <form action="/listings" method="GET" class="mb-3">
      <input class="form-control" type="search" name="q" placeholder="Search destinations...">
    </form>
    <a href="/listings/new" class="nav-link-wl d-block py-2 border-bottom" style="border-color: var(--border) !important;">
      <i class="fa-solid fa-plus me-2"></i>Add Listing
    </a>
    <% if(!currUser) { %>
      <a href="/login" class="nav-link-wl d-block py-2">Login</a>
      <a href="/signup" class="nav-link-wl d-block py-2">Sign Up</a>
    <% } else { %>
      <a href="/logout" class="nav-link-wl d-block py-2">
        <i class="fa-solid fa-right-from-bracket me-2"></i>Logout (@<%= currUser.username %>)
      </a>
    <% } %>
  </div>
</nav>
```

- [ ] **Step 3: Rewrite `views/includes/footer.ejs`**

```html
<footer class="wl-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <i class="fa-solid fa-compass me-2"></i>Wanderlust
    </div>
    <div class="footer-copy">&copy; 2026 Wanderlust Private Limited</div>
    <div class="footer-socials">
      <i class="fa-brands fa-facebook"></i>
      <i class="fa-brands fa-square-instagram"></i>
      <i class="fa-brands fa-linkedin"></i>
    </div>
    <div class="footer-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: Rewrite `views/includes/flash.ejs`**

Replace Bootstrap alert with custom dark flash using classes from Task 2:

```html
<% if(success && success.length) { %>
  <div class="flash-success" role="alert">
    <span><i class="fa-solid fa-circle-check me-2"></i><%= success %></span>
    <button class="flash-close" onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
  </div>
<% } %>

<% if(error && error.length) { %>
  <div class="flash-error" role="alert">
    <span><i class="fa-solid fa-circle-exclamation me-2"></i><%= error %></span>
    <button class="flash-close" onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
  </div>
<% } %>
```

- [ ] **Step 5: Verify in browser**

Start: `node app.js`. Open `http://localhost:8080/listings`.

Check:
- Dark navbar with gold "Wanderlust" brand name visible
- Search bar centered in navbar (desktop)
- Footer dark with gold brand
- No Bootstrap white navbar visible

- [ ] **Step 6: Commit**

```bash
git add views/layouts/boilerplate.ejs views/includes/navbar.ejs views/includes/footer.ejs views/includes/flash.ejs
git commit -m "style: dark navbar, footer, flash messages, add Google Fonts to boilerplate"
```

---

### Task 4: Index Page Redesign

**Files:**
- Modify: `views/listings/index.ejs`

**Interfaces:**
- Consumes: `allListings` array (each has `_id`, `title`, `image.url`, `price`, `location`, `country`)
- Consumes CSS: `filter-bar`, `filter-pill`, `tax-toggle-wrapper`, `listings-grid`, `listing-card`, `listing-card-img`, `listing-card-body`, `listing-card-title`, `listing-card-location`, `listing-card-price`, `tax-info`

- [ ] **Step 1: Replace `views/listings/index.ejs`**

Remove inline `<style>` block, remove Bootstrap card classes, use new grid and card classes:

```ejs
<% layout("/layouts/boilerplate") %>

<!-- Filter Bar -->
<div class="filter-bar">
  <button class="filter-pill" data-category="trending">
    <i class="fa-solid fa-fire"></i>
    <span>Trending</span>
  </button>
  <button class="filter-pill" data-category="rooms">
    <i class="fa-solid fa-bed"></i>
    <span>Rooms</span>
  </button>
  <button class="filter-pill" data-category="cities">
    <i class="fa-solid fa-mountain-city"></i>
    <span>Iconic Cities</span>
  </button>
  <button class="filter-pill" data-category="mountains">
    <i class="fa-solid fa-mountain"></i>
    <span>Mountains</span>
  </button>
  <button class="filter-pill" data-category="castles">
    <i class="fa-brands fa-fort-awesome"></i>
    <span>Castles</span>
  </button>
  <button class="filter-pill" data-category="pools">
    <i class="fa-solid fa-person-swimming"></i>
    <span>Amazing Pools</span>
  </button>
  <button class="filter-pill" data-category="camping">
    <i class="fa-solid fa-campground"></i>
    <span>Camping</span>
  </button>
  <button class="filter-pill" data-category="farms">
    <i class="fa-solid fa-tractor"></i>
    <span>Farms</span>
  </button>
  <button class="filter-pill" data-category="arctic">
    <i class="fa-solid fa-snowflake"></i>
    <span>Arctic</span>
  </button>
  <button class="filter-pill" data-category="domes">
    <i class="fa-solid fa-landmark-dome"></i>
    <span>Domes</span>
  </button>
  <button class="filter-pill" data-category="boating">
    <i class="fa-solid fa-sailboat"></i>
    <span>Boating</span>
  </button>

  <div class="tax-toggle-wrapper">
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" type="checkbox" role="switch" id="taxSwitch">
      <label class="form-check-label" for="taxSwitch" style="color: var(--text-secondary); font-size: 0.78rem;">Show total with taxes</label>
    </div>
  </div>
</div>

<!-- Listings Grid -->
<div class="listings-grid">
  <% for(let listing of allListings) { %>
    <a href="/listings/<%= listing._id %>" class="listing-card">
      <img
        src="<%= listing.image.url %>"
        class="listing-card-img"
        alt="<%= listing.title %>"
        loading="lazy"
      >
      <div class="listing-card-body">
        <div class="listing-card-title"><%= listing.title %></div>
        <div class="listing-card-location">
          <i class="fa-solid fa-location-dot me-1" style="color: var(--accent-gold); font-size: 0.75rem;"></i>
          <%= listing.location %>, <%= listing.country %>
        </div>
        <div class="listing-card-price">
          &#8377;<%= listing.price.toLocaleString('en-IN') %>
          <span class="per-night">/ night</span>
          <i class="tax-info">&nbsp;+18% GST</i>
        </div>
      </div>
    </a>
  <% } %>
</div>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:8080/listings`.

Check:
- Dark background, glassmorphism cards visible
- Cards show title, location with gold pin icon, price / night
- Filter pills row is horizontally scrollable
- Card hover lifts the card upward
- Tax toggle shows/hides GST line

- [ ] **Step 3: Commit**

```bash
git add views/listings/index.ejs
git commit -m "style: index page — dark glassmorphism listing cards, filter pill bar"
```

---

### Task 5: Show Page Redesign + Bug Fixes

**Files:**
- Modify: `views/listings/show.ejs`

**Interfaces:**
- Consumes: `listing` object (with `.title`, `.image.url`, `.owner.username`, `.description`, `.price`, `.location`, `.country`, `.reviews[]`, `.owner._id`)
- Consumes: `currUser` (may be null)
- Consumes CSS: `show-layout`, `show-left`, `show-right`, `show-title`, `show-hero`, `show-owner`, `show-description`, `show-meta`, `show-price`, `show-actions`, `booking-card`, `review-card`, `reviews-section`
- Fixes: review delete shown only to author, hardcoded "Rated: 3 stars" text removed, delete confirm dialog added

- [ ] **Step 1: Replace `views/listings/show.ejs`**

```ejs
<% layout("/layouts/boilerplate") %>

<div class="show-layout">

  <!-- LEFT: Listing details -->
  <div class="show-left">
    <img src="<%= listing.image.url %>" class="show-hero" alt="<%= listing.title %>">

    <h1 class="show-title"><%= listing.title %></h1>
    <p class="show-owner">
      Hosted by <span class="owner-name">@<%= listing.owner.username %></span>
    </p>

    <p class="show-description"><%= listing.description %></p>

    <div class="show-meta">
      <div class="show-meta-item">
        <i class="fa-solid fa-location-dot"></i>
        <%= listing.location %>
      </div>
      <div class="show-meta-item">
        <i class="fa-solid fa-earth-americas"></i>
        <%= listing.country %>
      </div>
    </div>

    <div class="show-price">
      &#8377;<%= listing.price.toLocaleString('en-IN') %>
      <small>/ night</small>
    </div>

    <% if(currUser && currUser._id.equals(listing.owner._id)) { %>
      <div class="show-actions">
        <a href="/listings/<%= listing._id %>/edit" class="btn-ghost">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </a>
        <form method="POST" action="/listings/<%= listing._id %>?_method=DELETE" onsubmit="return confirmDelete()">
          <button type="submit" class="btn-danger-ghost">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </form>
      </div>
    <% } %>
  </div>

  <!-- RIGHT: Booking card + Review form -->
  <div class="show-right">
    <div class="booking-card">
      <div class="booking-card-price">
        &#8377;<%= listing.price.toLocaleString('en-IN') %>
        <small>/ night</small>
      </div>

      <div class="booking-coming-soon">
        <i class="fa-regular fa-calendar me-2"></i>
        Booking coming soon — check availability
      </div>

      <div class="booking-divider"></div>

      <% if(currUser) { %>
        <h5 class="review-form-title">Leave a Review</h5>
        <form class="needs-validation" action="/listings/<%= listing.id %>/reviews" method="POST" novalidate>

          <div class="mb-3">
            <label class="form-label">Your Rating</label>
            <fieldset class="starability-slot">
              <input type="radio" id="no-rate" class="input-no-rate" name="review[rating]" value="1" checked aria-label="No rating." />
              <input type="radio" id="first-rate1" name="review[rating]" value="1" />
              <label for="first-rate1" title="Terrible">1 star</label>
              <input type="radio" id="first-rate2" name="review[rating]" value="2" />
              <label for="first-rate2" title="Not good">2 stars</label>
              <input type="radio" id="first-rate3" name="review[rating]" value="3" />
              <label for="first-rate3" title="Average">3 stars</label>
              <input type="radio" id="first-rate4" name="review[rating]" value="4" />
              <label for="first-rate4" title="Very good">4 stars</label>
              <input type="radio" id="first-rate5" name="review[rating]" value="5" />
              <label for="first-rate5" title="Amazing">5 stars</label>
            </fieldset>
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea name="review[comment]" id="comment" rows="3" class="form-control" required placeholder="Share your experience..."></textarea>
            <div class="invalid-feedback">Please write a comment before submitting.</div>
          </div>

          <button type="submit" class="btn-gold w-full">Submit Review</button>
        </form>
      <% } else { %>
        <p style="color: var(--text-secondary); font-size: 0.88rem; text-align: center;">
          <a href="/login" style="color: var(--accent-gold);">Log in</a> to leave a review.
        </p>
      <% } %>
    </div>
  </div>

</div>

<!-- Reviews Section (full width below the grid) -->
<div class="reviews-section">
  <% if(listing.reviews.length > 0) { %>
    <h3 class="reviews-heading">
      <i class="fa-solid fa-star me-2" style="color: var(--accent-gold);"></i>
      <%= listing.reviews.length %> Review<%= listing.reviews.length !== 1 ? 's' : '' %>
    </h3>

    <% for(let review of listing.reviews) { %>
      <div class="review-card">
        <div class="review-author">@<%= review.author.username %></div>
        <div class="review-date">
          <%= new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) %>
        </div>
        <p class="starability-result" data-rating="<%= review.rating %>"></p>
        <p class="review-comment"><%= review.comment %></p>
        <% if(currUser && currUser._id.equals(review.author._id)) { %>
          <div class="review-actions">
            <form method="POST" action="/listings/<%= listing._id %>/reviews/<%= review._id %>?_method=DELETE">
              <button type="submit" class="btn-danger-ghost">
                <i class="fa-solid fa-trash me-1"></i> Delete
              </button>
            </form>
          </div>
        <% } %>
      </div>
    <% } %>
  <% } else { %>
    <div class="reviews-heading" style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
      <p style="color: var(--text-secondary); font-size: 0.9rem;">No reviews yet. Be the first!</p>
    </div>
  <% } %>
</div>
```

- [ ] **Step 2: Verify in browser**

Navigate to any listing's show page: `http://localhost:8080/listings/<some-id>`.

Check:
- Two-column layout on desktop
- Hero image is 400px tall with rounded corners
- Price shown prominently in Playfair Display
- "Booking coming soon" card on right
- Review form appears when logged in, login prompt when logged out
- Review delete button only visible if you are the review author (log in and check)
- Star ratings display correctly (not hardcoded 3)
- Delete listing triggers browser confirm dialog

- [ ] **Step 3: Commit**

```bash
git add views/listings/show.ejs
git commit -m "style+fix: show page — two-col layout, fix review delete auth, fix hardcoded rating text, add delete confirm"
```

---

### Task 6: New + Edit Listing Forms

**Files:**
- Modify: `views/listings/new.ejs`
- Modify: `views/listings/edit.ejs`

**Interfaces:**
- `edit.ejs` consumes: `listing` object (`.title`, `.description`, `.image.url`, `.price`, `.location`, `.country`)
- Consumes CSS: `form-page`, `form-card`, `form-card-title`, `form-card-subtitle`, `image-preview-thumb`, `current-image-label`, `current-image-thumb`, `btn-gold`
- Fixes: `edit.ejs` country prefill bug, `edit.ejs` description prefill bug

- [ ] **Step 1: Replace `views/listings/new.ejs`**

```ejs
<% layout("/layouts/boilerplate") %>

<div class="form-page">
  <div class="form-card">
    <h2 class="form-card-title">Create a Listing</h2>
    <p class="form-card-subtitle">Share your space with travellers around the world.</p>

    <form method="POST" action="/listings" novalidate class="needs-validation" enctype="multipart/form-data">

      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input name="listing[title]" id="title" type="text" class="form-control" placeholder="e.g. Cozy mountain cabin" required>
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea name="listing[description]" id="description" class="form-control" placeholder="Describe your space..." required></textarea>
        <div class="invalid-feedback">Please add a description.</div>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Listing Image</label>
        <input name="listing[image]" id="image" type="file" class="form-control" accept="image/png,image/jpg,image/jpeg" required>
        <img id="imagePreview" class="image-preview-thumb" src="#" alt="Preview">
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Price per Night (₹)</label>
        <input name="listing[price]" id="price" type="number" class="form-control" placeholder="e.g. 2500" min="0" required>
        <div class="invalid-feedback">Please enter a valid price.</div>
      </div>

      <div class="mb-3">
        <label for="location" class="form-label">Location</label>
        <input name="listing[location]" id="location" type="text" class="form-control" placeholder="City or neighbourhood" required>
        <div class="invalid-feedback">Please enter a location.</div>
      </div>

      <div class="mb-3">
        <label for="country" class="form-label">Country</label>
        <input name="listing[country]" id="country" type="text" class="form-control" placeholder="e.g. India" required>
        <div class="invalid-feedback">Please enter a country.</div>
      </div>

      <br>
      <button type="submit" class="btn-gold w-full">Create Listing</button>
    </form>
  </div>
</div>
```

- [ ] **Step 2: Replace `views/listings/edit.ejs`**

Fix country bug (was `listing.title`) and description bug (was `placeholder` instead of content):

```ejs
<% layout("/layouts/boilerplate") %>

<div class="form-page">
  <div class="form-card">
    <h2 class="form-card-title">Edit Listing</h2>
    <p class="form-card-subtitle">Update your listing details below.</p>

    <form method="POST" action="/listings/<%= listing._id %>?_method=PUT" novalidate class="needs-validation" enctype="multipart/form-data">

      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input name="listing[title]" id="title" type="text" class="form-control" value="<%= listing.title %>" required>
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea name="listing[description]" id="description" class="form-control" required><%= listing.description %></textarea>
        <div class="invalid-feedback">Please add a description.</div>
      </div>

      <div class="mb-3">
        <p class="current-image-label">Current Image</p>
        <img src="<%= listing.image.url %>" class="current-image-thumb" alt="Current listing image">
        <label for="image" class="form-label">Upload New Image (optional)</label>
        <input name="listing[image]" id="image" type="file" class="form-control" accept="image/png,image/jpg,image/jpeg">
        <img id="imagePreview" class="image-preview-thumb" src="#" alt="Preview">
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Price per Night (₹)</label>
        <input name="listing[price]" id="price" type="number" class="form-control" value="<%= listing.price %>" min="0" required>
        <div class="invalid-feedback">Please enter a valid price.</div>
      </div>

      <div class="mb-3">
        <label for="location" class="form-label">Location</label>
        <input name="listing[location]" id="location" type="text" class="form-control" value="<%= listing.location %>" required>
        <div class="invalid-feedback">Please enter a location.</div>
      </div>

      <div class="mb-3">
        <label for="country" class="form-label">Country</label>
        <input name="listing[country]" id="country" type="text" class="form-control" value="<%= listing.country %>" required>
        <div class="invalid-feedback">Please enter a country.</div>
      </div>

      <br>
      <button type="submit" class="btn-gold w-full">Save Changes</button>
    </form>
  </div>
</div>
```

- [ ] **Step 3: Verify in browser**

1. Navigate to `http://localhost:8080/listings/new` (must be logged in).
   - Form appears in glassmorphism card
   - Select an image — preview thumbnail should appear immediately below the input
   - Submit the form — redirects to `/listings` with success flash

2. Navigate to an edit page for a listing you own.
   - Title, description, price, location, country all pre-fill correctly (country shows the country, NOT the title)
   - Current image thumbnail shows
   - Selecting a new image shows preview

- [ ] **Step 4: Commit**

```bash
git add views/listings/new.ejs views/listings/edit.ejs
git commit -m "style+fix: new/edit forms — glass card layout, fix country prefill bug, fix description prefill, image preview"
```

---

### Task 7: Auth Pages + Error Page

**Files:**
- Modify: `views/users/login.ejs`
- Modify: `views/users/signup.ejs`
- Modify: `views/listings/error.ejs`

**Interfaces:**
- Consumes CSS: `auth-layout`, `auth-image`, `auth-image-overlay`, `auth-image-text`, `auth-panel`, `auth-form-inner`, `auth-title`, `auth-subtitle`, `auth-switch`, `btn-gold`, `error-page`, `error-code`, `error-heading`, `error-body`

- [ ] **Step 1: Replace `views/users/login.ejs`**

```ejs
<% layout("/layouts/boilerplate") %>

<div class="auth-layout">
  <!-- Left: travel image -->
  <div class="auth-image">
    <div class="auth-image-overlay"></div>
    <div class="auth-image-text">
      <h2>Your next stay awaits.</h2>
      <p>Thousands of unique places. One platform.</p>
    </div>
  </div>

  <!-- Right: form -->
  <div class="auth-panel">
    <div class="auth-form-inner">
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to your Wanderlust account.</p>

      <form action="/login" method="POST" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input name="username" id="username" type="text" class="form-control" required placeholder="Your username">
          <div class="invalid-feedback">Please enter your username.</div>
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input name="password" id="password" type="password" class="form-control" required placeholder="Your password">
          <div class="invalid-feedback">Please enter your password.</div>
        </div>

        <button type="submit" class="btn-gold w-full">Login</button>
      </form>

      <div class="auth-switch">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Replace `views/users/signup.ejs`**

```ejs
<% layout("/layouts/boilerplate") %>

<div class="auth-layout">
  <!-- Left: travel image -->
  <div class="auth-image">
    <div class="auth-image-overlay"></div>
    <div class="auth-image-text">
      <h2>Join Wanderlust.</h2>
      <p>List your space or discover your next adventure.</p>
    </div>
  </div>

  <!-- Right: form -->
  <div class="auth-panel">
    <div class="auth-form-inner">
      <h1 class="auth-title">Create account</h1>
      <p class="auth-subtitle">Start your Wanderlust journey today.</p>

      <form action="/signup" method="POST" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input name="username" id="username" type="text" class="form-control" required placeholder="Choose a username">
          <div class="invalid-feedback">Please choose a username.</div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input name="email" id="email" type="email" class="form-control" required placeholder="you@example.com">
          <div class="invalid-feedback">Please enter a valid email.</div>
        </div>

        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input name="password" id="password" type="password" class="form-control" required placeholder="Create a password">
          <div class="invalid-feedback">Please create a password.</div>
        </div>

        <button type="submit" class="btn-gold w-full">Create Account</button>
      </form>

      <div class="auth-switch">
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Replace `views/listings/error.ejs`**

```ejs
<% layout("/layouts/boilerplate") %>

<div class="error-page">
  <div class="error-code">404</div>
  <h2 class="error-heading">Page not found</h2>
  <p class="error-body"><%= message || "The page you're looking for doesn't exist or has been moved." %></p>
  <a href="/listings" class="btn-gold">
    <i class="fa-solid fa-house me-2"></i>Back to Home
  </a>
</div>
```

- [ ] **Step 4: Verify in browser**

1. `http://localhost:8080/login` — split layout, image left, form right
2. `http://localhost:8080/signup` — same split layout
3. `http://localhost:8080/anything-that-doesnt-exist` — dark error page with gold "404", back button

- [ ] **Step 5: Commit**

```bash
git add views/users/login.ejs views/users/signup.ejs views/listings/error.ejs
git commit -m "style: auth pages split layout, styled error page"
```

---

### Task 8: JavaScript — Image Preview, Flash Auto-Dismiss, Mobile Nav, Delete Confirm

**Files:**
- Modify: `public/js/script.js`

**Interfaces:**
- `confirmDelete()` — called from `onsubmit` on delete forms in `show.ejs`. Returns `false` to cancel, `true` to proceed.
- `toggleMobileNav()` — called from mobile hamburger button in `navbar.ejs`
- Image preview — reads `#image` file input, shows `#imagePreview` img
- Flash auto-dismiss — removes `.flash-success` and `.flash-error` elements after 4 seconds

- [ ] **Step 1: Replace `public/js/script.js`**

```js
(() => {
  'use strict';

  // Bootstrap form validation
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Image upload preview
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('imagePreview');
  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = 'block';
      } else {
        imagePreview.style.display = 'none';
      }
    });
  }

  // Flash auto-dismiss after 4 seconds
  setTimeout(() => {
    document.querySelectorAll('.flash-success, .flash-error').forEach(el => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 500);
    });
  }, 4000);

})();

// Delete confirmation dialog (called inline via onsubmit)
function confirmDelete() {
  return confirm('Are you sure you want to delete this listing? This cannot be undone.');
}

// Mobile nav toggle (called inline via onclick)
function toggleMobileNav() {
  const panel = document.getElementById('mobileNavPanel');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = isHidden ? 'block' : 'none';
}
```

- [ ] **Step 2: Verify all JS behaviours**

1. `http://localhost:8080/listings/new` → select an image file → thumbnail appears immediately below the input
2. Create a listing → success flash appears → auto-disappears after 4 seconds
3. On a listing show page (as owner) → click Delete → browser confirm dialog appears → Cancel leaves you on the page
4. On mobile viewport (DevTools → toggle device toolbar, width < 768px) → hamburger icon appears → click it → mobile nav slides down

- [ ] **Step 3: Commit**

```bash
git add public/js/script.js
git commit -m "feat: image upload preview, flash auto-dismiss, mobile nav toggle, delete confirm dialog"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task that covers it |
|---|---|
| Fix `edit.ejs` country bug | Task 6 Step 2 |
| Fix review delete auth | Task 5 Step 1 |
| Fix `validateReview` | Task 1 Step 2 |
| Fix hardcoded "Rated: 3 stars" | Task 5 Step 1 (removed static text, `data-rating` drives stars) |
| Fix `next` in users controller | Task 1 Step 3 |
| Fix `Date.now()` → `Date.now` | Task 1 Step 1 |
| Fix dead search bar (minimal) | Task 3 Step 2 (form has `action="/listings" method="GET"`) |
| Fix filter buttons (data attrs) | Task 4 Step 1 (`data-category` attrs) |
| Fix `allowedFormats` | Task 1 Step 4 |
| CSS design system | Task 2 |
| Google Fonts | Task 3 Step 1 |
| Dark navbar (fix structure) | Task 3 Step 2 |
| Dark footer | Task 3 Step 3 |
| Dark flash messages | Task 3 Step 4 |
| Index listing cards dark | Task 4 |
| Show page two-col layout | Task 5 |
| New listing form glass card | Task 6 Step 1 |
| Edit form glass card + bug fixes | Task 6 Step 2 |
| Auth pages split layout | Task 7 |
| Error page styled | Task 7 Step 3 |
| Image preview JS | Task 8 |
| Flash auto-dismiss JS | Task 8 |
| Delete confirm JS | Task 8 |
| Mobile nav JS | Task 8 |

All spec requirements covered. No placeholders, no TBDs.
