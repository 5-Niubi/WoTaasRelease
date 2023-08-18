import React, { useCallback, useState } from "react";

import ActivityIcon from "@atlaskit/icon/glyph/activity";
import PeopleGroupIcon from "@atlaskit/icon/glyph/people-group";
import LightBulb from "@atlaskit/icon/glyph/lightbulb";
import { ReactComponent as LogoSvg } from "../../assets/svg/Logo.svg";

import {
	Header,
	NavigationFooter,
	NavigationHeader,
	NestableNavigationContent,
	Section,
	SideNavigation,
} from "@atlaskit/side-navigation";

import ButtonItemSideBar from "./ButtonItemSideBar";
import { APP_NAME, APP_NAME_DESCRIPTOR } from "../../common/contants";
import { HelperMessage } from "@atlaskit/form";
import MoreSection from "./MoreSection";

function HomeSideBar({rootPath = ""}) {
	return (
		<SideNavigation label="project" testId="side-navigation">
			<NavigationHeader>
				<Header
					// iconBefore={<AtlassianIcon appearance="brand" />}
					iconBefore={<LogoSvg></LogoSvg>}
					description={APP_NAME_DESCRIPTOR}
				>
					{APP_NAME}
				</Header>
			</NavigationHeader>

			<NestableNavigationContent
				initialStack={[]}
				testId="nestable-navigation-content"
			>
				<Section hasSeparator>
					<ButtonItemSideBar
						rootPath={rootPath}
						text={"Project Lists"}
						pathTo={""}
						iconBefore={<ActivityIcon label="" />}
					/>
					<ButtonItemSideBar
						rootPath={rootPath}
						text={"Resources"}
						pathTo={"resources"}
						iconBefore={<PeopleGroupIcon label="" />}
					/>
					<ButtonItemSideBar
						rootPath={rootPath}
						text={"Skills"}
						pathTo={"skills"}
						iconBefore={<LightBulb label="" />}
					/>
					<Section hasSeparator>
						<MoreSection rootPath={rootPath} />
					</Section>
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

export default HomeSideBar;
