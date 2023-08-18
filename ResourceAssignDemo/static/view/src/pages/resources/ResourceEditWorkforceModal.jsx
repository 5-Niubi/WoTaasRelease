import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useParams } from "react-router";
import Button, { ButtonGroup } from "@atlaskit/button";
import { invoke } from "@forge/bridge";
import Toastify from "../../common/Toastify";
import InfoIcon from "@atlaskit/icon/glyph/info";
import Select from "@atlaskit/select";
import { Grid, GridColumn } from "@atlaskit/page";
import { PiStarFill, PiStarBold } from "react-icons/pi";
import Form, { ErrorMessage, Field, HelperMessage } from "@atlaskit/form";
import Spinner from "@atlaskit/spinner";
import DynamicTable from "@atlaskit/dynamic-table";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import LoadingButton from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import Rating from "react-rating";
import CreatableAdvanced from "../../components/creatable-selection";
import { COLOR_SKILL_LEVEL } from "../../common/contants";
import {
	validateEmail,
	validateNumberOnly,
	validateWorkingEffort,
	validateName,
	cache,
	getCacheObject,
	findObj,
} from "../../common/utils";
import { MESSAGE_PLACEHOLDER_WORKING_EFFORTS } from "../../common/contants";

function ResourceEditWorkforceModal({
	openState,
	setOpenState,
    onEditedClick,
    skillDB
}) {
	const workforce = openState.workforce;
	console.log("ResourceEditWorkforceModal", workforce);
	const [selectedWorkforce, setSelectedWorkforce] = useState(workforce);
	const [isParttimeSelected, setIsParttimeSelected] = useState(
		workforce.workingType === 1 ? true : false
	);
	const [skillsTable, setSkillsTable] = useState([]);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [loadingDetail, setLoadingDetail] = useState(false);

	const closeModal = useCallback(
		function () {
			setOpenState({ workforce: workforce, isOpen: false });
		},
		[setOpenState]
	);

    const onSelectedValue = (childValue) => {
		setSkillsTable(childValue.selectedValue);
	};

    useEffect(
        function () {
            setLoadingDetail(true);
            
            setSkillsTable(
                workforce.skills?.map((skill) => ({
                    id: skill.id,
                    label: skill.name,
                    level: skill.level,
                }))
            );
    
            setLoadingDetail(false);
        },
        [openState]
    );

    const handleEditedClicked = () => {
		onEditedClick();
	};

	const handleUpdate = useCallback((workforce_request) => {
		setLoadingSubmit(true);
		invoke("updateWorkforce", { workforce_request })
			.then(function (res) {
				if (res) {
                    handleEditedClicked();
					let workforce_name_display = res.displayName;
					Toastify.success(
						"Workforce '" + workforce_name_display + "' is saved"
					);
					closeModal();
					setLoadingSubmit(false);
				}
			})
			.catch(function (error) {
				console.log(error);
				Toastify.error(error.toString());
				setLoadingSubmit(false);
			});
	}, []);


	const options = [
		{ label: "Fulltime", value: 0 },
		{ label: "Part-time", value: 1 },
	];



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
		? skillsTable?.map((skill) => ({
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

	const OutScopeMessage = () => (
		<ErrorMessage>Value raging from 0 to 24</ErrorMessage>
	);

	return (
		<div>
			<ModalTransition>
				<Modal
					onClose={closeModal}
					shouldScrollInViewport={true}
					width={"large"}
				>
					<ModalHeader>
						<ModalTitle>
							Edit employee
						</ModalTitle>
						{loadingDetail ? (
							<Spinner size={"medium"}></Spinner>
						) : (
							""
						)}
					</ModalHeader>
					<Form
						onSubmit={(data) => {
							setLoadingSubmit(true);
							let workforce_request = {
								id: selectedWorkforce.id,
								accountId: selectedWorkforce.accountId,
								email: data.email,
								accountType: selectedWorkforce.accountType,
								name: null,
								avatar: selectedWorkforce.avatar,
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
										  ]?.map((value) => parseFloat(value))
										: null,
								Skills: skillsTable
									.filter((s) => s.id != null)
									?.map((skill) => ({
										skillId: skill.id,
										level: parseInt(
											skill.level === null
												? 1
												: skill.level
										),
									})),
								newSkills: skillsTable
									.filter((s) => s.id == null)
									?.map((skill) => ({
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
							handleUpdate(workforce_request);
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
										{/* EMAIL TEXTFIELD */}
										<GridColumn medium={12}>
											<Field
												name="email"
												label="Email"
												isRequired
												defaultValue={
													selectedWorkforce.email
												}
												validate={(v) =>
													validateEmail(v)
												}
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
													<Fragment>
														<TextField
															autoComplete="off"
															{...fieldProps}
															placeholder="Email only."
														/>
														{error ===
															"NOT_VALID" && (
															<ErrorMessage>
																Invalid email,
																needs contains @
																symbol.
															</ErrorMessage>
														)}
														{error === "IN_USE" && (
															<ErrorMessage>
																Username already
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
												defaultValue={
													selectedWorkforce.displayName
												}
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
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
																This username is
																already in use,
																try another one.
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
												defaultValue={
													selectedWorkforce.name
												}
												validate={(v) =>
													validateName(v)
												}
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
													<Fragment>
														<TextField
															autoComplete="off"
															{...fieldProps}
															placeholder="Example: John Smith"
														/>
														{error ===
															"NOT_VALID" && (
															<ErrorMessage>
																The name field
																should only
																contain letters
																and must have a
																minimum length
																of 6 characters.
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
												defaultValue={
													selectedWorkforce.unitSalary
												}
												validate={(value) =>
													validateNumberOnly(value)
												}
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
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
                                                defaultValue={selectedWorkforce?.workingType}
												isDisabled={loadingDetail}
											>
												{({ fieldProps, error }) => (
													<Fragment>
														<Select
															{...fieldProps}
															options={options}
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[0]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[1]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[2]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[3]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[4]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
																	<ErrorMessage>
																		Value
																		raging
																		from 0.0
																		to 8.0
																	</ErrorMessage>
																)}
															</Fragment>
														)}
													</Field>
													{/* SATURDAY */}
													<Field
														name="sat"
														label="Saturday"
														isRequired
														defaultValue={
															selectedWorkforce
																.workingEfforts[5]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
														defaultValue={
															selectedWorkforce
																.workingEfforts[6]
														}
														validate={(value) =>
															validateWorkingEffort(
																value
															)
														}
														isDisabled={
															loadingDetail
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
										{!loadingDetail && (
											<>
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
																			selectedValue={selectedWorkforce.skills?.map(
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
																			Change
																			skill's
																			level
																			in
																			table,
																			can
																			not
																			store
																			non-word
																			characters
																		</HelperMessage>
																	</Fragment>
																)}
															</Field>
												</GridColumn>
												{/* SKILL DISPLAYING WITH LEVEL TABLE */}
												<GridColumn medium={12}>
													{skillsTable?.length >
														0 && (
														<DynamicTable
															head={
																headSkillTable
															}
															rows={
																rowsSkillTable
															}
														/>
													)}
												</GridColumn>
											</>
										)}
									</Grid>
								</ModalBody>
								<ModalFooter>
									<Button
										appearance="subtle"
										onClick={closeModal}
										autoFocus
									>
										Cancel
									</Button>
									{loadingSubmit ? (
										<LoadingButton
											appearance="primary"
											isLoading
										>
											Saving...
										</LoadingButton>
									) : (
										<LoadingButton
											type="submit"
											appearance="primary"
											autoFocus
										>
											Save
										</LoadingButton>
									)}
								</ModalFooter>
							</form>
						)}
					</Form>
				</Modal>
			</ModalTransition>
		</div>
	);
}

export default ResourceEditWorkforceModal;
