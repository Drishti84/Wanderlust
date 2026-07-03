# Wanderlust

A full-stack Airbnb-inspired vacation rental platform built with Node.js, Express, MongoDB, and EJS.

**Live Demo:** [air-bnb-jtw3.onrender.com](https://air-bnb-jtw3.onrender.com/listings)

## Features

- **Browse Listings** — 22 curated listings across 11 categories: Trending, Rooms, Cities, Mountains, Castles, Pools, Camping, Farms, Arctic, Domes, and Boating
- **Category Filter** — Filter listings by category with pill navigation
- **Search** — Search by destination, city, or country from the navbar
- **Interactive Map** — OpenStreetMap embed on each listing with a Get Directions link to Google Maps
- **Booking System** — Date picker with real-time conflict detection, price calculation, and guest selection
- **My Bookings** — View and cancel upcoming bookings from your account
- **Reviews** — Star ratings and comments on each listing
- **Authentication** — Sign up, log in, and log out with session-based auth
- **Listing Management** — Create, edit, and delete your own listings with image upload
- **Responsive Design** — Mobile-friendly warm modern UI with coral accents

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Templating | EJS + ejs-mate |
| Auth | Passport.js (passport-local-mongoose) |
| Image Storage | Cloudinary + Multer |
| Maps | OpenStreetMap iframe embed |
| Styling | Custom CSS + Bootstrap 5.3 (grid only) |
| Validation | Joi |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Installation

```bash
git clone https://github.com/Drishti84/Air-Bnb.git
cd Air-Bnb/Air-Bnb
npm install
```

### Environment Variables

Create a `.env` file in the `Air-Bnb/` directory:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### Seed the Database

```bash
node init/seed.js
```

This seeds 22 listings with 2–4 reviews and pre-populated busy booking dates per listing.

### Run the App

```bash
node app.js
# Server starts at http://localhost:8080
```

## Project Structure

```
Air-Bnb/
├── app.js                  # Express app entry point
├── middleware.js            # Auth & validation middleware
├── schema.js               # Joi validation schemas
├── cloudConfig.js          # Cloudinary configuration
├── controllers/
│   ├── listing.js          # Listing CRUD + search/filter
│   ├── review.js           # Review create/delete
│   ├── user.js             # Auth (signup/login/logout)
│   └── booking.js          # Booking create/cancel
├── models/
│   ├── listing.js          # Listing schema (with category & coordinates)
│   ├── review.js           # Review schema
│   ├── user.js             # User schema (passport-local-mongoose)
│   └── booking.js          # Booking schema (conflict detection index)
├── routes/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   ├── booking.js
│   └── myBookings.js
├── views/
│   ├── layouts/boilerplate.ejs
│   ├── includes/           # Navbar, footer, flash messages
│   ├── listings/           # Index, show, new, edit
│   ├── bookings/           # My Bookings page
│   └── users/              # Login, signup
├── public/
│   ├── css/style.css       # Design system (warm modern theme)
│   └── js/script.js        # Client-side validation & image preview
└── init/seed.js            # Database seeder
```

## Demo Credentials

| Username | Password |
|----------|----------|
| `guest` | `guest1234` |
