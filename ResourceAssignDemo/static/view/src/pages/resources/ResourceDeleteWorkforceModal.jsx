import { useCallback, useState } from "react";

import { css, jsx } from "@emotion/react";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import EditIcon from "@atlaskit/icon/glyph/edit";
import Button from "@atlaskit/button";
import { invoke } from "@forge/bridge";
import LoadingButton from "@atlaskit/button";
import Toastify from "../../common/Toastify";

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";

const boldStyles = css({
	fontWeight: "bold",
});

export default function ResourceDeleteWorkforceModal({
	openState,
	setOpenState,
	setWorkforcesListState,
}) {
	const workforce = openState.workforce;

	const [isDeleting, setIsDeleting] = useState(false);
	const closeModal = useCallback(
		function () {
			setOpenState({ workforce: workforce, isOpen: false });
		},
		[setOpenState]
	);

	const handleDelete = useCallback(() => {
		setIsDeleting(true);
		let workforce_id = workforce.id;
		invoke("deleteWorkforce", { id: workforce_id })
			.then(function (res) {
				Toastify.success(`Delete ${workforce.name} successfully`);
				console.log(res);
				closeModal();
				setWorkforcesListState((prev) =>
					prev.filter((item) => item.id !== workforce_id)
				);
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
							Delete {workforce.name}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						The employee name '{workforce.name}' will be permanently
						removed?
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
								Deleting...
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
