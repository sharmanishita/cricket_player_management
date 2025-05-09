from flask import Blueprint, request, jsonify
from models import db, Team

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([{'id': t.id, 'name': t.name} for t in teams])

@teams_bp.route('/teams', methods=['POST'])
def add_team():
    data = request.json
    if not data.get('name'):
        return jsonify({'error': 'Team name required'}), 400
    if Team.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Team already exists'}), 400
    team = Team(name=data['name'])
    db.session.add(team)
    db.session.commit()
    return jsonify({'id': team.id, 'name': team.name}), 201

@teams_bp.route('/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = Team.query.get_or_404(team_id)
    data = request.json
    if 'name' in data:
        team.name = data['name']
    db.session.commit()
    return jsonify({'id': team.id, 'name': team.name})

@teams_bp.route('/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = Team.query.get_or_404(team_id)
    db.session.delete(team)
    db.session.commit()
    return '', 204
