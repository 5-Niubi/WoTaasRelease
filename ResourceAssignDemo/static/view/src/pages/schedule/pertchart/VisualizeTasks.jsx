import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import TaskDetail from "./TaskDetail";
import PertChart from "./PertChart";
import { invoke } from "@forge/bridge";
import { Content, Main, PageLayout, RightSidebar } from "@atlaskit/page-layout";
import TasksCompact from "./TasksCompact";
import Toastify from "../../../common/Toastify";
import PageHeader from "@atlaskit/page-header";
import Button, { LoadingButton } from "@atlaskit/button";
import "./style.css";
import { cache, extractErrorMessage, findObj, getCache } from "../../../common/utils";
import ChevronRightCircleIcon from "@atlaskit/icon/glyph/chevron-right-circle";
import ChevronLeftCircleIcon from "@atlaskit/icon/glyph/chevron-left-circle";

/**
 * Using as Page to show pert chart and task dependences
 * @returns {import("react").ReactElement}
 */
function VisualizeTasksPage({ handleChangeTab }) {
	let { projectId } = useParams();

	const [canEstimate, setCanEstimate] = useState(true);
	const updateCanEstimate = (can) => {
		setCanEstimate(can);
	};

	const [isSaving, setIsSaving] = useState(false);
	const [isEstimating, setIsEstimating] = useState(false);
	const [tasksError, setTasksError] = useState([]);

	const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
	const handleCollapseRightPanel = () => {
		document.getElementsByClassName("tasks-compact")[0].classList.toggle("-collapsed");
		setRightPanelCollapsed(document.getElementsByClassName("tasks-compact")[0].classList.contains("-collapsed"));
	};

	function handleEstimate() {
		setIsEstimating(true);
		invoke("estimate", { projectId })
			.then(function (res) {
				setIsEstimating(false);
				if (res.id || res.id === 0) {
					Toastify.success("Estimated successfully");
					localStorage.setItem("estimation", JSON.stringify(res));
					//move to next tab
					handleChangeTab(1);
				} else {
					Toastify.error("Error in estimate");
				}
			})
			.catch(function (error) {
				setIsEstimating(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	}

	function handleSave() {
		setIsSaving(true);
		var data = {
			ProjectId: projectId,
			TaskPrecedenceTasks: [],
			TaskSkillsRequireds: [],
		};

		tasks.forEach((task) => {
			let preArray = [];
			task.precedences.forEach((pre) => preArray.push(pre.precedenceId));
			data.TaskPrecedenceTasks.push({
				TaskId: task.id,
				TaskPrecedences: preArray,
			});
			data.TaskSkillsRequireds.push({
				TaskId: task.id,
				SkillsRequireds: task.skillRequireds,
			});
		});

		invoke("saveTasks", { tasks: data })
			.then(function (res) {
				setIsSaving(false);
				//function return true or list of error task
				if (res == true) {
					setCanEstimate(true);
					setTasksError([]);
					Toastify.success("Saved successfully");
				}
			})
			.catch(function (error) {
				setCanEstimate(false);
				setIsSaving(false);
				console.log(error);
				let errorMsg = extractErrorMessage(error);
				if (errorMsg.message){
					console.log(errorMsg.message);
					Toastify.error(errorMsg.message);
				} else {
					var tasksError = [];
					errorMsg.forEach((e) =>{
						let task = findObj(tasks, e.taskId);
						if (task){
							tasksError.push(e);
							Toastify.error(`${task.name}: ${e.messages}`);
						}
					});
					setTasksError(tasksError);
				}
			});
	}

	//tasks represent list of all tasks in the pool of current project
	//-which are shown in the right panel
	var tasksCache = getCache("tasks");
	if (!tasksCache) {
		tasksCache = [];
	} else {
		tasksCache = JSON.parse(tasksCache);
	}

	var skillsCache = getCache("skills");
	if (!skillsCache) {
		skillsCache = [];
	} else {
		skillsCache = JSON.parse(skillsCache);
	}

	var milestonesCache = getCache("milestones");
	if (!milestonesCache) {
		milestonesCache = [];
	} else {
		milestonesCache = JSON.parse(milestonesCache);
	}
	const [tasks, setTasks] = useState(tasksCache);
	const [skills, setSkills] = useState(skillsCache);
	const [milestones, setMilestones] = useState(milestonesCache);
	const [loadingTasks, setLoadingTasks] = useState(tasks.length == 0);
	useEffect(function () {
		setLoadingTasks(false);
		var tasksCache = getCache("tasks");
		if (!tasksCache) {
			setLoadingTasks(true);
			invoke("getTasksList", { projectId })
				.then(function (res) {
					setLoadingTasks(false);
					if (res) {
						setTasks(res);
						cache("tasks", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					setLoadingTasks(false);
					console.log(error);
					Toastify.error(error.toString());
				});
		}

		var skillsCache = getCache("skills");
		if (!skillsCache) {
			invoke("getAllSkills", {})
				.then(function (res) {
					if (Object.keys(res).length !== 0) {
						setSkills(res);
						cache("skills", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
		}

		var milestonesCache = getCache("milestones");
		if (!milestonesCache) {
			invoke("getAllMilestones", { projectId })
				.then(function (res) {
					if (Object.keys(res).length !== 0) {
						setMilestones(res);
						cache("milestones", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
		}
	}, []);

	//currentTask represents the selected task to be shown in the bottom panel
	const [currentTaskId, setCurrentTaskId] = useState(
		tasks.length ? tasks[0].id : null
	);
	const updateCurrentTaskId = (taskId) => {
		setCurrentTaskId(taskId);
	};

	//selectedTask represents the all the tasks that are currently selected for the pert chart
	const [selectedIds, setSelectedIds] = useState([]);
	const updateSelectedTaskIds = (taskIds) => {
		setSelectedIds(taskIds);
	};

	const [dependenciesChanged, setDependenciesChanged] = useState(null);
	const updateDependenciesChanged = (dataChanged) => {
		setDependenciesChanged(dataChanged);
	};

	const [taskSkillsChanged, setTaskSkillsChanged] = useState(null);
	const updateTaskSkillsChanged = (dataChanged) => {
		setTaskSkillsChanged(dataChanged);
	};

	const [taskMilestoneChanged, setTaskMilestoneChanged] = useState(null);
	const updateTaskMilestoneChanged = (dataChanged) => {
		setTaskMilestoneChanged(dataChanged);
	};

	const [currentTaskChanged, setCurrentTaskChanged] = useState(null);
	const updateCurrentTaskChanged = (dataChanged) => {
		setCurrentTaskChanged(dataChanged);
	};

	const updateTasks = (tasks) => {
		cache("tasks", JSON.stringify(tasks));
		setTasks(tasks);
	};
	const updateSkills = (skills) => {
		cache("skills", JSON.stringify(skills));
		setSkills(skills);
	};
	const updateMilestones = (milestones) => {
		cache("milestones", JSON.stringify(milestones));
		setMilestones(milestones);
	};

	const actionsContent = (
		<div
			style={{
				display: "flex",
				justifyContent: "flex-start",
				gap: "20px",
				alignItems: "end",
			}}
		>
			{canEstimate ? (
				<LoadingButton
				appearance="primary"
				isLoading={isEstimating}
				onClick={handleEstimate}
			>
				Estimate
			</LoadingButton>
			) : (
				<LoadingButton isLoading={isSaving} onClick={handleSave}>
					Save
				</LoadingButton>
			)}
			
		</div>
	);

	return (
		<div class="visualize-tasks">
			<PageLayout>
				<Content>
					<Main testId="main2" id="main2">
						<PageHeader actions={actionsContent}>
							Visualize Tasks
						</PageHeader>
						<PertChart
							tasks={tasks}
							milestones={milestones}
							selectedTaskIds={selectedIds}
							updateCurrentTaskId={updateCurrentTaskId}
							updateTasks={updateTasks}
							currentTaskId={currentTaskId}
							updateCanEstimate={updateCanEstimate}
						/>
						<TaskDetail
							tasks={tasks}
							skills={skills}
							milestones={milestones}
							selectedTaskIds={selectedIds}
							currentTaskId={currentTaskId}
							updateTasks={updateTasks}
							updateDependenciesChanged={
								updateDependenciesChanged
							}
							updateTaskSkillsChanged={updateTaskSkillsChanged}
							updateCurrentTaskChanged={updateCurrentTaskChanged}
							updateTaskMilestoneChanged={
								updateTaskMilestoneChanged
							}
							updateCanEstimate={updateCanEstimate}
							updateSkills={updateSkills}
							updateMilestones={updateMilestones}
						/>
					</Main>
					<div
						className="right-sidebar tasks-compact"
						style={{
							boxSizing: "border-box",
							borderLeft: "1px solid #e5e5e5",
							marginLeft: "2rem",
						}}
					>
						<RightSidebar
							testId="rightSidebar"
							id="right-sidebar"
							skipLinkTitle="Right Sidebar"
							isFixed={false}
							width={300}
						>
							<div
								className="collapse-button"
								onClick={handleCollapseRightPanel}
							>
								{rightPanelCollapsed ? (
									<ChevronLeftCircleIcon />
								) : (
									<ChevronRightCircleIcon />
								)}
							</div>
							<div
								style={{
									minHeight: "95vh",
									padding: "10px",
									boxSizing: "border-box",
								}}
							>
								<TasksCompact
									tasks={tasks}
									loadingTasks={loadingTasks}
									tasksError={tasksError}
									milestones={milestones}
									skills={skills}
									selectedIds={selectedIds}
									currentTaskId={currentTaskId}
									setSelectedIds={updateSelectedTaskIds}
									updateCurrentTaskId={updateCurrentTaskId}
									updateTasks={updateTasks}
									updateSkills={updateSkills}
									updateMilestones={updateMilestones}
								/>
							</div>
						</RightSidebar>
					</div>
				</Content>
			</PageLayout>
		</div>
	);
}

export default VisualizeTasksPage;
