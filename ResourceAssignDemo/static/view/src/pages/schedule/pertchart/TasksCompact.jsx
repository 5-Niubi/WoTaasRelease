import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "@atlaskit/page-header";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";
import DynamicTable from "@atlaskit/dynamic-table";
import { findObj } from "../../../common/utils";
import CreateTaskModal from "./modal/CreateTaskModal";
import { useParams } from "react-router";
import Tooltip from "@atlaskit/tooltip";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import EmptyState from "@atlaskit/empty-state";

/**
 * List of tasks with only name; use for select task to appeared in the pertchart
 */
const TasksCompact = ({
	tasks,
	loadingTasks,
	tasksError,
	milestones,
	skills,
	selectedIds,
	currentTaskId,
	setSelectedIds,
	updateCurrentTaskId,
	updateTasks,
	updateSkills,
	updateMilestones,
}) => {
	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	let { projectId } = useParams();

	const handleChangeCheckbox = (e) => {
		// console.log(e.currentTarget);
		// console.log(e.currentTarget.checked);
		// console.log(e.currentTarget.value);
		updateCurrentTaskId(e.currentTarget.value);
		var inputs = document
			.getElementById("tasks")
			.getElementsByTagName("input");
		var selected = [];
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].checked) {
				let taskId = inputs[i].value;
				selected.push(taskId);
				// updateCurrentTaskId(taskId);
			}
		}
		// updateGlobalSelectedTasks(selected);
		setSelectedIds(selected);
	};

	const handleSelectTask = (e) => {
		// console.log(e.currentTarget.dataset.id);
		updateCurrentTaskId(e.currentTarget.dataset.id);
	};

	var selectedTasks = [];
	selectedIds.forEach((id) => {
		var task = findObj(tasks, id);
		if (task) selectedTasks.push(task);
	});
	const rows = tasks.map((item, index) => {
		// let checked = false;
		// for (let i = 0; i < selectedIds.length; i++) {
		// 	if (selectedIds[i] == item.id) {
		// 		checked = true;
		// 		break;
		// 	}
		// }

		let errClass = "";
		let errIcon = "";
		for (let i = 0; i < tasksError.length; i++) {
			if (tasksError[i].taskId == item.id) {
				errClass = "red thick";
				errIcon = (
					<Tooltip content={tasksError[i].messages}>
						{(tooltipProps) => (
							<ErrorIcon {...tooltipProps}></ErrorIcon>
						)}
					</Tooltip>
				);
				break;
			}
		}
		return {
			key: `row-${index}-${item.id}`,
			isHighlighted: false,
			cells: [
				{
					key: item.id,
					content: (
						// <Checkbox
						// 	size="large"
						// 	value={item.id}
						// 	isChecked={checked}
						// 	onChange={handleChangeCheckbox}
						// 	label={item.name}
						// ></Checkbox>
						<div
							className={"" + errClass}
							style={{ padding: "5px", cursor: "pointer" }}
							data-id={item.id}
							onClick={handleSelectTask}
						>
							{item.id == currentTaskId ? (
								<b>
									{index + 1}. {item.name}
								</b>
							) : (
								`${index + 1}. ${item.name}`
							)}
							{errIcon}
						</div>
					),
				},
			],
		};
	});

	const actionsContent = (
		<ButtonGroup>
			<Button onClick={() => setIsModalCreateOpen(true)}>
				Create task
			</Button>
		</ButtonGroup>
	);

	return (
		<div id="tasks">
			<PageHeader actions={actionsContent}>Tasks list:</PageHeader>
			{tasksError && tasksError.length > 0 ? (
				<div className="red">
					There are some incomplete tasks need your attention!
				</div>
			) : (
				""
			)}
			<div
				class="inner"
				style={{
					width: "100%",
					height: "80vh",
					overflowY: "auto",
					scrollbarWidth: "thin",
				}}
			>
				<DynamicTable
					rows={rows}
					loadingSpinnerSize="large"
					isFixedSize
					isLoading={loadingTasks}
					emptyView={
						<EmptyState
							header="Empty"
							description="Look like there is no task."
							primaryAction={
								<Button
									appearance="primary"
									onClick={() => setIsModalCreateOpen(true)}
								>
									Create new task
								</Button>
							}
						/>
					}
				/>
			</div>

			{isModalCreateOpen ? (
				<CreateTaskModal
					isOpen={isModalCreateOpen}
					setIsOpen={setIsModalCreateOpen}
					projectId={projectId}
					milestones={milestones}
					tasks={tasks}
					skills={skills}
					updateTasks={updateTasks}
					updateCurrentTaskId={updateCurrentTaskId}
					updateSkills={updateSkills}
					updateMilestones={updateMilestones}
				/>
			) : (
				""
			)}
		</div>
	);
};

export default TasksCompact;
