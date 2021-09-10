import React, { useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import {
  Button,
  Typography 
} from '@material-ui/core';

export default function MyLeagues() {
  const [rowData] = useState([
		{ make: "Toyota", model: "Celica", price: 35000 },
		{ make: "Ford", model: "Mondeo", price: 32000 },
		{ make: "Porsche", model: "Boxter", price: 72000 }
	]);

  return (
		<div>
			<Typography variant="h3">
				My Leagues
			</Typography>
			<div className="ag-theme-balham-dark" style={{ height: 400, width: 800 }}>
					<AgGridReact
							rowData={rowData}>
							<AgGridColumn field="make" sortable={ true } filter={ true }></AgGridColumn>
							<AgGridColumn field="model" sortable={ true } filter={ true }></AgGridColumn>
							<AgGridColumn field="price" sortable={ true } filter={ true }></AgGridColumn>
					</AgGridReact>
			</div>
			<Button variant="contained" color="primary">
				Hello World
			</Button>
		</div>
	);
}