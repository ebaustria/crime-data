import React, {useEffect, useState, useMemo, useCallback} from "react";
import Papa from "papaparse";
import Map, {Layer, MapboxGeoJSONFeature, MapLayerMouseEvent, Source} from 'react-map-gl';
import "./styles/App.css";
import { dataLayer } from "./map-style";
import { updatePercentiles } from "./utils";
import { NeighborhoodCrime, RawCrimeData, SelectMenuData, YearlyData } from "./models";
import StatisticSelect from "./components/StatisticSelect";
import YearSlider from "./components/YearSlider";
import MapTooltip from "./components/MapTooltip";
import LineGraph from "./diagrams/LineGraph";
import StaticBarChart from "./diagrams/StaticBarChart";

function App() {
    const [lng, setLng] = useState(13.7373);
    const [lat, setLat] = useState(51.0504);
    const [zoom, setZoom] = useState(9.75);
    const [years, setYears] = useState([2020, 2020]);
    const [geoData, setGeoData] = useState(undefined);
    const [allCrimeData, setAllCrimeData] = useState<RawCrimeData[] | undefined>(undefined);
    const [yearlyData, setYearlyData] = useState<YearlyData | undefined>(undefined);
    const [hoverInfo, setHoverInfo] = useState<{ feature: MapboxGeoJSONFeature; x: number; y: number; } | undefined>(undefined);
    const [selectedStat, setSelectedStat] = useState<SelectMenuData>({label: "Total cases", value: "totalCases"});
    const allYears: string[] = ["2016", "2017", "2018", "2019", "2020"];

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
                // Save the complete data set in a variable so we can use it for static diagrams and other things.
                setAllCrimeData(results.data as RawCrimeData[]);

                const [statistics2016, statistics2017, statistics2018, statistics2019, statistics2020] =
                    (results.data as RawCrimeData[]).reduce((result, element) => {
                        let index;
                        switch (element["Jahr"]) {
                            case "2016":
                                index = 0;
                                break;
                            case "2017":
                                index = 1;
                                break;
                            case "2018":
                                index = 2;
                                break;
                            case "2019":
                                index = 3;
                                break;
                            default:
                                index = 4;
                                break;
                        }
                        // @ts-ignore
                        result[index].push(element);
                        return result;
                    }, [[], [], [], [], []]);
                setYearlyData({
                    "2020": getCrimeDataForNeighborhoods(statistics2020),
                    "2019": getCrimeDataForNeighborhoods(statistics2019),
                    "2018": getCrimeDataForNeighborhoods(statistics2018),
                    "2017": getCrimeDataForNeighborhoods(statistics2017),
                    "2016": getCrimeDataForNeighborhoods(statistics2016),
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

    const onHover = useCallback((event: MapLayerMouseEvent) => {
        const {
            features,
            point: {x, y}
        } = event;
        const hoveredFeature = features && features[0];

        // prettier-ignore
        setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
    }, []);

    const data = useMemo(() => {
        return geoData && yearlyData && updatePercentiles(
            geoData,
            // @ts-ignore
            f => [f.properties.name, f.properties.official_name],
            yearlyData,
            selectedStat.value,
            getYearsRange()
        );
    }, [geoData, years, yearlyData, selectedStat]);

    const getCrimeDataForNeighborhoods = (rawCrimeDataList: RawCrimeData[]): NeighborhoodCrime => {
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

    const getLabelForStatistic = (stat: string): string => {
        switch (stat) {
            case "totalCases":
                return "Total cases";
            case "solvedCases":
                return "Solved cases";
            default:
                return "Suspects";
        }
    };

    return (
        <div className="app-container">
            <div className="side-container">
                {yearlyData &&
                    <LineGraph
                        chartData={allYears.map(year => yearlyData[year]["Insgesamt"])}
                        years={allYears.map(year => parseInt(year))}
                    />
                }
                <StaticBarChart chartData={[]} years={[]}/>
            </div>
            <div className="central-container">
                <Map
                    initialViewState={{
                        longitude: lng,
                        latitude: lat,
                        zoom: zoom
                    }}
                    style={{height: 500}}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onMouseMove={onHover}
                    interactiveLayerIds={['data']}
                    mapboxAccessToken={MAPBOX_TOKEN}
                >
                    <Source type="geojson" data={data}>
                        <Layer {...dataLayer} />
                    </Source>
                    {hoverInfo && <MapTooltip label={selectedStat.label} hoverInfo={hoverInfo} />}
                </Map>
                <div style={{flexDirection: "row", display: "flex"}}>
                    <StatisticSelect
                        onChange={(ev, child) => {
                            const value: string = ev.target.value;
                            setHoverInfo(undefined);
                            setSelectedStat({label: getLabelForStatistic(value), value});
                        }}
                        values={[
                            {label: "Total cases", value: "totalCases"},
                            {label: "Solved cases", value: "solvedCases"},
                            {label: "Suspects", value: "suspects"}
                        ]}
                    />
                    <YearSlider
                        onChange={(ev, value, activeThumb) => {
                            setHoverInfo(undefined);
                            setYears(value as number[]);
                        }}
                        selectedStrings={years}
                    />
                </div>
            </div>
            <div className="side-container">
                dynamic graphs
            </div>
        </div>
    );
}

export default App;
