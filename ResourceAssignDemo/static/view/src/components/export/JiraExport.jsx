import Button from "@atlaskit/button";
import Heading from "@atlaskit/heading";
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from "@atlaskit/modal-dialog";
import { invoke } from "@forge/bridge";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Toastify from "../../common/Toastify";
import { MODAL_WIDTH, THREAD_ACTION } from "../../common/contants";
import { saveThreadInfo } from "../../common/utils";
import { ProjectInfoContext } from "../../pages/schedule/ScheduleTabs";
import { ScheduleExportContext } from "../../pages/schedule/ganttchart/GanttChartPage";
import { ThreadLoadingContext } from "../main/MainPage";
import JiraCreateProjectExport from "./form/JiraCreateProjectExport";
import JiraAutoCreateProjectExport from "./gird/JiraCreateProjectExportGrid";
const width = MODAL_WIDTH.M;

const initProjectListState = {
	isLoading: true,
	projectsData: [],
};

const MODAL_STATE_DEFAULT = {
	isModalOpen: false,
	data: {},
};

function JiraExport({ state }) {
	const [isJiraExportOpen, setIsJiraExportOpen] = state;
	const project = useContext(ProjectInfoContext);

	const closeJiraExportModal = useCallback(
		() => setIsJiraExportOpen(false),
		[]
	);

	// Modal Create Project State
	const [createProjectModalState, setCreateProjectModalState] =
		useState(MODAL_STATE_DEFAULT);
	const [isModalProjectStateLoading, setIsModalProjectStateLoading] =
		useState(false);
	const openModalCreateProject = function () {
		let data = {
			projectName: project.name,
		};
		setCreateProjectModalState({ data, isModalOpen: true });
	};
	const closeModalCreateProject = function () {
		setCreateProjectModalState((prev) => ({ ...prev, isModalOpen: false }));
	};
	// --------

	// -- Get project list for import to
	const [projectListState, setProjectListState] =
		useState(initProjectListState);
	useEffect(() => {
		invoke("getJiraProjectsList")
			.then(function (res) {
				setProjectListState({ projectsData: res.values, isLoading: false });
			})
			.catch(function (error) {
				setProjectListState({ projectsData: [], isLoading: false });
				Toastify.error(error.toString());
			});
		return () => {
			setProjectListState(initProjectListState);
		};
	}, []);
	// --------

	const schedule = useContext(ScheduleExportContext);
	const [isLoading, setIsLoading] = useState(false);

	// State of Loading Thread Modal
	const threadLoadingContext = useContext(ThreadLoadingContext);
	const [threadStateValue, setThreadStateValue] = threadLoadingContext.state;
	// --------

	const handleCreateThreadSuccess = useCallback((threadId) => {
		let threadAction = THREAD_ACTION.JIRA_EXPORT;
		let threadInfo = {
			threadId,
			threadAction
		};
		setThreadStateValue(threadInfo);
		saveThreadInfo(threadInfo);
		closeJiraExportModal();
	}, []);

	const handleCreateProjectClick = function () {
		setIsModalProjectStateLoading(true);
		invoke("exportToJira", {
			scheduleId: schedule.id,
			projectCreateInfo: createProjectModalState.data,
		})
			.then((res) => {
				closeModalCreateProject();
				handleCreateThreadSuccess(res.threadId);
			})
			.catch((error) => {
				setIsModalProjectStateLoading(false);
				Toastify.error(error.message);
				console.log(error);
			});
	};

	const handleOpenCreateClick = useCallback(() => {
		openModalCreateProject();
	}, []);

	return (
		<ModalTransition>
			<Modal onClose={closeJiraExportModal} width={width}>
				<ModalHeader>
					<ModalTitle>
						<Heading level="h600">
							Export this solution to a Jira Software Project
						</Heading>
						<Heading level="h200">
							(This process will take a while and can not undo)
						</Heading>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<JiraAutoCreateProjectExport
						isButtonExportLoading={isLoading}
						onButtonExportClick={handleOpenCreateClick}
					/>
					{/* <Heading level="h600">Select project to export to</Heading>
					<JiraProjectExportTable
						isLoading={projectListState.isLoading}
						projects={projectListState.projectsData}
						exportButtonClick={handleExportClick}
					/> */}

					{createProjectModalState.isModalOpen && (
						<JiraCreateProjectExport
							state={[createProjectModalState, setCreateProjectModalState]}
							onCreateClick={handleCreateProjectClick}
							isLoading={isModalProjectStateLoading}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						appearance="default"
						isDisabled={isLoading}
						onClick={closeJiraExportModal}
						autoFocus={true}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</ModalTransition>
	);
}

export default JiraExport;
