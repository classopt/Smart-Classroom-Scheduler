from flask import Blueprint, request, jsonify
from ..models import Workload, Teacher, Course, Section, Room, TimetableEntry, Department
from .. import db
from sqlalchemy.orm import sessionmaker
import random

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

    teacher = db.session.get(Teacher, teacher_id)
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404
    course = db.session.get(Course, course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    # Qualification Check (Domain Protection)
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

def check_conflict(day, timeslot, teacher_id=None, room_id=None, section_id=None):
    """
    Core engine logic to detect overlaps.
    Returns error message if conflict exists, else None.
    """
    query = TimetableEntry.query.filter_by(day=day, timeslot=timeslot)
    
    if teacher_id:
        if query.filter_by(teacher_id=teacher_id).first():
            return "Teacher occupied"
    
    if room_id:
        if query.filter_by(room_id=room_id).first():
            return "Room occupied"
            
    if section_id:
        if query.filter_by(section_id=section_id).first():
            return "Section occupied"
            
    return None

# --- Timetable Generation ---

@scheduling_bp.route('/generate', methods=['POST'])
def generate_timetable():
    """
    Advanced automated algorithm to generate timetable.
    Handles hierarchy, availability, capacity, and room types.
    """
    data = request.json
    dept_id = data.get('department_id')
    if not dept_id:
        return jsonify({"error": "Department ID is required"}), 400

    dept = db.session.get(Department, dept_id)
    if not dept:
        return jsonify({'error': 'Department not found'}), 404
    TimetableEntry.query.filter_by(department_id=dept_id).delete()
    
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    timeslots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '01:00-02:00', '02:00-03:00']

    successful_entries = 0
    errors = []

    def is_teacher_available(teacher, day, slot):
        """Check if teacher is available during the specific timeslot"""
        if not teacher.availability: 
            return True
        return slot in teacher.availability.get(day, [])

    def get_room_score(room, course, section):
        """Calculate room suitability score"""
        score = 0
        
        # Capacity check (higher score for better fit)
        if room.capacity >= section.student_count:
            if room.capacity == section.student_count:
                score += 10  # Perfect fit
            elif room.capacity <= section.student_count * 1.2:
                score += 5   # Good fit
            else:
                score += 2   # Too big but usable
        else:
            return 0  # Too small, cannot use
        
        # Room type check
        if course.course_type == 'Lab':
            if 'lab' in room.room_type.lower():
                score += 20  # Perfect for lab
            else:
                return 0  # Lab course in non-lab room - not allowed
        else:
            if 'lab' not in room.room_type.lower():
                score += 10  # Perfect for theory
            else:
                score += 5   # Lab room for theory - acceptable but not ideal
        
        return score

    def calculate_schedule_gaps(section_schedule, day, current_slot):
        """Calculate gaps in schedule for optimization"""
        if not section_schedule.get(day):
            return 0
        
        slots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '01:00-02:00', '02:00-03:00']
        current_index = slots.index(current_slot)
        
        # Count gaps before and after current slot
        gaps_before = sum(1 for i, slot in enumerate(slots[:current_index]) 
                         if slot not in section_schedule[day])
        gaps_after = sum(1 for i, slot in enumerate(slots[current_index+1:]) 
                       if slot not in section_schedule[day])
        
        return gaps_before + gaps_after

    # Track section schedules for gap optimization
    section_schedules = {}
    
    # Hierarchy Traversal: Programs -> Batches -> Sections
    for program in dept.programs:
        for batch in program.batches:
            for section in batch.sections:
                section_schedules[section.id] = {}
                workloads = Workload.query.filter_by(section_id=section.id).all()
                
                for workload in workloads:
                    teacher = db.session.get(Teacher, workload.teacher_id)
                    course = db.session.get(Course, workload.course_id)
                    allocated_hours = 0
                    
                    # Collect all possible slots and score them
                    possible_slots = []
                    for day in days:
                        for slot in timeslots:
                            if allocated_hours >= workload.hours_per_week: 
                                break
                            
                            # 1. Teacher Availability Check
                            if not is_teacher_available(teacher, day, slot): 
                                continue
                            
                            # 2. Find and score suitable rooms
                            all_rooms = Room.query.all()
                            best_room = None
                            best_room_score = 0
                            
                            for room in all_rooms:
                                room_score = get_room_score(room, course, section)
                                if room_score > 0:  # Room is suitable
                                    if not check_conflict(day, slot, teacher_id=teacher.id, room_id=room.id, section_id=section.id):
                                        if room_score > best_room_score:
                                            best_room_score = room_score
                                            best_room = room
                            
                            if best_room:
                                # 3. Calculate gap penalty for optimization
                                gap_penalty = calculate_schedule_gaps(section_schedules[section.id], day, slot)
                                total_score = best_room_score - gap_penalty
                                
                                possible_slots.append({
                                    'day': day,
                                    'slot': slot,
                                    'room': best_room,
                                    'score': total_score
                                })
                    
                    # Sort by score (highest first) and allocate best slots
                    possible_slots.sort(key=lambda x: x['score'], reverse=True)
                    
                    for slot_info in possible_slots:
                        if allocated_hours >= workload.hours_per_week: 
                            break
                        
                        new_entry = TimetableEntry(
                            day=slot_info['day'], 
                            timeslot=slot_info['slot'], 
                            section_id=section.id,
                            course_id=workload.course_id, 
                            teacher_id=workload.teacher_id,
                            room_id=slot_info['room'].id, 
                            department_id=dept_id
                        )
                        db.session.add(new_entry)
                        
                        # Track this slot for gap optimization
                        day = slot_info['day']
                        slot = slot_info['slot']
                        if day not in section_schedules[section.id]:
                            section_schedules[section.id][day] = []
                        section_schedules[section.id][day].append(slot)
                        
                        allocated_hours += 1
                        successful_entries += 1
                    
                    if allocated_hours < workload.hours_per_week:
                        errors.append(f"Incomplete allocation for {course.name} in {section.name} - only {allocated_hours}/{workload.hours_per_week} hours scheduled")

    db.session.commit()
    return jsonify({
        "status": "success" if not errors else "partial_success",
        "entries": successful_entries,
        "errors": errors
    }), 200

@scheduling_bp.route('/view/<int:dept_id>', methods=['GET'])
def view_timetable(dept_id):
    entries = TimetableEntry.query.filter_by(department_id=dept_id).all()
    result = []
    for e in entries:
        result.append({
            "day": e.day, "timeslot": e.timeslot,
            "section": db.session.get(Section, e.section_id).name,
            "course": db.session.get(Course, e.course_id).name,
            "teacher": db.session.get(Teacher, e.teacher_id).name,
            "room": db.session.get(Room, e.room_id).name
        })
    return jsonify(result)
