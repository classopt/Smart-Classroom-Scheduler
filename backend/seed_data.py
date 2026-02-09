from app import create_app, db
from app.models import Department, Program, Batch, Section, Course, Teacher, Room

app = create_app()

def seed():
    with app.app_context():
        # Reset database
        print("Resetting database...")
        db.drop_all()
        db.create_all()

        print("Seeding Departments...")
        it_dept = Department(name="Information Technology", code="IT")
        cs_dept = Department(name="Computer Science", code="CS")
        db.session.add_all([it_dept, cs_dept])
        db.session.commit()

        print("Seeding Programs...")
        bca = Program(name="Bachelor of Computer Applications", code="BCA", department_id=it_dept.id)
        mca = Program(name="Master of Computer Applications", code="MCA", department_id=it_dept.id)
        db.session.add_all([bca, mca])
        db.session.commit()

        print("Seeding Batches & Sections...")
        batch_23 = Batch(name="Batch 2023-26", academic_year="2023-24", program_id=bca.id)
        db.session.add(batch_23)
        db.session.commit()
        
        sec_a = Section(name="Sec A", batch_id=batch_23.id)
        sec_b = Section(name="Sec B", batch_id=batch_23.id)
        db.session.add_all([sec_a, sec_b])

        print("Seeding Courses...")
        python_course = Course(name="Python Programming", code="IT101", credits=4, department_id=it_dept.id)
        db.session.add(python_course)
        db.session.commit()

        print("Seeding Teachers...")
        prof_ajay = Teacher(name="Prof. Ajay", email="ajay@university.edu")
        prof_ajay.departments.append(it_dept)
        # Ajay is qualified for Python
        prof_ajay.qualified_courses.append(python_course)
        
        prof_kumar = Teacher(name="Prof. Kumar", email="kumar@university.edu")
        prof_kumar.departments.append(cs_dept)
        # Kumar is NOT qualified for Python (experimental test)
        
        db.session.add_all([prof_ajay, prof_kumar])

        print("Seeding Rooms...")
        room101 = Room(name="Room 101", capacity=60, room_type="Classroom")
        lab1 = Room(name="IT Lab 1", capacity=30, room_type="Lab")
        db.session.add_all([room101, lab1])

        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
