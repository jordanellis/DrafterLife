import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Collapse,
  Divider,
  Icon,
  ListItem,
  Typography
} from '@mui/material';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';
import { KeyboardArrowDown, KeyboardArrowRight } from '@material-ui/icons';

interface TeamCardProps {
  logo: string,
  name: string,
  players: {
    tanks: Array<string>,
    dps: Array<string>,
    supports: Array<string>
  },
	colors: {
		primary: string,
		secondary: string,
		tertiary: string
	}
}

export default function TeamCard({logo, name, players, colors}: TeamCardProps) {
	const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const navigateToPlayerStats = (playerName: string) => {
    navigate("/player-stats/" + playerName)
  }

  return (
    <Card sx={{ width: 360, background: colors.primary }}>
      <CardActionArea onClick={() => {setExpanded(!expanded)}}>
        <CardMedia
          component="img"
          sx={{ marginTop: 3, height: 350 }}
          image={ logo }
          title={ name }
        />
        <CardContent>
          <Typography color="#ffffff" gutterBottom variant="h5" component="h2" sx={{ paddingRight: "2rem" }}>
            <Icon fontSize="large">
              { expanded ?
                <KeyboardArrowDown style={{ verticalAlign: "middle" }}/>
              : 
                <KeyboardArrowRight style={{ verticalAlign: "middle" }} />
              }
            </Icon>
            { name }
          </Typography>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: colors.tertiary, opacity: 0.2 }} />
        <CardContent sx={{ fontSize: "1.2rem" }}>
          {players.tanks.map((tank, key) => (
            <ListItem onClick={() => navigateToPlayerStats(tank)} button key={key}>
              <ShieldIcon sx={{ color: colors.secondary }} />&nbsp;<Typography variant="white">{tank}</Typography>
            </ListItem>
          ))}
          {players.dps.map((dpsPlayer, key) => (
            <ListItem onClick={() => navigateToPlayerStats(dpsPlayer)} button key={key}>
              <SportsMmaIcon sx={{ color: colors.secondary }} />&nbsp;<Typography variant="white">{dpsPlayer}</Typography>
            </ListItem>
          ))}
          {players.supports.map((support, key) => (
            <ListItem onClick={() => navigateToPlayerStats(support)} button key={key}>
              <LocalHospitalIcon sx={{ color: colors.secondary }} />&nbsp;<Typography variant="white">{support}</Typography>
            </ListItem>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}