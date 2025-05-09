import React, { useEffect, useState } from "react";
import api from "../api";
import { Container, Typography, Button, TextField, Select, MenuItem, List, ListItem, ListItemText } from "@mui/material";

function Matches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ home_team_id: "", away_team_id: "", home_score: 0, away_score: 0, date: "" });

  const fetchMatches = async () => {
    const res = await api.get("/matches");
    setMatches(res.data);
  };
  const fetchTeams = async () => {
    const res = await api.get("/teams");
    setTeams(res.data);
  };

  useEffect(() => { fetchMatches(); fetchTeams(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.home_team_id || !form.away_team_id || !form.date) return;
    await api.post("/matches", form);
    setForm({ home_team_id: "", away_team_id: "", home_score: 0, away_score: 0, date: "" });
    fetchMatches();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Matches</Typography>
      <Select name="home_team_id" value={form.home_team_id} onChange={handleChange} displayEmpty sx={{ mr: 2, minWidth: 120 }}>
        <MenuItem value="">Home Team</MenuItem>
        {teams.map(team => (
          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
        ))}
      </Select>
      <Select name="away_team_id" value={form.away_team_id} onChange={handleChange} displayEmpty sx={{ mr: 2, minWidth: 120 }}>
        <MenuItem value="">Away Team</MenuItem>
        {teams.map(team => (
          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
        ))}
      </Select>
      <TextField label="Home Score" name="home_score" type="number" value={form.home_score} onChange={handleChange} sx={{ mr: 2, width: 100 }} />
      <TextField label="Away Score" name="away_score" type="number" value={form.away_score} onChange={handleChange} sx={{ mr: 2, width: 100 }} />
      <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} sx={{ mr: 2, width: 160 }} InputLabelProps={{ shrink: true }} />
      <Button onClick={handleAdd} variant="contained">Add Match</Button>
      <List>
        {matches.map(match => (
          <ListItem key={match.id}>
            <ListItemText primary={
              `${teams.find(t => t.id === match.home_team_id)?.name || "?"} (${match.home_score}) vs ${teams.find(t => t.id === match.away_team_id)?.name || "?"} (${match.away_score}) on ${match.date}`
            } />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Matches;
