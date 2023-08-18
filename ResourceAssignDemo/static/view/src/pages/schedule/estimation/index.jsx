import "react-vertical-timeline-component/style.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import __noop from "@atlaskit/ds-lib/noop";
import EstimationPageHeader from "./EstimationPageHeader";
import MilestonesTimeline from "./EstimationMilestoneTimeline";
import { invoke } from "@forge/bridge";
import Toastify from "../../../common/Toastify";

/**
 * Using as Demo Homepage
 * @returns {import("react").ReactElement}
 */
function EstimationPage({ handleChangeTab }) {
	let navigate = useNavigate();
	let { projectId } = useParams();

	const [skills, setSkills] = useState([]);
	const [milestones, setMilestones] = useState([]);
	useEffect(function () {
		var skillsData = localStorage.getItem("skills");
		if (skillsData) skillsData = JSON.parse(skillsData);
		if (!skillsData) {
			invoke("getAllSkills", {})
				.then(function (res) {
					if (Object.keys(res).length !== 0) {
						setSkills(res);
					} else setSkills([]);
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
			setSkills([]);
		} else {
			setMilestones(skillsData);
		}

		var milestonesData = localStorage.getItem("milestones");
		if (milestonesData) milestonesData = JSON.parse(milestonesData);
		if (!milestonesData) {
			invoke("getAllMilestones", { projectId })
				.then(function (res) {
					if (Object.keys(res).length !== 0) {
						setMilestones(res);
					} else setMilestones([]);
				})
				.catch(function (error) {
					console.log(error);
					Toastify.error(error.toString());
				});
			setMilestones([]);
		} else {
			setMilestones(milestonesData);
		}

		return;
	}, []);

	return (
		<div style={{ width: "100%" }}>
			<EstimationPageHeader
				handleChangeTab={handleChangeTab}
			></EstimationPageHeader>
			<MilestonesTimeline
				milestones={milestones}
				skills={skills}
				handleChangeTab={handleChangeTab}
			></MilestonesTimeline>
		</div>
	);
}

export default EstimationPage;
