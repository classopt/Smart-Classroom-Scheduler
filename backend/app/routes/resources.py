from flask import Blueprint, request, jsonify
from ..models.department import Department
from .. import db

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([{'id': d.id, 'name': d.name, 'code': d.code} for d in departments])

@resources_bp.route('/departments', methods=['POST'])
def add_department():
    data = request.json
    new_dept = Department(name=data['name'], code=data['code'])
    db.session.add(new_dept)
    db.session.commit()
    return jsonify({'message': 'Department added!'}), 201