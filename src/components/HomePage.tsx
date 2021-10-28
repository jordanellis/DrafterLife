import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page-container">

			<table>
				<tbody>
					<tr>
						<td>
							<Link style={{ textDecoration: 'none' }} to="/teams/">
								<Button variant="contained" color="primary">
										OWL Teams
								</Button>
							</Link>
						</td>
					</tr>
					<tr>
						<td>
							<Link style={{ textDecoration: 'none' }} to="/my-leagues/">
								<Button variant="contained" color="secondary">
										View my leagues
								</Button>
							</Link>
						</td>
					</tr>
					<tr>
						<td>
							- Calculate player/map averages
						</td>
					</tr>
					<tr>
						<td>
							- Display averages at top of player stats
						</td>
					</tr>
					<tr>
						<td>
							- Style for mobile
						</td>
					</tr>
					<tr>
						<td>
							- My Roster view
						</td>
					</tr>
				</tbody>
			</table>
    </div>
  );
}

export default HomePage;
