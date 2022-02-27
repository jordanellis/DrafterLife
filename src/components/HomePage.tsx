import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../service/fetches";

interface Post {
	title: string;
	text: string;
	image: string;
};

const HomePage = () => {
	const [posts, setPosts] = useState<Post[]>();
	const [postsIndex, setPostIndex] = useState(0);

	useEffect(() => {
		fetchPosts()
			.then((postsResp: Post[]) => {
				setPosts(postsResp);
			})
			.catch(err => console.log(err))
	}, []);

	const displayPostPreview = (post: string) => {
		const maxLength = 120;
		return (post.length > maxLength) ? post.substr(0, maxLength-1) + '...' : post;
	};

	const displayPostCards = () => {
		return (
			<Container sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
				{posts?.map((post, i) => {
					return (
						<Card key={i} sx={{ margin: "1rem", textAlign: "center", minWidth: 345, maxWidth: 345 }} onClick={() => setPostIndex(i)}>
							<CardActionArea>
								<CardMedia
									component="img"
									height="140"
									image={post.image}
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{post.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{displayPostPreview(post.text)}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					);
				})}
			</Container>
		);
	}

  return (
    <Box>
			<Box sx={{
				height: "23rem",
				width: "100%",
				backgroundImage: `url(https://images.blz-contentstack.com/v3/assets/blt2477dcaf4ebd440c/blt2f2814e279463a3c/610314754abcae50334cea4d/malevento-screenshot-003.jpg)`,
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
				{[
					{"text":"OWL Teams", "path": "/teams/"},
					{"text":"View My League", "path": "/league/"}
				].map((button, i) => {
					return (<Link key={i} style={{ textDecoration: 'none' }} to={button.path}>
						<Button variant="contained" sx={{
							backgroundColor: "background.default",
							m: "1rem",
							fontSize: "1.1rem",
							fontWeight: "400",
							width: "12rem",
							height: "4.5rem",
							opacity: "85%"
						}}>
							{button.text}
						</Button>
					</Link>);
				})}
			</Box>
			<Box sx={{ m: "2rem 3.5rem" }}>
				<Typography variant="h5">News</Typography>
				<Divider sx={{ m: "0.75rem" }} />
				<Typography variant="body1">{posts ? posts[postsIndex].text : ""}</Typography>
			</Box>
			{displayPostCards()}
			{/* TODO:
			1 Edit team settings
			1 Lock Editing team once games start
			1 Loading skeletons
			2 OWL Schedule
			3 Trades?
			- Cleanup types/typescript
			- Style for mobile 
			*/}
    </Box>
  );
}

export default HomePage;
