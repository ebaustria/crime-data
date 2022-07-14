import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {NationalCrime, YearlyData} from "../models";
import "../styles/diagrams.css";
import {BarChartPalette} from "../models/colors";
import {districts, states} from "../models/places";

interface Props {
    chartData: YearlyData;
    years: string[];
}

const StaticBarChart = (props: Props) => {
    const { chartData, years } = props;
    const staticBarChartRef = useRef<HighchartsReact.RefObject>(null);
    const nationalView = years.length < 4;

    const data = (year: string): number[] => {
        const dataForYear = chartData[year];
        if (nationalView) {
            const total = (dataForYear as NationalCrime)["Total"];
            if (total) {
                return states.map(state => parseInt(total[state]));
            }
            return [];
        }
        return districts.map(district => parseInt(dataForYear[district].totalCases));
    }

    const parseData = (): Highcharts.SeriesOptionsType[] => {
        return (
            years.map(year => {
                return ({
                    name: year,
                    type: 'column',
                    data: data(year),
                    // @ts-ignore
                    color: BarChartPalette[year],
                });
            })
        );
    };

    const options: Highcharts.Options = {
        chart: {
            type: 'column'
        },
    
        title: {
            text: nationalView ? "Total Cases by Federal State, 2017-2019" : "Total Cases by District, 2016-2020"
        },
    
        xAxis: {
            categories: nationalView ? states : districts,
            crosshair: true
        },
    
        yAxis: {
            title: {
                text: 'Total Cases'
            }
        },
    
        series: parseData(),
    
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