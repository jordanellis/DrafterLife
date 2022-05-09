import React, {useEffect, useState} from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";

const PostCarousel = () => {
	const items = [
		{
			name: "Random Name #1",
			description: "Probably the most random thing you have ever seen!"
		},
		{
			name: "Random Name #2",
			description: "Hello World!"
		},
		{
			name: "Random Name #3",
			description: "Hqwerhahaa"
		},
		{
			name: "Random Name #4",
			description: "asdf"
		}
	];
	return (
		<Carousel height={"7rem"}>
			{
				items.map((item, i) => 
					<Paper key={i}>
						<h2>{item.name}</h2>
						<p>{item.description}</p>
						<Button className="CheckButton">
							Check it out!
						</Button>
					</Paper>)
			}
		</Carousel>
	);
};

export default PostCarousel;