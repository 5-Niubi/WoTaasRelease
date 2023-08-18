import React, { Fragment, useEffect, useState } from "react";
import Select, { CreatableSelect } from "@atlaskit/select";
import Form, { Field, FormFooter } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import PageHeader from "@atlaskit/page-header";
import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import { cache, findObj } from "../../../common/utils";
import { invoke } from "@forge/bridge";
import Toastify from "../../../common/Toastify";
import { useParams } from "react-router-dom";

/**
 * Using as part of visualize task page. To show dependences of a specific task
 */
const TaskDetail = ({
	tasks,
	skills,
	milestones,
	selectedTaskIds,
	currentTaskId,
	updateTasks,
	updateDependenciesChanged,
	updateTaskSkillsChanged,
	updateCurrentTaskChanged,
	updateTaskMilestoneChanged,
	updateCanEstimate,
	updateSkills,
	updateMilestones,
}) => {
	const { projectId } = useParams();
	const [milestoneCreating, setMilestoneCreating] = useState(false);
	const [skillCreating, setSkillCreating] = useState(false);
	const [isInfoChanged, setIsInfoChanged] = useState(false);
	const [isSavingInfo, setIsSavingInfo] = useState(false);

	var currentTask = findObj(tasks, currentTaskId);
	var selectedTasks = [];
	// selectedTaskIds?.forEach((id) => {
	// 	var task = findObj(tasks, id);
	// 	if (task) selectedTasks.push(task);
	// });

	//add all task to selected
	selectedTasks = JSON.parse(JSON.stringify(tasks));

	//add dummy tasks to the task list
	selectedTasks.unshift({
		id: -1,
		name: "Start",
		duration: 0,
		milestoneId: 0,
		precedences: [],
		skillRequireds: [],
	});
	selectedTasks.push({
		id: -2,
		name: "Finish",
		duration: 0,
		milestoneId: 0,
		precedences: [],
		skillRequireds: [],
	});

	var taskOpts = [];
	var taskValues = [];
	selectedTasks?.forEach((task) =>
		task.id != currentTaskId
			? taskOpts.push({ value: task.id, label: task.name })
			: ""
	);
	currentTask?.precedences?.forEach((pre) => {
		let preTask = findObj(tasks, pre.precedenceId);
		if (preTask)
			taskValues.push({ value: preTask.id, label: preTask.name });
	});

	var skillOpts = [];
	var skillValues = [];
	skills?.forEach((skill) => {
		for (let i = 1; i <= 5; i++) {
			skillOpts.push({
				value: skill.id + "-" + i,
				label: skill.name + " - level " + i,
			});
		}
	});
	currentTask?.skillRequireds?.forEach((s) => {
		var skill = findObj(skills, s.skillId);
		if (skill) {
			skillValues.push({
				value: skill.id + "-" + s.level,
				label: skill.name + " - level " + s.level,
			});
		}
	});

	var milestoneValue = {};
	var milestoneOpts = [];
	milestones?.forEach((milestone) => {
		milestoneOpts.push({
			value: milestone.id,
			label: milestone.name,
		});
	});
	if (currentTask?.milestoneId) {
		var milestone = findObj(milestones, currentTask.milestoneId);
		if (milestone) {
			milestoneValue = {
				value: milestone.id,
				label: milestone.name,
			};
		}
	}

	const handleChangePrecedence = (values) => {
		var ids = [];
		values?.forEach((item) =>
			ids.push({ taskId: currentTaskId, precedenceId: item.value })
		);

		currentTask.precedences = ids;
		updateDependenciesChanged(ids);
		updateCanEstimate(false);
	};

	const handleChangeSkill = (values) => {
		var skills = [];
		values?.forEach((item) => {
			var items = item.value.split("-");
			if (items.length != 2) return;

			//check duplicate skill; update level if needed
			let existed = false;
			skills?.forEach((s) => {
				if (s.skillId == items[0]) {
					s.level = items[1];
					existed = true;
				}
			});
			if (!existed) {
				skills.push({ skillId: items[0], level: items[1] });
			}
		});

		currentTask.skillRequireds = skills;
		updateTaskSkillsChanged(skills);
		updateCanEstimate(false);
		setIsInfoChanged(true);
	};

	const handleUpdateTask = () => {
		setIsSavingInfo(true);
		currentTask.projectId = projectId;
		invoke("updateTask", { task: currentTask })
			.then(function (res) {
				setIsSavingInfo(false);
				setIsInfoChanged(false);
				if (res.id) {
					updateCurrentTaskChanged(currentTask);
					for (let i = 0; i < tasks.length; i++) {
						if (tasks[i].id == currentTask.id){
							tasks[i] = currentTask;
							break;
						}
					}
					updateTasks(tasks);
					Toastify.success("Task updated successfully");
				}
			})
			.catch((error) => {
				setIsSavingInfo(false);
				setIsInfoChanged(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	};

	const handleCreateMilestone = (inputValue) => {
		let reqMilestone = {
			Name: inputValue,
			ProjectId: projectId,
		};
		setMilestoneCreating(true);
		invoke("createMilestone", { milestoneObjRequest: reqMilestone })
			.then(function (res) {
				setMilestoneCreating(false);
				if (res.id) {
					cache("milestones", JSON.stringify([...milestones, res]));
					updateMilestones([...milestones, res]);
				}
			})
			.catch((error) => {
				setMilestoneCreating(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	};

	const handleCreateSkill = (inputValue) => {
		setSkillCreating(true);
		invoke("createSkill", { skillReq: { name: inputValue } })
			.then(function (res) {
				setSkillCreating(false);
				if (res.id) {
					cache("skills", JSON.stringify([...skills, res]));
					updateSkills([...skills, res]);
					currentTask.skillRequireds.push({
						skillId: res.id,
						level: 1,
					});
					updateTaskSkillsChanged([
						...currentTask.skillRequireds,
						{ skillId: res.id, level: 1 },
					]);
				}
			})
			.catch((error) => {
				setSkillCreating(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	};

	const actionsContent = isInfoChanged ? (
		<ButtonGroup>
			<LoadingButton
				isLoading={isSavingInfo}
				appearance="primary"
				onClick={() => handleUpdateTask()}
			>
				Save task info
			</LoadingButton>
		</ButtonGroup>
	) : (
		""
	);

	return (
		<div className="task-details">
			<PageHeader actions={actionsContent}>Task details:</PageHeader>
			<div>
				<pre>
					{currentTask ? (
						<Form
							onSubmit={(formData) =>
								console.log("form data", formData)
							}
						>
							{({ formProps }) => (
								<form {...formProps} name="form">
									<Field
										label="Task name"
										name="name"
										defaultValue={currentTask.name}
										isRequired={true}
										isDisabled={isSavingInfo}
									>
										{({ fieldProps }) => (
											<Fragment>
												<Textfield
													{...fieldProps}
													onChange={(event) => {
														fieldProps.onChange(
															event
														);
														setIsInfoChanged(true);
														currentTask.name =
															event.currentTarget.value;
													}}
												/>
											</Fragment>
										)}
									</Field>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between ",
										}}
									>
										<div style={{ width: "35%" }}>
											<Field
												label="Duration"
												name="duration"
												defaultValue={
													currentTask.duration
												}
												isRequired={true}
												isDisabled={isSavingInfo}
											>
												{({ fieldProps }) => (
													<Fragment>
														<Textfield
															{...fieldProps}
															type="number"
															onChange={(
																event
															) => {
																fieldProps.onChange(
																	event
																);
																setIsInfoChanged(
																	true
																);
																currentTask.duration =
																	event.currentTarget.value;
															}}
															elemAfterInput={
																<span
																	style={{
																		paddingRight:
																			"10px",
																	}}
																>
																	DAYS
																</span>
															}
														/>
													</Fragment>
												)}
											</Field>
											<Field
												label="Group"
												name="milestone"
												defaultValue=""
												isRequired={true}
												isDisabled={isSavingInfo}
											>
												{({ fieldProps }) => (
													<Fragment>
														<CreatableSelect
															{...fieldProps}
															inputId="select-milestone"
															className="select-milestone"
															isClearable
															options={
																milestoneOpts
															}
															value={
																milestoneValue
															}
															onChange={(
																event
															) => {
																fieldProps.onChange(
																	event
																);
																setIsInfoChanged(
																	true
																);
																currentTask.milestoneId =
																	event?.value ||
																	null;
																updateTaskMilestoneChanged(
																	currentTask.milestoneId
																);
															}}
															onCreateOption={
																handleCreateMilestone
															}
															isSearchable={true}
															isLoading={
																milestoneCreating
															}
															placeholder="Choose group"
															menuPosition="fixed"
														/>
													</Fragment>
												)}
											</Field>
										</div>

										<div style={{ width: "60%" }}>
											<Field
												label="Required skills"
												name="skills"
												defaultValue=""
												isRequired={true}
											>
												{({ fieldProps }) => (
													<Fragment>
														<CreatableSelect
															{...fieldProps}
															inputId="select-skills"
															className="select-skills"
															isClearable
															options={skillOpts}
															value={skillValues}
															onChange={
																handleChangeSkill
															}
															onCreateOption={
																handleCreateSkill
															}
															isMulti
															isSearchable={true}
															isLoading={
																skillCreating
															}
															placeholder="Choose skills"
															menuPosition="fixed"
														/>
													</Fragment>
												)}
											</Field>
											<Field
												label="Precedence tasks"
												name="precedences"
												defaultValue=""
											>
												{({ fieldProps }) => (
													<Fragment>
														<Select
															{...fieldProps}
															inputId="multi-select-example"
															className="multi-select"
															classNamePrefix="react-select"
															options={taskOpts}
															value={taskValues}
															onChange={
																handleChangePrecedence
															}
															isMulti
															isSearchable={true}
															placeholder="Choose precedence tasks"
															menuPosition="fixed"
														/>
													</Fragment>
												)}
											</Field>
										</div>
									</div>
								</form>
							)}
						</Form>
					) : (
						"Select a task to view..."
					)}
				</pre>
			</div>
		</div>
	);
};

export default TaskDetail;
