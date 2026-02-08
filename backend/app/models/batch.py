from .. import db

class Batch(db.Model):
    __tablename__ = 'batches'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) # e.g., "Batch 2023-2026"
    academic_year = db.Column(db.String(20), nullable=False) # e.g., "2023-2024"
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)
    
    sections = db.relationship('Section', backref='batch', lazy=True)

    def __repr__(self):
        return f'<Batch {self.name}>'
