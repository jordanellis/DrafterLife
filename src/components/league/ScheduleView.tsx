import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Card,
  Typography, 
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Schedule } from "./types";

type ScheduleResp = {
  data: Schedule;
}

const ScheduleView = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule>();

  useEffect(() => {
    fetchSchedule()
    .then((scheduleResp: ScheduleResp) => {
      console.log(scheduleResp.data)
      setSchedule(scheduleResp.data);
    })
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
      <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
        {"< Back"}
      </Button>
      {schedule && schedule.weeks.map((week, key) => {
        return (
          <Container key={key} sx={{ pb: "2rem" }}>
            <Typography>{"Week " + week.week}</Typography>
            {week.matches.map((match, key) => {
              return (
                <Card key={key}>{match[0] + " vs. " + match[1]}</Card>
              );
            })}
          </Container>
        );
      })}
    </Container>
    );
}

export default ScheduleView