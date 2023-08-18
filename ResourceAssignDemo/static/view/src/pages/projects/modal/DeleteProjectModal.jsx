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

function DeleteProjectModal({ openState, setOpenState, setProjectsListState }) {
	const project = openState.project;

	const [isDeleting, setIsDeleting] = useState(false);
	const closeModal = useCallback(
		function () {
			setOpenState({ project, isOpen: false });
		},
		[setOpenState]
	);

	const handleDelete = useCallback(() => {
		setIsDeleting(true);
		invoke("deleteProject", { projectId: project.id })
			.then(function (res) {
				Toastify.success(`Delete ${project.name} successfully`);
				console.log(res);
				closeModal();
				setProjectsListState((prev) => prev.filter((item) => item.id !== res.id));
			})
			.catch(function (error) {
				closeModal();
				Toastify.error(error.toString());
			});
	}, []);

	return (
		<>
			<ModalTransition>
				<Modal onClose={closeModal}>
					<ModalHeader>
						<ModalTitle appearance="warning">
							Delete {project.name}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{project.name} will be delete permanly. This can not be
						undone!!!
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
						{isDeleting ? (
							<LoadingButton appearance="warning" isLoading>
								Create
							</LoadingButton>
						) : (
							<Button appearance="warning" onClick={handleDelete}>
								Delete
							</Button>
						)}
					</ModalFooter>
				</Modal>
			</ModalTransition>
		</>
	);
}

export default DeleteProjectModal;
