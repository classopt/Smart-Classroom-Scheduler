from flask import Blueprint, request, jsonify
from ..models import db, Workload, Teacher, Course, Section, Room
from datetime import datetime

scheduling_bp = Blueprint('scheduling', __name__)

# --- Workload Management ---

@scheduling_bp.route('/workloads', methods=['POST'])
def create_workload():
    """
    Assigns a teacher to a course for a specific section.
    Logic: Validates that the teacher is qualified for the course.
    """
    data = request.json
    teacher_id = data.get('teacher_id')
    course_id = data.get('course_id')
    section_id = data.get('section_id')
    hours = data.get('hours_per_week', 4)

    teacher = Teacher.query.get_or_404(teacher_id)
    course = Course.query.get_or_404(course_id)

    # SENIOR LOGIC: Qualification Check
    if course not in teacher.qualified_courses:
        return jsonify({
            "error": f"Teacher {teacher.name} is not qualified to teach {course.name}."
        }), 400

    new_workload = Workload(
        teacher_id=teacher_id,
        course_id=course_id,
        section_id=section_id,
        hours_per_week=hours
    )
    
    db.session.add(new_workload)
    db.session.commit()
    
    return jsonify({"message": "Workload assigned successfully"}), 201

# --- Conflict Detection Logic ---

def check_conflict(type, id, day, timeslot):
    """
    Core engine logic to detect overlaps.
    type: 'teacher', 'room', or 'section'
    day: e.g., 'Monday'
    timeslot: e.g., '09:00-10:00'
    """
    # This will be expanded once we have a 'TimetableEntry' model.
    # Logic: Search TimetableEntry for any record with matching (day, timeslot) 
    # where teacher_id=id OR room_id=id OR section_id=id.
    pass

@scheduling_bp.route('/validate-slot', methods=['POST'])
def validate_slot():
    """
    Lightweight endpoint for frontend to check if a slot is free.
    """
    data = request.json
    # Validation logic here...
    return jsonify({"available": True})
