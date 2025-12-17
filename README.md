# 🍽️ Whitelabel Restaurant

A full-stack **restaurant management solution** designed with a **white-label architecture**. The platform allows customizable branding and configuration, enabling multiple restaurant businesses to manage their online presence, menus, events, and reservations through a **single unified system**.

---

## 📁 Project Structure

The project is organized as a **monorepo** containing both frontend and backend applications:

```text
whitelabel-restaurant/
├── client/   # Angular frontend
└── server/   # Node.js + Express backend
```

* **`client/`** → Frontend application built with **Angular**
* **`server/`** → Backend REST API built with **Node.js**, **Express**, and **TypeScript**

---

## ✨ Features

* 🎨 **White-label Configuration**
  Customizable restaurant identity: logo, social links, theme, and "About Us" content.

* 📖 **Menu Management**
  Dynamic management of menu categories, items, and specialties.

* 🪑 **Reservation System**
  Customer table booking with admin-side reservation management.

* 🎉 **Event Management**
  Create, publish, and manage restaurant events.

* 🛠️ **Admin Dashboard**
  Secure control panel for restaurant administrators.

* 🌍 **Public Landing Page**
  Customer-facing website showcasing menus, events, and restaurant info.

* 🔐 **Authentication**
  Secure JWT-based authentication for administrators.

* 🌐 **Multi-language Support**
  Built-in localization for wider accessibility.

---

## 🧰 Tech Stack

### Backend (`/server`)

* **Runtime**: Node.js
* **Framework**: Express.js
* **Language**: TypeScript
* **Database**: MongoDB (Mongoose ODM)
* **Architecture**: `routing-controllers` (class-based routing & DI)
* **Authentication**: `jsonwebtoken`, `bcryptjs`
* **File Uploads**: `multer`

### Frontend (`/client`)

* **Framework**: Angular v19
* **Styling**: SCSS, Bootstrap
* **State & HTTP**: RxJS

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed on your machine:

* [Node.js](https://nodejs.org/) (LTS recommended)
* [MongoDB](https://www.mongodb.com/) (local or Atlas)
* [Angular CLI](https://angular.io/cli) *(optional but recommended)*

---

## 🖥️ Server Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the **server root directory**:

```env
# Server Configuration
PORT=3000

# Database Connection
MONGO_URI=mongodb://localhost:27017/whitelabel_restaurant

# Security & Authentication
JWT_SECRET=your_super_secret_jwt_key
BCRYPT_SALT=10

# CORS Configuration
CLIENT_URL=http://localhost:4200
```

### 3. Run the Server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

The API will be available at:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Client Setup

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Run the Client

```bash
npm start
```

The frontend application will be available at:

👉 **[http://localhost:4200](http://localhost:4200)**

---

## 🔌 API Overview

The backend exposes a **RESTful API** organized by resource controllers:

| Resource        | Endpoint           | Description                         |
| --------------- | ------------------ | ----------------------------------- |
| Whitelabel      | `/whitelabel`      | Global restaurant configuration     |
| Authentication  | `/auth`            | Admin login & registration          |
| Menu            | `/menu`            | Menu items management               |
| Menu Categories | `/menu-categories` | Menu category management            |
| Reservations    | `/reservations`    | Table booking logic                 |
| Events          | `/events`          | Restaurant events                   |
| TheFork         | `/thefork`         | Third-party reservation integration |
| Users           | `/users`           | System user management              |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add NewFeature"
```

4. Push to the branch

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

✨ *Whitelabel Restaurant – One platform, infinite restaurant brands.*
