import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import { DatePicker } from "@atlaskit/datetime-picker";
import Form, { Field, FormSection, HelperMessage } from "@atlaskit/form";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import { Grid, GridColumn } from "@atlaskit/page";
import Spinner from "@atlaskit/spinner";
import TextField from "@atlaskit/textfield";
import { invoke } from "@forge/bridge";
import React, { Fragment, useEffect, useState } from "react";
import Toastify from "../../../common/Toastify";
import {
	DATE_FORMAT,
	DEFAULT_WORKING_TIMERANGE,
	MODAL_WIDTH,
} from "../../../common/contants";
import { extractErrorMessage } from "../../../common/utils";
import WorkingTimeHours from "../form/WorkingTimeHours";
const width = MODAL_WIDTH.M;
const columns = 10;

function EditProjectModal({ openState, setOpenState, setProjectsListState }) {
	const [project, setProject] = useState(openState.project);
	const [projectName, setProjectName] = useState(project.name);
	const [startDate, setStartDate] = useState(project.startDate);
	const [endDate, setEndDate] = useState(project.deadline);
	const [budget, setBudget] = useState(0);
	const [unit, setUnit] = useState("");
	const [baseWorkingHour, setBaseWorkingHour] = useState(
		project.baseWorkingHour || 0
	);
	const timeRangeValueState = useState(DEFAULT_WORKING_TIMERANGE);
	const [timeRangeValues, setTimeRangeValue] = timeRangeValueState;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const closeModal = function () {
		setOpenState({ project: {}, isOpen: false });
	};

	useEffect(function () {
		invoke("getProjectDetail", { projectId: project.id })
			.then(function (res) {
				let projectRes = res;
				setProjectName(projectRes.name);
				setStartDate(projectRes.startDate);
				setEndDate(projectRes.deadline);
				setBudget(projectRes.budget);
				setUnit(projectRes.budgetUnit);
				// setBaseWorkingHour(projectRes.baseWorkingHour);
				projectRes.workingTimes && setTimeRangeValue(projectRes.workingTimes);
				setProject(projectRes);
				setIsLoaded(true);
			})
			.catch(function (error) {
				let errorObj = extractErrorMessage(error);
				Toastify.error(errorObj.message || errorObj);
			});
	}, []);

	const handleSetProjectName = function (e) {
		setProjectName(e.target.value);
	};

	const handleSetStartDate = function (value) {
		setStartDate(value);
		if (value > endDate) {
			setEndDate(value);
		}
	};

	const handleSetEndDate = function (value) {
		setEndDate(value);
	};

	const handleSetBudget = function (e) {
		setBudget(e.target.value);
	};

	const handleSetUnit = function (e) {
		setUnit(e.target.value);
	};

	const handleSetBaseWorkHour = function (e) {
		let workHour = Number(e.target.value);
		if (0 <= workHour && workHour <= 24) setBaseWorkingHour(workHour);
	};

	function handleSubmitCreate() {
		setIsSubmitting(true);
		let projectObjRequest = {
			id: project.id,
			name: projectName,
			startDate,
			deadline: endDate,
			budget,
			budgetUnit: unit,
			baseWorkingHour,
			workingTimes: timeRangeValues,
		};

		invoke("editProject", { projectObjRequest })
			.then(function (res) {
				closeModal();
				openState.project.name = res.name;
				openState.project.startDate = res.startDate;
				setProjectsListState((prev) => [...prev]);
				Toastify.success("Saved");
			})
			.catch(function (error) {
				let errorObj = extractErrorMessage(error);
				Toastify.error(errorObj.message || errorObj);
			});
	}

	return (
		<ModalTransition>
			<Modal onClose={closeModal} width={width}>
				<Form
					onSubmit={(formState) => console.log("form submitted", formState)}
				>
					{({ formProps }) => (
						<form id="form-with-id" {...formProps}>
							<ModalHeader>
								<ModalTitle>
									<div
										style={{
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{project.name}
									</div>
								</ModalTitle>
								{!isLoaded && <Spinner size={"medium"}></Spinner>}
							</ModalHeader>
							<ModalBody>
								<Grid layout="fluid" spacing="compact" columns={columns}>
									<GridColumn medium={7}>
										<FormSection>
											<Field
												aria-required={true}
												name="projectName"
												label="Project Name"
												isRequired
											>
												{() => (
													<Fragment>
														<TextField
															autoComplete="off"
															value={projectName}
															onChange={handleSetProjectName}
															isDisabled={!isLoaded}
															isRequired
														/>
														<HelperMessage>
															Project name must start with uppercase letter.
														</HelperMessage>
													</Fragment>
												)}
											</Field>
										</FormSection>
										<FormSection>
											<Field name="startDate" label="Start Date">
												{() => (
													<Fragment>
														<DatePicker
															value={startDate}
															onChange={handleSetStartDate}
															dateFormat={DATE_FORMAT.DMY}
															isDisabled={!isLoaded}
														/>
													</Fragment>
												)}
											</Field>
											<Field name="endDate" label="End Date">
												{() => (
													<Fragment>
														<DatePicker
															minDate={startDate}
															value={endDate}
															onChange={handleSetEndDate}
															dateFormat={DATE_FORMAT.DMY}
															isDisabled={!isLoaded}
														/>
													</Fragment>
												)}
											</Field>
										</FormSection>

										<FormSection>
											<Grid spacing="compact" columns={columns}>
												<GridColumn medium={8}>
													<Field
														aria-required={true}
														name="budget"
														label="Budget"
													>
														{(fieldProps) => (
															<TextField
																autoComplete="off"
																value={budget}
																onChange={handleSetBudget}
																type="number"
																isDisabled={!isLoaded}
																{...fieldProps}
															/>
														)}
													</Field>
												</GridColumn>
												<GridColumn medium={2}>
													<Field
														aria-required={true}
														name="budgetUnit"
														label="Unit"
													>
														{(fieldProps) => (
															<TextField
																autoComplete="off"
																value={unit}
																onChange={handleSetUnit}
																isDisabled={!isLoaded}
																{...fieldProps}
															/>
														)}
													</Field>
												</GridColumn>
											</Grid>
										</FormSection>
										<FormSection>
											<WorkingTimeHours
												timeRangeValueState={timeRangeValueState}
												isDisable={!isLoaded}
												label="Working Time Slots"
												onSetBaseWorkingHours={setBaseWorkingHour}
											/>
											<hr style={{ marginTop: "1.5em" }} />
											<p>
												Total Working: <b>{baseWorkingHour}</b> Hours/Day
											</p>
										</FormSection>
									</GridColumn>
								</Grid>
							</ModalBody>

							<ModalFooter>
								<ButtonGroup>
									<Button appearance="default" onClick={closeModal}>
										Cancel
									</Button>
									<LoadingButton
										type="submit"
										appearance="primary"
										onClick={handleSubmitCreate}
										isDisabled={!isLoaded}
										isLoading={isSubmitting}
									>
										Save
									</LoadingButton>
								</ButtonGroup>
							</ModalFooter>
						</form>
					)}
				</Form>
			</Modal>
		</ModalTransition>
	);
}

export default EditProjectModal;
