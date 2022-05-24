import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { SelectMenuData } from "../models";
import { ReactNode } from "react";

interface Props {
    values: SelectMenuData[];
    onChange: (event: SelectChangeEvent, child: ReactNode) => void;
}

const StatisticSelect = (props: Props) => {
    const { values, onChange } = props;
    return (
        <Select className="select" defaultValue={values[0].value} onChange={onChange}>
            {values.map(val => {
                return (
                    <MenuItem value={val.value}>
                        {val.label}
                    </MenuItem>
                );
            })}
        </Select>
    );
};

export default StatisticSelect;