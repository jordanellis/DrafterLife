import React, { useEffect, useState } from "react";
import { LeagueTeam } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useSessionUser } from "../../hooks/useSessionUser";
import { Alert, Button, Container, Snackbar, TextField, Typography } from "@mui/material";
import { fetchRoster, fetchUpdateTeamProfile } from "../../service/fetches";

const LeagueTeamProfile = () => {
  const navigate = useNavigate();
	const [sessionUser] = useSessionUser();
	const { ownerName } = useParams();
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [teamOwner, setTeamOwner] = useState("");
  const [teamOwnerName, setTeamOwnerName] = useState("");
  const [teamQuote, setTeamQuote] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

	useEffect(() => {
    ownerName && fetchRoster(ownerName)
      .then((teamResp: LeagueTeam) => {
        setTeamOwner(teamResp.owner);
        setTeamOwnerName(teamResp.ownerName);
        setTeamName(teamResp.name);
        setTeamQuote(teamResp.quote);
        setTeamBio(teamResp.bio);
        setLoading(false);
      })
      .catch(err => console.log(err))
  }, [ownerName]);

  const updateTeamProfile = () => {
    let updatedLeagueTeamValues = {
      "name": teamName,
      "quote": teamQuote,
      "bio": teamBio
    };
    fetchUpdateTeamProfile(sessionUser, updatedLeagueTeamValues)
    .then(response => {
      response.ok ? setSuccessSnackbarOpen(true) : setErrorSnackbarOpen(true);
    });
  }

  const handleTextFieldChange = (setter: Function, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(event.target.value);
    setter(event.target.value);
  };

	return (
    <Box>
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        {"< Back"}
      </Button>
      {teamOwner === sessionUser && !loading && <Container>
        <Typography variant="h5" sx={{ textAlign: "center" }}>{teamOwnerName}</Typography>
        {[
          {"label": "Team Name", "value": teamName, "setter": setTeamName},
          {"label": "Motto", "value": teamQuote, "setter": setTeamQuote},
          {"label": "Team Bio", "value": teamBio, "setter": setTeamBio}
        ].map((teamValues, id) => (
          <TextField
            key={id}
            variant="filled"
            color="secondary"
            label={teamValues.label}
            defaultValue={teamValues.value}
            onChange={(e) => handleTextFieldChange(teamValues.setter, e)}
            sx={{ width: "100%", m: "1rem" }}
          />
        ))}
        <Button variant="contained" sx={{ display: "block", m: "0 auto" }} onClick={updateTeamProfile}>Save</Button>
      </Container>}
      <Snackbar 
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        open={errorSnackbarOpen} 
        autoHideDuration={6000} 
      >
        <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
          Something went wrong.
        </Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        open={successSnackbarOpen} 
        autoHideDuration={6000}
      >
        <Alert variant="filled"severity="success" sx={{ width: '100%' }}>
          Your profile was saved successfully!
        </Alert>
      </Snackbar>
      
    </Box>
  );
}

export default LeagueTeamProfile