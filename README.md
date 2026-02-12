☕ Coffee Browsing & Ordering Platform

A full-stack MERN application that allows users to browse specialty coffee products, view detailed product information, and place orders using secure online payments.

📌 Overview

This project simulates a real-world coffee e-commerce platform, focusing on clean API design, realistic product data modeling, and end-to-end transaction workflows. Users can browse curated coffee products, explore detailed attributes (origin, roast level, tasting notes), and complete checkout using PayPal.

The goal of this project was to practice building a production-style full-stack application, including frontend UX, backend APIs, database integration, and third-party payment services.

🛠️ Tech Stack
Frontend

React

TypeScript

Vite

Tailwind CSS

Backend

Node.js

Express.js

MongoDB (MongoDB Atlas)

PayPal Payments API

Hosting

Frontend: Vercel

Backend: Render (free tier)

Database: MongoDB Atlas

✨ Key Features

Browse specialty coffee products with rich metadata (origin, roast level, tasting notes, brew methods)

View individual product details

Secure checkout using PayPal

Responsive UI optimized for desktop and mobile

Modular, reusable React components

RESTful API design

🧩 Data Modeling

Products are modeled to reflect real specialty coffee catalog data, including:

Origin, region, farm, and altitude

Roast level and processing method

Tasting notes and brew recommendations

Multiple size variants (retail and wholesale)

Inventory tracking and featured products

This structure was designed to resemble data used in real e-commerce or coffee distributor systems rather than simplified demo data.

💳 Payments

PayPal is integrated to handle secure online payments.
The checkout flow demonstrates:

Client-side order creation

Server-side payment processing

Confirmation of successful transactions

This simulates real-world payment workflows commonly found in production e-commerce systems.

⚡ Performance Notes (Important)

The backend is hosted on Render’s free tier, which introduces cold-start delays when the server has been inactive. As a result:

The first request after inactivity may take up to 30–60 seconds

Subsequent requests are significantly faster

To improve performance and scalability:

API responses were optimized to return only required fields

Pagination support was added to reduce payload size

Frontend loading states were implemented to improve perceived performance

Future improvements could include:

Caching frequently accessed data

Always-on backend hosting

CDN-backed API responses

These trade-offs were intentionally accepted to keep the project within free-tier infrastructure while still demonstrating real-world engineering considerations.

🧠 What I Learned

Designing realistic product schemas for frontend and backend

Building RESTful APIs for e-commerce-style workflows

Integrating third-party payment services (PayPal)

Handling infrastructure constraints such as cold starts

Improving perceived performance through frontend UX patterns

Communicating technical trade-offs clearly
