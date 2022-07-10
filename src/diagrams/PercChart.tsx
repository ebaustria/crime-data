import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeStatistics } from "../models";
import { zip } from "../utils/general";
import "../styles/diagrams.css";
import { cardClasses } from "@mui/material";

interface Props {
    chartData: CrimeStatistics[];
    years: number[];
}     

const PercChart = (props: Props) => {
    const { chartData, years } = props;
    const PercChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Percentage Column Chart Title'
        },
        xAxis: {
            categories: ['Suspects', 'Firearmed']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total crimes'
            }
        },
        tooltip: {        
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
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
            name: 'male',
            data: [5, 3],
            color: '#00886c',
            type: 'bar'
        }, {
            name: 'female',
            data: [2, 2],
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