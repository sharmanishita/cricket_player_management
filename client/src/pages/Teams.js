import React, { useEffect, useState } from "react";
import api from "../api";
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const fetchTeams = async () => {
    const res = await api.get("/teams");
    setTeams(res.data);
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleAddOrUpdate = async () => {
    if (!name) return;
    if (editing) {
      await api.put(`/teams/${editing.id}`, { name });
      setEditing(null);
    } else {
      await api.post("/teams", { name });
    }
    setName("");
    fetchTeams();
  };

  const handleEdit = (team) => {
    setEditing(team);
    setName(team.name);
  };

  const handleDelete = async (id) => {
    await api.delete(`/teams/${id}`);
    fetchTeams();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Teams</Typography>
      <TextField label="Team Name" value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={handleAddOrUpdate} variant="contained" sx={{ ml: 2 }}>
        {editing ? "Update" : "Add"}
      </Button>
      <List>
        {teams.map(team => (
          <ListItem key={team.id}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(team)}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(team.id)}><DeleteIcon /></IconButton>
              </>
            }>
            <ListItemText primary={team.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Teams;
