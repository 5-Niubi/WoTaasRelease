import ArrowLeftCircleIcon from "@atlaskit/icon/glyph/arrow-left-circle";
import IssuesIcon from "@atlaskit/icon/glyph/issues";
import RoadmapIcon from "@atlaskit/icon/glyph/roadmap";
import { ButtonItem } from "@atlaskit/side-navigation";
import Spinner from "@atlaskit/spinner";
import { invoke } from "@forge/bridge";

import Avatar from "@atlaskit/avatar";
import {
	Header,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	Section,
	SideNavigation,
} from "@atlaskit/side-navigation";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { APP_NAME, PROJECT_NAME_DESCRIPTOR } from "../../common/contants";
import ButtonItemSideBar from "./ButtonItemSideBar";

function ProjectSideBar({ rootPath = "" }) {
	const navigate = useNavigate();
	const [projectSidebar, setProjectSidebar] = useState(Object);
	const { projectId } = useParams();

	useEffect(function () {
		invoke("getProjectDetail", { projectId })
			.then(function (res) {
				setProjectSidebar(res);
			})
			.catch(function (error) {});
	}, []);

	return (
		<SideNavigation label="project" testId="side-navigation">
			<NavigationHeader>
				<Header
					description={PROJECT_NAME_DESCRIPTOR}
					iconBefore={
						<Avatar
							size="small"
							appearance="square"
							src={""}
							name="Project Avatar"
						/>
					}
				>
					{projectSidebar.name ? (
						projectSidebar.name
					) : (
						<Spinner interactionName="load" />
					)}{" "}
				</Header>
			</NavigationHeader>

			<NestableNavigationContent
				initialStack={[]}
				testId="nestable-navigation-content"
			>
				<Section>
					<ButtonItem
						iconBefore={<ArrowLeftCircleIcon label="" />}
						onClick={() => navigate("../")}
					>
						Go back
					</ButtonItem>
				</Section>
				<Section hasSeparator>
					<ButtonItemSideBar
						key="schedule"
						rootPath={rootPath}
						text={"Schedule"}
						pathTo={"schedule"}
						iconBefore={<RoadmapIcon label="" />}
					/>
					<ButtonItemSideBar
						key="task-list"
						rootPath={rootPath}
						text={"Task Lists"}
						pathTo={"tasks"}
						iconBefore={<IssuesIcon label="" />}
					/>
				</Section>
			</NestableNavigationContent>

			<NavigationFooter>
				<p style={{ textAlign: "center", fontSize: "12px" }}>
					You are in {APP_NAME}
				</p>
			</NavigationFooter>
		</SideNavigation>
	);
}

export default ProjectSideBar;
