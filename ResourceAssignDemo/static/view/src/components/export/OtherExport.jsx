import Button, { LoadingButton } from "@atlaskit/button";
import Modal, {
	ModalTransition,
	ModalHeader,
	ModalTitle,
	ModalBody,
	ModalFooter,
} from "@atlaskit/modal-dialog";
import React, { useCallback, useContext, useState } from "react";
import { MODAL_WIDTH } from "../../common/contants";
import { invoke, router } from "@forge/bridge";
import MPXmlExportFile from "./gird/MPXmlExportFile";
import { ScheduleExportContext } from "../../pages/schedule/ganttchart/GanttChartPage";

const width = MODAL_WIDTH.M;

function OtherExport({ state }) {
	const schedule = useContext(ScheduleExportContext);

	const [otherExportState, setOtherExportState] = state;
	const closeOtherExportModal = useCallback(() => {
		setOtherExportState({ isModalOpen: false, schedule: {} });
	}, []);
	const [isLoading, setIsLoading] = useState(false);

	const handleExportMSPClick = useCallback(async () => {
		setIsLoading(true);
		invoke("getDownloadMSXMLUrl", { scheduleId: schedule.id })
			.then(async (res) => {
				await router.open(res);
				setIsLoading(false);
			})
			.catch((error) => {
				setIsLoading(false);
			});
	}, []);

	return (
		<ModalTransition>
			<Modal onClose={closeOtherExportModal} width={width}>
				<ModalHeader>
					<ModalTitle>Other Option To Export</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<MPXmlExportFile
						isButtonExportLoading={isLoading}
						onButtonExportClick={handleExportMSPClick}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						appearance="subtle"
						onClick={closeOtherExportModal}
						autoFocus={true}
						isDisabled={isLoading}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
			{/* {isLoadingProcessOpen && <LoadingModal state={loadingModalState} />} */}
		</ModalTransition>
	);
}

export default OtherExport;
