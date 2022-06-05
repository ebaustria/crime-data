import { Slider } from "@mui/material";
import "../styles/components.css";

interface Props {
    selectedStrings: number[] | number;
    onChange: (event: Event, value: number[] | number, activeThumb: number) => void;
}

const YearSlider = (props: Props) => {
    const { selectedStrings, onChange } = props;

    return (
        <Slider
            className="year-slider"
            getAriaLabel={() => 'Years'}
            disableSwap
            value={selectedStrings}
            onChange={onChange}
            min={2016}
            max={2020}
            step={1}
            marks={[
                {value: 2016, label: 2016},
                {value: 2017, label: 2017},
                {value: 2018, label: 2018},
                {value: 2019, label: 2019},
                {value: 2020, label: 2020}
            ]}
        />
    );
};

export default YearSlider;