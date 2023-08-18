import Avatar from "@atlaskit/avatar";
import TableTree, { Rows } from "@atlaskit/table-tree";
import React, { useCallback, useState } from "react";
import Link from "../../../components/common/Link";
import ProjectActionDropdown from "../dropdown/ProjectActionDropdown";
import { formatDateDMY } from "../../../common/utils";

function ProjectsListHomeTable({ items }) {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);
	const [projectForModal, setProjectForModal] = useState({});

	const [isModalEditOpen, setIsModalEditOpen] = useState(false);
	const openModalEdit = useCallback(() => setIsModalEditOpen(true), []);
	const closeModalEdit = useCallback(() => setIsModalEditOpen(false), []);

	const No = (props) => <span>{props.no}</span>;
	const ProjectName = (props) => (
		<span>
			<span style={{ verticalAlign: "middle", marginRight: "0.5rem" }}>
				<Avatar
					size="small"
					appearance="square"
					src={"https://placehold.co/600x400"}
					name="Project Avatar"
				/>
			</span>
			<span>
				<Link to={`${props.projectId}/schedule`}>{props.projectName}</Link>
			</span>
		</span>
	);
	const StartDate = (props) => <span>{formatDateDMY(props.startDate)}</span>;
	const Amount = (props) => <span>{10}</span>;
	const Option = (props) => {
		function handleDeleteProjectOnClick() {
			openModal();
			setProjectForModal(props);
		}

		function handleEditProjectOnClick() {
			{
				openModalEdit();
				setProjectForModal(props);
			}
		}

		function handleCloneProjectOnClick() {}

		return (
			<>
				<ProjectActionDropdown
					cloneOnClick={handleCloneProjectOnClick}
					deleteOnClick={handleDeleteProjectOnClick}
					editOnClick={handleEditProjectOnClick}
				/>
			</>
		);
	};
	return (
		<>
			<TableTree
				columns={[No, ProjectName, StartDate, Amount, Option]}
				headers={["No", "Project Name", "Start Date", "Amount", ""]}
				columnWidths={["10px", "350px", "200px", "65px", "82px"]}
				items={items}
			>
				{items.length === 0 ? (
					<Rows items={undefined} render={() => null} />
				) : (
					""
				)}
			</TableTree>
		</>
	);
}

export default ProjectsListHomeTable;
