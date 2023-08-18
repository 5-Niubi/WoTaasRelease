import { token } from "@atlaskit/tokens";
import React, { useEffect, useState, useCallback, Fragment } from "react";
import DynamicTable from "@atlaskit/dynamic-table";
import { invoke } from "@forge/bridge";
import Toastify from "../../common/Toastify";
import Lozenge from "@atlaskit/lozenge";
import { COLOR_SKILL_LEVEL, ROW_PER_PAGE } from "../../common/contants";
import { css, jsx } from "@emotion/react";
import { PiStarFill } from "react-icons/pi";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import Button, { ButtonGroup } from "@atlaskit/button";
import InlineMessage from "@atlaskit/inline-message";
import __noop from "@atlaskit/ds-lib/noop";
import TextField from "@atlaskit/textfield";
import PageHeader from "@atlaskit/page-header";
import InfoMessageColor from "../../components/InfoMessageColor";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";
import ResourceDeleteWorkforceModal from "./ResourceDeleteWorkforceModal";
import { ResourceCreateWorkforceModal } from "./ResourceCreateWorkforceModal";
import ResourceEditWorkforceModal from "./ResourceEditWorkforceModal";
import { cache } from "../../common/utils";

const modalInitState = { workforce: {}, isOpen: false };

function ResourceWorkforceTable() {
	const [TableLoadingState, setTableLoadingState] = useState(true);
	const [modalDeleteState, setModalDeleteState] = useState(modalInitState);
	const [modalEditState, setModalEditState] = useState(modalInitState);
	const [workforces, setWorkforces] = useState([]);
    const [skillDB, setSkillDB] = useState([]);

    useEffect(function () {
        Promise.all([
            invoke("getAllWorkforces"),
            invoke("getAllSkills")
        ])
        .then(function ([workforcesResponse, skillsResponse]) {
            console.log("getAllWorkforces", workforcesResponse);
    
            const workforces = workforcesResponse.map((workforce) => ({
                id: workforce.id,
                accountId: workforce.accountId,
                email: workforce.email,
                accountType: workforce.accountType,
                name: workforce.displayName,
                avatar: workforce.avatar,
                unitSalary: workforce.unitSalary,
                workingType: workforce.workingType,
                workingEfforts: workforce.workingEfforts,
                skills: workforce.skills,
            }));
    
            setWorkforces(workforces);
            setTableLoadingState(false);
            
            setSkillDB(skillsResponse);
        })
        .catch(function (error) {
            console.log(error);
            Toastify.error(error.toString());
            setTableLoadingState(false);
        });
    }, [TableLoadingState]);

	function createKey(input) {
		return input
			? input.replace(/^(the|a|an)/, "").replace(/\s/g, "")
			: input;
	}

	const [searchInput, setSearchInput] = useState("");
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
						.includes(lowercaseQuery);
					const skillMatch = e.skills?.some((skill) =>
						skill.name
							.replace("-", " ")
							.toLowerCase()
							.includes(lowercaseQuery)
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

	function deleteOnClick(workforce) {
		setModalDeleteState({ workforce, isOpen: true });
	}

    function editOnClick(workforce) {
		setModalEditState({ workforce, isOpen: true });
	}

	const handleCreateClicked = () => {
		setTableLoadingState(true);
	};

    const handleEditClicked = () => {
		setTableLoadingState(true);
	};

	const actionsContent = (
		<ButtonGroup>
			<ResourceCreateWorkforceModal
				onCreatedClick={handleCreateClicked}
                skillDB={skillDB}
			/>
		</ButtonGroup>
	);

	const barContent = (
		<div style={{ display: "flex" }}>
			<div style={{ flex: "0 0 280px" }}>
				<TextField
					isCompact
					placeholder="Filter by Employee's Name or Skill"
					aria-label="Filter"
					elemAfterInput={<EditorSearchIcon label="Search" />}
					onChange={handleOnSearchBoxChange}
					value={searchInput}
				/>
			</div>
		</div>
	);

	const createHead = (withWidth) => {
		return {
			cells: [
				{
					key: "no",
					content: "No",
					width: withWidth ? 5 : undefined,
				},
				{
					key: "name",
					content: "Name",
					isSortable: true,
					width: withWidth ? 12 : undefined,
				},
				{
					key: "skill",
					content: "Skills",
					shouldTruncate: false,
					isSortable: true,
					width: withWidth ? 50 : undefined,
				},
				{
					key: "salary",
					content: "Salary (Hour)",
					shouldTruncate: false,
                    isSortable: true,
					width: withWidth ? 7 : undefined,
				},
				{
					key: "type",
					content: "Type",
					shouldTruncate: false,
					width: withWidth ? 7 : undefined,
				},
				{
					key: "actions",
					content: "Actions",
					shouldTruncate: true,
					width: 7,
				},
			],
		};
	};

	const head = createHead(true);

	const rows = workforcesFilter?.map((workforce, index) => ({
		key: `row-${index}-${workforce.name}`,
		isHighlighted: false,
		cells: [
			{
				key: "no",
				content: (index + 1),
			},
			{
				key: createKey(workforce.name),
				content: workforce.name,
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
			{
				key: workforce.salary,
				content: "$ " + workforce.unitSalary,
			},
			{
				key: "type",
				content: workforce.workingType == 0 ? "Full-time" : "Part-time",
			},
			{
				key: "actions",
				content: (
					<ButtonGroup>
						<Button
							onClick={() => {
								deleteOnClick(workforce);
							}}
							appearance="subtle"
							iconBefore={<TrashIcon label="delete" />}
						></Button>
						<Button
							onClick={() => {
								editOnClick(workforce);
							}}
							appearance="subtle"
							iconBefore={<EditIcon label="edit" />}
						></Button>
					</ButtonGroup>
				),
			},
		],
	}));

	return (
		<>
			<PageHeader actions={actionsContent} bottomBar={barContent} disableTitleStyles={true}>
            <div style={{display: "inline-flex"}}>
                    <h2>Employee List</h2>
                    <div style={{marginLeft: 5}}>
                        <InfoMessageColor/>
                    </div>
                </div>
			</PageHeader>

            <h5>Total employees: {workforcesFilter?.length}</h5>

			<DynamicTable
				head={head}
				rows={rows}
				rowsPerPage={ROW_PER_PAGE}
				defaultPage={1}
				isLoading={TableLoadingState}
				emptyView={<h2>Not found any employee</h2>}
			/>

			{modalDeleteState.isOpen ? (
				<ResourceDeleteWorkforceModal
					openState={modalDeleteState}
					setOpenState={setModalDeleteState}
					setWorkforcesListState={setWorkforces}
				/>
			) : (
				""
			)}

			{modalEditState.isOpen ? (
				<ResourceEditWorkforceModal
					openState={modalEditState}
					setOpenState={setModalEditState}
                    onEditedClick={handleEditClicked}
                    skillDB={skillDB}
				/>
			) : (
				""
			)}
		</>
	);
}

export default ResourceWorkforceTable;
