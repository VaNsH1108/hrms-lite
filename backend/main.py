from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import date
import uuid
from fastapi.middleware.cors import CORSMiddleware


from database import SessionLocal, engine
import models

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# Database dependency
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Pydantic Schemas
# ----------------------------
class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str  # Present / Absent

# ----------------------------
# Routes
# ----------------------------

@app.get("/")
def root():
    return {"message": "HRMS Backend with Database is running"}

# ---------- Employee APIs ----------

@app.post("/employees")
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Check duplicate employee_id
    if db.query(models.Employee).filter(
        models.Employee.employee_id == employee.employee_id
    ).first():
        raise HTTPException(status_code=409, detail="Employee ID already exists")

    # Check duplicate email
    if db.query(models.Employee).filter(
        models.Employee.email == employee.email
    ).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    new_employee = models.Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department,
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {"message": "Employee added successfully"}

@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Delete related attendance
    db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).delete()

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}

# ---------- Attendance APIs ----------

@app.post("/attendance")
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    # Check employee exists
    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == attendance.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Prevent duplicate attendance for same date
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date,
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Attendance already marked for this date",
        )

    new_attendance = models.Attendance(
        id=str(uuid.uuid4()),
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status,
    )

    db.add(new_attendance)
    db.commit()

    return {"message": "Attendance marked successfully"}

@app.get("/attendance/{employee_id}")
def get_attendance(employee_id: str, db: Session = Depends(get_db)):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
