import { Grid, GridColumn } from "@atlaskit/page";
import React, { useState, useEffect } from "react";
import { findObj, getCache } from "../../../common/utils";

const GanttChartStat = ({ title, value, info }) => {
	return (
		<div
			style={{
				width: "100%",
				height: "100px",
				backgroundColor: "#ebebeb",
				borderRadius: "12px",
			}}
		>
			<div
				style={{
					textAlign: "center",
					padding: "10px 0 5px 0",
					fontWeight: "bold",
				}}
			>
				{title}
			</div>
			<div
				style={{
					textAlign: "center",
					fontSize: "20px",
					marginBottom: "5px"
				}}
			>
				{value}
			</div>
			<div
				style={{
					textAlign: "center",
					fontSize: "15px",
					color: "#666"
				}}
			>
				{info}
			</div>
		</div>
	);
};

const GanttChartStats = ({ selectedSolution, solutionTasks }) => {
	var project = JSON.parse(getCache("project"));
	
	var start = solutionTasks[0]?.startDate;
	var end = solutionTasks[0]?.endDate;
	solutionTasks.forEach((t) => {
		if (t.startDate < start) {
			start = t.startDate;
		}
		if (t.endDate > end) {
			end= t.endDate;
		}
	});

	start = new Date(start);
	end = new Date(end);

	return selectedSolution ? (
		<Grid spacing="comfortable" columns={12}>
			<GridColumn medium={4}>
				<GanttChartStat
					title="Duration"
					value={selectedSolution.duration + " days"}
					info={
						start.toLocaleDateString("en-US") +
						" to " +
						end.toLocaleDateString("en-US")
					}
				/>
			</GridColumn>
			<GridColumn medium={4}>
				<GanttChartStat
					title="Cost"
					value={selectedSolution.cost + " " + project.budgetUnit}
				/>
			</GridColumn>
			<GridColumn medium={4}>
				<GanttChartStat
					title="Quality"
					value={selectedSolution.quality + "%"}
				/>
			</GridColumn>
		</Grid>
	) : (
		""
	);
};

export default GanttChartStats;
