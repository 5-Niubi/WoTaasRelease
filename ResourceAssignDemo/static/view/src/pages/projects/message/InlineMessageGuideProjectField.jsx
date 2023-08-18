import InlineMessage from "@atlaskit/inline-message";
import { Box, xcss } from "@atlaskit/primitives";
import React from "react";

const containerStyle = xcss({
	marginLeft: "0.5em",
	display: "inline"
});

function InlineMessageGuideProjectField() {
	return (
		<Box xcss={containerStyle}>
			<InlineMessage appearance="info">
				<p>
					<strong>Optional Fields</strong>
				</p>
				<p>
					Optional fields such as start date, end date, price, etc. can be
					customized in Parameter.
				</p>
			</InlineMessage>
		</Box>
	);
}

export default InlineMessageGuideProjectField;
