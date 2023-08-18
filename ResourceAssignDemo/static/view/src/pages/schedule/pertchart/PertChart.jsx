import React, { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import "gojs/extensions/DrawCommandHandler";
import "gojs/extensions/Figures";
import "gojs/extensions/GeometryReshapingTool";
import { findObj, getColor } from "../../../common/utils";
import ChevronUpCircleIcon from "@atlaskit/icon/glyph/chevron-up-circle";
import ChevronDownCircleIcon from "@atlaskit/icon/glyph/chevron-down-circle";

const PertChart = ({
	tasks,
	milestones,
	selectedTaskIds,
	currentTaskId,
	updateCurrentTaskId,
	updateTasks,
	updateCanEstimate,
}) => {
	const diagramRef = useRef(null);

	// colors used, named for easier identification
	var blue = "#0288D1";
	var pink = "#B71C1C";
	var pinkfill = "#F8BBD0";
	var bluefill = "#B3E5FC";

	var selectedTasks = [];
	//get selected tasks
	// selectedTaskIds?.forEach((id) => {
	// 	var task = findObj(tasks, id);
	// 	if (task) selectedTasks.push(task);
	// });
	// console.log(selectedTasks);

	//-------
	//add all task to selected
	selectedTasks = JSON.parse(JSON.stringify(tasks));

	//add dummy tasks to the task list
	selectedTasks.unshift({
		id: -1,
		name: "Start",
		duration: 0,
		milestoneId: 0,
		precedences: [],
		skillRequireds: [],
	});
	selectedTasks.push({
		id: -2,
		name: "Finish",
		duration: 0,
		milestoneId: 0,
		precedences: [],
		skillRequireds: [],
	});

	useEffect(() => {
		const $ = go.GraphObject.make;

		//init diagram and initial settings
		const diagram = $(go.Diagram, diagramRef.current, {
			// "draggingTool.dragsLink": true,
			"linkingTool.portGravity": 20,
			"relinkingTool.portGravity": 20,
			"relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
				segmentIndex: 0,
				cursor: "pointer",
				desiredSize: new go.Size(8, 8),
				fill: "tomato",
				stroke: "darkred",
			}),
			"relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
				segmentIndex: -1,
				cursor: "pointer",
				desiredSize: new go.Size(8, 8),
				fill: "darkred",
				stroke: "tomato",
			}),
			"linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
				desiredSize: new go.Size(7, 7),
				fill: "lightblue",
				stroke: "deepskyblue",
			}),
			"undoManager.isEnabled": true,
			"animationManager.isEnabled": false
		});

		// to make diagram span over screen
		diagram.layout = $(go.LayeredDigraphLayout, {
			isOngoing: false,
			layerSpacing: 100,
		});

		diagram.nodeTemplate = createNodeTemplate();
		diagram.linkTemplate = createLinkTemplate();
		diagram.model = createDiagramModel(selectedTasks);

		//event listener
		diagram.addDiagramListener("LinkDrawn", (e) => {
			var link = e.subject;
			var fromNode = link.fromNode;
			var toNode = link.toNode;
			// console.log(fromNode.ub);
			// console.log(toNode.ub);
			// console.log(diagram.model.linkDataArray);

			var toTask = findObj(tasks, toNode.ub.id);
			if (toTask) {
				var existed = false;
				toTask.precedences?.forEach((pre) => {
					if (pre.precedenceId == fromNode.ub.id) {
						return (existed = true);
					}
				});
				if (!existed) {
					toTask.precedences?.push({
						taskId: toTask.id,
						precedenceId: fromNode.ub.id,
					});
					updateCurrentTaskId(toTask.id);
					// updateTasks(tasks);
					updateCanEstimate(false);
				}
			}
		});

		diagram.addModelChangedListener((e) => {
			if (
				e.change === go.ChangedEvent.Remove &&
				e.propertyName === "linkDataArray"
			) {
				// console.log(tasks);
				// console.log(selectedTasks);
				var linkData = e.oldValue;
				var fromNode = diagram.findNodeForKey(linkData.from);
				var toNode = diagram.findNodeForKey(linkData.to);

				// console.log("Deleted link from node:", fromNode.data);
				// console.log("Deleted link to node:", toNode.data);
				var toTask = findObj(tasks, toNode.data.id);
				if (toTask) {
					// const index = toTask.precedences?.indexOf({
					// 	taskId: toTask,
					// 	precedenceId: fromNode.data.id,
					// });

					var index = -1;
					toTask.precedences?.forEach((pre, i) => {
						if (pre.precedenceId === fromNode.data.id) {
							index = i;
							return;
						}
					});
					if (index > -1) {
						// only splice array when item is found
						toTask.precedences.splice(index, 1); // 2nd parameter means remove one item only
						// updateTasks(tasks);
						updateCurrentTaskId(toTask.id);
						updateCanEstimate(false);
					}
				}
			}
		});

		diagram.addDiagramListener("Modified", (e) => {
			// console.log(e);
			// var button = document.getElementById("SaveButton");
			// if (button) button.disabled = !diagram.isModified;
			// var idx = document.title.indexOf("*");
			// if (diagram.isModified) {
			// 	if (idx < 0) document.title += "*";
			// } else {
			// 	if (idx >= 0) document.title = document.title.slice(0, idx);
			// }
		});

		// this event handler is called when the diagram is first ready
		diagram.addDiagramListener("InitialLayoutCompleted", (e) => {
			// pick a random node data
			var data = null;
			diagram.model.nodeDataArray.forEach((node) => {
				if (node.key == currentTaskId){
					data = node;
				}
			});
			// find the corresponding Node
			var node = diagram.findNodeForData(data);
			// and center it and select it
			if (node) {
				diagram.centerRect(node.actualBounds);
				diagram.select(node);
			}
		});

		// Perform any additional initialization or configuration here

		return () => {
			// Perform any necessary cleanup here
			diagram.div = null;
		};
	}, [selectedTasks]); //call useEffect each time selectedTasks changed

	// Define a function for creating a "port" that is normally transparent.
	// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
	// and where the port is positioned on the node, and the boolean "output" and "input" arguments
	// control whether the user can draw links from or to the port.
	function makePort(name, spot, output, input) {
		const $ = go.GraphObject.make;
		// the port is basically just a small transparent circle
		return $(go.Shape, "Circle", {
			fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
			stroke: null,
			desiredSize: new go.Size(7, 7),
			alignment: spot, // align the port on the main Shape
			alignmentFocus: spot, // just inside the Shape
			portId: name, // declare this object to be a "port"
			fromSpot: spot,
			toSpot: spot, // declare where links may connect at this port
			fromLinkable: output,
			toLinkable: input, // declare whether the user may draw links to/from here
			cursor: "pointer", // show a different cursor to indicate potential link point
		});
	}

	function showSmallPorts(node, show) {
		node.ports.each((port) => {
			if (port.portId !== "") {
				// don't change the default port, which is the big shape
				port.fill = show ? "rgba(0,0,0,.3)" : null;
			}
		});
	}

	function createNodeTemplate() {
		const $ = go.GraphObject.make;

		var nodeSelectionAdornmentTemplate = $(
			go.Adornment,
			"Auto",
			$(go.Shape, {
				fill: null,
				stroke: "deepskyblue",
				strokeWidth: 1.5,
				strokeDashArray: [4, 2],
			}),
			$(go.Placeholder)
		);

		return $(
			go.Node,
			"Auto",
			{
				desiredSize: new go.Size(150, NaN),
			},
			{
				deletable: false,
				selectable: true,
				selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
			},
			$(
				go.Shape,
				"RoundedRectangle",
				{ fill: "white", strokeWidth: 2 },
				// new go.Binding("fill", "critical", (b) =>(b ? pinkfill : bluefill)),
				// new go.Binding("stroke", "critical", (b) => (b ? pink : blue)),
				new go.Binding("fill", "milestoneId", (id) => {
					let color = "#fff";
					for (let i = 0; i < milestones.length; i++) {
						if (milestones[i].id == id) {
							color = getColor(milestones[i].id);
							break;
						}
					}
					return color;
				})
			),
			$(
				go.Panel,
				"Table",
				{
					padding: 0.5,
					desiredSize: new go.Size(150, NaN),
				},
				$(go.RowColumnDefinition, {
					row: 0,
					separatorStroke: "black",
				}),
				$(go.RowColumnDefinition, {
					row: 1,
					separatorStroke: "black",
					background: "white",
				}),
				$(
					go.TextBlock,
					{
						row: 0,
						column: 0,
						margin: 5,
						textAlign: "center",
					},
					new go.Binding(
						"text",
						"duration",
						(duration) => "Duration: " + duration
					)
				),

				$(go.TextBlock, new go.Binding("text", "name"), {
					row: 1,
					column: 0,
					margin: 5,
					textAlign: "center",
					font: "bold 14px sans-serif",
					maxSize: new go.Size(150, NaN), // Maximum width for truncation
					overflow: go.TextBlock.OverflowEllipsis, // Truncate overflowing text
					maxLines: 1, // Restrict to a single line
				})
			), // end Table Panel
			// four small named ports, one on each side:
			makePort("T", go.Spot.Top, false, true),
			makePort("L", go.Spot.Left, true, true),
			makePort("R", go.Spot.Right, true, true),
			makePort("B", go.Spot.Bottom, true, false),
			{
				// handle mouse enter/leave events to show/hide the ports
				mouseEnter: (e, node) => showSmallPorts(node, true),
				mouseLeave: (e, node) => showSmallPorts(node, false),
				click: (e, obj) => {
					// var data = obj.part.data;
					// var task = findObj(tasks, data.id);
					// if (task) {
					updateCurrentTaskId(obj.part.data.id);
					// }

					var shape = obj.part.elt(0);
					let color = blue;
					for (let i = 0; i < milestones.length; i++) {
						if (milestones[i].id == obj.part.data.id) {
							color = getColor(milestones[i].id);
							break;
						}
					}
					shape.stroke = color;
					shape.strokeWidth = 3;
				},
				selectionChanged: (part) => {
					var shape = part.elt(0);
					let color = blue;
					for (let i = 0; i < milestones.length; i++) {
						if (milestones[i].id == part.data.id) {
							color = getColor(milestones[i].id);
							break;
						}
					}
					shape.stroke = color;
					// updateCurrentTask(part.data);
				},
			}
		);
	}

	function linkColorConverter(linkdata, elt) {
		var link = elt.part;
		if (!link) return blue;
		var f = link.fromNode;
		if (!f || !f.data || !f.data.critical) return blue;
		var t = link.toNode;
		if (!t || !t.data || !t.data.critical) return blue;
		return pink; // when both Link.fromNode.data.critical and Link.toNode.data.critical
	}

	function createLinkTemplate() {
		const $ = go.GraphObject.make;

		var linkSelectionAdornmentTemplate = $(
			go.Adornment,
			"Link",
			$(
				go.Shape,
				// isPanelMain declares that this Shape shares the Link.geometry
				{
					isPanelMain: true,
					fill: null,
					stroke: "deepskyblue",
					strokeWidth: 0,
				}
			) // use selection object's strokeWidth
		);

		return $(
			go.Link,
			{
				selectable: true,
				selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
			},
			{ relinkableFrom: true, relinkableTo: true, reshapable: true },
			{
				routing: go.Link.AvoidsNodes,
				curve: go.Link.JumpOver,
				corner: 5,
				toShortLength: 4,
			},
			$(
				go.Shape, // the link path shape
				{ strokeWidth: 4 },
				new go.Binding("stroke", "", linkColorConverter)
			),
			$(
				go.Shape, // the arrowhead
				{ toArrow: "Triangle", stroke: null, scale: 1.5 },
				new go.Binding("fill", "", linkColorConverter)
			)
		);
	}

	function createDiagramModel(tasks) {
		const $ = go.GraphObject.make;
		// generate key for each node using its id
		tasks?.forEach((task) => (task.key = task.id));

		//get all link from precedence tasks pre-defined
		var links = [];
		tasks?.forEach((task) =>
			task.precedences?.forEach((pre) => {
				findObj(tasks, pre.precedenceId)
					? links.push({ from: pre.precedenceId, to: task.id })
					: null;
			})
		);

		//create link to dummy tasks
		tasks.forEach((task) => {
			if (
				task.precedences.length == 0 &&
				task.id != -1 &&
				task.id != -2
			) {
				links.push({ from: -1, to: task.id });
			}
			task.precedences?.forEach((pre) => {
				var preObj = findObj(tasks, pre.precedenceId);
				if (preObj){
					preObj.isNotEnd = true;
				}
			});
		});
		tasks.forEach((task) => {
			if (!task.isNotEnd && task.id != -1 && task.id != -2) {
				links.push({ from: task.id, to: -2 });
			}
		});

		return $(go.GraphLinksModel, {
			nodeDataArray: tasks,
			linkDataArray: links,
		});
	}

	const [chartExpanded, setChartExpanded] = useState(false);
	const handleExpandChart = () => {
		document
			.getElementsByClassName("pert-chart")[0]
			.classList.toggle("-expanded");
		setChartExpanded(
			document
				.getElementsByClassName("pert-chart")[0]
				.classList.contains("-expanded")
		);
	};

	return (
		<div className="pert-chart">
			<div ref={diagramRef} className="diagram-component"></div>
			<div
				className="expand-button"
				onClick={handleExpandChart}
			>
				{chartExpanded ? (
					<ChevronUpCircleIcon />
				) : (
					<ChevronDownCircleIcon />
				)}
			</div>
		</div>
	);
};

export default PertChart;
