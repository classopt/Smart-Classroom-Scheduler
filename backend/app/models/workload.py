from .. import db

class Workload(db.Model):
    __tablename__ = 'workloads'
    
    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    hours_per_week = db.Column(db.Integer, nullable=False, default=4)
    
    # Optional: Complexity or priority metadata
    # priority = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Workload S:{self.section_id} C:{self.course_id} T:{self.teacher_id}>'
