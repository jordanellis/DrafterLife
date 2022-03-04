import React from "react";
import { useNavigate } from "react-router-dom";
import { useSessionUser } from "../../hooks/useSessionUser";
import { Toolbar, Button, Box, Menu, MenuItem } from "@mui/material";

export default function LeagueNav() {
  const navigate = useNavigate();
  const [sessionUser] = useSessionUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const links = [
    {text: "Home", onclick: () => navigate("/"), alwaysShow: true},
    {text: "View My Team", onclick: () => navigate("/league/" + sessionUser)},
    {text: "Free Agents", onclick: () => navigate("/league/free-agency"), alwaysShow: true},
    {text: "Full Schedule", onclick: () => navigate("/league/schedule"), alwaysShow: true},
    {text: "Recent OWL Transfers", onclick: () => window?.open("https://liquipedia.net/overwatch/Player_Transfers", '_blank')?.focus(), alwaysShow: true},
    {text: "OWL Schedule", onclick: () => window?.open("https://overwatchleague.com/en-us/schedule", '_blank')?.focus(), alwaysShow: true},
    {text: "Edit Profile", onclick: () => navigate("/league/profile/" + sessionUser)},
  ];

  return (
    <Box>
      <Box display={{ xs: "none", sm: "flex" }}>
        <Toolbar sx={{ backgroundColor: "text.primary", display: "flex", justifyContent: "space-around", width: "100%" }}>
            {links.map((link, i) => 
              ((link.alwaysShow || sessionUser) && 
              <Button key={i} sx={{ color: "background.paper", borderRadius: "0" }} onClick={link.onclick}>
                {link.text}
              </Button>
              )
            )}
        </Toolbar>
      </Box>
      
      <Box display={{ xs: "flex", sm: "none" }} sx={{ justifyContent: "center", backgroundColor: "text.primary" }}>
        <Button
          onClick={handleClick}
          sx={{ m: ".5rem", color: "background.paper" }}
        >
          Links
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {links.map((link, i) => 
            ((link.alwaysShow || sessionUser) && 
            <MenuItem key={i} onClick={link.onclick}>{link.text}</MenuItem>
            )
          )}
        </Menu>
      </Box>
    </Box>
  );
}

