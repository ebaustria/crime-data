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

        xAxis: {
            crosshair: true
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

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} cases</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        plotOptions: {
            series: {
                point: {
                  events: {
                    click: function() {
                      console.log(this.category);
                    },
                    mouseOver() {
                        highlightFunction(this);
                    },
                    mouseOut() {
                        hideFunction()
                    }
                  }
                }
              }
        }
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

// ------------------------------------------------

let getStaticBarChart = function() {
    var static_bar_chart_index = -1;

    Highcharts.charts.forEach((chart, index) => {
        if (chart != undefined) {
            var container: any = chart?.container;
            while (!container?.classList.contains('chart-container')) container = container.parentNode;
            if (container.classList.contains('static-bar-chart')) static_bar_chart_index = index;
            
        }
    });
    if (static_bar_chart_index == -1) return null;
    return Highcharts.charts[static_bar_chart_index];
}

let highlightFunction = function (point: any) {
    var clicked_category = point.category;
    var static_bar_chart = getStaticBarChart();
    var series_index = -1;
    
    static_bar_chart?.series.forEach((series, index) => {
        if (series.name == clicked_category) {
            series.points.forEach(point => {
                point.setState('hover');
            });
        } else {
            series.points.forEach(point => {
                point.setState('inactive');
            });
        }
    });
}

let hideFunction = function () {
    var static_bar_chart = getStaticBarChart();

    static_bar_chart?.series.forEach(series => {
        series.points.forEach(point => {
            point.setState('normal');
        });
    });
}

export default LineGraph;