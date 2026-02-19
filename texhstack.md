# Tech Stack (MERN) – Subscription Intelligence Tracker

## 1. Overview
The **Subscription Intelligence Tracker** is developed using the **MERN Stack**, which includes **MongoDB, Express.js, React.js, and Node.js**.  
This stack is chosen because it provides full JavaScript-based development for both frontend and backend, making the application scalable, fast, and easy to maintain.

---

## 2. Frontend Technologies

### 2.1 React.js
- Used for building the user interface.
- Enables component-based architecture.
- Helps in creating reusable UI components like dashboards, subscription cards, and forms.

### 2.2 React Router DOM
- Used for client-side routing.
- Supports navigation between pages like login, dashboard, subscription list, and analytics.

### 2.3 Tailwind CSS
- Utility-first CSS framework.
- Helps in building responsive UI quickly.
- Ensures consistent styling and faster development.

### 2.4 Recharts / Chart.js
- Used for data visualization.
- Displays charts like:
  - Spend by category (Pie chart)
  - Monthly spend trends (Line chart)
  - Subscription cost comparison (Bar chart)

### 2.5 Axios
- Used to make API requests from frontend to backend.
- Handles HTTP calls for CRUD operations and analytics data.

---

## 3. Backend Technologies

### 3.1 Node.js
- JavaScript runtime environment.
- Used to execute backend server logic.

### 3.2 Express.js
- Backend framework for Node.js.
- Used for routing and API development.
- Handles requests for authentication, subscription management, analytics, and activity logs.

### 3.3 JWT (JSON Web Token)
- Used for user authentication and session management.
- Protects private routes.

### 3.4 bcrypt.js
- Used for password hashing.
- Ensures secure storage of user passwords in the database.

### 3.5 express-validator
- Used for validating incoming request data.
- Prevents invalid inputs and improves security.

---

## 4. Database Technology

### 4.1 MongoDB
- NoSQL database used to store user and subscription data.
- Stores data in document-based format (JSON-like).

### 4.2 Mongoose
- ODM (Object Data Modeling) library for MongoDB.
- Helps in schema creation and database operations.

---

## 5. Development Tools

### 5.1 Git & GitHub
- Used for version control and collaboration.
- Helps track changes and manage codebase.

### 5.2 Postman
- Used for testing backend APIs.
- Helps verify authentication, CRUD operations, and analytics endpoints.

### 5.3 dotenv
- Used for managing environment variables.
- Stores sensitive information like database URL and JWT secret.

---

## 6. Hosting / Deployment (Optional)
Depending on deployment needs, the application can be hosted using:

### Frontend
- Vercel / Netlify

### Backend
- Render / Railway / AWS EC2

### Database
- MongoDB Atlas (Cloud Database)

---

## 7. Why MERN Stack?
The MERN stack is ideal for this project because:
- It uses JavaScript for both frontend and backend.
- Fast development cycle due to reusable components.
- MongoDB provides flexible schema for subscription data.
- React provides interactive dashboards and analytics UI.
- Scalable and widely supported by industry.

---

## 8. Conclusion
The MERN stack provides a complete full-stack solution for building the **Subscription Intelligence Tracker**, ensuring performance, scalability, security, and maintainability.
