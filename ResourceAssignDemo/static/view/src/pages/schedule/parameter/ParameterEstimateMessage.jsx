import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import SectionMessage from "@atlaskit/section-message";
import { invoke } from "@forge/bridge";
import __noop from "@atlaskit/ds-lib/noop";
import StarFilledIcon from "@atlaskit/icon/glyph/star-filled";
import Lozenge from "@atlaskit/lozenge";
import { COLOR_SKILL_LEVEL } from "../../../common/contants";
import { PiStarFill } from "react-icons/pi";
import { findObj, getCache } from "../../../common/utils";
import Toastify from "../../../common/Toastify";
import Spinner from "@atlaskit/spinner";
import InstructionMessage from "../../../components/InstructionMessage";
import PageHeader from '@atlaskit/page-header';
import InfoMessageColor from "../../../components/InfoMessageColor";

export default function ParameterEstimateMessage() {
	const [estimations, setEstimations] = useState([]);
	let { projectId } = useParams();
	const [isEstimating, setIsEstimating] = useState(true);

	useEffect(function () {
		invoke("getEstimateOverallWorkforce", { projectId })
			.then(function (res) {
				setIsEstimating(false);
				setEstimations(res);
				console.log("Get All Estimation", estimations);
			})
			.catch(function (error) {
				setIsEstimating(false);
				console.log(error);
				Toastify.error(error.toString());
			});
	}, []);

	return (
		<>
			<PageHeader disableTitleStyles={true}>
                <div style={{display: "inline-flex"}}>
                    <h2>Resource Suggestions</h2>
                    <div style={{marginLeft: 5}}>
                        <InfoMessageColor/>
                    </div>
                </div>
			</PageHeader>
			{isEstimating ? (
				<Spinner size={"large"} />
			) : (
				<div>
					<ul>
						{estimations?.workforceWithMilestoneList?.map(
							(workforceWithMilestone) =>
								workforceWithMilestone?.workforceOutputList
									?.filter(
										(s) =>
											s.skillOutputList != null &&
											s.skillOutputList.length > 0
									)
									?.map((workers) => {
										let skills = [];
										workers.skillOutputList?.forEach(
											(skill) =>
												skills.push(
													skill.name +
														" level " +
														skill.level
												)
										);
										console.log("workers", workers);
										return (
											<>
												<li>
													{workers.quantity} workers
													with skills set
													{workers.skillOutputList?.map(
														(skill, i) => (
															<span
																style={{
																	marginRight:
																		"2px",
																	marginLeft:
																		"8px",
																}}
															>
																<Lozenge
																	key={i}
																	style={{
																		backgroundColor:
																			COLOR_SKILL_LEVEL[
																				skill.level -
																					1
																			]
																				.color,
																		color:
																			skill.level ===
																			1
																				? "#091e42"
																				: "white",
																	}}
																	isBold
																>
																	{skill.name}{" "}
																	-{" "}
																	{
																		skill.level
																	}
																	<PiStarFill />
																</Lozenge>
															</span>
														)
													)}
												</li>
											</>
										);
									})
						)}
					</ul>
				</div>
			)}
		</>
	);
}
