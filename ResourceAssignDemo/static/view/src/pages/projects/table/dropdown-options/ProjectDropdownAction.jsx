import Button from "@atlaskit/button/standard-button";
import MoreIcon from "@atlaskit/icon/glyph/more";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";

import DropdownMenu from "@atlaskit/dropdown-menu";
import React, { useContext } from "react";
import { DropdownItem, DropdownItemGroup } from "@atlaskit/dropdown-menu";
import { ModalStateContext } from "../../ProjectsListHome";

function ProjectDropdownAction({project}) {
	const { setModalEditState, setModalDeleteState } =
		useContext(ModalStateContext);
	function editOnClick() {
		setModalEditState({ project, isOpen: true });
	}

	function deleteOnClick() {
		setModalDeleteState({ project, isOpen: true });
	}

	return (
		<DropdownMenu
			trigger={({ triggerRef, ...props }) => (
				<Button
					{...props}
					appearance="subtle-link"
					iconBefore={<MoreIcon label="more" />}
					ref={triggerRef}
				/>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem
					elemBefore={<EditIcon label="edit" />}
					onClick={editOnClick}
				>
					Edit
				</DropdownItem>
				{/* <DropdownItem
					elemBefore={<CopyIcon label="clone" />}
					onClick={cloneOnClick}
				>
					Clone
				</DropdownItem> */}
				<DropdownItem
					elemBefore={<TrashIcon label="delete" />}
					onClick={deleteOnClick}
				>
					Delete
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}

export default ProjectDropdownAction;
