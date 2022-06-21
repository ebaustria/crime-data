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

const PieChart = (props: Props) => {
    const { chartData, years } = props;
    const PieChartRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Pie Chart Title'
        },
        
        tooltip: {        
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} cases</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        series: [{
            name: "2015",
            data: [ { y: 11, name: "Vergewaltigung, sexuelle Nötigung und sexueller Übergriff" }, 
                    { y: 50, name: "Raub, räuberische Erpressung und räuberischer Angriff" },
                    { y: 2871, name: "Körperverletzung"},
                    { y: 26940, name: "Diebstahl"},
                    { y: 11165, name: "Betrug"},
                    { y: 4839, name: "Sachbeschädigung"},
                    { y: 1993, name: "Rauschgiftdelikte"},
                    { y: 19, name: "Mord, Totschlag und Tötung auf Verlangen"},
                    { y: 560, name: "Cybercrime"},
                    { y: 12320, name: "Straßenkriminalität"},
                
                ],
            type: 'pie'
              
            }]
    }

    useEffect(() => {
        if (PieChartRef.current) {
            const container = PieChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            PieChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container">
            <HighchartsReact
                ref={PieChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default PieChart;