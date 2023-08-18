import React, { Component, useState } from "react";
import { Label } from "@atlaskit/form";
import CreatableSelect from "react-select/creatable";
import { formatText } from "../../common/utils";

const createOption = (label) => ({
    id: null,
	label: formatText(label),
	value: formatText(label),
    level: 1
});

export default function CreatableAdvanced({
	defaultOptions,
	selectedValue,
	onSelectedValue,
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState(defaultOptions);
	const [value, setValue] = useState(selectedValue??[]);

	const handleChange = (newValue, actionMeta) => {
		console.group("Value Changed");
		console.log(newValue);
		console.log(`action: ${actionMeta.action}`);
		console.groupEnd();
		setValue(newValue);
        onSelectedValue({ newOption: null, selectedValue: newValue });
	};

	const handleCreate = (inputValue) => {
		setIsLoading(true);
		const newOption = createOption(inputValue);
		console.groupEnd();
		const optionExists = options.some(
			(option) => formatText(option.value) === formatText(newOption.value)
		);
		if (!optionExists) {
			setOptions([...options, newOption]);
		}
		setValue((prevValue) => [...prevValue, newOption]);
		setIsLoading(false);

        onSelectedValue({ newOption, selectedValue: [...value, newOption] });
	};

	return (
		<>
			<CreatableSelect
				inputId="createable-select-example"
				isClearable
				isDisabled={isLoading}
				isLoading={isLoading}
				onChange={handleChange}
				onCreateOption={handleCreate}
				options={options}
				value={value}
				isMulti
			/>
		</>
	);
}
