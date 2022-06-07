import "../styles/components.css";
import React from "react";
import {MapboxGeoJSONFeature} from "react-map-gl";

interface Props {
    hoverInfo: {feature: MapboxGeoJSONFeature, x: number, y: number};
}

const MapTooltip = (props: Props) => {
    const { hoverInfo } = props;

    return (
        <div
            className="map-tooltip"
            style={{
                left: hoverInfo.x,
                top: hoverInfo.y,
            }}
        >
            <div >Neighborhood: {hoverInfo.feature.properties!.name}</div>
            <div>Total cases: {hoverInfo.feature.properties!.value}</div>
        </div>
    );
};

export default MapTooltip;