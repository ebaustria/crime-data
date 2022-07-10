import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { zip } from "../utils";
import "../styles/diagrams.css";
import {blueGreen} from "../models/colors";

interface Props {
    year: number;
    chartData: any;
}

const RadarChart = (props: Props) => {
    const { chartData, year } = props;
    const radarChartRef = useRef<HighchartsReact.RefObject>(null);
    const chart_data: any = {
        categories: [],
        data: []
    };

    if (chartData !== undefined) {
        chartData[year].forEach((element: any) => {
            chart_data.categories.push(element['Straftat']);
            chart_data.data.push(
                {
                    y: parseInt(element['Anzahl erfasster Fälle']),
                }
            );
        });
    }

    useEffect(() => {
        if (radarChartRef.current) {
            const container = radarChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            radarChartRef.current.chart.reflow();
        }
    }, []);

    const options: Highcharts.Options = {
        chart: {
            polar: true,
            zoomType: "xy",
        },

        title: {
            text: `Crime by Category, ${year}`
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        xAxis: {
            // categories: chart_data.categories,
            tickInterval: 36,
            min: 0,
            max: 360,
            labels: {
                format: '{value}°'
            }
        },

        yAxis: {
            min: 0
        },

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 36,
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [
            {
                type: 'column',
                name: 'Column',
                data: chart_data.data,
                color: blueGreen,
            },
        ],
    }

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={radarChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

// ------------------------------------------------

// let getStaticBarChart = function() {
//     let static_bar_chart_index = -1;
//
//     Highcharts.charts.forEach((chart, index) => {
//         if (chart !== undefined) {
//             let container: any = chart?.container;
//             while (!container?.classList.contains('chart-container')) container = container.parentNode;
//             if (container.classList.contains('static-bar-chart')) static_bar_chart_index = index;
//
//         }
//     });
//     if (static_bar_chart_index === -1) return null;
//     return Highcharts.charts[static_bar_chart_index];
// }
//
// let highlightFunction = function (point: any) {
//     const clicked_category = point.category;
//     const static_bar_chart = getStaticBarChart();
//
//     static_bar_chart?.series.forEach((series) => {
//         if (series.name == clicked_category) {
//             series.points.forEach(point => {
//                 point.setState('hover');
//             });
//         } else {
//             series.points.forEach(point => {
//                 point.setState('inactive');
//             });
//         }
//     });
// }
//
// let hideFunction = function () {
//     const static_bar_chart = getStaticBarChart();
//
//     static_bar_chart?.series.forEach(series => {
//         series.points.forEach(point => {
//             point.setState('normal');
//         });
//     });
// }

export default RadarChart;