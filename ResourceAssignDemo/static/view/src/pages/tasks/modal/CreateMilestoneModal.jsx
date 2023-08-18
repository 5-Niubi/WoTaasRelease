import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	useModal,
} from "@atlaskit/modal-dialog";
import React, { Fragment, useState, useCallback, useEffect } from "react";
import TextField from "@atlaskit/textfield";
import Form, { Field } from "@atlaskit/form";
import { invoke } from "@forge/bridge";
import Toastify from "../../../common/Toastify";

function CreateMilestoneModal({
	isOpen,
	setIsOpen,
	projectId,
	milestones,
	updateMilestones,
	milestoneEdit,
	updateMilestoneEdited,
}) {
	const [name, setName] = useState(milestoneEdit ? milestoneEdit.name : "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateName = useCallback(function (e) {
		setName(e.target.value);
	}, []);

	const closeModal = useCallback(
		function () {
			setIsOpen(false);
		},
		[setIsOpen]
	);

	function handleSubmitCreate() {
		setIsSubmitting(true);
		let milestoneObjRequest = {
			projectId,
			name: name
		};
		if (milestoneEdit) {
			milestoneObjRequest.id = milestoneEdit.id;
			//update current milestone
			invoke("updateMilestone", { milestoneObjRequest })
				.then(function (res) {
					setIsSubmitting(false);
					if (res.id) {
						for(let i=0; i<milestones.length; i++) {
							if (milestones[i].id == res.id) milestones[i] = res;
						};
						updateMilestones(milestones);
						if (updateMilestoneEdited){
							updateMilestoneEdited(true);
						}
						Toastify.success("Updated milestone successfully");
						closeModal();
					} else if (res.messages) {
						Toastify.error(res.messages);
					}
				})
				.catch((error) => {
					setIsSubmitting(false);
					console.log(error.message);
					if (error.messages) {
						Toastify.error(res.messages);
					} else {
						Toastify.error(error.message);
					}
				});
		} else {
			//create new
			invoke("createMilestone", { milestoneObjRequest })
				.then(function (res) {
					setIsSubmitting(false);
					if (res.id) {
						milestones.push(res);
						updateMilestones(milestones);
						Toastify.success("Created group successfully");
						closeModal();
					} else if (res.messages) {
						Toastify.error(res.messages);
					}
				})
				.catch((error) => {
					setIsSubmitting(false);
					console.log(error.message);
					if (error.messages) {
						Toastify.error(res.messages);
					} else {
						Toastify.error(error.message);
					}
				});
		}
	}

	return (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={closeModal} width={600}>
					<Form
						onSubmit={(formState) =>
							console.log("form submitted", formState)
						}
					>
						{({ formProps }) => (
							<form id="form-with-id" {...formProps}>
								<ModalHeader>
									<ModalTitle>{milestoneEdit ? "Edit group" : "Create new Group"}</ModalTitle>
								</ModalHeader>
								<ModalBody>
									<Field
										aria-required={true}
										name="name"
										label="Group Name"
										isRequired
									>
										{() => (
											<TextField
												autoComplete="off"
												value={name}
												onChange={updateName}
											/>
										)}
									</Field>
								</ModalBody>

								<ModalFooter>
									<ButtonGroup>
										<Button
											appearance="default"
											onClick={closeModal}
										>
											Cancel
										</Button>
										{isSubmitting ? (
											<LoadingButton
												appearance="primary"
												isLoading
											>
												Saving...
											</LoadingButton>
										) : (
											<Button
												type="submit"
												appearance="primary"
												onClick={handleSubmitCreate}
											>
												{milestoneEdit ? "Save" : "Create"}
											</Button>
										)}
									</ButtonGroup>
								</ModalFooter>
							</form>
						)}
					</Form>
				</Modal>
			)}
		</ModalTransition>
	);
}

export default CreateMilestoneModal;
