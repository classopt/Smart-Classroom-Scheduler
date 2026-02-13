from app.models import TimetableEntry, Workload
from app import db

def test_create_workload_success(client, sample_data):
    """Test successful workload assignment."""
    response = client.post('/api/scheduling/workloads', json={
        "teacher_id": 1, 
        "course_id": 1,
        "section_id": 1,
        "hours_per_week": 3
    })
    assert response.status_code == 201
    assert Workload.query.count() == 1

def test_create_workload_unqualified(client, sample_data):
    """Test workload assignment for unqualified teacher."""
    # Create an unqualified teacher contextually
    from app.models import Teacher
    with db.session.begin():
        bad_teacher = Teacher(name="Bad Teacher", email="bad@test.com")
        db.session.add(bad_teacher)
    
    response = client.post('/api/scheduling/workloads', json={
        "teacher_id": 2, 
        "course_id": 1,
        "section_id": 1
    })
    assert response.status_code == 400
    assert "not qualified" in response.get_json()['error']

def test_generate_timetable(client, sample_data):
    """Test the full generation algorithm."""
    # 1. Setup a valid workload first
    client.post('/api/scheduling/workloads', json={
        "teacher_id": 1,
        "course_id": 1,
        "section_id": 1,
        "hours_per_week": 2
    })
    
    # 2. Trigger generation
    response = client.post('/api/scheduling/generate', json={
        "department_id": 1
    })
    assert response.status_code == 200
    assert response.get_json()['entries'] == 2
    assert TimetableEntry.query.count() == 2
