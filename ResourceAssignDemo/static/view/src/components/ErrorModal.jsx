import Button from "@atlaskit/button";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import React from "react";

function ErrorModal({ children, setState }) {
	function handleOnClose() {
		setState((prev) => ({ ...prev, error: null }));
	}

	return (
		<ModalTransition>
			<Modal onClose={handleOnClose}>
				<ModalHeader>
					<ModalTitle appearance="danger">
						Error
					</ModalTitle>
				</ModalHeader>
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					<Button onClick={handleOnClose} appearance="default">
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</ModalTransition>
	);
}

export default ErrorModal;
