import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';

import type GeoJSON from 'geojson';
import {CrimeStatistics, YearlyData} from "./models";

/** Calculates percentiles of administrative districts (neighborhoods, city districts, etc.) for a given crime
 * statistic. */
export function updatePercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string[],
    crimeData: YearlyData,
    selectedStat: string
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const scale = scaleQuantile().domain(Object.values(crimeData)
        .flatMap(crime => Object.values(crime)
        .map(stats => parseInt(stats.totalCases))))
        .range(range(9));
    return {
        type: 'FeatureCollection',
        features: features.map(f => {
            const value = getValueForNeighborhood(accessor(f), crimeData, selectedStat);
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
const getValueForNeighborhood = (neighborhoodNames: string[], crimeData: YearlyData, selectedStat: string): number => {
    let total = 0;
    Object.keys(crimeData).forEach(year => {
        // We check both "name" and "official_name" in case the name in the crime data matches one but not the other.
        const data = crimeData[year][neighborhoodNames[0]] ?? crimeData[year][neighborhoodNames[1]];
        if (data) {
            total += parseInt(getStatistic(data, selectedStat));
        }
    });
    return total;
}