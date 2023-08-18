import { LoadingButton } from "@atlaskit/button";
import Heading from "@atlaskit/heading";
import Image from "@atlaskit/image";
import { Grid, GridColumn } from "@atlaskit/page";
import { Box, xcss } from "@atlaskit/primitives";
import React from "react";
import jiraSoftwarelogo from "../../../assets/images/Jira-Emblem_resized.png";
import { MODAL_WIDTH } from "../../../common/contants";

const width = MODAL_WIDTH.M;
const columns = 10;

const containerStyles = xcss({
	display: "flex",
	height: "3rem",
	justifyContent: "left",
});

const buttonContainerStyles = xcss({
	display: "flex",
	justifyContent: "right",
	alignItems: "center",
	height: "3rem",
});

const descriptionContainerStyles = xcss({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "3rem",
});
function JiraCreateProjectExportGrid({
	isButtonExportLoading,
	onButtonExportClick,
}) {
	return (
		<Grid layout="fluid" spacing="compact" columns={columns}>
			<GridColumn medium={2}>
				<Box xcss={containerStyles}>
					<Image src={jiraSoftwarelogo} alt="JiraSoftware Logo" />
				</Box>
			</GridColumn>
			<GridColumn medium={6}>
				<Box xcss={descriptionContainerStyles}>
					<Heading level="h400">
						Automatic create a Jira Software Project an import task to
					</Heading>
				</Box>
			</GridColumn>
			<GridColumn medium={2}>
				<Box xcss={buttonContainerStyles}>
					<LoadingButton
						isLoading={isButtonExportLoading}
						appearance="primary"
						onClick={onButtonExportClick}
					>
						Create
					</LoadingButton>
				</Box>
			</GridColumn>
		</Grid>
	);
}

export default JiraCreateProjectExportGrid;
