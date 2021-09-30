import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { 
  AppBar, 
  Box, 
  Button, 
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar, 
  Typography 
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = () => {
	const history = useHistory();
	const classes = useStyles();
	
  const [showDrawer, setShowDrawer] = useState(false);
  const [version, setVersion] = useState("");

	useEffect(() => {
		callVersionEndpoint()
			.then(res => setVersion(res.version))
			.catch(err => console.log(err))
	}, []);

	const callVersionEndpoint = async () => {
    const response = await fetch('/api/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	return (
    <AppBar position="static">
			<Toolbar>
				<IconButton
                    onClick={() => setShowDrawer(true)}
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    size="large">
					<MenuIcon />
				</IconButton>
				<Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)} >
					<Box
						role="presentation"
						onClick={() => setShowDrawer(false)}
						onKeyDown={() => setShowDrawer(false)}
					>
						<List>
							{[
								{text: 'Match Stats', icon: <InboxIcon/>},
								{text: 'My Team', icon: <InboxIcon/>},
								{text: 'League Home', icon: <InboxIcon/>},
								{text: 'My Profile', icon: <InboxIcon/>}
							].map((item, index) => (
								<ListItem button key={item.text}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItem>
							))}
						</List>
					</Box>
				</Drawer>
				<Typography variant="h6" className={classes.title} onClick={() => history.push("/")}>
					DrafterLife
				</Typography>
				<Typography variant="subtitle1" className={classes.title}>
					{version}
				</Typography>
				<Button color="inherit">Login</Button>
			</Toolbar>
		</AppBar>
    );
}

export default Header