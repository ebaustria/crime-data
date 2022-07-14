import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../styles/diagrams.css";

interface Props {
    chartData: any;
    years: number[];
    selectedStat: any;
}     

const PercChart = (props: Props) => {
    const { chartData, years, selectedStat } = props;
    const PercChartRef = useRef<HighchartsReact.RefObject>(null);
    var sum_firearm: number = 0;
    var sum_firearm_used: number = 0;

    if (chartData != undefined) {
        for (var i = years[0]; i <= years[1]; i++) {
            chartData[i].forEach((crime: any) => {
                sum_firearm += parseInt(crime['mit Schusswaffe gedroht']) + parseInt(crime['mit Schusswaffe geschossen']);
                sum_firearm_used += parseInt(crime['mit Schusswaffe geschossen']);
            });
        }
    }

    const options: Highcharts.Options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Firearm Use'
        },
        xAxis: {
            categories: ['Firearm']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Crimes'
            }
        },
        tooltip: {        
            headerFormat: '<span>{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>({point.percentage:.0f}%)</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            bar: {
                stacking: 'percent'
            }
        },
        series: [{
            name: 'Firearm Brandished',
            data: [sum_firearm],
            color: '#00886c',
            type: 'bar'
        }, {
            name: 'Firearm Discharged',
            data: [sum_firearm_used],
            color: '#5D4C4C',
            type: 'bar'
        }]
            
    }

    useEffect(() => {
        if (PercChartRef.current) {
            const container = PercChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            PercChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={PercChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default PercChart;