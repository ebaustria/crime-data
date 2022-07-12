import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";
import { CrimeCategoryColors } from "../models/colors";
import { ChartSelected } from "../models/selectedStatHelp";
import {getPieChart, getRadarChart, highlightPoint} from "../utils/charts";

interface Props {
    year: number;
    chartData: any;
    selectedStat: any;
}

const ColumnChart = (props: Props) => {
    const { year, chartData, selectedStat } = props;
    const ColumnChartRef = useRef<HighchartsReact.RefObject>(null);
    var chart_data: any = {
        categories: [],
        data: []
    };
    var chart_selected: any = {};
    if (ChartSelected.hasOwnProperty(selectedStat.value)) chart_selected = ChartSelected[selectedStat.value];
    else chart_selected = ChartSelected['totalCases'];

    if (chartData !== undefined) {
        chartData[year].forEach((element: any) => {
            chart_data.categories.push(element['Straftat']);
            chart_data.data.push(
                {
                    y: parseInt(element[chart_selected.access_data]),
                    color: CrimeCategoryColors[element['Straftat']]
                }
            );
        });
    }

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            zoomType: "y"
        },
        title: {
            text: `${chart_selected.title} ${year} `
        },
        xAxis: {
            categories: chart_data.categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'cases'
            }
        },
        tooltip: {
            headerFormat: `<span>{point.key}</span><table>`,
            pointFormat: `<tr><td style="padding:0"><b>{point.y} ${chart_selected.tooltip_label}</b></td></tr>`,
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: [{
            name: `${year}`,
            data: chart_data.data,
            type: 'column',

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

        }],
        legend:{ enabled:false }

    };

    useEffect(() => {
        if (ColumnChartRef.current) {
            const container = ColumnChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            ColumnChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container column-chart">
            <HighchartsReact
                ref={ColumnChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

// ---------------------------------------------------

let highlightFunction = function(point: any) {
    const clicked_category = point.category;
    const pie_chart = getPieChart();
    const radarChart = getRadarChart();

    if (pie_chart === null || radarChart === null) return;

    highlightPoint(radarChart, clicked_category, true);
    highlightPoint(pie_chart, clicked_category, true);
};

let hideFunction = function () {
    const pie_chart = getPieChart();
    const radarChart = getRadarChart();

    pie_chart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
    radarChart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
}

export default ColumnChart;