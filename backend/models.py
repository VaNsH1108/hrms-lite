from sqlalchemy import Column, String, Date, ForeignKey
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"))
    date = Column(Date)
    status = Column(String)
