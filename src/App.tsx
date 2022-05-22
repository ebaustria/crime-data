import React, {useRef, useEffect, useState, useMemo} from "react";
import Papa from "papaparse";
import Map, {Layer, Source} from 'react-map-gl';
import "./styles/App.css";
import {dataLayer} from "./map-style";
import {updatePercentiles} from "./utils";
import {NeighborhoodCrime} from "./models";

function App() {
    const [lng, setLng] = useState(13.7373);
    const [lat, setLat] = useState(51.0504);
    const [zoom, setZoom] = useState(11);
    const [year, setYear] = useState(2015);
    const [allData, setAllData] = useState(undefined);
    const [crimeData, setCrimeData] = useState<NeighborhoodCrime | undefined>(undefined);
    const [hoverInfo, setHoverInfo] = useState(null);
    const MAPBOX_TOKEN = "pk.eyJ1IjoiZXJpY2J1c2giLCJhIjoiY2thcXVzMGszMmJhZjMxcDY2Y2FrdXkwMSJ9.cwBqtbXpWJbtAEGli1AIIg";

    useEffect(() => {
        Papa.parse("https://raw.githubusercontent.com/ebaustria/crime-data/main/data/neighborhoods_crime_2020.csv", {
            header: true,
            download: true,
            complete: function(results) {
                const tempCrimeData: NeighborhoodCrime = {};
                results.data.forEach(element => {
                    // @ts-ignore
                    const key = element["Stadtteil (zusammengefasst)"].replace(/[0-9]/g, '').trim();
                    // @ts-ignore
                    const totalCases = element["Fälle erfasst"];
                    // @ts-ignore
                    const solvedCases = element["Fälle aufgeklärt"];
                    tempCrimeData[key] = {totalCases, solvedCases};
                });
                setCrimeData(tempCrimeData);
            }
        });
        /* global fetch */
        fetch(
            "https://raw.githubusercontent.com/offenesdresden/GeoData/master/Stadtteile-Dresden.geojson"
        )
            .then(resp => resp.json())
            .then(json => setAllData(json))
            .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, []);

    const data = useMemo(() => {
        // @ts-ignore
        return allData && crimeData && updatePercentiles(allData, f => f.properties.name, crimeData);
    }, [allData, year, crimeData]);

    return (
        <div className="app-container">
            <Map
                initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: 9.75
                }}
                style={{width: 800, height: 500}}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <Source type="geojson" data={data}>
                    <Layer {...dataLayer} />
                </Source>
            </Map>
        </div>
    );
}

export default App;
