// @ts-nocheck
import React, { useCallback, createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProjecstListHomePageHeader from "./page-header/ProjectsListHomePageHeader";

import { useMediaQuery } from "react-responsive";
import { Grid, GridColumn } from "@atlaskit/page";
import { Desktop } from "../../components/common/responsesive";
import { MEDIA_QUERY, MODAL_WIDTH } from "../../common/contants";
import CreateProjectModal from "./modal/CreateProjectModal";
import { invoke } from "@forge/bridge";
import ProjectListDynamicTable from "./table/ProjectListDynamicTable";
import EditProjectModal from "./modal/EditProjectModal";
import DeleteProjectModal from "./modal/DeleteProjectModal";
import Toastify from "../../common/Toastify";
import EmptyState from "@atlaskit/empty-state";
import Button from "@atlaskit/button";
import { cache, clearAllCache, getCache, getCacheObject } from "../../common/utils";

const width = MODAL_WIDTH.M;
const modalInitState = { project: {}, isOpen: false };
export const ModalStateContext = createContext();
const columns = 10;

function ProjectListHome() {
	clearAllCache();
	const [searchParams, setSearchParams] = useSearchParams();
	const isDesktopOrLaptop = useMediaQuery({
		query: `(min-width: ${MEDIA_QUERY.DESKTOP_LAPTOP.MIN}px)`,
	});
	const [projectTableLoadingState, setProjectTableLoadingState] =
		useState(true);

	const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(modalInitState);
	const [modalEditState, setModalEditState] = useState(modalInitState);

	const [searchBoxValue, setSearchBoxValue] = useState(
		searchParams.get("q") ? searchParams.get("q") : ""
	);

	let projectsCache = getCacheObject("projects", []);
	const [projects, setProjects] = useState(projectsCache);
	const [projectsForDisplay, setProjectsForDisplay] = useState(projects);

	const filterProjectName = useCallback(
		function (projects, query) {
			setProjectsForDisplay(
				projects.filter((e) =>
					e.name.toLowerCase().includes(query.toLowerCase())
				)
			);
		},
		[projects]
	);

	useEffect(
		function () {
			filterProjectName(projects, searchBoxValue);
		},
		[projects, searchBoxValue]
	);
	useEffect(function () {
		invoke("getProjectsList")
			.then(function (res) {
				setProjectTableLoadingState(false);
				let projectsList = [];
				for (let project of res) {
					let itemProject = {};
					itemProject = {
						id: project.id,
						imageAvatar: project.imageAvatar,
						name: project.name,
						startDate: project.startDate,
						deadline: project.deadline,
						tasks: project.taskCount,
						createDatetime: project.createDatetime,
					};
					projectsList.push(itemProject);
				}
				setProjects(projectsList);
				filterProjectName(projectsList, searchBoxValue);
				cache("projects", JSON.stringify(projectsList));
			})
			.catch(function (error) {
				setProjectTableLoadingState(false);
				Toastify.error(error.toString());
			});
	}, []);

	function handleOnSearchBoxChange(e) {
		setSearchBoxValue(e.target.value);
		setSearchParams({ q: e.target.value });
	}

	function handleOnSearch() {
		filterProjectName(projects, searchBoxValue);
	}

	return (
		<>
			<Grid layout="fluid" spacing="comfortable" columns={columns}>
				<GridColumn medium={columns}>
					<ProjecstListHomePageHeader
						createProjectButtonOnClick={() => setIsModalCreateOpen(true)}
						searchBoxValue={searchBoxValue}
						onSearchBoxChange={handleOnSearchBoxChange}
						onSearchButtonClick={handleOnSearch}
					/>
				</GridColumn>

				{!projectTableLoadingState && projects.length === 0 ? (
					<GridColumn medium={columns}>
						<EmptyState
							header="Empty"
							description="Look like you haven't create any projects yet. Create a new project to start using this app"
							primaryAction={
								<Button appearance="primary" onClick={setIsModalCreateOpen}>
									Create project
								</Button>
							}
						/>
					</GridColumn>
				) : (
					<>
						<GridColumn medium={columns}>
							<div style={{ marginBottom: "1rem" }}>
								<ModalStateContext.Provider
									value={{ setModalEditState, setModalDeleteState }}
								>
									<ProjectListDynamicTable
										isLoading={projectTableLoadingState}
										content={projectsForDisplay}
									/>
								</ModalStateContext.Provider>
							</div>
						</GridColumn>
						{/* <Desktop>
							<GridColumn medium={0}><div>Hover panel</div></GridColumn>
						</Desktop> */}
					</>
				)}
			</Grid>
			{isModalCreateOpen ? (
				<CreateProjectModal
					isOpen={isModalCreateOpen}
					setIsOpen={setIsModalCreateOpen}
					setProjectsDisplay={setProjects}
				/>
			) : (
				""
			)}

			{modalDeleteState.isOpen ? (
				<DeleteProjectModal
					openState={modalDeleteState}
					setOpenState={setModalDeleteState}
					setProjectsListState={setProjects}
				/>
			) : (
				""
			)}

			{modalEditState.isOpen ? (
				<EditProjectModal
					openState={modalEditState}
					setOpenState={setModalEditState}
					setProjectsListState={setProjects}
				/>
			) : (
				""
			)}
		</>
	);
}

export default ProjectListHome;
