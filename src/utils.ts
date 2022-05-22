import {range} from 'd3-array';
import {scaleQuantile} from 'd3-scale';

import type GeoJSON from 'geojson';
import {NeighborhoodCrime} from "./models";

export function updatePercentiles(
    featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => string,
    crimeData: NeighborhoodCrime
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
    const {features} = featureCollection;
    const scale = scaleQuantile().domain(Object.values(crimeData).map(c => parseInt(c.totalCases))).range(range(9));
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

const getValueForNeighborhood = (neighborhood: string, crimeData: NeighborhoodCrime): number => {
    // TODO Find solution for neighborhoods that aren't covered by this
    const data = crimeData[neighborhood];
    if (data) {
        return parseInt(data.totalCases);
    }
    return 0;
}