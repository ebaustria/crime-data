import React, { useEffect, useRef } from "react";
import Highcharts, { chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";
import { CrimeCategoryColors } from "../models/colors"

interface Props {
    year: number;
    chartData: any;
}

console.log(CrimeCategoryColors);

const ColumnChart = (props: Props) => {
    const { year, chartData } = props;
    const ColumnChartRef = useRef<HighchartsReact.RefObject>(null);
    var chart_data: any = {
        categories: [],
        data: []
    };

    if (chartData != undefined) {
        chartData[year].forEach((element: any) => {
            chart_data.categories.push(element['Straftat']);
            chart_data.data.push(
                {
                    y: parseInt(element['Anzahl erfasster Fälle']),
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
            text: `Column Chart Title ${year}`
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
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} cases</b></td></tr>',
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

let getPieChart = function() {
    let pie_chart_index = -1;

    Highcharts.charts.forEach((chart, index) => {
        if (chart !== undefined) {
            let container: any = chart?.container;
            while (!container?.classList.contains('chart-container')) container = container.parentNode;
            if (container.classList.contains('pie-chart')) pie_chart_index = index;

        }
    });
    if (pie_chart_index === -1) return null;
    return Highcharts.charts[pie_chart_index];
}

let highlightFunction = function(point: any) {
    const clicked_category = point.category;
    const pie_chart = getPieChart();

    if (pie_chart == null) return ;

    pie_chart?.series[0].points.forEach(point => {
        if (point.name === clicked_category) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
};

let hideFunction = function () {
    const pie_chart = getPieChart();

    pie_chart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
}

export default ColumnChart;