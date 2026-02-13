from flask import Blueprint, request, jsonify
from ..models import Department, Program, Batch, Section, Teacher, Course, Room
from .. import db

resources_bp = Blueprint('resources', __name__)

# --- Department Routes ---
@resources_bp.route('/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.name, 'code': d.code} for d in departments])

@resources_bp.route('/departments', methods=['POST'])
def add_department():
    data = request.json
    if not data or 'name' not in data or 'code' not in data:
        return jsonify({'error': 'Missing name or code'}), 400
    new_dept = Department(name=data['name'], code=data['code'])
    db.session.add(new_dept)
    db.session.commit()
    return jsonify({'message': 'Department added!'}), 201

# --- Program Routes (BCA, MCA etc) ---
@resources_bp.route('/programs', methods=['GET'])
def get_programs():
    dept_id = request.args.get('department_id')
    query = Program.query
    if dept_id:
        query = query.filter_by(department_id=dept_id)
    programs = query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'code': p.code, 'department_id': p.department_id} for p in programs])

@resources_bp.route('/programs', methods=['POST'])
def add_program():
    data = request.json
    new_program = Program(name=data['name'], code=data['code'], department_id=data['department_id'])
    db.session.add(new_program)
    db.session.commit()
    return jsonify({'message': 'Program added!'}), 201

# --- Batch Routes (2023-26 etc) ---
@resources_bp.route('/batches', methods=['GET'])
def get_batches():
    prog_id = request.args.get('program_id')
    query = Batch.query
    if prog_id:
        query = query.filter_by(program_id=prog_id)
    batches = query.all()
    return jsonify([{'id': b.id, 'name': b.name, 'academic_year': b.academic_year} for b in batches])

@resources_bp.route('/batches', methods=['POST'])
def add_batch():
    data = request.json
    new_batch = Batch(name=data['name'], academic_year=data['academic_year'], program_id=data['program_id'])
    db.session.add(new_batch)
    db.session.commit()
    return jsonify({'message': 'Batch added!'}), 201

# --- Section Routes (A, B etc) ---
@resources_bp.route('/sections', methods=['GET'])
def get_sections():
    batch_id = request.args.get('batch_id')
    query = Section.query
    if batch_id:
        query = query.filter_by(batch_id=batch_id)
    sections = query.all()
    return jsonify([{'id': s.id, 'name': s.name, 'batch_id': s.batch_id} for s in sections])

@resources_bp.route('/sections', methods=['POST'])
def add_section():
    data = request.json
    new_section = Section(name=data['name'], batch_id=data['batch_id'])
    db.session.add(new_section)
    db.session.commit()
    return jsonify({'message': 'Section added!'}), 201

# --- Teacher Routes ---
@resources_bp.route('/teachers', methods=['GET'])
def get_teachers():
    dept_id = request.args.get('department_id')
    if dept_id:
        # Get teachers associated with this department via many-to-many
        dept = db.session.get(Department, dept_id)
        if not dept:
            return jsonify({'error': 'Department not found'}), 404
        teachers = dept.teachers.all()
    else:
        teachers = Teacher.query.all()
    
    return jsonify([{
        'id': t.id, 
        'name': t.name, 
        'email': t.email,
        'departments': [d.name for d in t.departments],
        'qualifications': [c.name for c in t.qualified_courses]
    } for t in teachers])

@resources_bp.route('/teachers', methods=['POST'])
def add_teacher():
    data = request.json
    new_teacher = Teacher(
        name=data['name'], 
        email=data['email'],
        availability=data.get('availability')
    )
    
    # Handle departmental associations
    if 'department_ids' in data:
        for d_id in data['department_ids']:
            dept = db.session.get(Department, d_id)
            if dept:
                new_teacher.departments.append(dept)

    db.session.add(new_teacher)
    db.session.commit()
    return jsonify({'message': 'Teacher added!', 'id': new_teacher.id}), 201

@resources_bp.route('/teachers/<int:teacher_id>/qualifications', methods=['POST'])
def assign_expertise(teacher_id):
    """Link a teacher to a course they are qualified to teach."""
    data = request.json
    teacher = db.session.get(Teacher, teacher_id)
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404
    course = db.session.get(Course, data['course_id'])
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course not in teacher.qualified_courses:
        teacher.qualified_courses.append(course)
        db.session.commit()
    
    return jsonify({'message': f'Teacher {teacher.name} qualified for {course.name}'})

# --- Course Routes ---
@resources_bp.route('/courses', methods=['GET'])
def get_courses():
    dept_id = request.args.get('department_id')
    query = Course.query
    if dept_id:
        query = query.filter_by(department_id=dept_id)
    courses = query.all()
    return jsonify([{
        'id': c.id, 
        'name': c.name, 
        'code': c.code, 
        'credits': c.credits,
        'department_id': c.department_id
    } for c in courses])

@resources_bp.route('/courses', methods=['POST'])
def add_course():
    data = request.json
    new_course = Course(
        name=data['name'], 
        code=data['code'], 
        credits=data.get('credits', 3),
        department_id=data['department_id']
    )
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course added!', 'id': new_course.id}), 201

# --- Room Routes ---
@resources_bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([{
        'id': r.id, 
        'name': r.name, 
        'capacity': r.capacity, 
        'room_type': r.room_type
    } for r in rooms])

@resources_bp.route('/rooms', methods=['POST'])
def add_room():
    data = request.json
    new_room = Room(
        name=data['name'], 
        capacity=data['capacity'], 
        room_type=data.get('room_type', 'Classroom')
    )
    db.session.add(new_room)
    db.session.commit()
    return jsonify({'message': 'Room added!', 'id': new_room.id}), 201

@resources_bp.route('/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    room = db.session.get(Room, room_id)
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    db.session.delete(room)
    db.session.commit()
    return jsonify({'message': 'Room deleted!'})
