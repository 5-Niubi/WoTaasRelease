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

function DeleteMilestoneModal({
	setIsOpen,
	milestone,
	milestones,
	updateMilestones,
	updateSelectedMilestoneIndex,
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const closeModal = useCallback(function () {
		setIsOpen(false);
	});
	const handleDelete = useCallback(() => {
		setIsDeleting(true);
		invoke("deleteMilestone", { milestoneId: milestone.id })
			.then(function (res) {
				for (let i = 0; i < milestones.length; i++) {
					if (milestones[i].id == milestone.id) {
						milestones.splice(i, 1);
					}
				}
				updateMilestones(milestones);
				if (updateSelectedMilestoneIndex) {
					updateSelectedMilestoneIndex(0);
				}
				Toastify.success(`Delete ${milestone.name} successfully`);
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
							Delete {milestone.name}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{milestone.name} will be delete permanly. This can not
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

export default DeleteMilestoneModal;
