import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Spinner from "@atlaskit/spinner";
import { invoke } from "@forge/bridge";
import {
	cache,
	clearAllCache,
	clearProjectBasedCache,
	findObj,
	getCache,
} from "../../common/utils";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import DynamicTable from "@atlaskit/dynamic-table";
import EmptyState from "@atlaskit/empty-state";
import { COLOR_SKILL_LEVEL, ROW_PER_PAGE } from "../../common/contants";
import "./style.css";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import { Grid, GridColumn } from "@atlaskit/page";
import CreateTaskModal from "../schedule/pertchart/modal/CreateTaskModal";
import Lozenge from "@atlaskit/lozenge";
import DeleteTaskModal from "../schedule/pertchart/modal/DeleteTaskModal";
import Toastify from "../../common/Toastify";
import CreateMilestoneModal from "./modal/CreateMilestoneModal";
import DeleteMilestoneModal from "./modal/DeleteMilestoneModal";
import { PiStarFill } from "react-icons/pi";

/**
 * Using as Demo Homepage
 * @returns {import("react").ReactElement}
 */
function TasksPage() {
	let navigate = useNavigate();
	let { projectId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [loadingTasks, setLoadingTasks] = useState(true);
	const [tasks, setTasks] = useState([]);
	const [milestones, setMilestones] = useState([]);
	const [skills, setSkills] = useState([]);
	const [selectedMilestone, setSelectedMilestone] = useState(null);
	const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(0);
	const [displayTasks, setDisplayTasks] = useState(tasks);

	const [isModalCreateTaskOpen, setIsModalCreateTaskOpen] = useState(false);
	const [isModalDeleteTaskOpen, setIsModalDeleteTaskOpen] = useState(false);
	const [taskEdit, setTaskEdit] = useState(null);

	const [isModalCreateMilestoneOpen, setIsModalCreateMilestoneOpen] =
		useState(false);
	const [isModalDeleteMilestoneOpen, setIsModalDeleteMilestoneOpen] =
		useState(false);
	const [milestoneEdit, setMilestoneEdit] = useState(null);

	const updateTasks = (tasks) => {
		cache("tasks", JSON.stringify(tasks));
		setTasks(tasks);

		var milestoneTasks = [];
		for (let j = 0; j < tasks.length; j++) {
			if (tasks[j].milestoneId == selectedMilestone) {
				milestoneTasks.push(tasks[j]);
			}
		}
		setDisplayTasks(milestoneTasks);
	};
	const updateSkills = (skills) => {
		cache("skills", JSON.stringify(skills));
		setSkills(skills);
	};
	const updateMilestones = (milestones) => {
		cache("milestones", JSON.stringify(milestones));
		setMilestones(milestones);
	};

	useEffect(function () {
		setLoadingTasks(false);
		var projectCache = getCache("projectCache");
		if (!projectCache) {
			clearProjectBasedCache();
			projectCache = {};
		} else {
			projectCache = JSON.parse(projectCache);
			if (!projectCache || projectCache.id != projectCacheId) {
				clearProjectBasedCache();
				projectCache = {};
			}
		}
		var tasksCache = getCache("tasks");
		var milestonesCache = getCache("milestones");
		var skillsCache = getCache("skills");

		if (Object.keys(projectCache).length == 0) {
			setIsLoading(true);
			invoke("getProjectDetail", { projectId })
				.then(function (res) {
					setIsLoading(false);
					if (res.id) {
						cache("project", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					setIsLoading(false);
					console.log(error);
					Toastify.error(error.toString());
				});
		}

		if (!tasksCache) {
			setLoadingTasks(true);
			invoke("getTasksList", { projectId })
				.then(function (res) {
					setLoadingTasks(false);
					if (res) {
						setTasks(res);
						setDisplayTasks(res);
						cache("tasks", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					setLoadingTasks(false);
					console.log(error);
					Toastify.error(error.toString());
				});
		} else {
			setTasks(JSON.parse(tasksCache));
		}

		if (!milestonesCache) {
			setLoadingTasks(true);
			invoke("getAllMilestones", { projectId })
				.then(function (res) {
					setLoadingTasks(false);
					if (Object.keys(res).length !== 0) {
						setMilestones(res);
						cache("milestones", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					setLoadingTasks(false);
					console.log(error);
					Toastify.error(error.toString());
				});
		} else {
			setMilestones(JSON.parse(milestonesCache));
		}

		if (!skillsCache) {
			setLoadingTasks(true);
			invoke("getAllSkills", {})
				.then(function (res) {
					setLoadingTasks(false);
					if (Object.keys(res).length !== 0) {
						setSkills(res);
						cache("skills", JSON.stringify(res));
					}
				})
				.catch(function (error) {
					setLoadingTasks(false);
					console.log(error);
					Toastify.error(error.toString());
				});
		} else {
			setSkills(JSON.parse(skillsCache));
		}
	}, []);

	const handleChangeMilestone = (id, index = 0) => {
		setSelectedMilestone(id);
		setSelectedMilestoneIndex(index);

		var milestoneTasks = [];
		if (id === null) {
			milestoneTasks = tasks;
		}
		if (id === 0) {
			for (let j = 0; j < tasks.length; j++) {
				if (!tasks[j].milestoneId) {
					milestoneTasks.push(tasks[j]);
				}
			}
		} else {
			for (let j = 0; j < tasks.length; j++) {
				if (tasks[j].milestoneId == id) {
					milestoneTasks.push(tasks[j]);
				}
			}
		}

		setDisplayTasks(milestoneTasks);
	};

	const actionsContent = (
		<ButtonGroup>
			<Button
				onClick={() => {
					setMilestoneEdit(null);
					setIsModalCreateMilestoneOpen(true);
				}}
			>
				Create new group
			</Button>
			<Button
				appearance="primary"
				onClick={() => {
					setTaskEdit(null);
					setIsModalCreateTaskOpen(true);
				}}
			>
				Create new task
			</Button>
		</ButtonGroup>
	);

	const head = {
		cells: [
			{
				key: "no",
				content: "",
				isSortable: false,
				width: 5,
			},
			{
				key: "name",
				content: "Task name",
				shouldTruncate: true,
				isSortable: false,
				width: 30,
			},
			{
				key: "duration",
				content: "Duration",
				shouldTruncate: true,
				isSortable: false,
				width: 10,
			},
			{
				key: "skills",
				content: "Required skills",
				shouldTruncate: false,
				isSortable: false,
				width: 20,
			},
			{
				key: "precedences",
				content: "Tasks precedences",
				shouldTruncate: false,
				isSortable: false,
				width: 20,
			},
			{
				key: "action",
			},
		],
	};

	const groupHead = {
		cells: [
			{
				key: "name",
				content: "Task Groups",
				shouldTruncate: true,
				isSortable: false,
				width: 80,
			},
		],
	};

	var groupRows = milestones.map((m, index) => {
		return {
			key: `milestone-${m.id}`,
			isHighlighted: false,
			cells: [
				{
					key: m.id,
					content: (
						<>
							{m.name}
							<div className="actions">
								<ButtonGroup>
									<Button
										appearance="subtle"
										onClick={() => {
											setMilestoneEdit(m);
											setIsModalCreateMilestoneOpen(true);
										}}
									>
										<EditIcon />
									</Button>
									<Button
										appearance="subtle"
										onClick={() => {
											setMilestoneEdit(m);
											setIsModalDeleteMilestoneOpen(true);
										}}
									>
										<TrashIcon />
									</Button>
								</ButtonGroup>
							</div>
						</>
					),
				},
			],
			onClick: (e) => {
				handleChangeMilestone(m.id, index + 2);
			},
		};
	});
	groupRows.unshift(
		{
			key: `milestones`,
			cells: [
				{
					key: -1,
					content: <>All groups</>,
					onClick: (e) => {
						handleChangeMilestone(null, 0);
					},
				},
			],
		},
		{
			key: `milestone-${0}`,
			cells: [
				{
					key: 0,
					content: <>Uncategorized</>,
					onClick: (e) => {
						handleChangeMilestone(0, 1);
					},
				},
			],
		}
	);

	var rows = displayTasks?.map((task, index) => {
		return {
			key: `milestone-${selectedMilestone || "s"}-${index}`,
			isHighlighted: false,
			cells: [
				{
					key: "no",
					content: <div className="text-center">{index + 1}</div>,
				},
				{
					key: "name",
					content: (
						<div
							onClick={() => {
								setTaskEdit(task);
								setIsModalCreateTaskOpen(true);
							}}
						>
							{task.name}
						</div>
					),
				},
				{
					key: "duration",
					content: task.duration,
				},
				{
					key: "skill",
					content: (
						<>
							{task.skillRequireds?.map((obj, i) => {
								let skill = findObj(skills, obj.skillId);
								return (
									<span style={{ marginRight: "5px" }}>
										<Lozenge
											key={i}
											style={{
												marginLeft: "8px",
												backgroundColor:
													COLOR_SKILL_LEVEL[
														obj.level - 1
													].color,
												color:
													obj.level === 1
														? "#091e42"
														: "white",
											}}
											isBold
										>
											{skill.name} - {obj.level}
											<PiStarFill />
										</Lozenge>
									</span>
								);
							})}
						</>
					),
				},
				{
					key: "precedences",
					content: (
						<>
							{task.precedences?.map((obj, i) => {
								let preTask = findObj(tasks, obj.precedenceId);
								if (preTask) {
									return (
										<span style={{ marginRight: "5px" }}>
											<Lozenge
												key={i}
												style={{
													marginRight: "5px",
													maxWidth: "20px",
												}}
											>
												{preTask.name}
											</Lozenge>
										</span>
									);
								}
							})}
						</>
					),
				},
				{
					key: "option",
					content: (
						<div className="actions">
							<ButtonGroup>
								<Button
									appearance="subtle"
									onClick={() => {
										setTaskEdit(task);
										setIsModalCreateTaskOpen(true);
									}}
								>
									<EditIcon />
								</Button>
								<Button
									appearance="subtle"
									onClick={() => {
										setTaskEdit(task);
										setIsModalDeleteTaskOpen(true);
									}}
								>
									<TrashIcon />
								</Button>
							</ButtonGroup>
						</div>
					),
				},
			],
		};
	});

	return (
		<>
			{isLoading ? (
				<Spinner size="large" />
			) : (
				<div className="tasks-page">
					<PageHeader actions={actionsContent}>Tasks List</PageHeader>
					<Grid layout="fluid" spacing="compact" columns={10}>
						<GridColumn medium={3}>
							<div className="task-groups">
								<DynamicTable
									head={groupHead}
									rows={groupRows}
									highlightedRowIndex={[
										selectedMilestoneIndex,
									]}
									isFixedSize
									isLoading={loadingTasks}
								/>
							</div>
						</GridColumn>

						<GridColumn medium={7}>
							<div className="tasks-container">
								<DynamicTable
									head={head}
									rows={rows}
									rowsPerPage={20}
									defaultPage={1}
									page={1}
									isFixedSize
									onSort={() => console.log("onSort")}
									isLoading={loadingTasks}
									emptyView={
										<EmptyState
											header="Empty"
											description="There is no tasks."
											primaryAction={
												<Button
													appearance="primary"
													onClick={() => {
														setTaskEdit(null);
														setIsModalCreateTaskOpen(
															true
														);
													}}
												>
													Create new task
												</Button>
											}
										/>
									}
								/>
							</div>
						</GridColumn>
					</Grid>

					{isModalCreateTaskOpen ? (
						<CreateTaskModal
							isOpen={isModalCreateTaskOpen}
							setIsOpen={setIsModalCreateTaskOpen}
							projectId={projectId}
							milestones={milestones}
							tasks={tasks}
							skills={skills}
							updateTasks={updateTasks}
							updateCurrentTaskId={null}
							updateSkills={updateSkills}
							updateMilestones={updateMilestones}
							taskEdit={taskEdit}
							updateTaskEdit={(task) => setTaskEdit(task)}
						/>
					) : (
						""
					)}

					{isModalDeleteTaskOpen ? (
						<DeleteTaskModal
							isOpen={isModalDeleteTaskOpen}
							setIsOpen={setIsModalDeleteTaskOpen}
							task={taskEdit}
							tasks={tasks}
							updateTasks={updateTasks}
							updateTaskEdit={(task) => setTaskEdit(task)}
						/>
					) : (
						""
					)}

					{isModalCreateMilestoneOpen ? (
						<CreateMilestoneModal
							isOpen={isModalCreateMilestoneOpen}
							setIsOpen={setIsModalCreateMilestoneOpen}
							projectId={projectId}
							milestones={milestones}
							updateMilestones={updateMilestones}
							milestoneEdit={milestoneEdit}
							updateMilestoneEdit={(m) => updateMilestoneEdit(m)}
						/>
					) : (
						""
					)}

					{isModalDeleteMilestoneOpen ? (
						<DeleteMilestoneModal
							setIsOpen={setIsModalDeleteMilestoneOpen}
							milestone={milestoneEdit}
							milestones={milestones}
							updateMilestones={updateMilestones}
							updateSelectedMilestoneIndex={(i) =>
								setSelectedMilestoneIndex(i)
							}
						/>
					) : (
						""
					)}
				</div>
			)}
		</>
	);
}

export default TasksPage;
