# Warm Modern Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark luxury theme with a warm, Airbnb-flavored design using coral (#FF385C), warm sand background (#F7F3ED), white cards, and Plus Jakarta Sans throughout.

**Architecture:** Pure CSS/EJS overhaul — complete rewrite of `style.css`, targeted rewrites of all EJS templates, no backend changes. `boilerplate.ejs` stops wrapping body in a container so each page controls its own layout (required for full-width filter bar). Flash messages get their own `.flash-wrapper` div.

**Tech Stack:** EJS + ejs-mate layouts, CSS custom properties, Bootstrap 5.3 (utilities/grid only, all visual overridden), Plus Jakarta Sans via Google Fonts, Font Awesome 6.5.

## Global Constraints
- No backend route changes, no schema changes, no new npm packages
- Bootstrap utility classes preserved: `d-none`, `d-md-block`, `d-md-inline-flex`, `mb-*`, `me-*`, `form-check`, `form-switch`, `dropdown`, `dropdown-menu`, `dropdown-menu-end`, `dropdown-item`, `dropdown-toggle`
- Form input `name` attributes unchanged — these map to req.body fields
- Route `action` attributes unchanged
- `public/js/script.js` NOT modified — JS targets these exact IDs/classes:
  - `#taxSwitch` (change event) → toggles `.tax-info` elements
  - `#image` (change event) → sets `#imagePreview` src
  - `.flash-success`, `.flash-error` (auto-dismiss after 4s)
  - `#mobileNavPanel` (toggled by `toggleMobileNav()`)
  - `.needs-validation` forms (Bootstrap validation)
- Google Fonts: `Plus Jakarta Sans` weights `400;500;600;700;800`
- Primary accent: `#FF385C` (coral)
- Background: `#F7F3ED` (warm sand)
- Surface/cards: `#FFFFFF`
- Text primary: `#222222`, text secondary: `#717171`, border: `#EBEBEB`

---

### Task 1: CSS Design System + Boilerplate

**Files:**
- Modify: `Air-Bnb/public/css/style.css` — complete rewrite
- Modify: `Air-Bnb/views/layouts/boilerplate.ejs` — font swap, remove container wrapper
- Modify: `Air-Bnb/public/css/rating.css` — append coral star overrides

**Interfaces:**
- Produces: all CSS custom properties and utility classes consumed by Tasks 2–6
- Produces: updated boilerplate layout (no container wrapper, flash-wrapper div) consumed by Tasks 2–6

**Test:** Start the server (`node app.js` from `Air-Bnb/`), open `http://localhost:8080/listings`. Body background should be `#F7F3ED` (warm sand). Font should be Plus Jakarta Sans (check DevTools → Elements → computed font-family). No visual regressions on navbar/footer structure.

- [ ] **Step 1: Rewrite `public/css/style.css`**

Replace the entire file with:

```css
/* ============================================================
   Wanderlust — Warm Modern Theme
   ============================================================ */

/* 1. CSS Custom Properties
   ============================================================ */
:root {
  --bg:             #F7F3ED;
  --surface:        #FFFFFF;
  --coral:          #FF385C;
  --coral-hover:    #E0314F;
  --coral-light:    #FFF0F3;
  --text-primary:   #222222;
  --text-secondary: #717171;
  --border:         #EBEBEB;
  --shadow-sm:      0 1px 4px rgba(0,0,0,0.06);
  --shadow-md:      0 2px 12px rgba(0,0,0,0.08);
  --shadow-lg:      0 8px 32px rgba(0,0,0,0.12);
  --radius-card:    16px;
  --radius-btn:     8px;
  --radius-pill:    999px;
  --radius-input:   8px;
  --font:           'Plus Jakarta Sans', sans-serif;
}

/* 2. Base Resets
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-primary);
  font-size: 0.9375rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
a:hover { color: var(--coral); }
img { display: block; max-width: 100%; }

/* 3. Bootstrap Overrides
   ============================================================ */
.form-control,
.form-select {
  border: 1.5px solid var(--border);
  border-radius: var(--radius-input);
  background: var(--surface);
  color: var(--text-primary);
  font-family: var(--font);
  font-size: 0.9375rem;
  padding: 10px 14px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.form-control:focus,
.form-select:focus {
  border-color: var(--coral);
  box-shadow: 0 0 0 3px rgba(255,56,92,0.15);
  background: var(--surface);
  color: var(--text-primary);
  outline: none;
}
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.form-check-input:checked {
  background-color: var(--coral);
  border-color: var(--coral);
}
.invalid-feedback { font-size: 0.8125rem; }
.dropdown-menu {
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 8px;
  font-family: var(--font);
}
.dropdown-item {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: var(--text-primary);
}
.dropdown-item:hover {
  background: var(--bg);
  color: var(--text-primary);
}

/* 4. Buttons
   ============================================================ */
.btn-coral {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--coral);
  color: #fff;
  border: none;
  border-radius: var(--radius-btn);
  padding: 10px 20px;
  font-family: var(--font);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  text-decoration: none;
}
.btn-coral:hover {
  background: var(--coral-hover);
  color: #fff;
  transform: translateY(-1px);
}
.btn-coral.w-full { width: 100%; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-btn);
  padding: 9px 18px;
  font-family: var(--font);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  text-decoration: none;
}
.btn-ghost:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.btn-danger-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: #dc2626;
  border: 1.5px solid #fca5a5;
  border-radius: var(--radius-btn);
  padding: 7px 14px;
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none;
}
.btn-danger-ghost:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

/* 5. Navbar
   ============================================================ */
.wl-navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}
.wl-navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.wl-brand {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--coral);
  letter-spacing: -0.5px;
  white-space: nowrap;
  text-decoration: none;
}
.wl-brand:hover { color: var(--coral-hover); }
.wl-brand i { margin-right: 4px; }

.wl-search { flex: 1; max-width: 420px; }
.wl-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 10px 18px;
  background: var(--surface);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.wl-search-bar:focus-within {
  border-color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}
.wl-search-bar input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font);
  font-size: 0.9rem;
  color: var(--text-primary);
  width: 100%;
}
.wl-search-bar input::placeholder { color: var(--text-secondary); }
.wl-search-bar i { color: var(--coral); font-size: 0.9rem; }

.wl-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.nav-link-wl {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9375rem;
  text-decoration: none;
  padding: 6px 4px;
  transition: color 0.15s;
}
.nav-link-wl:hover { color: var(--coral); }

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--coral);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.avatar-circle::after { display: none; }
.avatar-circle:hover,
.avatar-circle:focus { border-color: var(--coral); background: var(--coral); color: #fff; box-shadow: none; }
.avatar-circle.show { border-color: var(--coral); }

.mobile-toggler {
  display: none;
  background: none;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-btn);
  padding: 7px 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1rem;
}

#mobileNavPanel {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 16px 1.5rem;
}
#mobileNavPanel .mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
#mobileNavPanel .mobile-nav-links a {
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 500;
  color: var(--text-primary);
  transition: background 0.1s;
}
#mobileNavPanel .mobile-nav-links a:hover { background: var(--bg); }

/* 6. Filter Bar
   ============================================================ */
.filter-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filter-bar::-webkit-scrollbar { display: none; }
.filter-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  width: max-content;
  min-width: 100%;
}
.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 7px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  font-family: var(--font);
}
.filter-pill:hover,
.filter-pill.active {
  border-color: var(--text-primary);
  background: var(--text-primary);
  color: #fff;
}
.tax-toggle-wrapper {
  margin-left: auto;
  padding-left: 24px;
  flex-shrink: 0;
  font-family: var(--font);
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

/* 7. Listings Grid + Cards
   ============================================================ */
.listings-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 1.5rem 48px;
}
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.listing-card {
  display: block;
  text-decoration: none;
  color: inherit;
}
.listing-card-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: var(--radius-card);
  display: block;
  transition: transform 0.2s ease;
}
.listing-card:hover .listing-card-img { transform: scale(1.02); }
.listing-card-body { padding: 10px 2px 0; }
.listing-card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.listing-card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.listing-card-rating {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  flex-shrink: 0;
}
.listing-card-location {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 2px;
}
.listing-card-location i { color: var(--coral); font-size: 0.75rem; }
.listing-card-price {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 4px;
}
.listing-card-price .per-night {
  font-weight: 400;
  color: var(--text-secondary);
}
.tax-info {
  display: none;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-style: normal;
  margin-top: 2px;
}

/* 8. Show Page
   ============================================================ */
.show-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 1.5rem 0;
}
.show-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 48px;
  align-items: start;
}
.show-left {}
.show-hero {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-card);
  display: block;
  margin-bottom: 24px;
}
.show-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.25;
}
.show-owner {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 20px;
}
.owner-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--coral);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.owner-name { font-weight: 500; color: var(--text-primary); }
.show-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}
.show-description {
  color: var(--text-primary);
  line-height: 1.65;
  font-size: 0.9375rem;
  margin-bottom: 20px;
}
.show-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.show-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}
.show-meta-item i { color: var(--coral); }
.show-price {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.show-price small {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}
.show-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

/* 9. Booking Card
   ============================================================ */
.show-right {}
.booking-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-card);
  padding: 24px;
  position: sticky;
  top: 96px;
  box-shadow: var(--shadow-lg);
}
.booking-card-price {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}
.booking-card-price small {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}
.booking-coming-soon {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 16px;
}
.booking-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}
.review-form-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 14px;
}

/* 10. Reviews Section
   ============================================================ */
.reviews-section {
  max-width: 1200px;
  margin: 32px auto 0;
  padding: 0 1.5rem 64px;
}
.reviews-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.review-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 14px;
}
.review-author {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
  margin-bottom: 2px;
}
.review-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.review-comment {
  color: var(--text-primary);
  font-size: 0.9375rem;
  line-height: 1.55;
  margin-top: 8px;
}
.review-actions { margin-top: 10px; }

/* 11. Form Pages (new/edit)
   ============================================================ */
.form-page {
  min-height: calc(100vh - 72px);
  background: var(--bg);
  padding: 48px 1.5rem 64px;
}
.form-card {
  max-width: 680px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 40px;
  box-shadow: var(--shadow-md);
}
.form-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 28px;
}
.current-image-thumb {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  margin-bottom: 12px;
}
.image-preview-thumb {
  display: none;
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  margin-top: 10px;
}

/* 12. Auth Pages
   ============================================================ */
.auth-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 72px);
}
.auth-image {
  background-image: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
}
.auth-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
}
.auth-image-text {
  position: absolute;
  bottom: 48px;
  left: 40px;
  right: 40px;
  color: #fff;
  z-index: 1;
}
.auth-image-text h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
  line-height: 1.2;
  font-family: var(--font);
}
.auth-image-text p { font-size: 1rem; opacity: 0.85; }
.auth-panel {
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}
.auth-form-inner { width: 100%; max-width: 400px; }
.auth-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.auth-subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 28px;
}
.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.auth-switch a { color: var(--coral); font-weight: 500; text-decoration: underline; }

/* 13. Flash Messages
   ============================================================ */
.flash-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 1.5rem 0;
}
.flash-success {
  background: var(--coral-light);
  border-left: 4px solid var(--coral);
  color: var(--text-primary);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  margin-bottom: 8px;
}
.flash-error {
  background: #FFF5F5;
  border-left: 4px solid #dc2626;
  color: var(--text-primary);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  margin-bottom: 8px;
}
.flash-success i { color: var(--coral); }
.flash-error i { color: #dc2626; }
.flash-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 1rem;
  padding: 0 4px;
  line-height: 1;
}
.flash-close:hover { color: var(--text-primary); }

/* 14. Error Page
   ============================================================ */
.error-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 1.5rem;
  background: var(--bg);
}
.error-inner { max-width: 480px; }
.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--coral);
  line-height: 1;
  margin-bottom: 16px;
}
.error-heading {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.error-body {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 28px;
  line-height: 1.55;
}

/* 15. Footer
   ============================================================ */
.wl-footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 24px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}
.footer-brand {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--coral);
  text-decoration: none;
}
.footer-copy {
  color: var(--text-secondary);
  font-size: 0.8125rem;
  text-align: center;
}
.footer-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}
.footer-links a {
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: color 0.15s;
}
.footer-links a:hover { color: var(--coral); }

/* 16. Utilities
   ============================================================ */
.w-full { width: 100%; }

/* 17. Responsive
   ============================================================ */
@media (max-width: 768px) {
  .wl-search { display: none !important; }
  .mobile-toggler { display: flex !important; }

  .auth-layout { grid-template-columns: 1fr; }
  .auth-image { display: none; }
  .auth-panel { padding: 32px 24px; min-height: calc(100vh - 72px); }

  .show-layout { grid-template-columns: 1fr; }
  .booking-card { position: static; }

  .form-card { padding: 24px; }

  .footer-inner { grid-template-columns: 1fr; text-align: center; }
  .footer-links { justify-content: center; }

  .listings-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
}

@media (max-width: 480px) {
  .listings-grid { grid-template-columns: 1fr; }
  .show-title { font-size: 1.375rem; }
  .form-card { padding: 20px 16px; }
}
```

- [ ] **Step 2: Update `views/layouts/boilerplate.ejs`**

Replace the entire file with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wanderlust</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="/css/rating.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <%- include("../includes/navbar.ejs") %>

    <div class="flash-wrapper">
        <%- include("../includes/flash.ejs") %>
    </div>

    <%- body %>

    <%- include("../includes/footer.ejs") %>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="/js/script.js"></script>
</body>
</html>
```

- [ ] **Step 3: Append coral star overrides to `public/css/rating.css`**

Add to the very end of rating.css (do not replace — only append):

```css

/* Warm modern theme overrides */
.starability-result:before {
  color: var(--coral);
}
.starability-slot label:before,
.starability-slot label:after {
  color: var(--coral);
}
```

- [ ] **Step 4: Verify visually**

Start server: `cd Air-Bnb && node app.js`
Open `http://localhost:8080/listings`
Check: body background is `#F7F3ED` (warm sand), font is Plus Jakarta Sans (DevTools → Computed → font-family), navbar is white with coral brand name.

- [ ] **Step 5: Commit**

```bash
git add Air-Bnb/public/css/style.css Air-Bnb/views/layouts/boilerplate.ejs Air-Bnb/public/css/rating.css
git commit -m "style: warm modern CSS design system, Plus Jakarta Sans, coral theme"
```

---

### Task 2: Shell — Navbar, Footer, Flash

**Files:**
- Modify: `Air-Bnb/views/includes/navbar.ejs`
- Modify: `Air-Bnb/views/includes/footer.ejs`
- Modify: `Air-Bnb/views/includes/flash.ejs`

**Interfaces:**
- Consumes: CSS classes from Task 1: `.wl-navbar`, `.wl-navbar-inner`, `.wl-brand`, `.wl-search`, `.wl-search-bar`, `.wl-nav-actions`, `.nav-link-wl`, `.avatar-circle`, `.btn-ghost`, `.btn-coral`, `.mobile-toggler`, `#mobileNavPanel`, `.wl-footer`, `.footer-inner`, `.footer-brand`, `.footer-copy`, `.footer-links`, `.flash-success`, `.flash-error`, `.flash-close`
- Consumes: global JS functions `toggleMobileNav()` (in script.js, unchanged)

**Test:** Open `http://localhost:8080/listings`. Navbar: white bg, coral "Wanderlust" wordmark, pill search bar, Add Listing ghost button, Login + Sign Up buttons (logged out). Footer: white bg, 3-column layout. Flash: test by navigating to `/listings` (no flash) and by triggering a login error.

- [ ] **Step 1: Rewrite `views/includes/navbar.ejs`**

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
        <div class="wl-search-bar">
          <input type="search" name="q" placeholder="Search destinations..." aria-label="Search">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </form>
    </div>

    <!-- Right-side actions -->
    <div class="wl-nav-actions">
      <a href="/listings/new" class="btn-ghost d-none d-md-inline-flex">
        <i class="fa-solid fa-plus"></i> Add Listing
      </a>

      <% if(!currUser) { %>
        <a href="/login" class="nav-link-wl d-none d-md-inline">Login</a>
        <a href="/signup" class="btn-coral">Sign Up</a>
      <% } else { %>
        <div class="dropdown">
          <button class="avatar-circle dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <%= currUser.username.charAt(0).toUpperCase() %>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <span class="dropdown-item-text" style="font-size:0.8rem; padding:0.5rem 1rem; display:block; color:var(--text-secondary);">
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
  <div id="mobileNavPanel" style="display:none;">
    <form action="/listings" method="GET" class="mb-3">
      <input class="form-control" type="search" name="q" placeholder="Search destinations...">
    </form>
    <div class="mobile-nav-links">
      <a href="/listings/new"><i class="fa-solid fa-plus me-2"></i>Add Listing</a>
      <% if(!currUser) { %>
        <a href="/login">Login</a>
        <a href="/signup">Sign Up</a>
      <% } else { %>
        <a href="/logout"><i class="fa-solid fa-right-from-bracket me-2"></i>Logout (@<%= currUser.username %>)</a>
      <% } %>
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Rewrite `views/includes/footer.ejs`**

```html
<footer class="wl-footer">
  <div class="footer-inner">
    <a href="/listings" class="footer-brand">
      <i class="fa-solid fa-compass me-1"></i>Wanderlust
    </a>
    <p class="footer-copy">&copy; 2024 Wanderlust. All rights reserved.</p>
    <div class="footer-links">
      <a href="/listings">Explore</a>
      <a href="/listings/new">List your space</a>
      <a href="#"><i class="fa-brands fa-instagram"></i></a>
      <a href="#"><i class="fa-brands fa-twitter"></i></a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Verify `views/includes/flash.ejs` (no change needed)**

The flash.ejs already uses `.flash-success` and `.flash-error` with the correct structure. Confirm it looks like this (do not modify):

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

If it differs, update it to match the above.

- [ ] **Step 4: Verify visually**

Open `http://localhost:8080/listings`. Check:
- Navbar: white bg, coral compass + "Wanderlust" wordmark, pill-shaped search bar (no box just pill outline), Add Listing ghost button, Sign Up coral button
- Footer: white bg, coral "Wanderlust" left, copyright center, links right
- Mobile (resize to <768px): search hides, hamburger appears, clicking it shows mobile panel

- [ ] **Step 5: Commit**

```bash
git add Air-Bnb/views/includes/navbar.ejs Air-Bnb/views/includes/footer.ejs Air-Bnb/views/includes/flash.ejs
git commit -m "style: warm modern navbar, footer, flash shell"
```

---

### Task 3: Index Page — Listings Grid

**Files:**
- Modify: `Air-Bnb/views/listings/index.ejs`

**Interfaces:**
- Consumes: CSS from Task 1: `.filter-bar`, `.filter-bar-inner`, `.filter-pill`, `.tax-toggle-wrapper`, `.listings-section`, `.listings-grid`, `.listing-card`, `.listing-card-img`, `.listing-card-body`, `.listing-card-row`, `.listing-card-title`, `.listing-card-rating`, `.listing-card-location`, `.listing-card-price`, `.per-night`, `.tax-info`
- Consumes: JS hooks from script.js (unchanged): `#taxSwitch` toggles `.tax-info` elements; `data-category` attrs on pills are UI-only
- EJS variable: `allListings` array — each item has `._id`, `.title`, `.image.url`, `.location`, `.country`, `.price` (number)

**Test:** Open `http://localhost:8080/listings`. Check: filter pills scroll horizontally, tax toggle shows/hides `.tax-info` spans, listing cards show image (4:3 aspect ratio, rounded), title row with rating placeholder, location row, price row.

- [ ] **Step 1: Rewrite `views/listings/index.ejs`**

```html
<% layout("/layouts/boilerplate") %>

<!-- Filter Bar (full-width, outside container) -->
<div class="filter-bar">
  <div class="filter-bar-inner">
    <button class="filter-pill" data-category="trending">
      <i class="fa-solid fa-fire"></i><span>Trending</span>
    </button>
    <button class="filter-pill" data-category="rooms">
      <i class="fa-solid fa-bed"></i><span>Rooms</span>
    </button>
    <button class="filter-pill" data-category="cities">
      <i class="fa-solid fa-mountain-city"></i><span>Iconic Cities</span>
    </button>
    <button class="filter-pill" data-category="mountains">
      <i class="fa-solid fa-mountain"></i><span>Mountains</span>
    </button>
    <button class="filter-pill" data-category="castles">
      <i class="fa-brands fa-fort-awesome"></i><span>Castles</span>
    </button>
    <button class="filter-pill" data-category="pools">
      <i class="fa-solid fa-person-swimming"></i><span>Amazing Pools</span>
    </button>
    <button class="filter-pill" data-category="camping">
      <i class="fa-solid fa-campground"></i><span>Camping</span>
    </button>
    <button class="filter-pill" data-category="farms">
      <i class="fa-solid fa-tractor"></i><span>Farms</span>
    </button>
    <button class="filter-pill" data-category="arctic">
      <i class="fa-solid fa-snowflake"></i><span>Arctic</span>
    </button>
    <button class="filter-pill" data-category="domes">
      <i class="fa-solid fa-landmark-dome"></i><span>Domes</span>
    </button>
    <button class="filter-pill" data-category="boating">
      <i class="fa-solid fa-sailboat"></i><span>Boating</span>
    </button>

    <div class="tax-toggle-wrapper">
      <div class="form-check form-switch mb-0">
        <input class="form-check-input" type="checkbox" role="switch" id="taxSwitch">
        <label class="form-check-label" for="taxSwitch">Show total with taxes</label>
      </div>
    </div>
  </div>
</div>

<!-- Listings Grid -->
<div class="listings-section">
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
          <div class="listing-card-row">
            <div class="listing-card-title"><%= listing.title %></div>
            <div class="listing-card-rating">&#9733; New</div>
          </div>
          <div class="listing-card-location">
            <i class="fa-solid fa-location-dot me-1"></i>
            <%= listing.location %>, <%= listing.country %>
          </div>
          <div class="listing-card-price">
            &#8377;<%= listing.price.toLocaleString('en-IN') %>
            <span class="per-night">/ night</span>
          </div>
          <div class="tax-info">&#8377;<%= Math.round(listing.price * 1.18).toLocaleString('en-IN') %> total with taxes</div>
        </div>
      </a>
    <% } %>
  </div>
</div>
```

- [ ] **Step 2: Verify visually**

Open `http://localhost:8080/listings`. Confirm:
- Filter bar: white bg, horizontally scrollable pills with `#EBEBEB` border, tax toggle on the right
- Tax toggle: clicking it shows `.tax-info` below each price (the JS in script.js targets `#taxSwitch` and toggles `display: 'inline'` on `.tax-info` elements)
- Cards: 4:3 image (rounded 16px corners), title + "★ New" rating row, location in gray, price bold

- [ ] **Step 3: Commit**

```bash
git add Air-Bnb/views/listings/index.ejs
git commit -m "style: warm modern listing cards grid with coral filter pills"
```

---

### Task 4: Show Page + Reviews

**Files:**
- Modify: `Air-Bnb/views/listings/show.ejs`

**Interfaces:**
- Consumes: CSS from Task 1: `.show-container`, `.show-layout`, `.show-left`, `.show-hero`, `.show-title`, `.show-owner`, `.owner-avatar`, `.owner-name`, `.show-divider`, `.show-description`, `.show-meta`, `.show-meta-item`, `.show-price`, `.show-actions`, `.show-right`, `.booking-card`, `.booking-card-price`, `.booking-coming-soon`, `.booking-divider`, `.review-form-title`, `.reviews-section`, `.reviews-heading`, `.review-card`, `.review-author`, `.review-date`, `.review-comment`, `.review-actions`, `.btn-coral`, `.btn-ghost`, `.btn-danger-ghost`
- EJS variables: `listing` (has `._id`, `.title`, `.image.url`, `.description`, `.location`, `.country`, `.price`, `.owner` (has `._id`, `.username`), `.reviews` array), `currUser` (null or has `._id`, `.username`), `listing.id` (string version of `_id`)
- Existing starability radio inputs + `.starability-result` display — keep unchanged
- `confirmDelete()` global function in script.js — already wired, do not change

**Test:** Navigate to any listing. Check: two-column layout (desktop), hero image 16:9, title, owner with coral avatar, description, meta row with coral icons, price, Edit/Delete buttons visible only when logged in as owner. Booking card: white, sticky, shadow, price at top, coral "Submit Review" button (logged in). Reviews: white cards with coral stars.

- [ ] **Step 1: Rewrite `views/listings/show.ejs`**

```html
<% layout("/layouts/boilerplate") %>

<div class="show-container">
  <div class="show-layout">

    <!-- LEFT: Listing details -->
    <div class="show-left">
      <img src="<%= listing.image.url %>" class="show-hero" alt="<%= listing.title %>">

      <h1 class="show-title"><%= listing.title %></h1>
      <div class="show-owner">
        <div class="owner-avatar"><%= listing.owner.username.charAt(0).toUpperCase() %></div>
        <span>Hosted by <span class="owner-name">@<%= listing.owner.username %></span></span>
      </div>

      <hr class="show-divider">
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

            <button type="submit" class="btn-coral w-full">Submit Review</button>
          </form>
        <% } else { %>
          <p style="color: var(--text-secondary); font-size: 0.88rem; text-align: center;">
            <a href="/login" style="color: var(--coral);">Log in</a> to leave a review.
          </p>
        <% } %>
      </div>
    </div>

  </div>
</div>

<!-- Reviews Section (full width below grid) -->
<div class="reviews-section">
  <% if(listing.reviews.length > 0) { %>
    <h3 class="reviews-heading">
      <i class="fa-solid fa-star me-2" style="color: var(--coral);"></i>
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
    <div class="reviews-heading">
      <p style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 400; padding-top: 1rem;">No reviews yet. Be the first!</p>
    </div>
  <% } %>
</div>
```

- [ ] **Step 2: Verify visually**

Navigate to any listing (click a card from index). Check:
- Two-column layout on desktop: listing details left, sticky booking card right
- Hero image 16:9, rounded 16px corners
- Coral avatar circle with owner initial
- Divider line below owner
- Booking card: white bg, border, shadow, sticky
- If logged out: "Log in to leave a review" prompt

- [ ] **Step 3: Commit**

```bash
git add Air-Bnb/views/listings/show.ejs
git commit -m "style: warm modern show page — two-col layout, white booking card, coral reviews"
```

---

### Task 5: New + Edit Forms

**Files:**
- Modify: `Air-Bnb/views/listings/new.ejs`
- Modify: `Air-Bnb/views/listings/edit.ejs`

**Interfaces:**
- Consumes: CSS from Task 1: `.form-page`, `.form-card`, `.form-card-title`, `.btn-coral`, `.w-full`, `.current-image-thumb`, `.image-preview-thumb`
- Consumes: JS hooks (unchanged): `#image` → `#imagePreview` (image preview)
- EJS variable (edit only): `listing` (has `.title`, `.description`, `.image.url`, `.price`, `.location`, `.country`)

**Test:** Log in, go to `/listings/new`. Check: warm sand background, white centered card, coral submit button, image preview appears when file selected. Go to `/listings/:id/edit` — all fields pre-filled correctly (title, description, country, price, location all populated from listing data).

- [ ] **Step 1: Rewrite `views/listings/new.ejs`**

```html
<% layout("/layouts/boilerplate") %>

<div class="form-page">
  <div class="form-card">
    <h2 class="form-card-title">List your space</h2>

    <form action="/listings" method="POST" enctype="multipart/form-data" class="needs-validation" novalidate>

      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" name="listing[title]" id="title" class="form-control" required placeholder="Cozy mountain cabin in Manali">
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea name="listing[description]" id="description" rows="4" class="form-control" required placeholder="Describe your space..."></textarea>
        <div class="invalid-feedback">Please add a description.</div>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Photo</label>
        <input type="file" name="listing[image]" id="image" class="form-control" accept="image/*">
        <img id="imagePreview" class="image-preview-thumb" src="" alt="Preview">
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="price" class="form-label">Price per night (₹)</label>
          <input type="number" name="listing[price]" id="price" class="form-control" required min="0" placeholder="2500">
          <div class="invalid-feedback">Please enter a price.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="location" class="form-label">Location</label>
          <input type="text" name="listing[location]" id="location" class="form-control" required placeholder="Manali, Himachal Pradesh">
          <div class="invalid-feedback">Please enter a location.</div>
        </div>
      </div>

      <div class="mb-4">
        <label for="country" class="form-label">Country</label>
        <input type="text" name="listing[country]" id="country" class="form-control" required placeholder="India">
        <div class="invalid-feedback">Please enter a country.</div>
      </div>

      <button type="submit" class="btn-coral w-full">Create Listing</button>
    </form>
  </div>
</div>
```

- [ ] **Step 2: Rewrite `views/listings/edit.ejs`**

```html
<% layout("/layouts/boilerplate") %>

<div class="form-page">
  <div class="form-card">
    <h2 class="form-card-title">Edit your listing</h2>

    <form action="/listings/<%= listing._id %>?_method=PUT" method="POST" enctype="multipart/form-data" class="needs-validation" novalidate>

      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" name="listing[title]" id="title" class="form-control" required value="<%= listing.title %>">
        <div class="invalid-feedback">Please enter a title.</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea name="listing[description]" id="description" rows="4" class="form-control" required><%= listing.description %></textarea>
        <div class="invalid-feedback">Please add a description.</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Current Photo</label><br>
        <img src="<%= listing.image.url %>" class="current-image-thumb" alt="Current image">
        <label for="image" class="form-label">Replace Photo (optional)</label>
        <input type="file" name="listing[image]" id="image" class="form-control" accept="image/*">
        <img id="imagePreview" class="image-preview-thumb" src="" alt="Preview">
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="price" class="form-label">Price per night (₹)</label>
          <input type="number" name="listing[price]" id="price" class="form-control" required min="0" value="<%= listing.price %>">
          <div class="invalid-feedback">Please enter a price.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="location" class="form-label">Location</label>
          <input type="text" name="listing[location]" id="location" class="form-control" required value="<%= listing.location %>">
          <div class="invalid-feedback">Please enter a location.</div>
        </div>
      </div>

      <div class="mb-4">
        <label for="country" class="form-label">Country</label>
        <input type="text" name="listing[country]" id="country" class="form-control" required value="<%= listing.country %>">
        <div class="invalid-feedback">Please enter a country.</div>
      </div>

      <button type="submit" class="btn-coral w-full">Save Changes</button>
    </form>
  </div>
</div>
```

- [ ] **Step 3: Verify visually**

Log in, go to `/listings/new`. Check: sand bg, white centered card, coral "Create Listing" button, file input shows image preview. Go to any listing you own, click Edit. Check: all fields pre-filled (title, description, price, location, country all populated).

- [ ] **Step 4: Commit**

```bash
git add Air-Bnb/views/listings/new.ejs Air-Bnb/views/listings/edit.ejs
git commit -m "style: warm modern new/edit form cards on sand background"
```

---

### Task 6: Auth Pages + Error Page

**Files:**
- Modify: `Air-Bnb/views/users/login.ejs`
- Modify: `Air-Bnb/views/users/signup.ejs`
- Modify: `Air-Bnb/views/listings/error.ejs`

**Interfaces:**
- Consumes: CSS from Task 1: `.auth-layout`, `.auth-image`, `.auth-image-overlay`, `.auth-image-text`, `.auth-panel`, `.auth-form-inner`, `.auth-title`, `.auth-subtitle`, `.auth-switch`, `.btn-coral`, `.w-full`, `.error-page`, `.error-inner`, `.error-code`, `.error-heading`, `.error-body`
- EJS variables (error page): `statusCode` (number), `message` (string)
- Form `action` attributes unchanged: login → `action="/login" method="POST"`, signup → `action="/signup" method="POST"`

**Test:** Go to `/login` — split layout: travel photo left (with dark overlay and white text), white form right with "Welcome back" heading, coral Login button, "Don't have an account? Sign up" link. Go to `/signup` — same split layout with "Create account" heading. Go to `/listings/invalidid` — coral error code, error heading, coral "Go home" button.

- [ ] **Step 1: Rewrite `views/users/login.ejs`**

```html
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

        <button type="submit" class="btn-coral w-full">Login</button>
      </form>

      <div class="auth-switch">
        Don't have an account? <a href="/signup">Sign up</a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Rewrite `views/users/signup.ejs`**

```html
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

        <button type="submit" class="btn-coral w-full">Create Account</button>
      </form>

      <div class="auth-switch">
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Rewrite `views/listings/error.ejs`**

```html
<% layout("/layouts/boilerplate") %>

<div class="error-page">
  <div class="error-inner">
    <div class="error-code"><%= statusCode %></div>
    <h2 class="error-heading"><%= statusCode === 404 ? "Page not found" : "Something went wrong" %></h2>
    <p class="error-body"><%= message || "We couldn't find what you were looking for." %></p>
    <a href="/listings" class="btn-coral">Go back home</a>
  </div>
</div>
```

- [ ] **Step 4: Verify visually**

Go to `/login` — split layout, travel photo left, white form right. Go to `/signup` — same. Go to `/listings/badid` — coral error code, warm sand background.

- [ ] **Step 5: Commit**

```bash
git add Air-Bnb/views/users/login.ejs Air-Bnb/views/users/signup.ejs Air-Bnb/views/listings/error.ejs
git commit -m "style: warm modern auth split layout and styled error page"
```
