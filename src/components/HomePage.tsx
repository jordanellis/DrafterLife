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
			<Box>1 Update Schedule view</Box>
			<Box>2 Fixup landing page and league home page</Box>
			<Box>2 Drop player/Add player to empty spot?</Box>
			<Box>3 Lock Editing team once games start</Box>
			<Box>3 Loading skeletons</Box>
			<Box>3 OWL Schedule</Box>
			<Box>3 Trades?</Box>
			<Box>4 Commish posts</Box>
			<Box>4 Edit team settings?</Box>
			<Box>- Cleanup fetches</Box>
			<Box>- Cleanup types/typescript</Box>
			<Box>- Style for mobile</Box>
    </div>
  );
}

export default HomePage;
