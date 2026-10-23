# StadtHelfer

StadtHelfer is a full-stack web app for finding local services, events, rentals, and community activities in North Rhine-Westphalia.

Users can search for listings, filter them by category and distance, and view them on a map. Registered users can also create their own listings and leave reviews.

## Features

- Search listings by keyword, category, city, and price
- Find nearby listings using an interactive Leaflet map
- Create, edit, and delete listings
- Register and log in with JWT authentication
- Rate listings and write reviews
- Seed the database with realistic demo data

## Tech Stack

**Frontend**

- Next.js
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Leaflet.js

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- Faker.js

## Getting Started

### Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas account

### 1. Clone the repository


git clone [https://github.com/Shimmerpeace/stadthelfer.git](https://github.com/Shimmerpeace/stadthelfer.git)
cd stadthelfer


### 2. Set up the backend


cd server
npm install


Create a `.env` file inside the `server` folder:


PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/stadthelfer
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000


Add demo data to the database:


npm run seed


Start the backend:


npm run dev


The API will run on:


http://localhost:5000


### 3. Set up the frontend

Open a second terminal:


cd client
npm install


Create a `.env.local` file inside the `client` folder:


NEXT_PUBLIC_API_URL=http://localhost:5000/api


Start the frontend:


npm run dev


Then open:


http://localhost:3000


## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Listings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Get listings with filters |
| GET | `/api/listings/:id` | Get one listing |
| POST | `/api/listings` | Create a listing |
| PUT | `/api/listings/:id` | Update a listing |
| DELETE | `/api/listings/:id` | Delete a listing |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/listing/:listingId` | Get reviews for a listing |
| POST | `/api/reviews` | Add a review |

## Project Structure


stadthelfer/
├─ client/
│  ├─ app/
│  ├─ components/
│  └─ lib/
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ seed/
│  │  └─ index.ts
│  └─ package.json
└─ README.md


## What I Learned

While building this project, I worked with:

- Building a REST API with Express and MongoDB
- Using TypeScript for both frontend and backend
- Managing server data with TanStack Query
- Handling global UI state with Zustand
- Working with geospatial data in MongoDB
- Creating a responsive map-based interface with Leaflet

## Future Improvements

- Add image uploads
- Add favorites and saved searches
- Add direct messaging between users
- Add an admin dashboard
- Add tests and CI/CD

## Author

Created by [Shimmerpeace](https://github.com/Shimmerpeace).
