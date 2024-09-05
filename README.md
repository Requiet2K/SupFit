# **SupFit**  
### *Full-stack E-commerce Website with AI Chatbot Integration*

### **Introduction Video**
Click the image below to watch the introduction video.

[![SupFit Demo](https://i.postimg.cc/9XG7tVtK/supfit.jpg)](https://www.youtube.com/watch?v=AK59gSnSVzQ "SupFit E-commerce Platform Demo")

## **Table of Contents**
- [Introduction](#introduction)
- [Some Functionalities](#some-functionalities)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## **Introduction**
**SupFit** is a full-stack e-commerce platform that integrates an AI chatbot to enhance user experience. The platform features secure authentication, scheduled restocks, and optimized performance through caching mechanisms. SupFit is built with modern web development technologies, ensuring scalability, security, and responsiveness across devices.

## **Some Functionalities**
Users can find answers to frequently asked questions (FAQs) and ask any remaining questions to the site’s integrated chatbot (SupMate). Users can search for products using the search bar, add favorite products to their favorites, and view the most purchased products on the site. They can also choose how many minutes before their session times out. To place an order, they need to register and add at least one address. After placing an order, users can track their order and see their previous reviews. They can view product details such as nutrition facts, weight, usage descriptions, reviews, ratings, and stock levels. They can add products to their cart and use discount codes. If the cart total exceeds $50, they get free shipping. The site is responsive, so it works well on all devices without issues.

## **Technologies Used**
- **Backend:**
  - Spring Boot
  - Spring AI
  - Spring Security
  - JPA (Hibernate)
  - MySQL/SQL
  - Redis
- **Frontend:**
  - React.js (with Vite)
  - Redux Toolkit Query
  - TypeScript
  - Bootstrap / Material UI
- **AI Integration:**
  - Ollama LLAMA3 (used rag technique & pinecone vector database)
- **Security:**
  - JSON Web Token (JWT)
- **Other:**
  - EMailJS (for email service integration)
  - External API for Turkish city/district data

## **Features**
- **AI Chatbot Integration**: Improve customer interaction with an AI-powered chatbot for friendly and fast support.
- **Scheduled Job for Restocking**: Automates product restocks at predefined intervals default is every midnight.
- **Caching for Optimized Performance**: Redis caching for faster retrieval of user information and product data.
- **Fully Responsive Design**: Provides a fully user friendly shopping experience across all devices.
- **Secure Authentication**: User login and registration secured with JSON Web Tokens (JWT).
- **Email Notifications**: Integrated with EMailJS for sending transactional emails for the purpose of forgotten password service.
- **External API Integration**: Uses an external API for dynamic city and related district data within Turkey.

## **Installation**

### 1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/supfit.git
   cd supfit
   ```

### 2.  **Backend Setup:**
   
   **Navigate to the backend folder and run:**
   ```
   mvn clean install
   mvn spring-boot:run
   ```

### 3.  **Frontend Setup:**
   **Navigate to the frontend folder and run:**
   ```
   npm install
   npm run dev
   ```

## **Usage**
- Start both the backend and frontend servers.
- Access the app via http://localhost:3000.
- Register an account, browse products, chat with the AI bot, and enjoy the seamless e-commerce experience.
- Before starting, you should add some mock data for the products.
