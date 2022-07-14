import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";
import { CrimeCategoryColors } from "../models/colors";
import { ChartSelected } from "../models/selectedStatHelp";
import {getColumnChart, getRadarChart, highlightPoint} from "../utils/charts";

interface Props {
    year: number;
    chartData: any;
    selectedStat: any;
}     

const PieChart = (props: Props) => {
    const { year, chartData, selectedStat } = props;
    const PieChartRef = useRef<HighchartsReact.RefObject>(null);
    var chart_data: any = [];
    var chart_selected: any = {};
    if (ChartSelected.hasOwnProperty(selectedStat.value)) chart_selected = ChartSelected[selectedStat.value];
    else chart_selected = ChartSelected['totalCases'];

    if (chartData !== undefined) {
        chartData[year].forEach((element: any) => {
            chart_data.push({
                y: parseInt(element[chart_selected.access_data]),
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
            text: `${chart_selected.title} in Dresden by Category, ${year}`
        },
        
        tooltip: {        
            headerFormat: `<span>{point.key}</span><table>`,
            pointFormat: `<tr><td style="padding:0"><b>{point.y} ${chart_selected.tooltip_label}</b></td></tr>`,
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

    highlightPoint(column_chart, clicked_category, false);
    highlightPoint(radarChart, clicked_category, true);
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