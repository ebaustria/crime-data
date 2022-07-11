import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CrimeCategoryColors } from "../models/colors"
import "../styles/diagrams.css";

interface Props {
    chartData: any;
    years: number[];
}

const AreaChart = (props: Props) => {
    const { chartData, years } = props;
    const AreaChartRef = useRef<HighchartsReact.RefObject>(null);
    var crimes_cases: any = {};
    var crime_categories: any = [];
    var chart_data: any = {
        categories: [],
        data: []
    };
    
    chartData[years[0]].forEach((crime: any) => {
        crime_categories.push(crime['Straftat']);
        crimes_cases[crime['Straftat']] = [];
    });
    
    for (var i: number = years[0]; i <= years[1]; i++) {
        chart_data.categories.push(`${i}`);
        chartData[i].forEach((crime: any) => {
            crimes_cases[crime['Straftat']].push(parseInt(crime['Anzahl erfasster Fälle']));
        });
    }

    for (const [crime, cases] of Object.entries(crimes_cases)) {
        chart_data.data.push({
            name: crime,
            type: 'area',
            data: cases,
            color: CrimeCategoryColors[crime]
        });    
    }

    console.log(chart_data);

    const options: Highcharts.Options = {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Area Chart Title'
        },
        xAxis: {
            categories: chart_data.categories
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
        series: chart_data.data
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