import Tabs, { Tab, TabList, TabPanel } from "@atlaskit/tabs";
import VisualizeTasksPage from "./pertchart/VisualizeTasks";
import ParameterPage from "./parameter/ParameterPage";
import Badge from "@atlaskit/badge";
import EstimationPage from "./estimation";
import { createContext, useCallback, useEffect, useState } from "react";
import ResultPage from "./resultpage/ResultPage";
import React from "react";
import { invoke, router } from "@forge/bridge";
import Toastify from "../../common/Toastify";
import { cache, clearProjectBasedCache, getCache } from "../../common/utils";
import Link from "../../components/common/Link";
import { useParams, useLocation } from "react-router";
const projectInfoContextInit = {};
export const ProjectInfoContext = createContext(projectInfoContextInit);

export default function ScheduleTabs() {
	const { projectId } = useParams();
	// const [selected, setSelected] = useState(0);

	const [selected, setSelected] = useState(
		parseInt(getCache("tab_selected")) || 0
	);

	useEffect(() => {
		cache("tab_selected", selected);
	}, [selected]);

	var project = getCache("project");
	if (!project) {
		clearProjectBasedCache();
		project = {};
	} else {
		project = JSON.parse(project);
		if (!project || project.id != projectId) {
			clearProjectBasedCache();
			project = {};
		}
	}
	// const [project, setProject] = useState(projectCache);

	const handleChangeTab = useCallback(
		(index) => {
			setSelected(index);
		},
		[setSelected]
	);

	return (
		<ProjectInfoContext.Provider value={project}>
			<Tabs onChange={handleChangeTab} selected={selected} id="default">
				<TabList>
					<Tab id="tasks">
						<Badge>{1}</Badge> Tasks dependencies
					</Tab>
					<Tab id="suggestion">
						<Badge>{2}</Badge> Resource suggestion
					</Tab>
					<Tab id="parameters">
						<Badge>{3}</Badge> Parameters
					</Tab>
					<Tab id="solutions">
						<Badge>{4}</Badge> Schedule
					</Tab>
				</TabList>
				<TabPanel>
					<VisualizeTasksPage handleChangeTab={handleChangeTab} />
				</TabPanel>
				<TabPanel>
					<EstimationPage handleChangeTab={handleChangeTab} />
				</TabPanel>
				<TabPanel>
					<ParameterPage handleChangeTab={handleChangeTab} />
				</TabPanel>
				<TabPanel>
					<ResultPage handleChangeTab={handleChangeTab} />
				</TabPanel>
			</Tabs>
		</ProjectInfoContext.Provider>
	);
}
