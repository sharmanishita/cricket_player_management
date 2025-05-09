import React, { useEffect, useState } from "react";
import api from "../api";
import { Container, Typography, Paper, Grid } from "@mui/material";

function Dashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMatches: 0,
    topPlayer: null,
  });

  useEffect(() => {
    async function fetchStats() {
      const [teams, matches, players] = await Promise.all([
        api.get("/teams"),
        api.get("/matches"),
        api.get("/players"),
      ]);
      let topPlayer = null;
      if (players.data.length > 0) {
        topPlayer = players.data.reduce((a, b) => (a.runs > b.runs ? a : b));
      }
      setStats({
        totalTeams: teams.data.length,
        totalMatches: matches.data.length,
        topPlayer,
      });
    }
    fetchStats();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Teams</Typography>
            <Typography variant="h3">{stats.totalTeams}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Matches</Typography>
            <Typography variant="h3">{stats.totalMatches}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Top Player (by runs)</Typography>
            <Typography variant="h5">
              {stats.topPlayer ? `${stats.topPlayer.name} (${stats.topPlayer.runs} runs)` : "N/A"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
