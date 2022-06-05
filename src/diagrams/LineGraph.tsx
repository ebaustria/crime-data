import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeStatistics } from "../models";
import { zip } from "../utils";
import "../styles/diagrams.css";

interface Props {
    chartData: CrimeStatistics[];
    years: number[];
}

const LineGraph = (props: Props) => {
    const { chartData, years } = props;
    const lineChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: "spline",
            zoomType: "xy"
        },
        title: {
            text: "Crime Data by Category, 2016-2020",
            style: { fontSize: "20" },
        },
        yAxis: {
            title: {
                text: "Occurrences",
            },
        },
        series: [
            {
                name: "Total Cases",
                type: "spline",
                data: zip(years, chartData.map(element => parseInt(element.totalCases)))
            },
            {
                name: "Solved Cases",
                type: "spline",
                data: zip(years, chartData.map(element => parseInt(element.solvedCases)))
            },
            {
                name: "Suspects",
                type: "spline",
                data: zip(years, chartData.map(element => parseInt(element.suspects)))
            }
        ],
    }

    useEffect(() => {
        if (lineChartRef.current) {
            const container = lineChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            lineChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={lineChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default LineGraph;