import React, { useEffect, useState } from "react";
import api from "../api";
import { Container, Typography, Button, TextField, Select, MenuItem, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", team_id: "", runs: 0, wickets: 0 });
  const [editing, setEditing] = useState(null);

  const fetchPlayers = async () => {
    const res = await api.get("/players");
    setPlayers(res.data);
  };
  const fetchTeams = async () => {
    const res = await api.get("/teams");
    setTeams(res.data);
  };

  useEffect(() => { fetchPlayers(); fetchTeams(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.team_id) return;
    if (editing) {
      await api.put(`/players/${editing.id}`, form);
      setEditing(null);
    } else {
      await api.post("/players", form);
    }
    setForm({ name: "", team_id: "", runs: 0, wickets: 0 });
    fetchPlayers();
  };

  const handleEdit = (player) => {
    setEditing(player);
    setForm(player);
  };

  const handleDelete = async (id) => {
    await api.delete(`/players/${id}`);
    fetchPlayers();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Players</Typography>
      <TextField label="Name" name="name" value={form.name} onChange={handleChange} sx={{ mr: 2 }} />
      <Select name="team_id" value={form.team_id} onChange={handleChange} displayEmpty sx={{ mr: 2, minWidth: 120 }}>
        <MenuItem value="">Select Team</MenuItem>
        {teams.map(team => (
          <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
        ))}
      </Select>
      <TextField label="Runs" name="runs" type="number" value={form.runs} onChange={handleChange} sx={{ mr: 2, width: 80 }} />
      <TextField label="Wickets" name="wickets" type="number" value={form.wickets} onChange={handleChange} sx={{ mr: 2, width: 80 }} />
      <Button onClick={handleAddOrUpdate} variant="contained">{editing ? "Update" : "Add"}</Button>
      <List>
        {players.map(player => (
          <ListItem key={player.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(player)}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(player.id)}><DeleteIcon /></IconButton>
              </>
            }>
            <ListItemText primary={`${player.name} (${teams.find(t => t.id === player.team_id)?.name || "N/A"}) | Runs: ${player.runs} | Wickets: ${player.wickets}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Players;
