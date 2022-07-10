import React, { useEffect, useRef } from "react";
import Highcharts, { chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";
import { CrimeCategoryColors } from "../models/colors"
import {getColumnChart, getRadarChart} from "../utils/charts";

interface Props {
    year: number;
    chartData: any;
}     

const PieChart = (props: Props) => {
    const { year, chartData } = props;
    const PieChartRef = useRef<HighchartsReact.RefObject>(null);
    var chart_data: any = [];

    if (chartData != undefined) {
        chartData[year].forEach((element: any) => {
            chart_data.push({
                y: parseInt(element['Anzahl erfasster Fälle']),
                name: element['Straftat'],
                color: CrimeCategoryColors[element['Straftat']]
            });
        });
    }

    const options: Highcharts.Options = {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Pie Chart Title'
        },
        
        tooltip: {        
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y} cases</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: [{
            name: "2015",
            data: chart_data,
            type: 'pie',

            point: {
                events: {
                  mouseOver(e) {
                    highlightFunction(this);
                  },
                  mouseOut() {
                    hideFunction()
                  }
                }
            }
              
            }]
    }

    useEffect(() => {
        if (PieChartRef.current) {
            const container = PieChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            PieChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container pie-chart">
            <HighchartsReact
                ref={PieChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

// ---------------------------------------------------

let highlightFunction = function(point: any) {
    const clicked_category = point.name;
    const column_chart = getColumnChart();
    const radarChart = getRadarChart();
    if (column_chart === null || radarChart === null) return;

    column_chart?.series[0].points.forEach(point => {
        if (point.category === clicked_category) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
    radarChart?.series[0].points.forEach(point => {
        if (point.name === clicked_category) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
};

let hideFunction = function () {
    const column_chart = getColumnChart();
    const radarChart = getRadarChart();

    column_chart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
    radarChart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
}

// let highlightFunction = function(point: any) {
//     console.log(point.name);
// };

export default PieChart;