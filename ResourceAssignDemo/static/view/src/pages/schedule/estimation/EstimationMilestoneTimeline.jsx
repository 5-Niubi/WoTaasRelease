import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import FlagFilledIcon from "@atlaskit/icon/glyph/flag-filled";
import PeopleGroupIcon from "@atlaskit/icon/glyph/people-group";
import TrayIcon from "@atlaskit/icon/glyph/tray";
import { findObj, getCache, getColor } from "../../../common/utils";
import Lozenge from "@atlaskit/lozenge";
import { COLOR_SKILL_LEVEL } from "../../../common/contants";
import { PiStarFill } from "react-icons/pi";

export default function MilestonesTimeline({
	milestones,
	skills,
	handleChangeTab,
}) {
	var estimation = getCache("estimation");
	if (estimation) {
		estimation = JSON.parse(estimation);
	} else {
		handleChangeTab(0);
		return "";
	}

	return (
		<>
			<VerticalTimeline lineColor="#172B4D">
				{estimation.workforceWithMilestoneList?.map(
					(milestone, index) => {
						let obj = findObj(milestones, milestone.id);
						if (obj) {
							return (
								<VerticalTimelineElement
									className="vertical-timeline-element--work"
									contentStyle={{
										background: getColor(milestone.id),
										color: "#444",
									}}
									contentArrowStyle={{
										borderRight:
											"7px solid " +
											getColor(milestone.id),
									}}
									iconStyle={{
										background: getColor(milestone.id),
										color: "black",
										paddingRight: "10",
									}}
								>
									<h3 className="vertical-timeline-element-title">
										#Group {index + 1}{" "}
										<FlagFilledIcon size="medium"></FlagFilledIcon>
									</h3>
									<h4 className="vertical-timeline-element-subtitle">
										{obj.name}
									</h4>
									{milestone?.workforceOutputList?.map(
										(workers, index) => {
											let skills = [];
											workers.skillOutputList?.forEach(
												(skill) =>
													skills.push(
														skill.name +
															" level " +
															skill.level
													)
											);
											return (
												<p>
													<PeopleGroupIcon></PeopleGroupIcon>{" "}
													{workers.quantity} workers
													with skills set:{" "}
													{workers.skillOutputList?.map(
														(skill, index) => (
															<Lozenge
																key={index}
																style={{
																	marginLeft:
																		"8px",
																	backgroundColor:
																		COLOR_SKILL_LEVEL[
																			skill.level -
																				1
																		].color,
																	color:
																		skill.level ===
																		1
																			? "#091e42"
																			: "white",
																}}
																isBold
															>
																{skill.name} -{" "}
																{skill.level}
																<PiStarFill />
															</Lozenge>
														)
													)}
												</p>
											);
										}
									)}
								</VerticalTimelineElement>
							);
						}
					}
				)}
			</VerticalTimeline>
		</>
	);
}
