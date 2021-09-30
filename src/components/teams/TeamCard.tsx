import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Collapse,
  Divider,
  IconButton,
  ListItem,
  Typography
} from '@mui/material';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShieldIcon from '@mui/icons-material/Shield';

type TeamCardProps = {
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

const useStyles = makeStyles({
  root: {
    width: 360,
  },
  media: {
    marginTop: 15,
    height: 330,
  },
  open: {
    transform: "rotate(0deg)",
  },
  close: {
    transform: "rotate(270deg)",
  },
});

export default function TeamCard({logo, name, players, colors}: TeamCardProps) {
	const history = useHistory();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const navigateToPlayerStats = (playerName: string, role: string) => {
    history.push("/player-stats/" + playerName, {teamname: name, logo, colors, role})
  }

  return (
    <Card className={classes.root} sx={{background: colors.primary}}>
      <CardActionArea>
        <CardMedia
          component="img"
          className={classes.media}
          image={logo}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" sx={{paddingRight: "2rem"}}>
            <IconButton component="div" aria-label="share" size="large" onClick={() => {setExpanded(!expanded)}}>
              <ExpandMoreIcon className={clsx(!expanded && classes.close, expanded && classes.open)} />
            </IconButton>
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{background: colors.tertiary, opacity: 0.2}} />
        <CardContent sx={{fontSize: "1.2rem"}}>
          {players.tanks.map((tank, key) => (
            <ListItem onClick={() => navigateToPlayerStats(tank, "tank")} button key={key}>
              <ShieldIcon sx={{color: colors.secondary}} />&nbsp;{ tank }
            </ListItem>
          ))}
          {players.dps.map((dpsPlayer, key) => (
            <ListItem onClick={() => navigateToPlayerStats(dpsPlayer, "dps")} button key={key}>
              <SportsMmaIcon sx={{color: colors.secondary}} />&nbsp;{ dpsPlayer }
            </ListItem>
          ))}
          {players.supports.map((support, key) => (
            <ListItem onClick={() => navigateToPlayerStats(support, "support")} button key={key}>
              <LocalHospitalIcon sx={{color: colors.secondary}} />&nbsp;{ support }
            </ListItem>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}