import { useCallback, useEffect, useState, Fragment } from "react";
import DynamicTable from "@atlaskit/dynamic-table";
import Button from "@atlaskit/button";
import InfoIcon from "@atlaskit/icon/glyph/info";
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
import { invoke } from "@forge/bridge";
import Toastify from "../../common/Toastify";
import LoadingButton from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import Form, { ErrorMessage, Field, HelperMessage } from "@atlaskit/form";
import { COLOR_SKILL_LEVEL } from "../../common/contants";
import InfoMessageColor from "../../components/InfoMessageColor";
import { Grid, GridColumn } from "@atlaskit/page";
import CreatableAdvanced from "../../components/creatable-selection";
import Rating from "react-rating";
import {
	validateEmail,
	validateNumberOnly,
	validateWorkingEffort,
	validateName,
	getCacheObject,
    formatText,
} from "../../common/utils";
import { MESSAGE_PLACEHOLDER_WORKING_EFFORTS } from "../../common/contants";

const options = [
	{ name: "workingType", value: 0, label: "Fulltime" },
	{ name: "workingType", value: 1, label: "Part-time" },
];

export function ResourceCreateWorkforceModal({ onCreatedClick, skillDB }) {
	const [isCWOpen, setIsCWOpen] = useState(false);
	const closeCWModal = useCallback(() => setIsCWOpen(false), []);
	const [isParttimeSelected, setIsParttimeSelected] = useState(false);
	const [skillsTable, setSkillsTable] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);

	const [workforcesJiraAccount, setWorkforcesJiraAccount] = useState([]);

	useEffect(
		function () {
			if (workforcesJiraAccount.length < 1) {
				invoke("getAllUserJira")
					.then(function (jiraUsersResponse) {
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
					})
					.catch(function (error) {
						console.log(error);
						Toastify.error(error.toString());
					});
			}
            invoke("getAllSkills", {})
			.then(function (res) {
				skillDB = res;
			})
			.catch(function (error) {
				console.log(error);
				Toastify.error(error.toString());
			});
		},
		[skillDB]
	);

	const handleCreateClicked = () => {
		onCreatedClick();
	};

	const onSelectedValue = (childValue) => {
		setSkillsTable(childValue.selectedValue);
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
				appearance="primary"
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
									displayName: formatText(data.name),
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
										0, 0, 0, 0, 0, 0, 0,
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
																		<OutScopeMessage/>
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
																		<OutScopeMessage/>
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
																		<OutScopeMessage/>
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
                                                                        <OutScopeMessage/>
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
																		<OutScopeMessage/>
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
																		<OutScopeMessage/>
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
																		<OutScopeMessage/>
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
																		level: skill.level,
																	})
																)}
																onSelectedValue={
																	onSelectedValue
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
