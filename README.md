# HRMS Lite – Employee & Attendance Management System

HRMS Lite is a lightweight full-stack Human Resource Management System designed to manage employees and track attendance efficiently. This project demonstrates end-to-end full-stack development including frontend, backend, database integration, and cloud deployment. The application has been built, deployed, and submitted as part of a live full-stack technical assessment.

## Live Application URLs

Frontend (Vercel):  
https://hrms-lite.vercel.app

Backend API (Render):  
https://hrms-lite-backend-xfip.onrender.com

## Tech Stack Used

Frontend:
- React (Vite)
- Axios
- CSS

Backend:
- Python
- FastAPI
- MongoDB Atlas
- PyMongo

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

- Add, view, and delete employees
- Mark attendance (Present / Absent)
- View attendance history per employee
- Automatic calculation of total present days
- RESTful API architecture
- Cloud-deployed full-stack application
- Basic loading, empty, and error UI states

## Project Structure

hrms-lite/
├── backend/
│   ├── models/
│   │   ├── employee.py
│   │   └── attendance.py
│   ├── routes/
│   │   ├── employees.py
│   │   └── attendance.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

## Steps to Run the Project Locally

1. Clone the repository

git clone https://github.com/VaNsH1108/hrms-lite.git  
cd hrms-lite

2. Backend setup

cd backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  
uvicorn main:app --reload

Backend runs at: http://127.0.0.1:8000

3. Frontend setup

cd frontend  
npm install  
npm run dev

Frontend runs at: http://localhost:5173

## Assumptions and Limitations

- No authentication or role-based access control implemented
- Attendance marking is manual
- UI is minimal and focused on core functionality
- Designed for small to medium employee datasets
- MongoDB Atlas free tier is used

## Learning Outcomes

- Full-stack application development
- REST API design using FastAPI
- Database modeling with MongoDB
- Frontend–backend integration
- Cloud deployment and CI/CD fundamentals

## Author

Vansh Gupta  
B.Tech CSE – Final Year Project
