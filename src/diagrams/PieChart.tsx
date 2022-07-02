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

const PieChart = () => {
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
            data: [ { y: 11, name: "Vergewaltigung, sexuelle Nötigung und sexueller Übergriff", color: '#ce7e2b' }, 
                    { y: 50, name: "Raub, räuberische Erpressung und räuberischer Angriff", color: '#247672' },
                    { y: 2871, name: "Körperverletzung", color: '#633d30'},
                    { y: 26940, name: "Diebstahl", color: '#338821'},
                    { y: 11165, name: "Betrug", color: '#a1d832'},
                    { y: 4839, name: "Sachbeschädigung", color: '#a1def0'},
                    { y: 1993, name: "Rauschgiftdelikte", color: '#f3d426'},
                    { y: 19, name: "Mord, Totschlag und Tötung auf Verlangen", color: '#a21636'},
                    { y: 560, name: "Cybercrime", color: '#ff0087'},
                    { y: 12320, name: "Straßenkriminalität", color: '#dd9a9a'},
                
                ],
            type: 'pie',

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
        <div className="chart-container pie-chart">
            <HighchartsReact
                ref={PieChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

// ---------------------------------------------------

let getColumnChart = function() {
    let pie_chart_index = -1;

    Highcharts.charts.forEach((chart, index) => {
        if (chart !== undefined) {
            let container: any = chart?.container;
            while (!container?.classList.contains('chart-container')) container = container.parentNode;
            if (container.classList.contains('column-chart')) pie_chart_index = index;
            
        }
    });
    if (pie_chart_index === -1) return null;
    return Highcharts.charts[pie_chart_index];
}

let highlightFunction = function(point: any) {
    const clicked_category = point.name;
    const column_chart = getColumnChart();
    if (column_chart == null) return ;

    column_chart?.series[0].points.forEach(point => {
        if (point.category === clicked_category) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
};

let hideFunction = function () {
    const column_chart = getColumnChart();

    column_chart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
}

// let highlightFunction = function(point: any) {
//     console.log(point.name);
// };

export default PieChart;