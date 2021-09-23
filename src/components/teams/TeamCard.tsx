import React, { useState } from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles({
  root: {
    maxWidth: 320,
  },
  media: {
    paddingTop: 10,
    height: 300,
  },
  open: {
    transform: "rotate(0deg)",
  },
  close: {
    transform: "rotate(270deg)",
  },
});

export default function TeamCard(props: any) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          className={classes.media}
          image={props.logo}
          title={props.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <IconButton aria-label="share" size="large" onClick={() => {setExpanded(!expanded)}}>
              <ExpandMoreIcon className={clsx(!expanded && classes.close, expanded && classes.open)} />
            </IconButton>
            {props.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Tanks:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>DPS:</Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat.
          </Typography>
          <Typography paragraph>Supports:</Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}