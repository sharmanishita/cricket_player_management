from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    players = db.relationship('Player', backref='team', cascade="all, delete-orphan")
    home_matches = db.relationship('Match', backref='home_team', foreign_keys='Match.home_team_id', cascade="all, delete-orphan")
    away_matches = db.relationship('Match', backref='away_team', foreign_keys='Match.away_team_id', cascade="all, delete-orphan")

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    runs = db.Column(db.Integer, default=0)
    wickets = db.Column(db.Integer, default=0)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    home_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    home_score = db.Column(db.Integer, nullable=False)
    away_score = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(20), nullable=False)
