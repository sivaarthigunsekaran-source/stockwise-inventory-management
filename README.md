# StockWise – Smart Inventory Management System

StockWise is a full-stack inventory management system designed to help businesses monitor products, manage stock levels, track inventory movements, and identify products that need replenishment.

The application provides a React-based dashboard connected to a Spring Boot REST API and MySQL database.

## Features

### Dashboard
- View total number of products
- Monitor total units in stock
- Calculate current inventory value
- Identify low-stock products
- View recent stock transactions
- Quickly add stock from the low-stock section

### Product Management
- Add new products
- View product details
- Search products by name or SKU
- Monitor current stock
- View reorder levels
- Display stock status

### Inventory Management
- View overall inventory
- Monitor stock levels
- Identify low-stock products
- Filter inventory by:
  - All
  - Low Stock
  - Healthy
- Add stock
- Reduce stock

### Stock Transactions
- Record stock-in movements
- Record stock-out movements
- View transaction history
- Track product, quantity, movement type, and transaction date

### Validation and Error Handling
- Validate product information
- Prevent invalid stock quantities
- Prevent stock from becoming negative
- Handle duplicate SKU entries
- Display backend connection errors

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- HTML
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Jakarta Validation

### Database
- MySQL

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

## System Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ REST API
  ▼
Spring Boot Backend
  │
  │ JPA / Hibernate
  ▼
MySQL Database

Project Structure

stockwise-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── Icon.jsx
│   │   ├── Modal.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductTable.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StockModal.jsx
│   │   ├── Toast.jsx
│   │   └── TransactionList.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Inventory.jsx
│   │   └── Transactions.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── config.js
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md

## API

Products

GET    /api/products
GET    /api/products/{id}
GET    /api/products/search
GET    /api/products/low-stock
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}

Stock Management

POST /api/products/{id}/add-stock
POST /api/products/{id}/reduce-stock
Stock Transactions
GET /api/stock-transactions
GET /api/stock-transactions/product/{productId}

Database
The application uses MySQL to store product and stock transaction information.

## Product

Main product information includes:

Product ID
Product name
SKU
Unit cost
Current stock
Reorder level
Stock Transaction

## Transaction information includes:

Transaction ID
Product ID
Quantity
Transaction type
Transaction date
Getting Started
Prerequisites

## Make sure the following are installed:

Java JDK
Node.js
npm
MySQL
Git
1. Clone the Repository
git clone https://github.com/sivaarthigunsekaran-source/stockwise-inventory-management.git
cd stockwise-inventory-management
2. Start the Backend

Open the Spring Boot backend project in your IDE.

Make sure MySQL is running and the database configuration is correctly configured.

Start the Spring Boot application.

The backend runs on:

http://localhost:8080
3. Start the Frontend

 ## Open a terminal inside the frontend project:

npm install

Then:

npm run dev

The frontend runs on:

http://localhost:5173
Application Workflow
Add Product
     │
     ▼
Product stored in MySQL
     │
     ▼
Monitor Inventory
     │
     ├── Add Stock
     │
     └── Reduce Stock
             │
             ▼
      Stock Transaction
             │
             ▼
       Dashboard Update
             │
             ▼
      Low Stock Detection
Current Implementation

## The current version includes:

Product management
Inventory monitoring
Stock-in and stock-out operations
Transaction tracking
Low-stock detection
Dashboard statistics
Search functionality
React and Spring Boot integration
MySQL persistence
Future Enhancements

## Potential future improvements include:

Supplier management
Automated reorder recommendations
Supplier intelligence
Advanced analytics
Inventory charts
Authentication and role-based access
Export reports
Email notifications for low stock
Deployment to a cloud platform

## Screenshots

Screenshots of the dashboard, products, inventory, and transaction pages will be added here.

## Author

Sivaarthi Gunasekaran

B.Tech Information Technology