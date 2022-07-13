import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";
import {blueGreen, CrimeCategoryColors} from "../models/colors";
import { ChartSelected } from "../models/selectedStatHelp";
import {getColumnChart, getPieChart, highlightPoint} from "../utils/charts";

interface Props {
    year: number;
    chartData: any;
    selectedStat: any;
}

const RadarChart = (props: Props) => {
    const { chartData, year, selectedStat } = props;
    const radarChartRef = useRef<HighchartsReact.RefObject>(null);
    const chart_data: any = {
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
                    name: element['Straftat'],
                    y: parseInt(element['Aufklärungsqoute']),
                    color: CrimeCategoryColors[element['Straftat']]
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

    const mapDegreesToCategory = (degrees: string | number): string => {
        switch (degrees) {
            case 0:
                return chart_data.categories[0];
            case 36:
                return chart_data.categories[1];
            case 72:
                return chart_data.categories[2];
            case 108:
                return chart_data.categories[3];
            case 144:
                return chart_data.categories[4];
            case 180:
                return chart_data.categories[5];
            case 216:
                return chart_data.categories[6];
            case 252:
                return chart_data.categories[7];
            case 288:
                return chart_data.categories[8];
            default:
                return chart_data.categories[9];
        }
    }

    const options: Highcharts.Options = {
        chart: {
            polar: true,
            zoomType: "xy",
        },

        title: {
            text: `Clearance Rate by Category, ${year}`
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        xAxis: {
            tickInterval: 36,
            labels: {
                formatter: function() {
                    return mapDegreesToCategory(this.value);
                },
            }
        },

        yAxis: {
            min: 0
        },

        tooltip: {
            headerFormat: `<span>{point.key}</span><table>`,
            pointFormat: `<tr><td style="padding:0"><b>{point.y}% of the recorded cases were solved</b></td></tr>`,
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
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
                name: `${year}`,
                data: chart_data.data,
                color: blueGreen,
                point: {

                    events: {
                        mouseOver(e) {
                            highlightFunction(this);
                        },
                        mouseOut() {
                            hideFunction()
                        }
                    }
                },
            },
        ],
        legend: { enabled: false },
    }

    const highlightFunction = function(point: any) {
        const clicked_category = mapDegreesToCategory(point.category);
        const column_chart = getColumnChart();
        const pie_chart = getPieChart();
        if (column_chart === null || pie_chart === null) return;

        highlightPoint(column_chart, clicked_category, false);
        highlightPoint(pie_chart, clicked_category, true);
    };

    const hideFunction = function () {
        const columnChart = getColumnChart();
        const pie_chart = getPieChart();

        columnChart?.series[0].points.forEach(point => {
            point.setState('normal');
        });
        pie_chart?.series[0].points.forEach(point => {
            point.setState('normal');
        });
    }

    return (
        <div className="chart-container radar-chart">
            <HighchartsReact
                ref={radarChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default RadarChart;