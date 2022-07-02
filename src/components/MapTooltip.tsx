import "../styles/components.css";
import React from "react";
import {MapboxGeoJSONFeature} from "react-map-gl";

interface Props {
    hoverInfo: {feature: MapboxGeoJSONFeature, x: number, y: number};
    label: string;
}

const MapTooltip = (props: Props) => {
    const { hoverInfo, label } = props;

    return (
        <div
            className="map-tooltip"
            style={{
                left: hoverInfo.x + 5,
                top: hoverInfo.y + 5,
            }}
        >
            <div style={{fontWeight: "bold"}}>{hoverInfo.feature.properties!.name}</div>
            <div>{label}: {hoverInfo.feature.properties!.value}</div>
        </div>
    );
};

export default MapTooltip;