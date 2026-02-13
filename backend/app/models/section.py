from .. import db

class Section(db.Model):
    __tablename__ = 'sections'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(10), nullable=False) # e.g., "A", "B"
    student_count = db.Column(db.Integer, nullable=False, default=40)
    batch_id = db.Column(db.Integer, db.ForeignKey('batches.id'), nullable=False)
    
    workloads = db.relationship('Workload', backref='section', lazy=True)

    def __repr__(self):
        return f'<Section {self.name}>'
