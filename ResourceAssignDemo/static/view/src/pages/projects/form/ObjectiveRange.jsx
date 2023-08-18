import { Field, RangeField } from "@atlaskit/form";
import { Grid, GridColumn } from "@atlaskit/page";
import Range from "@atlaskit/range";
import TextField from "@atlaskit/textfield";
import React from "react";

function ObjectiveRange({ name, label, value, onChange, rangeOnChange }) {
  const columns = 10;

  return (
    <Grid spacing="cosy" columns={columns}>
      <GridColumn medium={8}>
        <RangeField
          name={`Range-${name}`}
          defaultValue={50}
          label={label}
        >
          {() => <Range min={0} max={100} value={value} onChange={rangeOnChange} step={1}/>}
        </RangeField>
      </GridColumn>
      <GridColumn medium={2}>
        <Field aria-required={true} name={name} label=" ">
          {() => <TextField autoComplete="off" value={value} onChange={onChange} type="number" min="0"/>}
        </Field>
      </GridColumn>
    </Grid>
  );
}

export default ObjectiveRange;
