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
							<Link style={{ textDecoration: 'none' }} to="/league/">
								<Button variant="contained" color="secondary">
										View My League
								</Button>
							</Link>
						</td>
					</tr>
					<tr>
						<td>
							- Login
						</td>
					</tr>
					<tr>
						<td>
							- Rethink using url param for player stats/league team view
						</td>
					</tr>
					<tr>
						<td>
							- Style for mobile
						</td>
					</tr>
					<tr>
						<td>
							- Cleanup fetches
						</td>
					</tr>
					<tr>
						<td>
							- Cleanup types/typescript
						</td>
					</tr>
					<tr>
						<td>
							- Commish posts
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
