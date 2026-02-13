import pytest
from app import create_app, db
from app.models import Department, Program, Batch, Section, Teacher, Course, Room, Workload

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    })

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def sample_data(app):
    with app.app_context():
        it_dept = Department(name="IT", code="IT")
        db.session.add(it_dept)
        db.session.commit()
        
        bca = Program(name="BCA", code="BCA", department_id=it_dept.id)
        db.session.add(bca)
        db.session.commit()
        
        batch = Batch(name="B23", academic_year="2023", program_id=bca.id)
        db.session.add(batch)
        db.session.commit()
        
        section = Section(name="A", batch_id=batch.id, student_count=30)
        db.session.add(section)
        
        course = Course(name="Python", code="IT1", credits=4, department_id=it_dept.id, course_type="Theory")
        db.session.add(course)
        db.session.commit()
        
        teacher = Teacher(name="Test Teacher", email="test@test.com")
        teacher.qualified_courses.append(course)
        db.session.add(teacher)
        
        room = Room(name="101", capacity=50, room_type="Classroom")
        db.session.add(room)
        db.session.commit()
        
        return {
            "dept": it_dept,
            "section": section,
            "course": course,
            "teacher": teacher,
            "room": room
        }
