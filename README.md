# Project 4: Art Toy Pre-Order System

Members:
- Bhuribhat Ratanasanguanvongs
- Sirawitch Tiyasuttipun

## Project Setup Instructions

Follow the steps below to set up and run the project locally.

## 📁 Project Structure

```
project-root/
├── backend/     # Backend source code (Node.js)
├── frontend/    # Frontend source code (e.g., React/Vue)
└── README.md    # Project setup and documentation
```

---

## 1. Clone the Repository

```bash
$ git clone https://github.com/sirawitch/project_swdevprac
$ cd project_swdevprac
```

---

## 2. Frontend Setup

### Environment Variables

Create a `.env.local` file inside the `frontend` directory and add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Install & Run

```bash
$ cd frontend
$ npm install
$ npm run dev
```

This will install the necessary dependencies and start the frontend development server.  
The website is available at http://localhost:3000

---

## 3. Backend Setup

### Environment Variables

Create a `config.env` file inside the `backend/config` directory and add the following:

```env
PORT=5001
NODE_ENV=development

MONGO_URI=
JWT_SECRET=
JWT_EXPIRE=
JWT_COOKIE_EXPIRE=

FRONTEND_URL=http://localhost:3000
```

> 🔐 __Note:__ Fill in the values for `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, and `JWT_COOKIE_EXPIRE` as per your project's requirements.

### Install & Run

```bash
$ cd backend
$ npm install
$ npm run dev
```

This will install the backend dependencies and start the backend server in development mode.  
The API document is available at http://localhost:5001/api-docs

---

## Notes

- Make sure you have **Node.js** and **npm** installed on your system.
- You may need to set up environment variables depending on your project configuration.