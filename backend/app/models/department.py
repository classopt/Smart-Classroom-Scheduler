from .. import db


class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    code = db.Column(db.String(10), unique=True, nullable=False)

    courses = db.relationship('Course', backref='department', lazy=True)
    programs = db.relationship('Program', backref='department', lazy=True)

    def __repr__(self):
        return f'<Department {self.code}>'
