import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeStatistics } from "../models";
import "../styles/diagrams.css";
import { BarChartPalette } from "../models/colors";

interface Props {
    chartData: CrimeStatistics[];
    years: number[];
}

const StaticBarChart = (props: Props) => {
    const { chartData, years } = props;
    const staticBarChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'column'
        },
    
        title: {
            text: 'number of cases in different neighborhoods'
        },
    
        xAxis: {
            categories: [
                'Altstadt',
                'Neustadt',
                'Pieschen',
                'Klotzsche/nördliche Ortschaften',
                'Loschwitz/OS Schönfeld-Weißig',
                'Blasewitz',
                'Leuben',
                'Prohlis',
                'Plauen',
                'Cotta/westliche Ortschaften',
                'unbekannt'
            ],
            crosshair: true
        },
    
        yAxis: {
            title: {
                text: 'Number of cases'
            }
        },
    
        series: [
            {
                name: '2020',
                type: 'column',
                data: [11980, 7003, 3809, 1068, 973, 4005, 1825, 3966, 3322, 6294, 4684],
                color: BarChartPalette["2020"],
            },
            {
                name: '2019',
                type: 'column',
                data: [12390, 6938, 3450, 1138, 746, 4083, 1698, 3914, 2962, 5669, 3388],
                color: BarChartPalette["2019"],
            },
            {
                name: '2018',
                type: 'column',
                data: [14215, 7935, 3477, 976, 803, 3813, 1578, 3971, 3270, 5081, 4033],
                color: BarChartPalette["2018"],
            },
            {
                name: '2017',
                type: 'column',
                data: [14116, 8700, 4205, 1048, 978, 2865, 1725, 4461, 3888, 5321, 5503],
                color: BarChartPalette["2017"],
            },
            {
                name: '2016',
                type: 'column',
                data: [15946, 8713, 4518, 1283, 1049, 4799, 1821, 4865, 3980, 6386, 5300],
                color: BarChartPalette["2016"],
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