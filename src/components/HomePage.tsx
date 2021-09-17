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
								<Button variant="contained" color="primary">
										View my leagues
								</Button>
							</Link>
						</td>
					</tr>
					<tr>
						<td>
							<Link style={{ textDecoration: 'none' }} to="/player-stats/">
								<Button variant="contained" color="secondary">
										Player Stats
								</Button>
						</Link>
						</td>
					</tr>
				</tbody>
			</table>
    </div>
  );
}

export default HomePage;
