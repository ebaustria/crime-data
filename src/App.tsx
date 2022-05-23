import React, {useEffect, useState, useMemo} from "react";
import Papa from "papaparse";
import Map, {Layer, Source} from 'react-map-gl';
import "./styles/App.css";
import {dataLayer} from "./map-style";
import {updatePercentiles} from "./utils";
import {NeighborhoodCrime, RawCrimeData, YearlyData} from "./models";

function App() {
    const [lng, setLng] = useState(13.7373);
    const [lat, setLat] = useState(51.0504);
    const [zoom, setZoom] = useState(9.75);
    const [year, setYear] = useState(2020);
    const [geoData, setGeoData] = useState(undefined);
    const [allCrimeData, setAllCrimeData] = useState<RawCrimeData[] | undefined>(undefined);
    const [yearlyData, setYearlyData] = useState<YearlyData | undefined>(undefined);
    const [hoverInfo, setHoverInfo] = useState(null);
    const MAPBOX_TOKEN = "pk.eyJ1IjoiZXJpY2J1c2giLCJhIjoiY2thcXVzMGszMmJhZjMxcDY2Y2FrdXkwMSJ9.cwBqtbXpWJbtAEGli1AIIg";

    useEffect(() => {
        Papa.parse("https://raw.githubusercontent.com/ebaustria/crime-data/main/data/neighborhoods_crime_2020.csv", {
            header: true,
            download: true,
            complete: function(results) {
                const tempCrimeData: NeighborhoodCrime = {};
                setAllCrimeData(results.data as RawCrimeData[]);

                // @ts-ignore
                results.data.filter(element => element["Jahr"] === "2020")
                    .forEach(item => {
                        // @ts-ignore
                        const key = item["Stadtteil (zusammengefasst)"].replace(/[0-9]/g, '').trim();
                        // @ts-ignore
                        const totalCases = item["Fälle erfasst"];
                        // @ts-ignore
                        const solvedCases = item["Fälle aufgeklärt"];
                        // @ts-ignore
                        const suspects = item["Tatverdächtige"];
                        tempCrimeData[key] = {totalCases, solvedCases, suspects};
                    });
                setYearlyData({"2020": tempCrimeData});
            }
        });
        /* global fetch */
        fetch(
            "https://raw.githubusercontent.com/offenesdresden/GeoData/master/Stadtteile-Dresden.geojson"
        )
            .then(resp => resp.json())
            .then(json => setGeoData(json))
            .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, []);

    const data = useMemo(() => {
        // @ts-ignore
        return geoData && yearlyData && updatePercentiles(geoData, f => f.properties.name, yearlyData);
    }, [geoData, year, yearlyData]);

    return (
        <div className="app-container">
            <Map
                initialViewState={{
                  longitude: lng,
                  latitude: lat,
                  zoom: zoom
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
