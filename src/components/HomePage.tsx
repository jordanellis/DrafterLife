import { Box, Button, Container, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
	const [posts, setPosts] = useState<string[]>();
	const [postsIndex, setPostIndex] = useState(0);

	useEffect(() => {
		fetchPosts()
			.then(posts => {
				setPosts(posts);
				setPostIndex(posts.length-1);
			})
			.catch(err => console.log(err))
	}, []);

	const fetchPosts = async () => {
    const response = await fetch('/api/posts');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body.posts;
  };
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
			<Container>
				<Typography variant="h5">News</Typography>
				<Divider sx={{ m: "0.75rem" }} />
				<Typography variant="body1">{posts ? posts[postsIndex] : ""}</Typography>
			</Container>
			
			{/* TODO:
			1 Fix in memory loading of json on backend
			2 Fixup landing page and league home page
			2 Store winner/loser of matchup in schedule
			2 Drop player/Add player to empty spot?
			3 Lock Editing team once games start
			3 Loading skeletons
			3 OWL Schedule
			3 Trades?
			4 Commish posts
			4 Edit team settings?
			- Cleanup fetches
			- Cleanup types/typescript
			- Style for mobile 
			*/}
    </div>
  );
}

export default HomePage;
