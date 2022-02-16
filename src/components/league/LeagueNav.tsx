import React from "react";
import { useNavigate } from "react-router-dom";
import { useSessionUser } from "../../hooks/useSessionUser";
import { Toolbar, Button } from "@mui/material";

export default function LeagueNav() {
  const navigate = useNavigate();
  const [sessionUser] = useSessionUser();

  return (
    <Toolbar sx={{ backgroundColor: "text.primary", display: "flex", justifyContent: "space-around" }}>
      <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => navigate("/")}>Home</Button>
      {sessionUser && <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => navigate("/league/" + sessionUser)}>View My Team</Button>}
      <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => navigate("/league/free-agency")}>Free Agents</Button>
      <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => navigate("/league/schedule")}>Full Schedule</Button>
      <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => window?.open("https://liquipedia.net/overwatch/Player_Transfers", '_blank')?.focus()}>Recent OWL Transfers</Button>
      <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => window?.open("https://overwatchleague.com/en-us/schedule", '_blank')?.focus()}>OWL Schedule</Button>
      {/* {sessionUser && <Button sx={{ color: "background.paper", borderRadius: "0" }} onClick={() => navigate("/league/profile/" + sessionUser)}>Edit Profile</Button>} */}
    </Toolbar>
  );
}

