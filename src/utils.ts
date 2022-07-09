import { range } from 'd3-array';
import { scaleQuantile } from 'd3-scale';

import type GeoJSON from 'geojson';
import {CrimeStatistics, NationalCrime, NeighborhoodCrime, RawCrimeData, YearlyData} from "./models";
import {FillLayer} from "react-map-gl";
import {greenGradient, redGradient} from "./models/colors";
import { states } from './models/places';

/** Calculates percentiles of administrative districts (neighborhoods, city districts, etc.) for a given crime
 * statistic. */
export function updateLocalPercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string[],
    crimeData: YearlyData,
    selectedStat: string,
    years: number[]
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const selectedYears = getYearsRange(years).map(year => crimeData[String(year)]);
    const scaleData: number[] = [];
    let neighborhoods: string[] = [];
    if (selectedYears[0]) {
        neighborhoods = Object.keys(selectedYears[0]);
    }
    neighborhoods.forEach(neighborhood => {
        let newNumber = 0;
        selectedYears.forEach(set => {
            // @ts-ignore
            newNumber = newNumber + parseInt(set[neighborhood][selectedStat]);
        });
        scaleData.push(newNumber);
    });
    const scale = scaleQuantile().domain(scaleData).range(range(6));
    return {
        type: 'FeatureCollection',
        features: features.map(f => {
            const value = getValueForNeighborhood(accessor(f), selectedYears, selectedStat);
            const properties = {
                ...f.properties,
                value,
                percentile: scale(value)
            };
            return {...f, properties};
        })
    };
}

/** Calculates percentiles of federal states for a given crime statistic. */
export function updateNationalPercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string,
    crimeData: YearlyData,
    selectedStat: string,
    years: number[]
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const selectedYears = getYearsRange(years).map(year => crimeData[String(year)]);
    const occurrences = selectedYears.map(nationalCrime => nationalCrime[selectedStat]);
    const scaleData: number[] = [];
    states.forEach(state => {
        let newNumber = 0;
        occurrences.forEach(set => {
            // @ts-ignore
            newNumber = newNumber + parseInt(set[state]);
        });
        scaleData.push(newNumber);
    });
    const scale = scaleQuantile().domain(scaleData).range(range(6));
    return {
        type: 'FeatureCollection',
        features: features.map(f => {
            const value = getValueForState(accessor(f), selectedYears, selectedStat);
            const properties = {
                ...f.properties,
                value,
                percentile: selectedStat === "totalCases" ? 0 : scale(value)
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

const getYearsRange = (years: number[]): number[] => {
    let result: number[] = [];
    for (let i = years[0]; i <= years[1]; i++) {
        if (!result.includes(i)) {
            result.push(i);
        }
    }
    return result;
};

/** Finds the total number of occurrences of a given crime statistic in a given federal state of Germany
 * over one or more years. */
const getValueForState = (state: string, crimeData: (NeighborhoodCrime | NationalCrime)[], selectedStat: string): number => {
    let total = 0;
    crimeData.forEach(dataSet => {
        // @ts-ignore
        const data = dataSet[selectedStat][state];
        if (data) {
            total += parseInt(data);
        }
    });
    return total;
}

/** Finds the total number of occurrences of a given crime statistic in a given neighborhood over one or more years. */
const getValueForNeighborhood = (neighborhoodNames: string[], crimeData: (NeighborhoodCrime | NationalCrime)[], selectedStat: string): number => {
    let total = 0;
    crimeData.forEach(dataSet => {
        if (dataSet) {
            // We check both "name" and "official_name" in case the name in the crime data matches one but not the other.
            const data = dataSet[neighborhoodNames[0]] ?? dataSet[neighborhoodNames[1]];
            if (data) {
                total += parseInt(getStatistic(data as CrimeStatistics, selectedStat));
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
        const key = rawCrimeData["Stadtteil (zusammengefasst)"].replace(/\d/g, '').trim();
        const totalCases = rawCrimeData["Fälle erfasst"];
        const solvedCases = rawCrimeData["Fälle aufgeklärt"];
        const suspects = rawCrimeData["Tatverdächtige insgesamt"];
        result[key] = {totalCases, solvedCases, suspects};
    });
    return result;
};

export const getNationalCrimeData = (rawCrimeDataList: RawCrimeData[]): NationalCrime => {
    const result: NationalCrime = {};
    rawCrimeDataList.forEach(rawCrimeData => {
        const federalStates: RawCrimeData = {};
        const crimeCategory = rawCrimeData["Sachgebiet"];
        Object.keys(rawCrimeData).forEach(key => {
            if (key !== "Sachgebiet" && key !== "Jahr") {
                federalStates[key] = rawCrimeData[key];
            }
        });
        result[crimeCategory] = federalStates;
    });
    return result;
};

/** Color scale for the percentiles of the crime statistics */
export const getDataLayer = (selectedStat: string): FillLayer => {
    return {
        id: 'data',
        type: 'fill',
        paint: {
            'fill-color': {
                property: 'percentile',
                stops: selectedStat === "solvedCases" ? greenGradient : redGradient,
            },
            'fill-opacity': 0.8
        }
    };
};

export const zip = (firstArray: any[], secondArray: any[]) => firstArray.map((k, i) => [k, secondArray[i]]);
