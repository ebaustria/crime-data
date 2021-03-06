import Highcharts from "highcharts";
import {YearlyData} from "../models";

export const getColumnChart = () => {
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

export const getPieChart = () => {
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

export const getRadarChart = () => {
    let radarIndex = -1;

    Highcharts.charts.forEach((chart, index) => {
        if (chart !== undefined) {
            let container: any = chart?.container;
            while (!container?.classList.contains('chart-container')) container = container.parentNode;
            if (container.classList.contains('radar-chart')) radarIndex = index;

        }
    });
    if (radarIndex === -1) return null;
    return Highcharts.charts[radarIndex];
}

export const highlightPoint = (chart: Highcharts.Chart | undefined, hoveredCategory: string, byName: boolean) => {
    chart?.series[0].points.forEach(point => {
        const comparator = byName ? point.name : point.category;
        if (comparator === hoveredCategory) {
            point.setState('hover');
            point.series.chart.tooltip.refresh(point);
        } else {
            point.setState('inactive');
        }
    });
}

export const parseLocalBarChartData = (yearlyData: YearlyData): YearlyData | null => {
    let data: YearlyData = {};

    if (!yearlyData) {
        return null;
    }

    Object.keys(yearlyData).forEach(year => {
        data[year] = {};
        Object.keys(yearlyData[year]).forEach(zone => {
            if (zone.includes("StB ")) {
                data[year][zone.replace(/\d/, "").replace("StB  ", "")] = yearlyData[year][zone];
            }
        });
    });

    return data;
}
