import React, { useCallback, useState } from "react";

import Button from "@atlaskit/button/standard-button";
import { LoadingButton } from "@atlaskit/button";
import { invoke } from "@forge/bridge";

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import Toastify from "../../../common/Toastify";

function DeleteSkillModal({
	setIsOpen,
	skill,
	skills,
	updateSkills
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const closeModal = useCallback(function () {
		setIsOpen(false);
	});
	const handleDelete = useCallback(() => {
		setIsDeleting(true);
		invoke("deleteSkill", { skillId: skill.id })
			.then(function (res) {
				for (let i = 0; i < skills.length; i++) {
					if (skills[i].id == skill.id) {
						skills.splice(i, 1);
					}
				}
				updateSkills(skills);
				Toastify.success(`Delete ${skill.name} successfully`);
				closeModal();
			})
			.catch(function (error) {
				closeModal();
				if (error.message) {
					Toastify.error(error.message);
				} else Toastify.error(error.toString());
			});
	}, []);

	return (
		<>
			<ModalTransition>
				<Modal onClose={closeModal}>
					<ModalHeader>
						<ModalTitle appearance="warning">
							Delete {skill.name}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{skill.name} will be delete permanly. This can not
						be undone!!!
					</ModalBody>
					<ModalFooter>
						<Button
							appearance="subtle"
							onClick={closeModal}
							autoFocus
							isDisabled={isDeleting}
						>
							Cancel
						</Button>
						<LoadingButton
							appearance="warning"
							isLoading={isDeleting}
							onClick={handleDelete}
						>
							Delete
						</LoadingButton>
					</ModalFooter>
				</Modal>
			</ModalTransition>
		</>
	);
}

export default DeleteSkillModal;
