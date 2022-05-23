import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';

import type GeoJSON from 'geojson';
import {YearlyData} from "./models";

export function updatePercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string,
    crimeData: YearlyData
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const scale = scaleQuantile().domain(Object.values(crimeData)
        .flatMap(crime => Object.values(crime)
        .map(stats => parseInt(stats.totalCases))))
        .range(range(9));
    return {
        type: 'FeatureCollection',
        features: features.map(f => {
            const value = getValueForNeighborhood(accessor(f), crimeData);
            const properties = {
                ...f.properties,
                value,
                percentile: scale(value)
            };
            return {...f, properties};
        })
    };
}

const getValueForNeighborhood = (neighborhood: string, crimeData: YearlyData): number => {
    // TODO Find solution for neighborhoods that aren't covered by this
    let total = 0;
    Object.keys(crimeData).forEach(year => {
        const data = crimeData[year][neighborhood];
        if (data) {
            total += parseInt(data.totalCases);
        }
    });
    return total;
}