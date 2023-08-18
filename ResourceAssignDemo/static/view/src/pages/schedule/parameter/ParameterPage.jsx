import "react-vertical-timeline-component/style.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import __noop from "@atlaskit/ds-lib/noop";
import ParameterWorkforceList from "./ParameterWorkforceList";
import ParameterObjectInput from "./ParameterObjectInput";
import ParameterEstimateMessage from "./ParameterEstimateMessage";

/**
 * Using as Demo Homepage
 * @returns {import("react").ReactElement}
 */
function ParameterPage({handleChangeTab}) {
	let navigate = useNavigate();
	return (
		<div style={{width:"100%"}}>
			<ParameterEstimateMessage></ParameterEstimateMessage>
			<ParameterObjectInput handleChangeTab={handleChangeTab}></ParameterObjectInput>
			<ParameterWorkforceList></ParameterWorkforceList>
		</div>
	);
}

export default ParameterPage;
