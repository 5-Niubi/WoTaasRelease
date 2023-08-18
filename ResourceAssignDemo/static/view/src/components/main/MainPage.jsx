import { Route, Router, Routes } from "react-router";
import { LeftSidebar, Main, PageLayout, Content } from "@atlaskit/page-layout";
import HomeSideBar from "../side-nav/HomeSideBar";
import ProjectListHome from "../../pages/projects/ProjectsListHome";
import AppFrame from "../common/AppFrame";
import SchedulePage from "../../pages/schedule";
import ProjectSideBar from "../side-nav/ProjectSideBar";
import StartUpPage from "../../pages/startup/StartUpPage";
import TestModal from "../../pages/TestModal";
import EstimationPage from "../../pages/schedule/estimation";
import LoadingModalWithThread from "../LoadingModalWithThread";
import MorePage from "../../pages/more";
import ResourcesPage from "../../pages/resources/ResourcePage";
import TasksPage from "../../pages/tasks/TasksPage";
import SkillsPage from "../../pages/skills/SkillsPage";
import React, { createContext, useEffect, useState } from "react";
import { STORAGE, THREAD_STATE_DEFAULT } from "../../common/contants";
import { invoke } from "@forge/bridge";
import Toastify from "../../common/Toastify";
import { removeThreadInfo } from "../../common/utils";

export const ThreadLoadingContext = createContext({ state: [] });

function MainPage({ history, historyState }) {
	const threadState = useState(THREAD_STATE_DEFAULT);
	const [threadStateValue, setThreadStateValue] = threadState;

	useEffect(() => {
		getThreadStateInfo();
	}, []);

	function getThreadStateInfo() {
		let threadInfoRaw = localStorage.getItem(STORAGE.THREAD_INFO) || "{}";
		let threadInfo = JSON.parse(threadInfoRaw);
		if (threadInfo) {
			setThreadStateValue({
				threadId: threadInfo.threadId,
				threadAction: threadInfo.threadAction,
			});
		}
		invoke("getThreadStateInfo")
			.then(function (res) {
				console.log(res);
				if (res.threadId)
					setThreadStateValue({
						threadId: res.threadId,
						threadAction: res.threadAction,
					});
				else removeThreadInfo();
			})
			.catch((error) => {
				Toastify.error(error);
			});
	}

	return (
		<ThreadLoadingContext.Provider value={{ state: threadState }}>
			<PageLayout>
				<Content>
					<LeftSidebar>
						<div style={{ height: "100vh" }}>
							<Router
								navigator={history}
								navigationType={historyState.action}
								location={historyState.location}
							>
								<Routes>
									{/* Path with * take effect in all route after current */}
									<Route path="/" element={<HomeSideBar rootPath="/" />}>
										<Route></Route>
										<Route
											path="/projects"
											element={<HomeSideBar rootPath="/" />}
										></Route>
										<Route
											path="/resources"
											element={<HomeSideBar rootPath="/" />}
										></Route>
										<Route
											path="/skills"
											element={<HomeSideBar rootPath="/" />}
										></Route>
										<Route
											path="/subscription"
											element={<HomeSideBar rootPath="/" />}
										></Route>
									</Route>
									<Route
										path="/:projectId/*"
										element={<ProjectSideBar rootPath="/:projectId/" />}
									></Route>
								</Routes>
							</Router>
						</div>
					</LeftSidebar>
					<Main testId="main" id="main">
						<AppFrame>
							<Router
								navigator={history}
								navigationType={historyState.action}
								location={historyState.location}
							>
								<Routes>
									<Route path="/" element={<ProjectListHome />}></Route>
									<Route path="/startup" element={<StartUpPage />}></Route>

									<Route path="/resources" element={<ResourcesPage />}></Route>
									<Route path="/skills" element={<SkillsPage />}></Route>
									<Route path="/subscription" element={<MorePage />}></Route>
									<Route path="/modals" element={<TestModal />}></Route>

									<Route path="/:projectId">
										<Route path="" element={<SchedulePage />}></Route>
										<Route
											path="estimation"
											element={<EstimationPage />}
										></Route>
										<Route path="schedule" element={<SchedulePage />}></Route>
										<Route path="tasks" element={<TasksPage />}></Route>
									</Route>
								</Routes>
								{threadStateValue.threadId && (
									<LoadingModalWithThread state={threadState} />
								)}
							</Router>
						</AppFrame>
					</Main>
				</Content>
			</PageLayout>
			;
		</ThreadLoadingContext.Provider>
	);
}

export default MainPage;
