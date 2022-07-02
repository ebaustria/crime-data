import { Slider } from "@mui/material";
import "../styles/components.css";

interface Props {
    min: number;
    max: number;
    selectedStrings: number[] | number;
    onChange: (event: Event, value: number[] | number, activeThumb: number) => void;
}

const YearSlider = (props: Props) => {
    const { selectedStrings, onChange, min, max } = props;

    const getMarks = () => {
        const marks = [];
        for (let i = min; i <= max; i++) {
            marks.push({value: i, label: i});
        }
        return marks;
    }

    return (
        <Slider
            className="year-slider"
            getAriaLabel={() => 'Years'}
            disableSwap
            value={selectedStrings}
            onChange={onChange}
            min={min}
            max={max}
            step={1}
            marks={getMarks()}
        />
    );
};

export default YearSlider;