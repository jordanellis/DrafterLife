import React, { useState } from "react";
import { 
  AppBar, 
  Card, 
  Container, 
  Divider, 
  Stack, 
  Typography, 
} from '@mui/material';
import { useEffect } from "react";

type ScheduledMatches = {
  matches: Array<string[]>;
}

const Header = () => {
  const [schedule, setSchedule] = useState<ScheduledMatches>();

	useEffect(() => {
		fetchSchedule()
			.then(res => setSchedule(res.data))
			.catch(err => console.log(err))
	}, []);

	const fetchSchedule = async () => {
    const response = await fetch('/api/league/schedule');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

	return (
    <Container sx={{ textAlign: "center" }}>
      <Card variant="outlined" sx={{ display: "inline-block", width: "auto", padding: "0rem 2rem" }}>
        <Stack direction="row" margin="0.5rem" justifyContent="center" divider={<Divider orientation="vertical" flexItem />} spacing={3}>
          <Typography variant="subtitle1" sx={{ margin: "auto 0" }}>Matches:</Typography>
          {schedule && schedule.matches.map((match, index) => (
            <Container key={index} sx={{ display: "inline-block", float: "left", flexDirection: "column", textAlign: "center", margin: "auto 0", width: "unset" }}>
              <Typography variant="subtitle2">{ match[0] }</Typography>
              <Typography variant="caption">vs</Typography>
              <Typography variant="subtitle2">{ match[1] }</Typography>
            </Container>
          ))}
        </Stack>
      </Card>
    </Container>
    );
}

export default Header