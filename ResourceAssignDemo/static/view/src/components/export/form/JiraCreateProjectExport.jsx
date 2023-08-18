import Button, { LoadingButton } from "@atlaskit/button";
import { Field, HelperMessage } from "@atlaskit/form";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import TextField from "@atlaskit/textfield";
import React, { Fragment, useEffect, useState } from "react";
import { extractProjectKey } from "../../../common/utils";

function JiraCreateProjectExport({ state, onCreateClick, isLoading }) {
	const [modalState, setModalState] = state;
	const [projectName, setProjectName] = useState(
		modalState.data.projectName ? modalState.data.projectName : ""
	);
	const [projectKey, setProjectKey] = useState(extractProjectKey(projectName));

	function closeModal() {
		if (!isLoading) setModalState((prev) => ({ ...prev, isModalOpen: false }));
	}

	function handleProjectNameInput(e) {
		setProjectName(e.target.value);
		setProjectKey(extractProjectKey(e.target.value));
	}
	function handleProjectKeyInput(e) {
		let input = e.target.value;
		if (input.length <= 10) {
			setProjectKey(extractProjectKey(input));
		}
	}

	useEffect(() => {
		let project = { projectName, projectKey };
		setModalState((prev) => ({ ...prev, data: project }));
	}, [projectName, projectKey]);

	return (
		<ModalTransition>
			<Modal onClose={closeModal}>
				<ModalHeader>
					<ModalTitle>Create Default Software Project</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Field name="projectName" label="Project Name">
						{(fieldProps) => (
							<TextField
								name="projectName"
								{...fieldProps}
								value={projectName}
								onChange={handleProjectNameInput}
							/>
						)}
					</Field>
					<Field name="projectKey" label="Project Key" isRequired>
						{(fieldProps) => (
							<Fragment>
								<TextField
									name="projectKey"
									{...fieldProps}
									value={projectKey}
									onChange={handleProjectKeyInput}
								/>
								<HelperMessage>
									<ul>
										<li>
											If you want to export to an existed project. Please
											provide project key.
										</li>
										<li>
											Project keys must start with an uppercase letter, followed
											by one or more uppercase alphanumeric characters.
										</li>
										<li>Project key is bellow 10 characters.</li>
									</ul>
								</HelperMessage>
							</Fragment>
						)}
					</Field>
				</ModalBody>
				<ModalFooter>
					<Button onClick={closeModal}>Close</Button>
					<LoadingButton isLoading={isLoading} onClick={onCreateClick}>
						Create
					</LoadingButton>
				</ModalFooter>
			</Modal>
		</ModalTransition>
	);
}

export default JiraCreateProjectExport;
