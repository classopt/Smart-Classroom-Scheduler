# AI-Powered Smart Classroom Scheduling System 🎓

## Overview
This is an AI-powered automated scheduling system designed to generate conflict-free university timetables. It supports complex academic hierarchies (Departments, Programs, Batches, Sections) and strictly enforces constraints like teacher availability, domain expertise, and room capacity.

## Features
- **Hierarchical Scheduling**: Supports Dept → Program → Batch → Section structure.
- **AI-Driven Conflict Resolution**: Automatically detects and resolves teacher, room, and student overlaps.
- **Domain Protection**: Ensures teachers are only assigned subjects they are qualified to teach.
- **Resource Optimization**: Matches Theory vs. Lab courses to appropriate room types and capacities.
- **Smart Compactness**: "First-Fit" strategy minimizes gaps in student schedules.

## Tech Stack
- **Backend**: Python (Flask), SQLAlchemy, SQLite
- **Algorithm**: Constraint-based heuristic scheduling

## Setup
1. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. **Run Migrations (Optional)**:
   The system uses an SQLite database (`backend/instance/development.db`). It is pre-configured.
3. **Seed Data**:
   Populate the database with sample data:
   ```bash
   cd backend
   python seed_data.py
   ```
4. **Run Server**:
   ```bash
   python run.py
   ```

## Testing
To run the automated test suite:
```bash
python -m pytest
```

## API Endpoints
- `POST /api/scheduling/generate`: Generate a timetable for a department.
- `GET /api/scheduling/view/<dept_id>`: View the generated timetable.
- `POST /api/scheduling/workloads`: Assign teaching workloads.

## License
MIT
