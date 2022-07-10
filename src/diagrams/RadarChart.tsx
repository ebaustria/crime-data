import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {CrimeStatistics, RawCrimeData} from "../models";
import { zip } from "../utils";
import "../styles/diagrams.css";

interface Props {
    chartData: (RawCrimeData | CrimeStatistics)[];
}

const RadarChart = (props: Props) => {
    const { chartData } = props;
    const radarChartRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        if (radarChartRef.current) {
            const container = radarChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            radarChartRef.current.chart.reflow();
        }
    }, []);

    // @ts-ignore
    if (chartData.includes(undefined)) {
        return null;
    }

    const options: Highcharts.Options = {
        chart: {
            polar: true
        },

        title: {
            text: 'Highcharts Polar Chart'
        },

        subtitle: {
            text: 'Also known as Radar Chart'
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        xAxis: {
            tickInterval: 45,
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
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [{
            type: 'column',
            name: 'Column',
            data: [8, 7, 6, 5, 4, 3, 2, 1],
            pointPlacement: 'between'
        }, {
            type: 'line',
            name: 'Line',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }, {
            type: 'area',
            name: 'Area',
            data: [1, 8, 2, 7, 3, 6, 4, 5]
        }]
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