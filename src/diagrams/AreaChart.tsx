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

const AreaChart = (props: Props) => {
    const { chartData, years } = props;
    const AreaChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Area Chart Title'
        },
        xAxis: {
            categories: [
                '2015', 
                '2016', 
                '2017', 
                '2018', 
                '2019', 
                '2020'
            ]
        },
        yAxis: {
            title: {
                text: 'Number of cases'
            }
        },
        tooltip: {        
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} cases</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: [{
            name: 'Vergewaltigung, sexuelle Nötigung und sexueller Übergriff',
            type: 'area',
            data: [11, 14, 9, 13, 12, 7]
        }, {
            name: 'Raub, räuberische Erpressung und räuberischer Angriff',
            type: 'area',
            data: [583, 635, 809, 678, 788, 852]
        }, {
            name: 'Körperverletzung',
            type: 'area',
            data: [2871, 3521, 2457, 3214, 2500, 2321]
        }, {
            name: 'Diebstahl',
            type: 'area',
            data: [26940, 26541, 24940, 28540, 26940, 25412]
        }, {
            name: 'Betrug',
            type: 'area',
            data: [11165, 12456, 13452, 12456, 13214, 13212]
        }, {
            name: 'Sachbeschädigung',
            type: 'area',
            data: [4839, 5215, 3214, 4839, 4939, 4571]
        }, {
            name: 'Rauschgiftdelikte',
            type: 'area',
            data: [1993, 2152, 1857, 1877, 2231, 1993]
        }, {
            name: 'Mord, Totschlag und Tötung auf Verlangen',
            type: 'area',
            data: [19, 23, 17, 15, 19, 18]
        }, {
            name: 'Cybercrime',
            type: 'area',
            data: [560, 635, 589, 535, 668, 754]
        }, {
            name: 'Straßenkriminalität',
            type: 'area',
            data: [12320, 13260, 12457, 12456, 13251, 12320]
        }]
    }

    useEffect(() => {
        if (AreaChartRef.current) {
            const container = AreaChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            AreaChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={AreaChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default AreaChart;