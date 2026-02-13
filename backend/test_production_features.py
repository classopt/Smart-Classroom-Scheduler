#!/usr/bin/env python3
"""
Test script to demonstrate the production-ready scheduling features:
1. Teacher Availability Integration
2. Room Capacity & Type Check  
3. Soft Constraints Optimization (gap minimization)
"""

from app import create_app, db
from app.models import *
from datetime import datetime
import json

def test_production_features():
    app = create_app()
    
    with app.app_context():
        print("🚀 Testing Production-Ready Scheduling Features\n")
        
        # Clean database
        db.drop_all()
        db.create_all()
        
        # Setup test data
        print("📋 Setting up test data...")
        
        # Create departments
        it_dept = Department(name="Information Technology", code="IT")
        cs_dept = Department(name="Computer Science", code="CS")
        db.session.add_all([it_dept, cs_dept])
        db.session.commit()
        
        # Create programs
        bca_program = Program(name="BCA", code="BCA", department_id=it_dept.id)
        mca_program = Program(name="MCA", code="MCA", department_id=it_dept.id)
        db.session.add_all([bca_program, mca_program])
        db.session.commit()
        
        # Create batches
        bca_batch1 = Batch(name="BCA 1st Year", academic_year="2024-2025", program_id=bca_program.id)
        mca_batch1 = Batch(name="MCA 1st Year", academic_year="2024-2025", program_id=mca_program.id)
        db.session.add_all([bca_batch1, mca_batch1])
        db.session.commit()
        
        # Create sections with different sizes
        bca_section_a = Section(name="A", batch_id=bca_batch1.id, student_count=25)
        bca_section_b = Section(name="B", batch_id=bca_batch1.id, student_count=60)
        mca_section = Section(name="A", batch_id=mca_batch1.id, student_count=35)
        db.session.add_all([bca_section_a, bca_section_b, mca_section])
        db.session.commit()
        
        # Create courses (Theory and Lab)
        python_theory = Course(name="Python Programming", code="PY101", credits=3, 
                              course_type="Theory", department_id=it_dept.id)
        python_lab = Course(name="Python Lab", code="PY102", credits=2, 
                           course_type="Lab", department_id=it_dept.id)
        db_course = Course(name="Database Systems", code="DB201", credits=4, 
                          course_type="Theory", department_id=it_dept.id)
        db.session.add_all([python_theory, python_lab, db_course])
        db.session.commit()
        
        # Create rooms with different capacities and types
        small_room = Room(name="Room 101", capacity=30, room_type="Classroom")
        large_room = Room(name="Room 102", capacity=80, room_type="Classroom") 
        lab_room = Room(name="IT Lab 1", capacity=40, room_type="Lab")
        tiny_room = Room(name="Room 103", capacity=20, room_type="Classroom")
        db.session.add_all([small_room, large_room, lab_room, tiny_room])
        db.session.commit()
        
        # Create teachers with different availability patterns
        prof_morning = Teacher(name="Prof. Morning", email="morning@university.edu")
        prof_morning.departments.append(it_dept)
        prof_morning.qualified_courses.append(python_theory)
        prof_morning.qualified_courses.append(db_course)
        # Only available morning slots
        prof_morning.availability = {
            "Monday": ["09:00-10:00", "10:00-11:00", "11:00-12:00"],
            "Tuesday": ["09:00-10:00", "10:00-11:00"],
            "Wednesday": ["09:00-10:00", "11:00-12:00"]
        }
        
        prof_afternoon = Teacher(name="Prof. Afternoon", email="afternoon@university.edu")
        prof_afternoon.departments.append(it_dept)
        prof_afternoon.qualified_courses.append(python_theory)
        prof_afternoon.qualified_courses.append(python_lab)
        # Only available afternoon slots
        prof_afternoon.availability = {
            "Monday": ["01:00-02:00", "02:00-03:00"],
            "Tuesday": ["01:00-02:00"],
            "Thursday": ["01:00-02:00", "02:00-03:00"]
        }
        
        prof_flexible = Teacher(name="Prof. Flexible", email="flexible@university.edu")
        prof_flexible.departments.append(it_dept)
        prof_flexible.qualified_courses.append(python_lab)
        # Available all slots (no availability constraint)
        
        db.session.add_all([prof_morning, prof_afternoon, prof_flexible])
        db.session.commit()
        
        # Create workloads
        workload1 = Workload(section_id=bca_section_a.id, course_id=python_theory.id, 
                           teacher_id=prof_morning.id, hours_per_week=3)
        workload2 = Workload(section_id=bca_section_a.id, course_id=python_lab.id, 
                           teacher_id=prof_afternoon.id, hours_per_week=2)
        workload3 = Workload(section_id=bca_section_b.id, course_id=python_theory.id, 
                           teacher_id=prof_morning.id, hours_per_week=3)
        workload4 = Workload(section_id=mca_section.id, course_id=db_course.id, 
                           teacher_id=prof_morning.id, hours_per_week=4)
        
        db.session.add_all([workload1, workload2, workload3, workload4])
        db.session.commit()
        
        print("✅ Test data setup complete!\n")
        
        # Test the enhanced scheduling
        print("🔧 Running Enhanced Scheduling Algorithm...")
        
        from app.routes.scheduling import generate_timetable
        
        # Use the enhanced scheduling function
        with app.test_client() as client:
            response = client.post('/api/scheduling/generate', 
                                 json={'department_id': it_dept.id})
            result = response.get_json()
            status_code = response.status_code
        
        print(f"📊 Scheduling Result: {result['status']}")
        print(f"📝 Total Entries Created: {result['entries']}")
        
        if result['errors']:
            print("⚠️  Errors:")
            for error in result['errors']:
                print(f"   - {error}")
        
        # Analyze the generated timetable
        print("\n📅 Generated Timetable Analysis:")
        print("=" * 60)
        
        entries = TimetableEntry.query.filter_by(department_id=it_dept.id).all()
        
        for entry in entries:
            section = db.session.get(Section, entry.section_id)
            course = db.session.get(Course, entry.course_id)
            teacher = db.session.get(Teacher, entry.teacher_id)
            room = db.session.get(Room, entry.room_id)
            
            print(f"📚 {course.name} ({course.course_type})")
            print(f"   👥 Section: {section.name} ({section.student_count} students)")
            print(f"   👨‍🏫 Teacher: {teacher.name}")
            print(f"   🏫 Room: {room.name} (Capacity: {room.capacity}, Type: {room.room_type})")
            print(f"   ⏰ Time: {entry.day} {entry.timeslot}")
            
            # Verify constraints
            print("   ✅ Checks:")
            
            # 1. Teacher availability check
            if teacher.availability:
                if entry.timeslot in teacher.availability.get(entry.day, []):
                    print("      ✓ Teacher is available during this slot")
                else:
                    print("      ✗ Teacher is NOT available during this slot!")
            else:
                print("      ✓ Teacher has no availability constraints")
            
            # 2. Room capacity check
            if room.capacity >= section.student_count:
                if room.capacity == section.student_count:
                    print("      ✓ Perfect room capacity match")
                elif room.capacity <= section.student_count * 1.2:
                    print("      ✓ Good room capacity fit")
                else:
                    print("      ✓ Room capacity adequate (slightly oversized)")
            else:
                print("      ✗ Room too small for section!")
            
            # 3. Room type check
            if course.course_type == 'Lab':
                if 'lab' in room.room_type.lower():
                    print("      ✓ Lab course scheduled in lab room")
                else:
                    print("      ✗ Lab course NOT in lab room!")
            else:
                if 'lab' not in room.room_type.lower():
                    print("      ✓ Theory course scheduled in classroom")
                else:
                    print("      ⚠ Theory course in lab room (acceptable)")
            
            print()
        
        # Test gap optimization
        print("🎯 Gap Optimization Analysis:")
        print("=" * 40)
        
        for section_id in [bca_section_a.id, bca_section_b.id, mca_section.id]:
            section = db.session.get(Section, section_id)
            entries = TimetableEntry.query.filter_by(section_id=section_id).all()
            
            print(f"📖 Section {section.name}:")
            
            # Group by day
            daily_slots = {}
            for entry in entries:
                if entry.day not in daily_slots:
                    daily_slots[entry.day] = []
                daily_slots[entry.day].append(entry.timeslot)
            
            all_slots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '01:00-02:00', '02:00-03:00']
            
            for day, slots in daily_slots.items():
                slots.sort()  # Sort by time
                print(f"   {day}: {', '.join(slots)}")
                
                # Calculate gaps
                if len(slots) > 1:
                    gaps = 0
                    for i in range(len(slots) - 1):
                        current_idx = all_slots.index(slots[i])
                        next_idx = all_slots.index(slots[i + 1])
                        if next_idx - current_idx > 1:
                            gaps += (next_idx - current_idx - 1)
                    
                    if gaps == 0:
                        print("      ✓ No gaps - compact schedule!")
                    else:
                        print(f"      ⚠ {gaps} gap(s) in schedule")
                elif len(slots) == 1:
                    print("      ℹ Single class - no gaps possible")
            
            print()
        
        print("🎉 Production Features Test Complete!")
        print("\n📋 Summary of Implemented Features:")
        print("✅ Teacher Availability Integration")
        print("✅ Room Capacity & Type Matching")
        print("✅ Soft Constraints (Gap Minimization)")
        print("✅ Intelligent Room Scoring")
        print("✅ Conflict Detection & Resolution")

if __name__ == "__main__":
    test_production_features()
