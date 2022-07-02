import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {CrimeStatistics, RawCrimeData} from "../models";
import { zip } from "../utils";
import "../styles/diagrams.css";

interface Props {
    chartData: (RawCrimeData | CrimeStatistics)[];
    years: number[];
}

const LineGraph = (props: Props) => {
    const { chartData, years } = props;
    const lineChartRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (lineChartRef.current) {
            const container = lineChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            lineChartRef.current.chart.reflow();
        }
    }, []);

    // @ts-ignore
    if (chartData.includes(undefined)) {
        return null;
    }

    const someFunction = (): Highcharts.SeriesOptionsType[] => {
        if (years.length < 4) {
            return ([
                {
                    name: "Total Cases",
                    type: "spline",
                    data: zip(years, chartData.map(element => Object.values(element)
                        .reduce((accumulator, cases) => accumulator + parseInt(cases), 0))),
                },
            ]);
        }
        return ([
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
        ]);
    };

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
        series: someFunction(),
    }

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