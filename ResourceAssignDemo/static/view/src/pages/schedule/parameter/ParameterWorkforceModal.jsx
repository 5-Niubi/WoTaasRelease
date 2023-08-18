import { useCallback, useEffect, useState, Fragment } from "react";
import { css, jsx } from "@emotion/react";
import DynamicTable from "@atlaskit/dynamic-table";
import Button, { ButtonGroup } from "@atlaskit/button";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { useParams } from "react-router";
import { PiStarFill, PiStarBold } from "react-icons/pi";
import Avatar from "@atlaskit/avatar";
import Select from "@atlaskit/select";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import Spinner from "@atlaskit/spinner";
import { invoke } from "@forge/bridge";
import Toastify from "../../../common/Toastify";
import { RadioGroup } from "@atlaskit/radio";
import LoadingButton from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";
import Lozenge from "@atlaskit/lozenge";
import TextField from "@atlaskit/textfield";
import Form, {
	CheckboxField,
	ErrorMessage,
	Field,
	FormFooter,
	FormHeader,
	HelperMessage,
	RequiredAsterisk,
	ValidMessage,
} from "@atlaskit/form";
import AddCircle from "@atlaskit/icon/glyph/add-circle";
import { COLOR_SKILL_LEVEL } from "../../../common/contants";
import InfoMessageColor from "../../../components/InfoMessageColor";
import { Grid, GridColumn } from "@atlaskit/page";
import CreatableAdvanced from "../../../components/creatable-selection";
import Rating from "react-rating";
import {
	validateEmail,
	validateNumberOnly,
	validateWorkingEffort,
	validateName,
	getCacheObject,
	cache,
	getCache,
} from "../../../common/utils";
import InlineMessage from "@atlaskit/inline-message";
import Flag from "@atlaskit/flag";
import Tooltip from "@atlaskit/tooltip";
import InstructionMessage from "../../../components/InstructionMessage";
const options = [
	{ name: "workingType", value: 0, label: "Fulltime" },
	{ name: "workingType", value: 1, label: "Part-time" },
];
import { MESSAGE_PLACEHOLDER_WORKING_EFFORTS } from "../../../common/contants";

export function ParameterSelectWorkforceModal({ onSelectedWorkforces }) {
	//SELECT WORKFORCE MODAL (SW)

	let workforce_local = getCacheObject("workforce_parameter", []);
	const [isSWOpen, setIsSWOpen] = useState(false);
	const openSWModal = useCallback(() => setIsSWOpen(true), []);
	const closeSWModal = useCallback(() => setIsSWOpen(false), []);
	const [TableLoadingState, setTableLoadingState] = useState(true);
	const [searchInput, setSearchInput] = useState("");
	const [workforces, setWorkforces] = useState([]);
	const [selectedWorkforces, setSelectedWorkforces] = useState([]);
	const [selectAll, setSelectAll] = useState(false);

	const handleCreateClicked = () => {
		setTableLoadingState(true);
	};

	const handleLoadingDBClicked = () => {
		setTableLoadingState(true);
	};

	useEffect(
		function () {
			invoke("getAllWorkforces")
				.then(function (res) {
					let workforces = [];
					for (let workforce of res) {
						let itemWorkforce = {
							id: workforce.id,
							accountId: workforce.accountId,
							email: workforce.email,
							accountType: workforce.accountType,
							name: workforce.displayName,
							avatar: workforce.avatar,
							// name: workforce.displayName,
							unitSalary: workforce.unitSalary,
							workingType: workforce.workingType,
							workingEfforts: workforce.workingEfforts,
							skills: workforce.skills,
						};
						workforces.push(itemWorkforce);
					}
					setTableLoadingState(false);
					setWorkforces(workforces);

					let localWorkforceIds = [];
					if (workforce_local?.length > 0) {
						localWorkforceIds = workforce_local?.map((workforce) =>
							workforce?.id?.toString()
						);
					}
					setSelectedWorkforces(localWorkforceIds);

					if (workforces?.length == localWorkforceIds?.length) {
						setSelectAll(true);
					}
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
		},
		[TableLoadingState]
	);

	//FILTER WORKFORCE SELECT TABLE
	const [workforcesFilter, setWorkforcesFilter] = useState(workforces);
	const filterWorkforceName = useCallback(function (workforces, query) {
		if (query === null || query.trim() === "") {
			setWorkforcesFilter(workforces);
		} else {
			setWorkforcesFilter(
				workforces.filter((e) => {
					const lowercaseQuery = query.toLowerCase().trim();
					const nameMatch = e.name
						.toLowerCase()
						?.includes(lowercaseQuery);
					const skillMatch = e.skills?.some((skill) =>
						skill.name
							.replace("-", " ")
							.toLowerCase()
							?.includes(lowercaseQuery)
					);
					return nameMatch || skillMatch;
				})
			);
		}
	}, []);

	useEffect(
		function () {
			filterWorkforceName(workforces, searchInput);
		},
		[workforces]
	);

	function handleOnSearchBoxChange(e) {
		const newSearchInput = e.target.value;
		setSearchInput(newSearchInput);
		filterWorkforceName(workforces, newSearchInput);
	}

	function handleCheckboxChange(workforceId) {
		setSelectedWorkforces((prevSelectedWorkforces) => {
			console.log("prevSelectedWorkforces:", prevSelectedWorkforces);

			if (prevSelectedWorkforces?.includes(workforceId.toString())) {
				return prevSelectedWorkforces.filter(
					(id) => id !== workforceId.toString()
				);
			} else {
				return [...prevSelectedWorkforces, workforceId.toString()];
			}
		});
	}

	const head = {
		cells: [
			{
				key: "no",
				content: null,
				width: 8,
			},
			{
				key: "name",
				content: "Name",
				width: 30,
			},
			{
				key: "skills",
				content: "Skills",
				width: 62,
                shouldTruncate: false,
                isSortable: true,
			},
		],
	};

	const rows = workforcesFilter?.map((workforce, index) => ({
		key: `row-${index}-${workforce.name}`,
		cells: [
			{
				key: "no",
				content: (
					<div>
						<Checkbox
							size="large"
							isChecked={selectedWorkforces?.includes(
								workforce.id.toString()
							)}
							onChange={() => handleCheckboxChange(workforce.id)}
						/>
					</div>
				),
			},
			{
				key: "name",
				content: (
					<div
						onClick={() => handleCheckboxChange(workforce.id)}
						style={{ cursor: "pointer" }}
					>
						{workforce.name}
					</div>
				),
			},
			{
				key: workforce.skills,
				content: (
					<div>
						{workforce.skills?.map((skill, i) => (
							<span style={{ marginRight: "2px" }}>
								<Lozenge
									key={i}
									style={{
										marginLeft: "8px",
										backgroundColor:
											COLOR_SKILL_LEVEL[skill.level - 1]
												.color,
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
						))}
					</div>
				),
			},
		],
		// onClick:(e) =>{
		//     handleCheckboxChange(workforce.id);
		// }
	}));

	function handleConfirm() {
		const selectedWorkforcesArray = selectedWorkforces?.map(
			(workforceId) => {
				return workforces.find(
					(workforce) => workforce.id.toString() === workforceId
				);
			}
		);
		cache("workforce_parameter", JSON.stringify(selectedWorkforcesArray));

		onSelectedWorkforces(selectedWorkforcesArray);

		closeSWModal();
	}

	function handleSelectAll() {
		if (selectAll) {
			setSelectedWorkforces([]);
		} else {
			const allWorkforceIds = workforces.map((workforce) =>
				workforce.id.toString()
			);
			setSelectedWorkforces(allWorkforceIds);
		}
		setSelectAll(!selectAll);
	}

	return (
		<div>
			<Button appearance="primary" onClick={openSWModal}>
				Select
			</Button>
			{/* SELECT WORKFORCE MODAL (SW) */}
			<ModalTransition>
				{isSWOpen && (
					<Modal
						onClose={closeSWModal}
						shouldScrollInViewport={false}
						width={"large"}
					>
						<ModalHeader>
							<div style={{ flexWrap: "wrap" }}>
								<ModalTitle>
									Select Employees <InfoMessageColor />
								</ModalTitle>
								<div
									style={{
										display: "flex",
										marginTop: "10px",
									}}
								>
									<div
										style={{
											flex: "0 0 320px",
											marginRight: "10px",
										}}
									>
										<TextField
											isCompact
											placeholder="Search Employee/Skill"
											aria-label="Filter"
											onChange={handleOnSearchBoxChange}
											value={searchInput}
										/>
									</div>
									<div
										style={{
											flex: "0 0 300px",
										}}
									>
										<ButtonGroup>
											<ParameterCreareWorkforceModal
												onCreatedClick={
													handleCreateClicked
												}
											/>
											{/* SELECT ALL BUTTON */}
											<Button
												appearance="primary"
												onClick={handleSelectAll}
											>
												{selectAll
													? "Deselect All"
													: "Select All"}
											</Button>
											<Button
												onClick={handleLoadingDBClicked}
											>
												Refresh
											</Button>
										</ButtonGroup>
									</div>
								</div>
								{getCacheObject("message_missing_workforce", [])
									?.length > 0 && (
									<div
										style={{
											marginTop: "10px",
										}}
									>
										<InlineMessage
											appearance="warning"
											secondaryText="You need add more employee"
										>
											<p>
												<ul>
													{getCacheObject(
														"message_missing_workforce",
														[]
													)?.map((skillSet) => (
														<li
															key={
																skillSet.taskId
															}
														>
															Task ID{" "}
															{skillSet.taskId}{" "}
															needs workers with
															skill sets{" "}
															{skillSet.skillRequireds?.map(
																(skill, i) => (
																	<span
																		style={{
																			marginRight:
																				"2px",
																			marginLeft:
																				"8px",
																		}}
																		key={i}
																	>
																		<Lozenge
																			style={{
																				backgroundColor:
																					COLOR_SKILL_LEVEL[
																						skill.level -
																							1
																					]
																						.color,
																				color:
																					skill.level ===
																					1
																						? "#091e42"
																						: "white",
																			}}
																			isBold
																		>
																			{
																				skill.name
																			}{" "}
																			-{" "}
																			{
																				skill.level
																			}
																			<PiStarFill />
																		</Lozenge>
																	</span>
																)
															)}
														</li>
													))}
												</ul>
											</p>
										</InlineMessage>
									</div>
								)}
							</div>
						</ModalHeader>
						<ModalBody>
							<DynamicTable
								shouldScrollInViewport
								head={head}
								rows={rows}
								isFixedSize
								isLoading={TableLoadingState}
								emptyView={<h2>Not found any employee</h2>}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								appearance="subtle"
								onClick={closeSWModal}
								autoFocus
							>
								Cancel
							</Button>
							<Button
								appearance="primary"
								onClick={handleConfirm}
								autoFocus
							>
								Confirm
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
}

export function ParameterCreareWorkforceModal({ onCreatedClick }) {
	//CREATE WORKFORCE MODAL (CW)
	let project = getCacheObject("project", null);
	const [isCWOpen, setIsCWOpen] = useState(false);
	const openCWModal = useCallback(() => setIsCWOpen(true), []);
	const closeCWModal = useCallback(() => setIsCWOpen(false), []);
	const [isParttimeSelected, setIsParttimeSelected] = useState(false);
	const [skillsTable, setSkillsTable] = useState([]);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [skillDB, setSkillDB] = useState([]);

	const [workforcesJiraAccount, setWorkforcesJiraAccount] = useState([]);

	useEffect(() => {
		setLoadingDetail(true);
		Promise.all([invoke("getAllUserJira"), invoke("getAllSkills")])
			.then(([jiraUsersResponse, resSkillDB]) => {
				const jiraUsers = jiraUsersResponse
					.filter((user) => user.accountType === "atlassian")
					.map((user) => ({
						accountId: user.accountId,
						email: user.emailAddress,
						accountType: user.accountType,
						name: user.displayName,
						avatar: user.avatarUrls["48x48"],
						displayName: user.displayName,
					}));
				setWorkforcesJiraAccount(jiraUsers);

				setSkillDB(resSkillDB);
				localStorage.setItem(
					"all_skills_DB",
					JSON.stringify(resSkillDB)
				);
				setLoadingDetail(false);
			})
			.catch(function (error) {
				console.log(error);
				Toastify.error(error.toString());
			});
	}, [loadingSubmit]);

	const handleCreateClicked = () => {
		onCreatedClick();
	};

	const onSelectedValue = (childValue) => {
		console.log("Received value from child:", childValue);

		setSkillsTable(childValue.selectedValue);
		console.log("Received value display in table:", skillsTable);
	};

	const headSkillTable = {
		cells: [
			{
				key: "skills",
				content: "Skills",
				width: 40,
			},
			{
				key: "level",
				content: "Level",
				width: 60,
			},
		],
	};

	const rowsSkillTable = skillsTable
		? skillsTable?.map((skill, index) => ({
				key: skill.name?.toString(),
				cells: [
					{
						key: skill.label?.toString(),
						content: skill.label?.toString(),
					},
					{
						key: skill.level?.toString(),
						content: (
							<>
								<Rating
									emptySymbol={<PiStarBold size={25} />}
									fullSymbol={[
										<PiStarFill
											size={25}
											fill={COLOR_SKILL_LEVEL[0].color}
											border
										/>,
										<PiStarFill
											size={25}
											fill={COLOR_SKILL_LEVEL[1].color}
											border
										/>,
										<PiStarFill
											size={25}
											fill={COLOR_SKILL_LEVEL[2].color}
											border
										/>,
										<PiStarFill
											size={25}
											fill={COLOR_SKILL_LEVEL[3].color}
											border
										/>,
										<PiStarFill
											size={25}
											fill={COLOR_SKILL_LEVEL[4].color}
											border
										/>,
									]}
									initialRating={
										skill.level === null ? 1 : skill.level
									}
									onClick={(value) => {
										skill.level =
											value === null ? 1 : value;
									}}
								></Rating>
							</>
						),
					},
				],
		  }))
		: null;

	function createNewWorkforce(workforce_request) {
		setLoadingSubmit(true);
		invoke("createWorkforce", { workforce_request })
			.then(function (res) {
				if (res != null) {
					console.log("create new workforce", res);
					let workforce_name_display = res.displayName;
					Toastify.success(
						"Workforce '" + workforce_name_display + "' is created."
					);
					setSkillsTable([]);
					setLoadingSubmit(false);
					setIsCWOpen(false);
					handleCreateClicked();
				}
			})
			.catch(function (error) {
				console.log(error);
				Toastify.error(error.toString());
				setLoadingSubmit(false);
			});
	}

	function formatOptionLabel(user) {
		return (
			<div style={{ display: "flex", alignItems: "center" }}>
				<Avatar src={user.avatar} alt={user.label} size="medium" />
				<div style={{ marginLeft: "8px" }}>{user.label}</div>
			</div>
		);
	}

	const OutScopeMessage = () => (
		<ErrorMessage>Value raging from 0 to 24</ErrorMessage>
	);

	return (
		<>
			<Button
				onClick={() => {
					setSkillsTable([]);
					setIsCWOpen(true);
				}}
			>
				Create new
			</Button>
			{/* CREATE WORKFORCE MODAL (CW) */}
			{isCWOpen && (
				<ModalTransition>
					<Modal
						onClose={closeCWModal}
						shouldScrollInViewport={true}
						width={"large"}
					>
						<ModalHeader>
							<ModalTitle>
								Create new Employee <InfoMessageColor />
							</ModalTitle>
						</ModalHeader>
						<Form
							onSubmit={(data) => {
								setLoadingSubmit(true);
								let workforce_request = {
									id: 0, //DEFAULT
									accountId:
										data.jiraAccount !== null
											? data.jiraAccount?.value
											: null, //DEFAULT
									email: data.email,
									accountType: "atlassian", //DEFAULT
									name: null,
									avatar: null, //DEFAULT
									displayName: data.name,
									unitSalary: data.salary,
									workingType:
										isParttimeSelected === true ? 1 : 0,
									workingEfforts:
										isParttimeSelected === true
											? [
													data.mon,
													data.tues,
													data.wed,
													data.thurs,
													data.fri,
													data.sat,
													data.sun,
											  ].map((value) =>
													parseFloat(value)
											  )
											: null,
									Skills: skillsTable
										.filter((s) => s.id != null)
										.map((skill) => ({
											skillId: skill.id,
											level: parseInt(
												skill.level === null
													? 1
													: skill.level
											),
										})),
									newSkills: skillsTable
										.filter((s) => s.id == null)
										.map((skill) => ({
											name: skill.value,
											level: parseInt(
												skill.level === null
													? 1
													: skill.level
											),
										})),
								};
								if (workforce_request.workingType == 0) {
									workforce_request.workingEfforts = [
										0,
										0,
										0,
										0,
										0,
										0,
										0,
									];
								}
								console.log("Form data", workforce_request);
								createNewWorkforce(workforce_request);
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
									<ModalBody>
										<Grid layout="fluid" spacing="compact">
											{/* USER ACCOUNT */}
                                            <GridColumn medium={4}>
											<Field
												name="jiraAccount"
												label="Jira Account (optional)"
												defaultValue=""
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
													<Fragment>
														<Select
															inputId="single-select-example"
															className="single-select"
															classNamePrefix="react-select"
															{...fieldProps}
															options={[
                                                                {
                                                                    label: "None",
                                                                    value: null,
                                                                    avatar: null
                                                                },
                                                                ...workforcesJiraAccount?.map(
																(user) => ({
																	label: user.displayName,
																	value: user.accountId,
																	avatar: user.avatar,
																})
															)]
                                                            }
															formatOptionLabel={
																formatOptionLabel
															}
															placeholder="Choose a Jira account"
														/>
														{loadingDetail ===
															true && <Spinner />}
														{!error && (
															<HelperMessage></HelperMessage>
														)}
														{error && (
															<ErrorMessage></ErrorMessage>
														)}
													</Fragment>
												)}
											</Field>
                                            </GridColumn>
											{/* EMAIL TEXTFIELD */}
											<GridColumn medium={8}>
												<Field
													name="email"
													label="Email"
													isRequired
													validate={(v) =>
														validateEmail(v)
													}
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<TextField
																autoComplete="off"
																{...fieldProps}
																placeholder="Email only."
															/>
															{error ===
																"NOT_VALID" && (
																<ErrorMessage>
																	Invalid
																	email, needs
																	contains @
																	symbol.
																</ErrorMessage>
															)}
															{error ===
																"IN_USE" && (
																<ErrorMessage>
																	Username
																	already
																	taken, try
																	another one
																</ErrorMessage>
															)}
														</Fragment>
													)}
												</Field>
											</GridColumn>
											{/* USERNAME JIRA TEXTFIELD */}
											{/* <GridColumn medium={6}>
												<Field
													name="usernamejira"
													label="Jira Username"
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<TextField
																autoComplete="off"
																{...fieldProps}
																placeholder="You can use letters and numbers."
															/>
															{!error && (
																<HelperMessage></HelperMessage>
															)}
															{error && (
																<ErrorMessage>
																	This
																	username is
																	already in
																	use, try
																	another one.
																</ErrorMessage>
															)}
														</Fragment>
													)}
												</Field>
											</GridColumn> */}
											{/* NAME TEXTFIELD */}
											<GridColumn medium={6}>
												<Field
													name="name"
													label="Name"
													isRequired
													validate={(v) =>
														validateName(v)
													}
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<TextField
																autoComplete="off"
																{...fieldProps}
																placeholder="Example: John Smith"
															/>
															{error ===
																"NOT_VALID" && (
																<ErrorMessage>
																	The name
																	field should
																	only contain
																	letters and
																	must have a
																	minimum
																	length of 6
																	characters.
																</ErrorMessage>
															)}
														</Fragment>
													)}
												</Field>
											</GridColumn>
											{/* SALARY TEXTFIELD */}
											<GridColumn medium={6}>
												<Field
													name="salary"
													label="Salary (Hour)"
													isRequired
													validate={(value) =>
														validateNumberOnly(
															value
														)
													}
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<TextField
																type="number"
																autoComplete="off"
																{...fieldProps}
																
																elemBeforeInput={
																	<p
																		style={{
																			marginLeft: 10,
																		}}
																	>
																		$
																	</p>
																}
															/>
															{error ===
																"NOT_VALID" && (
																<ErrorMessage>
																	Wrong input.
																</ErrorMessage>
															)}
														</Fragment>
													)}
												</Field>
											</GridColumn>
											{/* WORKING TYPE SELECT  */}
											<GridColumn medium={3}>
												<Field
													label="Working Type"
													name="workingType"
													isRequired
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<Select
																{...fieldProps}
																options={
																	options
																}
																placeholder="Choose type..."
																onChange={(
																	newValue
																) => {
																	setIsParttimeSelected(
																		newValue.value ===
																			1
																			? true
																			: false
																	);
																}}
																value={options.find(
																	(option) =>
																		option.value ===
																		(isParttimeSelected
																			? 1
																			: 0)
																)}
															/>
														</Fragment>
													)}
												</Field>
												{isParttimeSelected && (
													<HelperMessage>
														<InfoIcon
															size="small"
															content=""
														></InfoIcon>
														Working hours per day.<br/>
                                                        The hours require exactly one digit after the decimal point.
													</HelperMessage>
												)}
											</GridColumn>
											{/* WORKING EFFORT (PART-TIME) */}
											<GridColumn medium={9}>
												{isParttimeSelected && (
													<>
														{/* MONDAY*/}
														<Field
															name="mon"
															label="Monday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* TUESDAY */}
														<Field
															name="tues"
															label="Tuesday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* WEDNESDAY */}
														<Field
															name="wed"
															label="Wednesday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* THURSDAY */}
														<Field
															name="thurs"
															label="Thursday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* FRIDAY */}
														<Field
															name="fri"
															label="Friday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* SATURDAY */}
														<Field
															name="sat"
															label="Saturday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
														{/* SUNDAY */}
														<Field
															name="sun"
															label="Sunday"
															isRequired
															validate={(value) =>
																validateWorkingEffort(
																	value
																)
															}
														>
															{({
																fieldProps,
																error,
															}) => (
																<Fragment>
																	<TextField
																		type="number"
																		autoComplete="off"
																		{...fieldProps}
																		placeholder={MESSAGE_PLACEHOLDER_WORKING_EFFORTS}
                                                                        elemAfterInput={<div style={{margin: "10px"}}>Hours</div>}
																	/>
																	{error ===
																		"NOT_VALID" && (
																		<ErrorMessage>
																			Wrong
																			input.
																		</ErrorMessage>
																	)}
																	{error ===
																		"OUT_SCOPE" && (
																		<OutScopeMessage />
																	)}
																</Fragment>
															)}
														</Field>
													</>
												)}
											</GridColumn>
											{/* SKILL CREATABLE MULTIPLE SELECT */}
											<GridColumn medium={12}>
												<Field
													name="skills"
													label="Skills"
													isDisabled={loadingDetail}
												>
													{({
														fieldProps,
														error,
													}) => (
														<Fragment>
															<CreatableAdvanced
																isRequired
																defaultOptions={skillDB?.map(
																	(
																		skill
																	) => ({
																		id: skill.id,
																		value: skill.name,
																		label: skill.name,
																		level: 1,
																	})
																)}
																onSelectedValue={
																	onSelectedValue
																}
																isLoading={
																	loadingDetail
																}
															></CreatableAdvanced>
															<HelperMessage>
																<InfoIcon
																	size="small"
																	content=""
																></InfoIcon>
																Change skill's
																level in table,
																can not store
																non-word
																characters
															</HelperMessage>
														</Fragment>
													)}
												</Field>
											</GridColumn>
											{/* SKILL DISPLAYING WITH LEVEL TABLE */}
											<GridColumn medium={12}>
												{skillsTable?.length > 0 && (
													<DynamicTable
														head={headSkillTable}
														rows={rowsSkillTable}
													/>
												)}
											</GridColumn>
										</Grid>
									</ModalBody>
									<ModalFooter>
										<Button
											appearance="subtle"
											onClick={closeCWModal}
											autoFocus
										>
											Cancel
										</Button>
										{loadingSubmit ? (
											<LoadingButton
												appearance="primary"
												isLoading
											>
												Creating...
											</LoadingButton>
										) : (
											<LoadingButton
												type="submit"
												appearance="primary"
												autoFocus
											>
												Create
											</LoadingButton>
										)}
									</ModalFooter>
								</form>
							)}
						</Form>
					</Modal>
				</ModalTransition>
			)}
		</>
	);
}
