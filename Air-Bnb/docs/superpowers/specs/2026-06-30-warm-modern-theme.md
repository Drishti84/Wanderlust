# Wanderlust — Warm Modern Theme Redesign

**Date:** 2026-06-30
**Scope:** Complete visual overhaul of all CSS, EJS templates, and JS. No backend changes, no schema changes, no new routes.
**Direction:** Airbnb-flavored but distinctly Wanderlust — warm sand background, coral accent, Plus Jakarta Sans, clean white cards.

---

## Design System

### Color Tokens (CSS custom properties on `:root`)

```css
--bg:             #F7F3ED   /* warm sand page background */
--surface:        #FFFFFF   /* cards, navbar, panels */
--coral:          #FF385C   /* primary CTA, active states */
--coral-hover:    #E0314F   /* hover on coral buttons */
--coral-light:    #FFF0F3   /* tinted bg for flash success */
--text-primary:   #222222   /* headings, body copy */
--text-secondary: #717171   /* captions, meta, labels */
--border:         #EBEBEB   /* card borders, dividers, inputs */
--shadow-sm:      0 1px 4px rgba(0,0,0,0.06)
--shadow-md:      0 2px 12px rgba(0,0,0,0.08)
--shadow-lg:      0 8px 32px rgba(0,0,0,0.12)
--radius-card:    16px
--radius-btn:     8px
--radius-pill:    999px
--radius-input:   8px
```

### Typography

**Font:** `Plus Jakarta Sans` — Google Fonts, weights 400/500/600/700/800.
Single font family for everything — headings and body. Loaded via `<link>` in `boilerplate.ejs`.

| Role | Weight | Size |
|---|---|---|
| Page title (h1) | 800 | 2rem |
| Section heading (h2) | 700 | 1.5rem |
| Card title | 600 | 1rem |
| Body / labels | 400–500 | 0.9375rem |
| Caption / meta | 400 | 0.8125rem |

---

## Page-by-Page Layout

### `boilerplate.ejs`
- Replace Google Fonts link: load `Plus Jakarta Sans` (weights 400;500;600;700;800)
- Body background: `var(--bg)`
- Container max-width: 1200px, padding: 0 1.5rem
- Remove `data-bs-theme` attribute (not using Bootstrap dark mode)

### `navbar.ejs`
- Background: `var(--surface)`, border-bottom: `1px solid var(--border)`, sticky top, `z-index: 100`
- `box-shadow: var(--shadow-sm)`
- Inner layout: `display: flex; align-items: center; justify-content: space-between; height: 72px`
- **Left:** "Wanderlust" wordmark in `var(--coral)`, `font-weight: 800`, `font-size: 1.375rem`, letter-spacing -0.5px
- **Center (desktop only):** pill search bar — `border: 1.5px solid var(--border)`, `border-radius: var(--radius-pill)`, `padding: 10px 20px`, `display: flex; align-items: center; gap: 8px`, placeholder "Search destinations...", coral magnifier icon on right
- **Right:** 
  - Logged out: `Login` ghost button + `Sign up` coral pill button
  - Logged in: `Add Listing` ghost button + avatar circle (initials, coral bg) with dropdown (Logout)
- Mobile: center search hidden, hamburger → slide-down panel with nav links

### `index.ejs` — Listings Grid

**Filter bar:**
- Horizontal scroll row, `padding: 16px 0`, `gap: 10px`, no scrollbar visible
- Each pill: `border: 1.5px solid var(--border)`, `border-radius: var(--radius-pill)`, `padding: 8px 18px`, `font-size: 0.875rem`, `font-weight: 500`, bg white
- Active / hover: `border-color: var(--text-primary)`, `background: var(--text-primary)`, `color: white`
- 11 categories with `data-category` attrs (UI only)

**Tax toggle:**
- Right-aligned above grid, Bootstrap `form-check form-switch`
- Label: `Show total with taxes` in `var(--text-secondary)`

**Listings grid:**
- `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px`
- No Bootstrap card classes

**Listing card:**
- No border, no box-shadow by default — clean float effect
- Image: `width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: var(--radius-card); display: block`
- Hover on image: `transform: scale(1.02)`, transition 200ms ease
- Card body (below image, no bg needed):
  - Row 1: title (`font-weight: 600, color: var(--text-primary)`) right-aligned star + rating (`font-size: 0.875rem`)
  - Row 2: location in `var(--text-secondary)`, `font-size: 0.875rem`
  - Row 3: `₹price` bold + `/ night` in secondary
  - Row 4 (tax line): `₹total with taxes` in secondary, hidden by default, shown when tax toggle on
- The whole card is a link — `<a>` wraps image + body, no underline

### `show.ejs` — Listing Detail

**Layout:** CSS Grid two-column desktop — `grid-template-columns: 1fr 380px; gap: 48px`. Single column below 768px.

**Left column:**
- Hero image: `width: 100%; border-radius: var(--radius-card); aspect-ratio: 16/9; object-fit: cover; margin-bottom: 24px`
- Title: `font-size: 1.75rem; font-weight: 700; color: var(--text-primary)`
- Owner badge: `Hosted by @username` — avatar initial circle (32px, coral) + name in secondary text
- Horizontal rule `border-color: var(--border); margin: 20px 0`
- Description: body text, line-height 1.6
- Meta row: location + country with icons in secondary text
- Price: `₹X,XXX / night` — price in 700 weight, "/ night" in secondary
- Edit/Delete (owner only): small ghost buttons below price

**Right column — booking card:**
- `background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius-card); padding: 24px; position: sticky; top: 96px; box-shadow: var(--shadow-lg)`
- Price repeat at top: `₹X,XXX / night`
- "Booking coming soon" placeholder with calendar icon
- Divider `border-color: var(--border)`
- Review form (logged in) or login prompt

### `new.ejs` + `edit.ejs` — Forms

- Full page bg: `var(--bg)`
- Centered card: `max-width: 680px; margin: 48px auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-card); padding: 40px; box-shadow: var(--shadow-md)`
- Inputs: `border: 1.5px solid var(--border); border-radius: var(--radius-input); background: #fff; color: var(--text-primary)` — focus ring coral `rgba(255,56,92,0.25)`
- Labels: `var(--text-secondary)`, `font-size: 0.875rem`, `font-weight: 500`
- Submit: coral full-width button
- Edit: shows current image thumbnail above image input

### `login.ejs` + `signup.ejs` — Auth Pages

- Full-height two-column split layout: left = travel photo (Unsplash, loaded as CSS `background-image`), right = form panel
- Right panel: `background: var(--surface)`, centered vertically, max-width 440px form
- Inputs: same dark-border style as forms
- Submit: coral full-width button
- Cross-link (`Already have an account? Log in`) in secondary text

### `flash.ejs`

- Success: `background: var(--coral-light); border-left: 4px solid var(--coral); color: var(--text-primary)`
- Error: `background: #FFF5F5; border-left: 4px solid #E53E3E; color: var(--text-primary)`
- Icon + message + close button (×)
- Auto-dismiss after 4s via JS (already in script.js)

### `error.ejs`

- Centered on `var(--bg)` background
- Big coral error code number (5rem, 800 weight)
- Heading in `var(--text-primary)`
- Body message in `var(--text-secondary)`
- Coral "Go home" button

### `footer.ejs`

- `background: var(--surface); border-top: 1px solid var(--border)`
- Three-column layout: Wanderlust wordmark left, copyright center, links right
- Links in `var(--text-secondary)`, hover coral

### Reviews section (`show.ejs` bottom)

- Each review card: `background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px`
- Author: `font-weight: 600; color: var(--text-primary)`
- Date: `font-size: 0.8125rem; color: var(--text-secondary)`
- Star rating: existing starability library, override star color to coral `#FF385C`
- Comment: body text
- Delete button (author only): small red ghost

---

## CSS Architecture (`public/css/style.css`)

Complete rewrite. Sections:
1. CSS custom properties (`:root`)
2. Base resets (body, a, *, html)
3. Bootstrap overrides (form-control, dropdown, nav)
4. Buttons (`btn-coral`, `btn-ghost`, `btn-danger-ghost`, `w-full`)
5. Navbar
6. Filter bar + pills
7. Listings grid + cards
8. Show page (two-col layout, hero, booking card)
9. Review cards + reviews section
10. Form pages (new/edit)
11. Auth pages (split layout)
12. Flash messages
13. Error page
14. Footer
15. Utilities
16. Responsive overrides (`@media max-width: 768px`)

`public/css/rating.css` — keep starability as-is, append override: `.starability-result:before { color: var(--coral); }` and active star labels.

---

## JavaScript (`public/js/script.js`)

No changes needed — existing script.js handles:
- Bootstrap validation
- Image preview
- Flash auto-dismiss (4s)
- Tax toggle
- `confirmDelete()` and `toggleMobileNav()` globals

---

## Files Changed

| File | Change |
|---|---|
| `views/layouts/boilerplate.ejs` | Swap Google Fonts to Plus Jakarta Sans |
| `views/includes/navbar.ejs` | Warm modern navbar with pill search |
| `views/includes/footer.ejs` | White footer, coral brand |
| `views/includes/flash.ejs` | Coral/red tinted banners |
| `views/listings/index.ejs` | Warm card grid, pill filter bar |
| `views/listings/show.ejs` | Two-col layout, white booking card |
| `views/listings/new.ejs` | White form card on sand bg |
| `views/listings/edit.ejs` | White form card on sand bg |
| `views/listings/error.ejs` | Coral error code, warm bg |
| `views/users/login.ejs` | Split auth layout |
| `views/users/signup.ejs` | Split auth layout |
| `public/css/style.css` | Complete rewrite |
| `public/css/rating.css` | Append coral star overrides |

`public/js/script.js` — **no changes**.

---

## Out of Scope

- Search backend
- Booking system
- Category filtering (backend)
- Map integration
- User profiles
- Pagination
