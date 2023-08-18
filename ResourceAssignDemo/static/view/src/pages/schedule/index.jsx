import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ScheduleTabs from "./ScheduleTabs";
import Spinner from "@atlaskit/spinner";
import { invoke } from "@forge/bridge";
import { cache, clearAllCache, getCache } from "../../common/utils";
import Toastify from "../../common/Toastify";

/**
 * Using as Demo Homepage
 * @returns {import("react").ReactElement}
 */
function SchedulePage() {
	let navigate = useNavigate();
	let { projectId } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	useEffect(function () {
		invoke("getProjectDetail", { projectId })
			.then(function (res) {
				setIsLoading(false);
				if (res.id) {
					cache("project", JSON.stringify(res));
				}
			})
			.catch(function (error) {
				setIsLoading(false);
				console.log(error);
				Toastify.error(error.toString());
			});		
	}, []);

	return <>{isLoading ? <Spinner size="large" /> : <ScheduleTabs />}</>;
}

export default SchedulePage;
