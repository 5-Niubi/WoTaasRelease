import Button from "@atlaskit/button";
import { TimePicker } from "@atlaskit/datetime-picker";
import {
	ErrorMessage,
	Field,
	FormSection,
	HelperMessage,
	Label,
} from "@atlaskit/form";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import { Grid, GridColumn } from "@atlaskit/page";
import React, { Fragment, useEffect, useState } from "react";
import { milisecondToHours, parseForTimeOnly } from "../../../common/utils";
import { TIME_SELECTBOX_VALUE } from "../../../common/contants";
import { SlideIn } from "@atlaskit/motion";

const columns = 9;

function WorkingTimeHours({
	timeRangeValueState,
	isDisable = false,
	label = "",
	onSetBaseWorkingHours,
}) {
	const [error, setError] = useState("");
	const RemoveButton = ({ index }) => (
		<Button
			iconBefore={<CrossIcon label="remove" />}
			appearance="subtle"
			onClick={() => handleRemoveBtnClick(index)}
			isDisabled={isDisable}
			shouldFitContainer
		></Button>
	);
	const AddButton = () => (
		<Button
			iconBefore={<AddCircleIcon label="add" />}
			appearance="subtle"
			onClick={handleAddBtnClick}
			isDisabled={isDisable}
			shouldFitContainer
		></Button>
	);

	const FieldTimeInput = ({ actionButton, timeRange, index, ...props }) => (
		<div style={{ marginBottom: "0.5em" }} {...props}>
			<Grid columns={columns} layout="fluid" spacing="compact">
				<GridColumn medium={1}>{actionButton}</GridColumn>
				<GridColumn medium={4}>
					<TimePicker
						value={timeRange.start}
						onChange={(e) => {
							setTimeRangeStart(e, index);
						}}
						isDisabled={isDisable}
						times={TIME_SELECTBOX_VALUE}
					/>
				</GridColumn>
				<GridColumn medium={4}>
					<TimePicker
						value={timeRange.finish}
						onChange={(e) => {
							setTimeRangeFinish(e, index);
						}}
						isDisabled={isDisable}
						times={TIME_SELECTBOX_VALUE}
					/>
				</GridColumn>
			</Grid>
		</div>
	);

	function setTimeRangeStart(e, index) {
		const newItems = [...timeRangeValues];
		newItems[index] = { start: e, finish: newItems[index].finish };
		setTimeRangeValues(newItems);
	}

	function setTimeRangeFinish(e, index) {
		const newItems = [...timeRangeValues];
		newItems[index] = { start: newItems[index].start, finish: e };
		setTimeRangeValues(newItems);
	}

	const [timeRangeValues, setTimeRangeValues] = timeRangeValueState;

	useEffect(() => {
		setError("");
		let baseWkingHrs = 0;
		for (let i = 0; i < timeRangeValues.length; i++) {
			let timeRange = timeRangeValues[i];
			let start = parseForTimeOnly(timeRange.start);
			let finish = parseForTimeOnly(timeRange.finish);
			if (
				i > 0 &&
				start.isBefore(parseForTimeOnly(timeRangeValues[i - 1].finish))
			) {
				setError("Start time and finish time of two range value is overlap");
			} else if (start.isSame(finish)) {
				setError("Start time and finish time are the same value");
			} else if (start.isAfter(finish)) {
				setError("Start time is later than finish time ");
			} else baseWkingHrs += milisecondToHours(finish.diff(start));
		}
		onSetBaseWorkingHours(baseWkingHrs);
	}, [timeRangeValues]);

	function handleAddBtnClick() {
		let lastTimeRange = timeRangeValues[timeRangeValues.length - 1];
		let newTime = {
			start: lastTimeRange.finish,
			finish: lastTimeRange.finish,
		};
		setTimeRangeValues((prev) => [...prev, newTime]);
	}

	function handleRemoveBtnClick(index) {
		let newItems = [...timeRangeValues];
		newItems.splice(index, 1);

		setTimeRangeValues(newItems);
	}

	return (
		<Fragment>
			<Label htmlFor="">{label}</Label>
			{timeRangeValues.map((element, index) => {
				let actionButton = <RemoveButton index={index} />;
				if (index == timeRangeValues.length - 1) {
					actionButton = <AddButton />;
				}

				return (
					<SlideIn enterFrom={"bottom"} fade={"in"}>
						{(props) => (
							<FieldTimeInput
								actionButton={actionButton}
								timeRange={element}
								index={index}
								{...props}
							/>
						)}
					</SlideIn>
				);
			})}
			{!!error.length && <ErrorMessage>{error}</ErrorMessage>}
		</Fragment>
	);
}

export default WorkingTimeHours;
