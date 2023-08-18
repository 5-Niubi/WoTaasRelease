import Button from "@atlaskit/button";
import React, { createContext, useCallback, useState } from "react";
import JiraExport from "../components/export/JiraExport";
import { ModalTransition } from "@atlaskit/modal-dialog";
import OtherExport from "../components/export/OtherExport";
import JiraCreateProjectExport from "../components/export/form/JiraCreateProjectExport";

const initModalExportState = {
	data: {},
	isModalOpen: false,
};

// export const ScheduleExportContext = createContext(scheduleExportDefaultValue);
function TestModal() {
	// --- state ---
	const jiraExportModalState = useState(initModalExportState);
	const [jiraExportState, setJiraExportState] = jiraExportModalState;
	const openJiraExportModal = () =>
		setJiraExportState((prev) => ({ ...prev, isModalOpen: true }));
	// ------

	return (
		<div>
			<Button appearance="primary" onClick={openJiraExportModal}>
				Open modal JiraExport
			</Button>
			{jiraExportState.isModalOpen ? (
				<JiraCreateProjectExport state={jiraExportModalState} />
			) : (
				""
			)}
		</div>
	);
}

export default TestModal;
