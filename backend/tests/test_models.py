from app.models import Department, Teacher, Course

def test_department_model(app):
    with app.app_context():
        dept = Department(name="Science", code="SCI")
        assert dept.name == "Science"
        assert dept.code == "SCI"

def test_teacher_qualification_link(app):
    with app.app_context():
        t = Teacher(name="Dr. Smith", email="smith@test.com")
        c = Course(name="Bio", code="B1", credits=3)
        t.qualified_courses.append(c)
        assert c in t.qualified_courses
        assert t in c.qualified_teachers
