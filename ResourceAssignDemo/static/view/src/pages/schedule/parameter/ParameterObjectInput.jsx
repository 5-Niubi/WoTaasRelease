import React, {
	Fragment,
	useState,
	useCallback,
	useEffect,
	useContext,
} from "react";
import Button from "@atlaskit/button/standard-button";
import Form, {
	Field,
	FormFooter,
	HelperMessage,
	ErrorMessage,
	RangeField,
	ValidMessage,
	FormSection,
	FormHeader,
} from "@atlaskit/form";
import Range from "@atlaskit/range";
import { Grid, GridColumn } from "@atlaskit/page";
import { useParams } from "react-router";
import Textfield from "@atlaskit/textfield";
import Lozenge from "@atlaskit/lozenge";
import { css, jsx } from "@emotion/react";
import RecentIcon from "@atlaskit/icon/glyph/recent";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import ProgressBar from "@atlaskit/progress-bar";
import { invoke } from "@forge/bridge";
import __noop from "@atlaskit/ds-lib/noop";
import Toastify from "../../../common/Toastify";
import { ButtonGroup, LoadingButton } from "@atlaskit/button";
import {
	COLOR_SKILL_LEVEL,
	DATE_FORMAT,
	MODAL_WIDTH,
	THREAD_ACTION,
} from "../../../common/contants";
import { DatePicker } from "@atlaskit/datetime-picker";
import {
	getCurrentTime,
	calculateDuration,
	getCacheObject,
	saveThreadInfo,
	validateEnddate,
	extractErrorMessage,
	cache,
	clearCache,
} from "../../../common/utils";
import Spinner from "@atlaskit/spinner";
import { RadioGroup } from "@atlaskit/radio";
import Page from "@atlaskit/page";
import PageHeader from "@atlaskit/page-header";
import { ThreadLoadingContext } from "../../../components/main/MainPage";
import { AppContext } from "../../../App";
import { PiStarFill } from "react-icons/pi";
import { validateNumberOnly } from "../../../common/utils";
import InstructionMessage from "../../../components/InstructionMessage";
import { color } from "highcharts";

const objectiveItems = [
	{ name: "time", value: "time", label: "Execution time" },
	{ name: "cost", value: "cost", label: "Total cost" },
	{
		name: "experience",
		value: "quality",
		label: "Total employees' experiences",
	},
	{ name: "none", value: "", label: "Neutral" },
];

const optimizerItems = [
	{
		name: "Mathematical Optimizer",
		value: "1",
		label: "Mathematical Optimizer",
	},
    {
		name: "General Optimizer (Genetic Algorithm)",
		value: "0",
		label: "General Optimizer (Genetic Algorithm)",
	},
];

const strongTextStyle = {
	color: "red",
};

export default function ParameterObjectInput({ handleChangeTab }) {
	let project_detail = getCacheObject("project", []);
	const { projectId } = useParams();
	const [startDate, setStartDate] = useState(project_detail.startDate);
	const [endDate, setEndDate] = useState(project_detail.deadline);
	const [budget, setBudget] = useState(project_detail.budget);
	const [budgetUnit, setBudgetUnit] = useState(project_detail.budgetUnit);
    const [selectedOptimizer, setSelectedOptimizer] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isScheduling, setIsScheduling] = useState(false);
	const { setAppContextState } = useContext(AppContext);
	const [messageScheduleLimited, setMessageScheduleLimited] =
		useState(Object);
	const [canClickSchedule, setCanClickSchedule] = useState(false);
	const [numberOfScheduleCanClick, setNumberOfScheduleCanClick] = useState(0);

	const handleSetStartDate = useCallback(function (value) {
		let a = new Date(value);
		let b = new Date(endDate);
		if (a > b) {
			setEndDate(value);
		}
		setStartDate(value);
	}, []);

	const handleSetEndDate = useCallback(function (value) {
		setEndDate(value);
	}, []);

	useEffect(
		function () {
			invoke("getExecuteAlgorithmDailyLimited")
				.then(function (res) {
					console.log("getExecuteAlgorithmDailyLimited", res);
					setMessageScheduleLimited(res);
					handleExecuteAlgorithmDailyLimited(res);
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
		},
		[isScheduling]
	);

	function handleExecuteAlgorithmDailyLimited(res) {
		let numberExecuted = res?.usageExecuteAlgorithm;
		//CHECK PLAN ID
		if (res?.planId === 1) {
			let numberScheduleToday = 3 - numberExecuted;
			if (numberScheduleToday > 0) {
				setCanClickSchedule(true);
				setNumberOfScheduleCanClick(numberScheduleToday);
			}
		}

		if (res?.planId === 2) {
			setCanClickSchedule(true);
		}
	}

	const threadLoadingContext = useContext(ThreadLoadingContext);
	const [threadStateValue, setThreadStateValue] = threadLoadingContext.state;

	const handleCreateThreadSuccess = useCallback((threadId) => {
		let threadAction = THREAD_ACTION.RUNNING_SCHEDULE;
		let threadInfo = {
			threadId,
			threadAction,
			callBack: loadScheduleSuccess,
		};
		setThreadStateValue(threadInfo);
		saveThreadInfo(threadInfo);
	}, []);

	const handleCreateThreadFail = (messageBody) => {
		setAppContextState((prev) => ({
			...prev,
			error: messageBody,
		}));
	};

	function SaveParameters({ cost, objectives, optimizer }) {
		setIsScheduling(true);
		var parameterResourcesLocal = getCacheObject("workforce_parameter", []);
		let parameterResources = [];
		for (let item of parameterResourcesLocal) {
			let itemParameterResource = {
				ResourceId: item.id,
				Type: "workforce",
			};
			parameterResources.push(itemParameterResource);
		}
		var data = {
			ProjectId: Number(projectId),
			Duration: calculateDuration({ startDate, endDate }),
			ObjectiveTime: objectives === "time" ? 1 : null,
			ObjectiveCost: objectives === "cost" ? 1 : null,
			ObjectiveQuality: objectives === "quality" ? 1 : null,
			Optimizer: (optimizer === "0")? 0 : 1,
			StartDate: startDate,
			DeadLine: endDate,
			Budget: Number(cost),
			ParameterResources: parameterResources,
		};
		console.log("Send parameter data: ", data);

		async function saveAndSchedule() {
			try {
				let saveRes = await invoke("saveParameters", {
					parameter: data,
				});
				console.log("saveParameters response: ", saveRes);
				localStorage.setItem("parameterId", saveRes.id);
				let getThreadScheduleRes;
				try {
					getThreadScheduleRes = await invoke("getThreadSchedule", {
						parameterId: saveRes.id,
					});
				} catch (error) {
					setIsScheduling(false);
					let messageError = extractErrorMessage(error);
					handleCreateThreadFail(<p>{messageError.message}</p>);
				}
				if (getThreadScheduleRes) {
					handleCreateThreadSuccess(getThreadScheduleRes.threadId);
					setIsScheduling(false);
				}
			} catch (error) {
				setIsScheduling(false);
				let messageError = extractErrorMessage(error);
				let messageDisplay = messageError;
				debugger;
				if (Array.isArray(messageError)) {
					messageDisplay = (
						<ul>
							{messageError?.map((skillSet) => (
								<li key={skillSet.taskId}>
									Task ID {skillSet.taskId} needs workers with
									skill sets{" "}
									{skillSet.skillRequireds?.map(
										(skill, i) => (
											<span
												style={{
													marginRight: "2px",
													marginLeft: "8px",
												}}
												key={i}
											>
												<Lozenge
													style={{
														backgroundColor:
															COLOR_SKILL_LEVEL[
																skill.level - 1
															].color,
														color:
															skill.level === 1
																? "#091e42"
																: "white",
													}}
													isBold
												>
													{skill.name} - {skill.level}
													<PiStarFill />
												</Lozenge>
											</span>
										)
									)}
								</li>
							))}
						</ul>
					);

					//STORE MESSAGE MISSING WORKFORCE
					cache(
						"message_missing_workforce",
						JSON.stringify(messageError)
					);
					handleCreateThreadFail(messageDisplay);
					return;
				}
				Toastify.error(messageDisplay);
			}
		}
		saveAndSchedule();
	}

	function loadScheduleSuccess() {
		handleChangeTab(3);
		Toastify.success("Schedule successfully.");
		clearCache("message_missing_workforce");
	}

	const actionsContent = (
		<>
			<ButtonGroup>
				<LoadingButton onClick={() => handleChangeTab(1)}>
					Back
				</LoadingButton>
				<LoadingButton
					type="submit"
					appearance="primary"
					isLoading={isScheduling}
					submitting
					isDisabled={!canClickSchedule}
				>
					Schedule
				</LoadingButton>
			</ButtonGroup>
			{messageScheduleLimited?.planId === 1 && (
				<HelperMessage>
					Number of schedule today: {numberOfScheduleCanClick}
				</HelperMessage>
			)}
		</>
	);

	return (
		<div style={{ width: "100%" }}>
			{isLoading ? <Spinner size={"large"} /> : null}
			<Form
				onSubmit={({ cost, objectives, optimizer }) => {
					console.log("Form Submitted: ", objectives);
					SaveParameters({ cost, objectives, optimizer });
					return new Promise((resolve) =>
						setTimeout(resolve, 2000)
					).then(() =>
						data.username === "error"
							? {
									username: "IN_USE",
							  }
							: undefined
					);
				}}
			>
				{({ formProps, submitting }) => (
					<form {...formProps}>
						<PageHeader
							actions={actionsContent}
							disableTitleStyles={true}
						>
							<div style={{ display: "inline-flex" }}>
								<h2>Parameters</h2>
								<div style={{ marginLeft: 5 }}>
									<InstructionMessage
										content={
											<ul>
												<li>
													<strong
														style={strongTextStyle}
													>
														Expected Cost
													</strong>
													: The estimated total cost
													required for personnel
													payment
												</li>
												<li>
													<strong
														style={strongTextStyle}
													>
														Expected Start Date
													</strong>
													: The desired project start
													date
												</li>
												<li>
													<strong
														style={strongTextStyle}
													>
														Expected End Date
													</strong>
													: The desired project
													completion date
												</li>
												<li>
													<strong
														style={strongTextStyle}
													>
														Project Objective
													</strong>
													: The goals that the project
													aims to achieve including:
													<ul>
														<li>
															<strong>
																Execution Time
															</strong>
															: Prioritize
															minimizing the time
															to complete the
															project
														</li>
														<li>
															<strong>
																Total Cost
															</strong>
															: Prioritize
															minimizing the costs
															required for
															personnel payment
														</li>
														<li>
															<strong>
																Total Employees'
																Experiences
															</strong>
															: Prioritize
															maximizing the
															quality of personnel
															throughout the
															project
														</li>
														<li>
															<strong>
																Neutral
															</strong>
															: Maintain a
															balanced approach
															among the above
															objectives
														</li>
													</ul>
												</li>
											</ul>
										}
									/>
								</div>
							</div>
						</PageHeader>

						<FormSection>
							<Grid layout="fluid" medium={0}>
								{/* EXPECTED COST TEXTFIELD */}
								<GridColumn medium={0}>
									<Field
										label="Expected Cost"
										name="cost"
										defaultValue={budget ?? 0}
									>
										{({ fieldProps, error }) => (
											<Fragment>
												<Textfield
													{...fieldProps}
													type="number"
													placeholder="What expected maximize project's cost?"
													elemBeforeInput={
														<p
															style={{
																marginLeft: 10,
																fontWeight:
																	"bold",
															}}
														>
															{budgetUnit}
														</p>
													}
												/>
											</Fragment>
										)}
									</Field>
								</GridColumn>
								{/* START DATE DATETIMEPICKER */}
								<GridColumn medium={0}>
									<Field
										name="startDate"
										label="Start Date"
										isRequired
									>
										{({ fieldProps }) => (
											<Fragment>
												<DatePicker
													{...fieldProps}
													value={startDate}
													onChange={
														handleSetStartDate
													}
													dateFormat={DATE_FORMAT.DMY}
													isRequired
												/>
											</Fragment>
										)}
									</Field>
								</GridColumn>
								{/* END DATE DATETIMEPICKER */}
								<GridColumn medium={0}>
									<Field
										name="endDate"
										label="End Date"
										isRequired
									>
										{({ fieldProps, error }) => (
											<Fragment>
												<DatePicker
													{...fieldProps}
													minDate={startDate}
													value={endDate ?? startDate}
													onChange={handleSetEndDate}
													dateFormat={DATE_FORMAT.DMY}
													isRequired
												/>
											</Fragment>
										)}
									</Field>
								</GridColumn>
							</Grid>
							<Grid layout="fluid" medium={0}>
								{/* SELECT OBJECT RADIO */}
								<GridColumn medium={4.5}>
									<Field
										label="Project Objectives"
										name="objectives"
										defaultValue=""
										isRequired
									>
										{({ fieldProps }) => (
											<RadioGroup
												{...fieldProps}
												options={objectiveItems}
											/>
										)}
									</Field>
								</GridColumn>
								<GridColumn medium={6.5}>
									<Field
										label="Optimizer"
										name="optimizer"
										isRequired
                                        defaultValue={"0"}
									>
										{({ fieldProps }) => (
											<RadioGroup
                                            {...fieldProps}
                                            options={optimizerItems}
                                        />
										)}
									</Field>
								</GridColumn>
							</Grid>
						</FormSection>
					</form>
				)}
			</Form>
		</div>
	);
}
