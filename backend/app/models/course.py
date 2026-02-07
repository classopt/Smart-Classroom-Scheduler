from .. import db

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)