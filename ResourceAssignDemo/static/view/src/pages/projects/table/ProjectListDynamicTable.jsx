import DynamicTable from "@atlaskit/dynamic-table";
import React, { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Avatar from "@atlaskit/avatar";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";

import ProjectDropdownAction from "./dropdown-options/ProjectDropdownAction";
import { formatDateDMY } from "../../../common/utils";
import Link from "../../../components/common/Link";
import { ROW_PER_PAGE } from "../../../common/contants";
import Button from "@atlaskit/button";
import { ModalStateContext } from "../ProjectsListHome";

function ProjectListDynamicTable({ isLoading, content }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = useState(
		searchParams.get("page") ? Number(searchParams.get("page")) : 1
	);

	const { setModalEditState, setModalDeleteState } =
		useContext(ModalStateContext);
	function editOnClick(project) {
		setModalEditState({ project, isOpen: true });
	}

	function deleteOnClick(project) {
		setModalDeleteState({ project, isOpen: true });
	}

	const rows = content.map((data, index) => ({
		key: `row-${index + 1}-${data.name}`,
		isHighlighted: false,
		cells: [
			{
				key: data.id,
				content: <div className="text-center">{index + 1}</div>,
			},
			{
				key: data.name,
				content: (
					<span>
						<span style={{ verticalAlign: "middle", marginRight: "0.5rem" }}>
							<Avatar
								size="small"
								appearance="square"
								src={""}
								name="Project Avatar"
							/>
						</span>
						<span>
							<Link to={`${data.id}/schedule`}>{data.name}</Link>
						</span>
					</span>
				),
			},
			{
				key: data.startDate,
				content: formatDateDMY(data.startDate),
			},
			{
				key: data.deadline,
				content: formatDateDMY(data.deadline),
			},
			{
				key: data.tasks,
				content: data.tasks,
			},
			{
				key: data.createDatetime,
				content: formatDateDMY(data.createDatetime),
			},
			{
				key: "optionDelete",
				content: (
					<Button
						onClick={() => {
							deleteOnClick(data);
						}}
						appearance="subtle"
						iconBefore={<TrashIcon label="delete" />}
					></Button>
				),
			},
			{
				key: "optionEdit",
				content: (
					<Button
						onClick={() => {
							editOnClick(data);
						}}
						appearance="subtle"
						iconBefore={<EditIcon label="edit" />}
					></Button>
				),
			},
		],
	}));
	return (
		<>
			<DynamicTable
				head={head}
				rows={rows}
				rowsPerPage={ROW_PER_PAGE}
				defaultPage={1}
				page={page}
				isFixedSize
				defaultSortKey="no"
				defaultSortOrder="DESC"
				onSort={() => console.log("onSort")}
				onSetPage={(page) => {
					setPage(page);
					setSearchParams({ page: `${page}` });
				}}
				isLoading={isLoading}
				emptyView={<h2>Not found any project match</h2>}
			/>
		</>
	);
}

export default ProjectListDynamicTable;

export const createHead = () => {
	return {
		cells: [
			{
				key: "no",
				content: "No",
				isSortable: true,
				width: 5,
			},
			{
				key: "projectName",
				content: "Project name",
				shouldTruncate: true,
				isSortable: true,
				width: 50,
			},
			{
				key: "startDate",
				content: "Start date",
				shouldTruncate: true,
				isSortable: true,
				width: 15,
			},
			{
				key: "endDate",
				content: "End date",
				shouldTruncate: true,
				isSortable: true,
				width: 15,
			},
			{
				key: "tasks",
				content: "Tasks",
				isSortable: true,
				shouldTruncate: true,
				width: 10,
			},
			{
				key: "createDatetime",
				content: "Create at",
				isSortable: true,
				shouldTruncate: true,
				width: 15,
			},
			{
				key: "optionDelete",
				content: "",
				shouldTruncate: true,
				width: 5,
			},
			{
				key: "optionEdit",
				content: "",
				shouldTruncate: true,
				width: 5,
			},
		],
	};
};

const head = createHead();
