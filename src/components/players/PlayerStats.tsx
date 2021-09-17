import { Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import React from 'react';
// import data from "../../data/one_match.csv"

const useStyles = makeStyles({
  playerStatsGrid: {
    height: "25rem",
    width: "100%"
	}
});

export default function PlayerStats() {
	// const isMounted = useRef(null);
	// const csvToJson = (csv) => {
	// 	var lines=csv.split("\r\n");
	// 	var result = [];
	// 	var headers = lines[0].split(",");
	
	// 	for(var i=1; i < lines.length; i++){
	// 		var obj = {};
	// 		var currentline = lines[i].split(",");
	
	// 		for(var j=0; j < headers.length; j++){
	// 			obj[headers[j]] = currentline[j];
	// 		}
	// 		result.push(obj);
	// 	}
	// 	return result;
	// }

	// const readPlayerDataFile = useCallback(() => {
	// 	fetch(data)
	// 	.then(r => r.text())
	// 	.then(text => {
	// 		if (isMounted.current) {
	// 			setRowData(csvToJson(text));
	// 		}
	// 	}).catch(err => {
	// 		console.log(err)
	// 	});
	// }, []);

	// const [rowData, setRowData] = useState(readPlayerDataFile());

	// useEffect(() => {
	// 	isMounted.current = true;
	// 	readPlayerDataFile();
	// 	return () => {isMounted.current = false}
	// }, [readPlayerDataFile])

	const classes = useStyles();

  return (
		<div>
			<Typography variant="h3">
				Player Stats
			</Typography>
			<div className={classes.playerStatsGrid}>
				<AgGridReact className="ag-theme-balham-dark" rowData={[]} pagination={true} paginationPageSize={25} >
						<AgGridColumn field="esports_match_id"></AgGridColumn>
						<AgGridColumn field="map_type"></AgGridColumn>
						<AgGridColumn field="map_name"></AgGridColumn>
						<AgGridColumn field="player_name"></AgGridColumn>
						<AgGridColumn field="team_name"></AgGridColumn>
						<AgGridColumn field="stat_name"></AgGridColumn>
						<AgGridColumn field="hero_name"></AgGridColumn>
						<AgGridColumn field="stat_amount"></AgGridColumn>
						<AgGridColumn field="start_time"></AgGridColumn>
				</AgGridReact>
			</div>
			<Button variant="contained" color="primary">
				Hello World
			</Button>
		</div>
	);
}