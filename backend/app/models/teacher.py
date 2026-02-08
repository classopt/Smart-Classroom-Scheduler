from .. import db

# Association table for Many-to-Many relationship between Teacher and Department
teacher_departments = db.Table('teacher_departments',
    db.Column('teacher_id', db.Integer, db.ForeignKey('teacher.id'), primary_key=True),
    db.Column('department_id', db.Integer, db.ForeignKey('department.id'), primary_key=True)
)

# Association table for Courses a teacher is qualified to teach
teacher_qualifications = db.Table('teacher_qualifications',
    db.Column('teacher_id', db.Integer, db.ForeignKey('teacher.id'), primary_key=True),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'), primary_key=True)
)

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    availability = db.Column(db.JSON, nullable=True)
    
    # Many-to-Many relationship with Department (Administrative)
    departments = db.relationship('Department', secondary=teacher_departments, 
                                  backref=db.backref('teachers', lazy='dynamic'))
    
    # Many-to-Many relationship with Course (Domain Expertise)
    qualified_courses = db.relationship('Course', secondary=teacher_qualifications,
                                       backref=db.backref('qualified_teachers', lazy='dynamic'))
    
    workloads = db.relationship('Workload', backref='teacher', lazy=True)

    def __repr__(self):
        return f'<Teacher {self.name}>'
