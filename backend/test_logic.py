from app import create_app, db
from app.models import Teacher, Course, Section, Workload

app = create_app()

def test_workload_logic():
    with app.app_context():
        # Get our seeded data
        ajay = Teacher.query.filter_by(name="Prof. Ajay").first()
        kumar = Teacher.query.filter_by(name="Prof. Kumar").first()
        python = Course.query.filter_by(code="IT101").first()
        sec_a = Section.query.filter_by(name="Sec A").first()

        print(f"Testing Workload for {ajay.name} (Qualified for {python.name})...")
        # Logic matches resources.py/scheduling.py logic
        if python in ajay.qualified_courses:
            workload = Workload(teacher_id=ajay.id, course_id=python.id, section_id=sec_a.id)
            db.session.add(workload)
            db.session.commit()
            print("SUCCESS: Prof. Ajay assigned to Python.")
        else:
            print("FAILURE: Prof. Ajay should have been qualified.")

        print(f"\nTesting Workload for {kumar.name} (NOT Qualified for {python.name})...")
        if python in kumar.qualified_courses:
            print("FAILURE: Prof. Kumar should NOT be qualified for Python.")
        else:
            print("CORRECT: Prof. Kumar blocked from Python (Domain Expertise protected).")

if __name__ == "__main__":
    test_workload_logic()
