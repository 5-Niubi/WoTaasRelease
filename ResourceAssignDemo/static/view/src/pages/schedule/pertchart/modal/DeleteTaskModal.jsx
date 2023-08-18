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
import Toastify from "../../../../common/Toastify";

function DeleteTaskModal({
	isOpen,
	setIsOpen,
	task,
	tasks,
	updateTasks,
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const closeModal = useCallback(function () {
		setIsOpen(false);
	});

	const handleDelete = useCallback(() => {
		setIsDeleting(true);
		invoke("deleteTask", { taskId: task.id })
			.then(function (res) {
				for (let i = 0; i < tasks.length; i++) {
					if (tasks[i].id == task.id) {
						tasks.splice(i, 1);
					}
				}
				updateTasks(tasks);
				Toastify.success(`Delete task successfully`);
				closeModal();
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
							Delete {task.name}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						{task.name} will be delete permanly. This can not be
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

export default DeleteTaskModal;
