import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import Map, { Layer, Source } from 'react-map-gl';
import "./styles/App.css";
import { dataLayer } from "./map-style";
import { updatePercentiles } from "./utils";
import { NeighborhoodCrime, RawCrimeData, YearlyData } from "./models";
import StatisticSelect from "./components/StatisticSelect";
import YearSlider from "./components/YearSlider";

function App() {
    const [lng, setLng] = useState(13.7373);
    const [lat, setLat] = useState(51.0504);
    const [zoom, setZoom] = useState(9.75);
    const [years, setYears] = useState([2020, 2020]);
    const [geoData, setGeoData] = useState(undefined);
    const [allCrimeData, setAllCrimeData] = useState<RawCrimeData[] | undefined>(undefined);
    const [yearlyData, setYearlyData] = useState<YearlyData | undefined>(undefined);
    const [hoverInfo, setHoverInfo] = useState(null);
    const [selectedStat, setSelectedStat] = useState("totalCases");

    // This token is needed to display the map.
    const MAPBOX_TOKEN = "pk.eyJ1IjoiZXJpY2J1c2giLCJhIjoiY2thcXVzMGszMmJhZjMxcDY2Y2FrdXkwMSJ9.cwBqtbXpWJbtAEGli1AIIg";

    const getYearsRange = (): number[] => {
        let result: number[] = [];
        for (let i = years[0]; i <= years[1]; i++) {
            if (!result.includes(i)) {
                result.push(i);
            }
        }
        return result;
    };

    useEffect(() => {
        // Load the crime data for Dresden's neighborhoods.
        Papa.parse("https://raw.githubusercontent.com/ebaustria/crime-data/main/data/neighborhoods_crime.csv", {
            header: true,
            download: true,
            complete: function(results) {
                const tempCrimeData: NeighborhoodCrime = {};

                // Save the complete data set in a variable so we can use it for static diagrams and other things.
                setAllCrimeData(results.data as RawCrimeData[]);

                const [statistics2018, statistics2019, statistics2020] =
                    (results.data as RawCrimeData[]).reduce((result, element) => {
                        let index;
                        switch (element["Jahr"]) {
                            case "2018":
                                index = 0;
                                break;
                            case "2019":
                                index = 1;
                                break;
                            default:
                                index = 2;
                                break;
                        }
                        // @ts-ignore
                        result[index].push(element);
                        return result;
                    }, [[], [], []]);
                setYearlyData({
                    "2020": getCrimeDataForNeighborhoods(statistics2020),
                    "2019": getCrimeDataForNeighborhoods(statistics2019),
                    "2018": getCrimeDataForNeighborhoods(statistics2018),
                });
            }
        });

        // Fetch the GeoJSON data for Dresden's neighborhoods. This is needed to draw the polygons on the map.
        fetch(
            "https://raw.githubusercontent.com/offenesdresden/GeoData/master/Stadtteile-Dresden.geojson"
        )
            .then(resp => resp.json())
            .then(json => setGeoData(json))
            .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, []);

    const data = useMemo(() => {
        return geoData && yearlyData && updatePercentiles(
            geoData,
            // @ts-ignore
            f => [f.properties.name, f.properties.official_name],
            yearlyData,
            selectedStat,
            getYearsRange()
        );
    }, [geoData, years, yearlyData, selectedStat]);

    const getCrimeDataForNeighborhoods = (rawCrimeDataList: RawCrimeData[]) => {
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

    return (
        <div className="app-container">
            <div className="central-container">
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
                <div style={{flexDirection: "row", display: "flex"}}>
                    <StatisticSelect
                        onChange={(ev, child) => setSelectedStat(ev.target.value)}
                        values={[
                            {label: "Total cases", value: "totalCases"},
                            {label: "Solved cases", value: "solvedCases"},
                            {label: "Suspects", value: "suspects"}
                        ]}
                    />
                    <YearSlider
                        onChange={(ev, value, activeThumb) => setYears(value as number[])}
                        selectedStrings={years}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
