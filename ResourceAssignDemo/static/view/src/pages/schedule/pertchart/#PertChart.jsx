import React, { useEffect, useRef } from "react";
import * as go from "gojs";
import "gojs/extensions/DrawCommandHandler";
import "gojs/extensions/Figures";
import "gojs/extensions/GeometryReshapingTool";
import { duration } from "moment";

const PertChart1 = ({ updateCurrentTask }) => {
	const diagramRef = useRef(null);

	// colors used, named for easier identification
	var blue = "#0288D1";
	var pink = "#B71C1C";
	var pinkfill = "#F8BBD0";
	var bluefill = "#B3E5FC";

	useEffect(() => {
		const $ = go.GraphObject.make;

		const diagram = $(go.Diagram, diagramRef.current);
		diagram.initialContentAlignment = go.Spot.Center;
		diagram.layout = $(go.LayeredDigraphLayout, {
			isOngoing: false,
			layerSpacing: 100,
		});
		diagram.nodeTemplate = createNodeTemplate();
		diagram.linkTemplate = createLinkTemplate();
		diagram.model = createDiagramModel();

		// Perform any additional initialization or configuration here

		return () => {
			// Perform any necessary cleanup here
			diagram.div = null;
		};
	}, []);

	function createNodeTemplate() {
		const $ = go.GraphObject.make;
		return $(
			go.Node,
			"Auto",
			{
				desiredSize: new go.Size(150, NaN),
			}, // on Panel
			$(
				go.Shape,
				"RoundedRectangle",
				{ fill: "white", strokeWidth: 2 },
				new go.Binding("fill", "critical", (b) =>
					b ? pinkfill : bluefill
				),
				new go.Binding("stroke", "critical", (b) => (b ? pink : blue))
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
				$(go.TextBlock, {
					row: 0,
					column: 0,
					margin: 5,
					textAlign: "center",
				},
				new go.Binding("text", "duration", (duration) => "Duration: "+ duration)),

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
			{
				click: (e, obj) => {
					updateCurrentTask(obj.part.data);
				},
				// selectionChanged: (part) => {
				// 	// var shape = part.elt(0);
				// 	// shape.stroke = part.isSelected ? "blue" : (part.data.critical ? pink : blue);
				//     updateCurrentTask(part.data);
				// },
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
		return $(
			go.Link,
			{
				routing: go.Link.Orthogonal,
				corner: 5,
				toShortLength: 6,
				toEndSegmentLength: 20,
			},
			$(
				go.Shape,
				{ strokeWidth: 4 },
				new go.Binding("stroke", "", linkColorConverter)
			),
			$(
				go.Shape, // arrowhead
				{ toArrow: "Triangle", stroke: null, scale: 1.5 },
				new go.Binding("fill", "", linkColorConverter)
			)
		);
	}

	function createDiagramModel() {
		const $ = go.GraphObject.make;
		return $(go.GraphLinksModel, {
			nodeDataArray: [
				{
					key: 1,
					name: "Start",
					duration: 0,
					critical: true,
				},
				{
					key: 2,
					name: "Task 1",
					duration: 4,
					critical: true,
				},
				{
					key: 3,
					name: "Task 2",
					duration: 5.33,
					critical: false,
				},
				{
					key: 4,
					name: "Task 3 siêuuuuuuuuuuuuuuuuu dàiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
					duration: 5.17,
					critical: true,
				},
				{
					key: 5,
					name: "Task 4",
					duration: 6.33,
					critical: false,
				},
				{
					key: 6,
					name: "Task 5",
					duration: 5.17,
					critical: true,
				},
				{
					key: 7,
					name: "Task 6",
					duration: 4.5,
					critical: false,
				},
				{
					key: 8,
					name: "Task 7",
					duration: 5.17,
					critical: true,
				},
				{
					key: 9,
					name: "Finish",
					duration: 0,
					critical: true,
				},
				{
					key: 10,
					name: "Task 8",
					duration: 0,
					critical: true,
				},
			],
			linkDataArray: [
				{ from: 1, to: 2 },
				{ from: 1, to: 3 },
				{ from: 1, to: 10 },
				{ from: 2, to: 4 },
				{ from: 4, to: 5 },
				{ from: 3, to: 6 },
				{ from: 4, to: 6 },
				{ from: 5, to: 7 },
				{ from: 6, to: 8 },
				{ from: 7, to: 9 },
				{ from: 8, to: 9 },
				{ from: 10, to: 9 },
			],
		});
	}

	return (
		<div
			ref={diagramRef}
			className="diagram-component"
			style={{ height: "40vh", width: "100%" }}
		></div>
	);
};

export default PertChart1;
