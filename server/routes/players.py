from flask import Blueprint, request, jsonify
from models import db, Player, Team

players_bp = Blueprint('players', __name__)

@players_bp.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([
        {'id': p.id, 'name': p.name, 'team_id': p.team_id, 'runs': p.runs, 'wickets': p.wickets}
        for p in players
    ])

@players_bp.route('/players', methods=['POST'])
def add_player():
    data = request.json
    if not data.get('name') or not data.get('team_id'):
        return jsonify({'error': 'Name and team_id required'}), 400
    if not Team.query.get(data['team_id']):
        return jsonify({'error': 'Team does not exist'}), 400
    player = Player(name=data['name'], team_id=data['team_id'], runs=data.get('runs', 0), wickets=data.get('wickets', 0))
    db.session.add(player)
    db.session.commit()
    return jsonify({'id': player.id, 'name': player.name}), 201

@players_bp.route('/players/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    player = Player.query.get_or_404(player_id)
    data = request.json
    if 'name' in data:
        player.name = data['name']
    if 'runs' in data:
        player.runs = data['runs']
    if 'wickets' in data:
        player.wickets = data['wickets']
    db.session.commit()
    return jsonify({'id': player.id, 'name': player.name})

@players_bp.route('/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    player = Player.query.get_or_404(player_id)
    db.session.delete(player)
    db.session.commit()
    return '', 204

