import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';

import type GeoJSON from 'geojson';
import {CrimeStatistics, NeighborhoodCrime, RawCrimeData, YearlyData} from "./models";

/** Calculates percentiles of administrative districts (neighborhoods, city districts, etc.) for a given crime
 * statistic. */
export function updatePercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string[],
    crimeData: YearlyData,
    selectedStat: string,
    years: number[]
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const scale = scaleQuantile().domain(Object.values(crimeData)
        .flatMap(crime => Object.values(crime)
        .map(stats => parseInt(stats.totalCases))))
        .range(range(9));
    return {
        type: 'FeatureCollection',
        features: features.map(f => {
            const value = getValueForNeighborhood(accessor(f), crimeData, selectedStat, years);
            const properties = {
                ...f.properties,
                value,
                percentile: scale(value)
            };
            return {...f, properties};
        })
    };
}

const getStatistic = (data: CrimeStatistics, selectedStat: string) => {
    switch (selectedStat) {
        case "totalCases":
            return data.totalCases;
        case "solvedCases":
            return data.solvedCases;
        default:
            return data.suspects;
    }
}

/** Finds the total number of occurrences of a given crime statistic in a given neighborhood over one or more years. */
const getValueForNeighborhood = (neighborhoodNames: string[], crimeData: YearlyData, selectedStat: string, years: number[]): number => {
    let total = 0;
    Object.keys(crimeData).forEach(year => {
        if (years.includes(parseInt(year))) {
            // We check both "name" and "official_name" in case the name in the crime data matches one but not the other.
            const data = crimeData[year][neighborhoodNames[0]] ?? crimeData[year][neighborhoodNames[1]];
            if (data) {
                total += parseInt(getStatistic(data, selectedStat));
            }
        }
    });
    return total;
}

/** Fetch the GeoJSON data for a geographic area. This is needed to draw polygons on the map. */
export const fetchGeoData = (url: string, onFetch: (json: any) => void) => {
    fetch(url)
        .then(resp => resp.json())
        .then(json => onFetch(json))
        .catch(err => console.error('Could not load data', err)); // eslint-disable-line
}

export const getCrimeDataForNeighborhoods = (rawCrimeDataList: RawCrimeData[]): NeighborhoodCrime => {
    const result: NeighborhoodCrime = {};
    rawCrimeDataList.forEach(rawCrimeData => {
        // @ts-ignore
        const key = rawCrimeData["Stadtteil (zusammengefasst)"].replace(/[0-9]/g, '').trim();
        // @ts-ignore
        const totalCases = rawCrimeData["Fälle erfasst"];
        // @ts-ignore
        const solvedCases = rawCrimeData["Fälle aufgeklärt"];
        // @ts-ignore
        const suspects = rawCrimeData["Tatverdächtige insgesamt"];
        result[key] = {totalCases, solvedCases, suspects};
    });
    return result;
};

export const zip = (firstArray: any[], secondArray: any[]) => firstArray.map((k, i) => [k, secondArray[i]]);
