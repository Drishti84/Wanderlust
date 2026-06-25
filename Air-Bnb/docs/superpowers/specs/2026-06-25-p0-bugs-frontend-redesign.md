# P0 Bugs + Frontend Redesign — Wanderlust

**Date:** 2026-06-25
**Scope:** Fix 9 active bugs + complete visual redesign. No schema changes, no new backend routes.
**Approach:** Deep CSS override — keep Bootstrap for grid/layout, replace all visual defaults with custom CSS.

---

## Bug Fixes

1. `edit.ejs:40` — country input uses `listing.title` → change to `listing.country`
2. `show.ejs:86` — review delete button shows for all users → wrap in `<% if(currUser && currUser._id.equals(review.author._id)) { %>`
3. `middleware.js:47-52` — `validateReview` never throws or calls next on error → add `throw new expressError(400, errMsg)`
4. `show.ejs:84` — hardcoded "Rated: 3 stars" → already uses `data-rating` attribute, just remove the static text inside the `<p>`
5. `controllers/users.js` — `next` undeclared in `signup` and `logout` → add `next` to both function signatures
6. `models/review.js:13` — `Date.now()` called at schema load → change to `Date.now` (no parentheses)
7. Navbar search bar — dead form → add `action="/listings" method="GET"` and wire `name="q"` on input (UI only this pass, no backend)
8. Filter buttons — pure UI, no data → keep as UI, mark clearly with `data-category` attrs for future wiring
9. `cloudConfig.js:15` — `allowedFormats` returns `'jpeg'` (comma operator) → change to `['png', 'jpg', 'jpeg']`

---

## Design System

### Colors (CSS custom properties on `:root`)
```css
--bg-primary:    #0D0D0D
--bg-card:       #1A1A1A
--bg-elevated:   #242424
--accent-gold:   #D4AF37
--accent-muted:  #8B7522
--text-primary:  #F5F5F0
--text-secondary:#9A9A8E
--border:        rgba(212,175,55,0.15)
--glass-bg:      rgba(26,26,26,0.7)
```

### Typography
- Headings: `Playfair Display` (Google Fonts)
- Body/UI: `Inter` (Google Fonts)
- Loaded via single `<link>` in `boilerplate.ejs`

### Reusable Patterns
- **Glass card:** `background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 16px;`
- **Gold button:** `background: var(--accent-gold); color: #0D0D0D; border-radius: 8px; font-weight: 600;`
- **Ghost button:** `background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold);`
- **Dark input:** `background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); border-radius: 8px;`

---

## Page-by-Page Layout

### `boilerplate.ejs`
- Add Google Fonts link (Playfair Display + Inter)
- Set `data-bs-theme` on `<html>` — not using Bootstrap dark mode, just a hook
- Body background: `var(--bg-primary)`

### `navbar.ejs`
- Fix broken nested collapse divs — single proper structure
- Remove inline `<style>` block
- Dark bar `#111`, gold-tinted bottom border
- Left: gold compass + "Wanderlust" in Playfair Display
- Center: styled search input (dark bg, gold focus ring) with `action="/listings" method="GET"`
- Right: `Add Listing` ghost button + Login/Signup OR username initial avatar + dropdown (Profile placeholder, Logout)
- Sticky with `backdrop-filter: blur(10px)`

### `index.ejs`
- Remove inline `<style>` block → move all styles to `style.css`
- Filter row: horizontal scroll, pill buttons with gold border on hover, `data-category` attrs
- Tax toggle: restyled to dark theme
- Cards: glassmorphism surface, image 220px tall `object-fit: cover`, card body shows title, location, `★ rating` placeholder, `₹price / night`
- Card hover: `translateY(-4px)` lift, gold border brightens
- Grid: `row-cols-lg-3 row-cols-md-2 row-cols-sm-1`

### `show.ejs`
- Two-column layout desktop (60/40), single column mobile
- Left: hero image (400px, border-radius 16px), title in Playfair Display, owner badge, description, location/country row, price
- Edit/Delete as small ghost buttons (owner only), delete triggers `confirm()` dialog
- Right: sticky glassmorphism card — booking teaser placeholder + review form
- Reviews section below: dark cards, star display via existing starability, reviewer + date, delete only for author
- Fix: remove hardcoded "Rated: 3 stars" text

### `new.ejs`
- Dark full-page background
- Form in centered glassmorphism card (max-width 680px)
- All inputs styled dark
- Image upload: JS preview on file select
- Labels in `--text-secondary`, inputs dark bg

### `edit.ejs`
- Same card layout as new.ejs
- Fix: country input pre-fills with `listing.country`
- Fix: description textarea pre-fills with `listing.description` as inner text (not placeholder)
- Existing image shown as small thumbnail, labelled "Current image"

### `login.ejs` + `signup.ejs`
- Full-height two-column layout: left = full-bleed Unsplash travel image, right = dark form panel
- Form centered vertically on right side
- Gold submit button
- signup.ejs: link to login at bottom; login.ejs: link to signup

### `flash.ejs`
- Replace Bootstrap alert colors with dark-themed versions using gold for success, red-tinted for error
- Auto-dismiss after 4s via JS

### `error.ejs`
- Large gold error code, Playfair Display heading, body text, "Go back home" gold button

### `footer.ejs`
- Dark background matching `--bg-primary`, gold social icons on hover
- Three-column layout: brand left, copyright center, links right

---

## CSS Architecture (`style.css`)

Single file, organized in sections:
1. CSS custom properties (`:root`)
2. Base resets (body, a, html)
3. Bootstrap overrides (form-control, btn, navbar, card)
4. Navbar
5. Listing cards + grid
6. Show page (two-column, hero image, booking card)
7. Review cards
8. Auth pages (split layout)
9. Form pages (new/edit)
10. Footer
11. Flash messages
12. Error page
13. Utilities (glass-card mixin class, gold-btn, ghost-btn)
14. Responsive overrides (`@media`)

`rating.css` — keep as-is (starability library), only add dark-mode color overrides.

---

## Files Changed

| File | Change |
|---|---|
| `views/layouts/boilerplate.ejs` | Add Google Fonts, body bg |
| `views/includes/navbar.ejs` | Full rewrite, fix structure, dark theme |
| `views/includes/footer.ejs` | Dark theme, layout fix |
| `views/includes/flash.ejs` | Dark-themed alerts, auto-dismiss |
| `views/listings/index.ejs` | Remove inline styles, dark cards, filter pills |
| `views/listings/show.ejs` | Two-col layout, fix rating text, fix review delete auth |
| `views/listings/new.ejs` | Glass card form, image preview |
| `views/listings/edit.ejs` | Glass card form, fix country bug, fix description bug |
| `views/listings/error.ejs` | Styled error page |
| `views/users/login.ejs` | Split layout |
| `views/users/signup.ejs` | Split layout |
| `public/css/style.css` | Complete rewrite |
| `public/js/script.js` | Add image preview + flash auto-dismiss + delete confirm |
| `models/review.js` | Fix `Date.now()` → `Date.now` |
| `middleware.js` | Fix `validateReview` error handling |
| `controllers/users.js` | Add `next` to signup + logout signatures |
| `cloudConfig.js` | Fix `allowedFormats` array |

---

## Out of Scope (This Pass)

- Search backend route
- Category field on Listing model
- Map integration
- Booking system
- User profile page
- OAuth / password reset
- Pagination
