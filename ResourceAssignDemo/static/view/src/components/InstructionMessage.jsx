import React from "react";

import InlineMessage from "@atlaskit/inline-message";

const InstructionMessage = ({ content }) => {
	return (
		<InlineMessage appearance="info">
			<div>
				<strong>INFORMATION</strong>
			</div>
			<div>{content}</div>
		</InlineMessage>
	);
};

export default InstructionMessage;
