import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Select from "@atlaskit/select";
import TextField from "@atlaskit/textfield";
import React from "react";
import { token } from "@atlaskit/tokens";
import Heading from "@atlaskit/heading";
import EditorSearchIcon from "@atlaskit/icon/glyph/editor/search";

function ProjecstListHomePageHeader({
	createProjectButtonOnClick,
	onSearchBoxChange,
	searchBoxValue,
	onSearchButtonClick,
}) {
	const actionsContent = (
		<ButtonGroup>
			<Button appearance="primary" onClick={createProjectButtonOnClick}>
				Create project
			</Button>
		</ButtonGroup>
	);

	const barContent = (
		<div style={{ display: "flex" }}>
			<div style={{ flex: "0 0 200px" }}>
				<TextField
					isCompact
					placeholder="Filter by Project Name"
					aria-label="Filter"
					elemAfterInput={<EditorSearchIcon label="Search" />}
					onChange={onSearchBoxChange}
					value={searchBoxValue}
				/>
			</div>
			{/* <div style={{ flex: "0 0 200px", marginLeft: token("space.100", "8px") }}>
				<Button onClick={onSearchButtonClick}>Search</Button>
			</div> */}
		</div>
	);
	return (
		<PageHeader actions={actionsContent} bottomBar={barContent}>
			<Heading level="h900">Choose Your Project To Start</Heading>
			<Heading level="h400">Only Jira Software Project</Heading>
		</PageHeader>
	);
}

export default ProjecstListHomePageHeader;
