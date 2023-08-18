import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import DynamicTable from "@atlaskit/dynamic-table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import GanttChartPage from "../ganttchart/GanttChartPage";
import { invoke } from "@forge/bridge";
import Toastify from "../../../common/Toastify";
import { Grid, GridColumn } from "@atlaskit/page";
import Pagination from "@atlaskit/pagination";
import Spinner from "@atlaskit/spinner";
import { getCache } from "../../../common/utils";
import EmptyState from "@atlaskit/empty-state";
import { ROW_PER_PAGE } from "../../../common/contants";
import "./style.css";

/**
 * Using as Page to show pert chart and task dependences
 * @returns {import("react").ReactElement}
 */
function ResultPage({ handleChangeTab }) {
	let { projectId } = useParams();

	var project = getCache("project");
	if (!project) {
	} else {
		project = JSON.parse(project);
	}

	const actionsContent = (
		<ButtonGroup>
			<Button onClick={() => handleChangeTab(2)}>Reschedule</Button>
		</ButtonGroup>
	);

	const [solutions, setSolutions] = useState([]);
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(function () {
		invoke("getSolutionsByProject", { projectId })
			.then(function (res) {
				setPageLoading(false);
				if (res) {
					setSolutions(res.values);
				}
			})
			.catch((error) => {
				setPageLoading(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	}, []);

	const [selectedSolution, setSelectedSolution] = useState(null);

	const head = {
		cells: [
			{
				key: "no",
				content: "No",
				isSortable: true,
				width: 15,
			},
			{
				key: "since",
				content: "Generated at",
				shouldTruncate: true,
				isSortable: true,
				width: 20,
			},
			{
				key: "duration",
				content: "Duration",
				shouldTruncate: true,
				isSortable: true,
				width: 15,
			},
			{
				key: "cost",
				content: "Cost",
				shouldTruncate: true,
				isSortable: true,
				width: 15,
			},
			{
				key: "quality",
				content: "Quality",
				shouldTruncate: true,
				isSortable: true,
				width: 15,
			},
			{
				key: "action",
				shouldTruncate: true,
			},
		],
	};

	const rows = solutions.map((s, index) => {
		let since = "N/A";
		if (s.since) {
			let datetime = new Date(s.since);
			since = datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();
		}
		return ({
			key: `row-${s.id}`,
			isHighlighted: false,
			cells: [
				{
					key: index,
					content: (
						<Button
							appearance="subtle-link"
							onClick={() => setSelectedSolution(s)}
						>
							{"Solution #" + s.id}
						</Button>
					),
				},
				{
					key: index,
					content: since,
				},
				{
					key: index,
					content: s.duration + " days",
				},
				{
					key: index,
					content: "$" + s.cost,
				},
				{
					key: index,
					content: s.quality + "%",
				},
				{
					key: "option",
					content: (
						<div className="actions">
						<Button onClick={() => setSelectedSolution(s)}>
							View
						</Button>
						</div>
					),
				},
			],
		});
	});

	return (
		<div
			className="solutions-list"
			style={{ width: "100%", height: "90vh" }}
		>
			{selectedSolution !== null ? (
				<GanttChartPage
					setSelectedSolution={setSelectedSolution}
					selectedSolution={selectedSolution}
				/>
			) : (
				<>
					<PageHeader actions={actionsContent}>
						Solution optimizations
					</PageHeader>
					<h4 style={{ marginBottom: "10px" }}>
						Total number of solutions: {solutions.length}
					</h4>
					<DynamicTable
						head={head}
						rows={rows}
						rowsPerPage={ROW_PER_PAGE}
						defaultPage={1}
						page={1}
						isFixedSize
						defaultSortKey="no"
						defaultSortOrder="DESC"
						onSort={() => console.log("onSort")}
						isLoading={pageLoading}
						emptyView={
							<EmptyState
								header="Empty"
								description="Look like there is no schedule solution yet."
								primaryAction={
									<Button
										appearance="primary"
										onClick={() => handleChangeTab(2)}
									>
										Schedule
									</Button>
								}
							/>
						}
					/>
				</>
			)}
		</div>
	);
}

export default ResultPage;
