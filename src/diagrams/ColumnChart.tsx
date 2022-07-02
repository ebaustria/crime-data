import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeStatistics } from "../models";
import { zip } from "../utils";
import "../styles/diagrams.css";
import { cardClasses } from "@mui/material";
import PieChart from './PieChart';
import Papa from "papaparse";

interface Props {
    year: number;
}

const ColumnChart = (props: Props) => {
    const { year } = props;
    const ColumnChartRef = useRef<HighchartsReact.RefObject>(null);
    let csv_data: any = [];
    const chart_data: any = {
        categories: [],
        data: []
    };

    Papa.parse(`https://raw.githubusercontent.com/ebaustria/crime-data/main/data/BKA_DD_${year}.csv`, {
        header: true,
        download: true,
        complete: function(results: any) {
            csv_data = results;
            results.data.forEach((element: any) => {
                chart_data.categories.push(element['Straftat']);
                chart_data.data.push(
                    {
                        y: element['Anzahl erfasster Fälle']
                    }
                );
            });
        }
    });

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            zoomType: "y"
        },
        title: {
            text: `Column Chart Title ${year}`
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
            data: [{y: 11, color: '#ce7e2b'},
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

    };

    useEffect(() => {
        if (ColumnChartRef.current) {
            const container = ColumnChartRef.current.container.current as HTMLDivElement;
            container.style.height = "100%";
            container.style.width = "100%";
            ColumnChartRef.current.chart.reflow();
        }
    }, []);

    return (
        <div className="chart-container column-chart">
            <HighchartsReact
                ref={ColumnChartRef}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

// ---------------------------------------------------

let getPieChart = function() {
    let pie_chart_index = -1;

    Highcharts.charts.forEach((chart, index) => {
        if (chart !== undefined) {
            let container: any = chart?.container;
            while (!container?.classList.contains('chart-container')) container = container.parentNode;
            if (container.classList.contains('pie-chart')) pie_chart_index = index;

        }
    });
    if (pie_chart_index === -1) return null;
    return Highcharts.charts[pie_chart_index];
}

let highlightFunction = function(point: any) {
    const clicked_category = point.category;
    const pie_chart = getPieChart();

    if (pie_chart == null) return ;

    pie_chart?.series[0].points.forEach(point => {
        if (point.name === clicked_category) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
};

let hideFunction = function () {
    const pie_chart = getPieChart();

    pie_chart?.series[0].points.forEach(point => {
        point.setState('normal');
    });
}

export default ColumnChart;