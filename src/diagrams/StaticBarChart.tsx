import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {CrimeStatistics, RawCrimeData, YearlyData} from "../models";
import "../styles/diagrams.css";
import { BarChartPalette } from "../models/colors";
import {districts} from "../models/places";

interface Props {
    chartData: YearlyData;
    years: number[];
}

const StaticBarChart = (props: Props) => {
    const { chartData, years } = props;
    const staticBarChartRef = useRef<HighchartsReact.RefObject>(null);

    const data = (year: string) => {
        const dataForYear = chartData[year];
        return districts.map(district => parseInt(dataForYear[district].totalCases));
    }

    const options: Highcharts.Options = {
        chart: {
            type: 'column'
        },
    
        title: {
            text: 'number of cases in different neighborhoods'
        },
    
        xAxis: {
            categories: districts,
            crosshair: true
        },
    
        yAxis: {
            title: {
                text: 'Number of cases'
            }
        },
    
        series: [
            {
                name: years[0].toString(),
                type: 'column',
                data: data("2016"),
                color: BarChartPalette["2016"],
            },
            {
                name: years[1].toString(),
                type: 'column',
                data: data("2017"),
                color: BarChartPalette["2017"],
            },
            {
                name: years[2].toString(),
                type: 'column',
                data: data("2018"),
                color: BarChartPalette["2018"],
            },
            {
                name: years[3].toString(),
                type: 'column',
                data: data("2019"),
                color: BarChartPalette["2019"],
            },
            {
                name: years[4].toString(),
                type: 'column',
                data: data("2020"),
                color: BarChartPalette["2020"],
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
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
    }

    useEffect(() => {
        if (staticBarChartRef.current) {
            const container = staticBarChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            staticBarChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container static-bar-chart">
            <HighchartsReact
                ref={staticBarChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default StaticBarChart;