import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page-container">
			<Box>
				<Link style={{ textDecoration: 'none' }} to="/teams/">
					<Button variant="contained" color="primary">
							OWL Teams
					</Button>
				</Link>
			</Box>
			<Box>
				<Link style={{ textDecoration: 'none' }} to="/league/">
					<Button variant="contained" color="secondary">
						View My League
					</Button>
				</Link>
			</Box>
			<Box>- Login</Box>
			<Box>- Rethink using url param for player stats/league team view</Box>
			<Box>- Style for mobile</Box>
			<Box>- Cleanup fetches</Box>
			<Box>- Cleanup types/typescript</Box>
			<Box>- Commish posts</Box>
			<Box>- My Roster view</Box>
    </div>
  );
}

export default HomePage;
