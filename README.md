# Project 4: Art Toy Pre-Order System

Members:
- Bhuribhat Ratanasanguanvongs
- Sirawitch Tiyasuttipun

## 🚀 Full Stack App Project Setup Instructions

This is a full-stack application with a **React (Next.js)** frontend and a **Node.js/Express** backend. The project is containerized using **Docker** for seamless development and deployment.

## 📁 Project Structure

```
project-root/
├── docker-compose.yml         # Orchestrates frontend and backend containers
├── frontend/                  # Frontend (Next.js)
│   ├── Dockerfile             # Docker config for frontend
│   ├── .env.local             # Frontend environment variables
│   └── ...                    # Other frontend files
├── backend/                   # Backend (Node.js + Express)
│   ├── Dockerfile             # Docker config for backend
│   ├── config/
│   │   └── config.env         # Backend environment variables
│   └── ...                    # Other backend files
└── README.md                  # Project setup and documentation
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

### Run Development Servers:

**Backend & Frontend:**

```bash
$ make dev
```

This will run the backend and frontend development servers.    
Open your browser and navigate to the frontend development server URL (e.g., `http://localhost:3000`).

**Docker-Compose:**

```bash
$ docker-compose up -d --build    # To run in background (detached mode)
$ docker-compose down             # To stop the process
```

Where:
- The -f flag is used to specify the file path of the Compose file.
- The -d flag is used to launch the services in the background (i.e. detached mode).

Website:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001/api-docs

---

## Notes

- Make sure you have **Node.js** and **npm** installed on your system.
- You may need to set up environment variables depending on your project configuration.