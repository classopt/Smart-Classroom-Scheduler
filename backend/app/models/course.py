from .. import db

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    course_type = db.Column(db.String(20), nullable=False, default='Theory') # Theory or Lab
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)
    
    workloads = db.relationship('Workload', backref='course', lazy=True)

    def __repr__(self):
        return f'<Course {self.code}>'
