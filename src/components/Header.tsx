import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
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
  Modal,
  TextField,
  Toolbar, 
  Typography 
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BallotIcon from '@mui/icons-material/Ballot';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect } from "react";
import { useSessionUser } from "../hooks/useSessionUser";

const Header = () => {
  let navigate = useNavigate();
	
  const [showDrawer, setShowDrawer] = useState(false);
  const [version, setVersion] = useState("");
  const [username, setUsername] = useState("");
	const [sessionUser, setSessionUser] = useSessionUser();
	const [isModalOpen, setModalOpen] = useState(false);
	const [loginDisabled, setLoginDisabled] = useState(true);
	const [isUserInvalid, setUserInvalid] = useState(false);

	useEffect(() => {
		fetchVersionEndpoint()
			.then(res => setVersion(res.version))
			.catch(err => console.log(err))
	}, []);

	const fetchVersionEndpoint = async () => {
    const response = await fetch('/api/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && !loginDisabled){
			loginClicked();
		}
 }

	const loginClicked = () => {
		setSessionUser(username);
		handleModalClose();
		window.location.reload();
	};

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const userValue = event.target.value.toUpperCase();
		if (["JORDAN", "KELLEN", "SAM", "ZACK"].includes(userValue)) {
			setLoginDisabled(false);
			setUsername(userValue);
		} else {
			setUsername(userValue);
			setLoginDisabled(true);
		}
  };

	const validateUsername = () => {
		if (["JORDAN", "KELLEN", "SAM", "ZACK"].includes(username)) {
			setUserInvalid(false);
		} else {
			setUserInvalid(true);
		}
	}

	const handleModalOpen = () => {
		setModalOpen(true);
	};

  const handleModalClose = () => {
		setUsername("");
		setModalOpen(false);
	};

	const drawerItemClicked = (path: string) => {
		setShowDrawer(false);
		navigate(path);
	};

	return (
    <AppBar position="sticky">
			<Toolbar>
				<IconButton
					onClick={() => setShowDrawer(true)}
					edge="start"
					sx={{
						marginRight: 2
					}}
					color="inherit"
					size="large"
				>
					<MenuIcon />
				</IconButton>
				<Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)} >
					<Box role="presentation" >
						<List>
							{[
								{text: 'Player Stats', icon: <AssessmentIcon/>, show: true, clickHandler: () => drawerItemClicked("/teams/")},
								{text: 'League Home', icon: <GroupsIcon/>, show: true, clickHandler: () => drawerItemClicked("/league/")},
								{text: 'My Team', icon: <BallotIcon/>, show: sessionUser, clickHandler: () => drawerItemClicked("/league/"+sessionUser)},
								//{text: 'My Profile', icon: <InboxIcon/>, show: sessionUser, clickHandler: () => drawerItemClicked("/")}
							].map((item, index) => (
								<ListItem button key={index} disabled={!item.show} onClick={item.clickHandler}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.text} />
								</ListItem>
							))}
						</List>
					</Box>
				</Drawer>
				<Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
					DrafterLife
				</Typography>
				<Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
					{version}
				</Typography>
				{ sessionUser && 
					<Typography variant="subtitle1" sx={{ marginRight: "1rem" }}>Welcome, {sessionUser}!</Typography>
				}
				{ sessionUser ? 
					<Button color="inherit" onClick={() => {
						setSessionUser("");
						window.location.reload();
					}}>Logout</Button>
				:
					<Button color="inherit" onClick={handleModalOpen}>Login</Button>
				}
				<Modal
					open={isModalOpen}
					onClose={handleModalClose}
				>
					<Box sx={{
						position: "absolute" as "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						border: "1px solid #000",
						borderRadius: "0.5rem",
						boxShadow: 24,
						p: 3,
					}}>
						<Typography variant="h6" component="h2" sx={{ mb: ".5rem" }}>
							Enter your username:
						</Typography>
						<TextField
							fullWidth
							color="secondary"
							label="Username"
							onKeyDown={keyPress}
							onChange={handleUsernameChange}
							onBlur={validateUsername}
							error={isUserInvalid}
							sx={{ mt: "2" }}
						/>
						{isUserInvalid && 
							<Typography color="error" variant="body1" sx={{ m: ".5rem" }}>Username is not a real user</Typography>
						}
						<Box sx={{ display: "flex", justifyContent: "center", mt: "1.5rem" }}>
							<Button disabled={loginDisabled} variant="contained" color="primary" sx={{ m: "0rem .5rem" }} onClick={loginClicked}>Login</Button>
							<Button variant="contained" color="secondary" onClick={handleModalClose} sx={{ m: "0rem .5rem" }}>Cancel</Button>
						</Box>
					</Box>
				</Modal>
			</Toolbar>
		</AppBar>
    );
}

export default Header