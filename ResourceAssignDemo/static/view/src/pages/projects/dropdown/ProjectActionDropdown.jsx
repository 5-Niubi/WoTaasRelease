import React, { useCallback, useState } from "react";

import Button from "@atlaskit/button/standard-button";
import MoreIcon from "@atlaskit/icon/glyph/more";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import CopyIcon from "@atlaskit/icon/glyph/copy";
import DropdownMenu, {
	DropdownItem,
	DropdownItemGroup,
} from "@atlaskit/dropdown-menu";

function ProjectActionDropdown({
	editOnClick,
	deleteOnClick,
	cloneOnClick,
}) {
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
				<DropdownItem
					elemBefore={<CopyIcon label="clone" />}
					onClick={cloneOnClick}
				>
					Clone
				</DropdownItem>
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

export default ProjectActionDropdown;
