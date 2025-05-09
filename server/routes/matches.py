from flask import Blueprint, request, jsonify
from models import db, Match, Team

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    return jsonify([
        {
            'id': m.id,
            'home_team_id': m.home_team_id,
            'away_team_id': m.away_team_id,
            'home_score': m.home_score,
            'away_score': m.away_score,
            'date': m.date
        } for m in matches
    ])

@matches_bp.route('/matches', methods=['POST'])
def add_match():
    data = request.json
    required = ['home_team_id', 'away_team_id', 'home_score', 'away_score', 'date']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing match fields'}), 400
    if data['home_team_id'] == data['away_team_id']:
        return jsonify({'error': 'Teams must be different'}), 400
    if not Team.query.get(data['home_team_id']) or not Team.query.get(data['away_team_id']):
        return jsonify({'error': 'Invalid team(s)'}), 400
    match = Match(
        home_team_id=data['home_team_id'],
        away_team_id=data['away_team_id'],
        home_score=data['home_score'],
        away_score=data['away_score'],
        date=data['date']
    )
    db.session.add(match)
    db.session.commit()
    return jsonify({'id': match.id}), 201
