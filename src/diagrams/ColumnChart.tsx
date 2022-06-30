import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeStatistics } from "../models";
import { zip } from "../utils";
import "../styles/diagrams.css";
import { cardClasses } from "@mui/material";

interface Props {
    chartData: CrimeStatistics[];
    years: number[];
}     

const ColumnChart = (props: Props) => {
    const { chartData, years } = props;
    const ColumnChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            zoomType: "y"
        },
        title: {
            text: 'Column Chart Title'
        },
        xAxis: {
            categories: [
                'Vergewaltigung, sexuelle Nötigung und sexueller Übergriff',
                'Raub, räuberische Erpressung und räuberischer Angriff',
                'Körperverletzung',
                'Diebstahl',
                'Betrug',
                'Sachbeschädigung',
                'Rauschgiftdelikte',
                'Mord, Totschlag und Tötung auf Verlangen',
                'Cybercrime',
                'Straßenkriminalität',
            ],
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
            name: "2015",
            data: [ {y: 11, color: '#ce7e2b'},
                {y: 50, color: '#247672'},
                {y: 2871, color: '#633d30'},
                {y: 26940, color: '#338821'},
                {y: 11165, color: '#a1d832'},
                {y: 4839, color: '#a1def0'},
                {y: 1993, color: '#f3d426'},
                {y: 19, color: '#a21636'},
                {y: 560, color: '#ff0087'},
                {y: 12320, color: '#dd9a9a'}
                
                
                ],
            type: 'column',
              
            }]
            
    }

    useEffect(() => {
        if (ColumnChartRef.current) {
            const container = ColumnChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            ColumnChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={ColumnChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default ColumnChart;