import React, {useEffect, useState, useMemo, useCallback} from "react";
import Papa from "papaparse";
import Map, {Layer, MapboxGeoJSONFeature, MapLayerMouseEvent, Source} from 'react-map-gl';
import "./styles/App.css";
import {
    fetchGeoData, getCrimeDataForNeighborhoods,
    getDataLayer,
    getNationalCrimeData, updateLocalPercentiles,
    updateNationalPercentiles,
} from "./utils/general";
import { RawCrimeData, SelectMenuData, YearlyData } from "./models";
import StatisticSelect from "./components/StatisticSelect";
import YearSlider from "./components/YearSlider";
import MapTooltip from "./components/MapTooltip";
import LineGraph from "./diagrams/LineGraph";
import StaticBarChart from "./diagrams/StaticBarChart";
import AreaChart from "./diagrams/AreaChart";
import PieChart from "./diagrams/PieChart";
import {LocalStatistics, NationalStatistics} from "./models/statistics";
import {SelectChangeEvent} from "@mui/material";
import PercChartSuspects from "./diagrams/PercChartSuspects";
import PercChartFirearm from "./diagrams/PercChartFirearm";
import ColumnChart from "./diagrams/ColumnChart";
import RadarChart from "./diagrams/RadarChart";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";

HC_more(Highcharts);

function App() {
    const [zoom, setZoom] = useState(11);
    const [years, setYears] = useState([2020, 2020]);
    const [geoData, setGeoData] = useState(undefined);
    const [showLocalView, setShowLocalView] = useState(true);
    const [yearlyData, setYearlyData] = useState<YearlyData | undefined>(undefined);
    const [hoverInfo, setHoverInfo] = useState<{ feature: MapboxGeoJSONFeature; x: number; y: number; } | undefined>(undefined);
    const [selectedStat, setSelectedStat] = useState<SelectMenuData>(LocalStatistics[0]);
    const [bkaData, setBkaData] = useState<any>(undefined);

    // This token is needed to display the map.
    const MAPBOX_TOKEN = "pk.eyJ1IjoiZXJpY2J1c2giLCJhIjoiY2thcXVzMGszMmJhZjMxcDY2Y2FrdXkwMSJ9.cwBqtbXpWJbtAEGli1AIIg";

    useEffect(() => {
        setShowLocalView(true);
        fetchLocalData();
        fetchBkaData();
    }, []);

    useEffect(() => {
        if (zoom <= 9 && showLocalView) {
            setSelectedStat(NationalStatistics[0]);
            setYears([2019, 2019]);
            Papa.parse("https://raw.githubusercontent.com/ebaustria/crime-data/15-additional-map-view/data/national_crime.csv", {
                header: true,
                download: true,
                complete: function(results) {
                    const [statistics2017, statistics2018, statistics2019] =
                        (results.data as RawCrimeData[]).reduce((result, element) => {
                            let index;
                            switch (element["Jahr"]) {
                                case "2017":
                                    index = 0;
                                    break;
                                case "2018":
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
                        "2019": getNationalCrimeData(statistics2019),
                        "2018": getNationalCrimeData(statistics2018),
                        "2017": getNationalCrimeData(statistics2017),
                    });
                }
            });
            fetchGeoData(
                "https://raw.githubusercontent.com/blackmad/neighborhoods/master/germany.geojson",
                json => {
                    setGeoData(json);
                    setShowLocalView(false);
                }
            );
            return;
        }
        if (zoom > 9 && !showLocalView) {
            setShowLocalView(true);
            fetchLocalData();
        }
    }, [showLocalView, zoom]);

    const fetchBkaData = () => {
        Papa.parse(`https://raw.githubusercontent.com/ebaustria/crime-data/main/data/BKA_DD_all_years.csv`, {
            header: true,
            download: true,
            complete: function(results) {
                const data: any = {};
                results.data.forEach((element: any) => {
                    if (data.hasOwnProperty(element['Jahr'])) {
                        data[element['Jahr']].push(element);
                    } else {
                        data[element['Jahr']] = [];
                        data[element['Jahr']].push(element);
                    }
                });

                setBkaData(data);
            }
        });
    }

    const fetchLocalData = () => {
        setSelectedStat(LocalStatistics[0]);
        setYears([2020, 2020]);
        // Load the crime data for Dresden's neighborhoods.
        Papa.parse("https://raw.githubusercontent.com/ebaustria/crime-data/main/data/neighborhoods_crime.csv", {
            header: true,
            download: true,
            complete: function(results) {
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

        fetchGeoData(
            "https://raw.githubusercontent.com/offenesdresden/GeoData/master/Stadtteile-Dresden.geojson",
            json => {
                setGeoData(json);
            }
        );
    }

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
        if (showLocalView) {
            return geoData && yearlyData && updateLocalPercentiles(
                geoData,
                // @ts-ignore
                f => [f.properties.name, f.properties.official_name],
                yearlyData,
                selectedStat.value,
                years
            );
        }
        if (!showLocalView) {
            return geoData && yearlyData && updateNationalPercentiles(
                geoData,
                // @ts-ignore
                f => f.properties.name,
                yearlyData,
                selectedStat.value,
                years
            );
        }
    }, [showLocalView, geoData, years, yearlyData, selectedStat]);

    const handleChangeStatistics = (event: SelectChangeEvent, statistics: SelectMenuData[]) => {
        setHoverInfo(undefined);
        const newSelection = statistics.find(stat => stat.value === event.target.value);
        if (newSelection) {
            setSelectedStat(newSelection);
        }
    }

    return (
        <div className="app-container">
            <div className="left-container">
                <StaticBarChart chartData={[]} years={[]}/>

                <div className="placeholder">density plot</div>

                {yearlyData &&
                    <LineGraph
                        chartData={Object.keys(yearlyData).map(year => {
                            return (yearlyData[year][showLocalView ? "Insgesamt" : "Total"]);
                        })}
                        years={Object.keys(yearlyData).map(year => parseInt(year))}
                    />
                }
            </div>

            <div className="central-container">
                <Map
                    initialViewState={{
                        longitude: 13.7373,
                        latitude: 51.0504,
                        zoom: zoom
                    }}
                    onZoom={e => setZoom(e.target.getZoom())}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onMouseMove={onHover}
                    interactiveLayerIds={['data']}
                    mapboxAccessToken={MAPBOX_TOKEN}
                >
                    <Source type="geojson" data={data}>
                        <Layer {...getDataLayer(selectedStat.value)} />
                    </Source>
                    {hoverInfo && <MapTooltip label={selectedStat.label} hoverInfo={hoverInfo} />}
                </Map>
                    {(showLocalView && LocalStatistics.includes(selectedStat)) &&
                        <StatisticSelect
                            onChange={(event, child) => handleChangeStatistics(event, LocalStatistics)}
                            values={LocalStatistics}
                        />
                    }
                    {(!showLocalView && NationalStatistics.includes(selectedStat)) &&
                        <StatisticSelect
                            onChange={(event, child) => handleChangeStatistics(event, NationalStatistics)}
                            values={NationalStatistics}
                        />
                    }
                    <YearSlider
                        min={showLocalView ? 2016 : 2017}
                        max={showLocalView ? 2020 : 2019}
                        onChange={(ev, value, activeThumb) => {
                            setHoverInfo(undefined);
                            setYears(value as number[]);
                        }}
                        selectedStrings={years}
                    />
                    <PercChartSuspects years={years} chartData={bkaData} selectedStat={selectedStat}/>
                    <PercChartFirearm years={years} chartData={bkaData} selectedStat={selectedStat}/>

            </div>
            <div className="right-container">
                <div className="grid-cell">
                    {years[0] === years[1]
                        ? <PieChart year={years[0]} chartData={bkaData} selectedStat={selectedStat}/>
                        : <AreaChart years={years} chartData={bkaData} selectedStat={selectedStat}/>
                    }
                </div>
                <div className="grid-cell">
                    {years[0] === years[1] &&
                        <ColumnChart year={years[0]} chartData={bkaData} selectedStat={selectedStat}/>
                    }
                </div>
                <div className="grid-cell">
                    {years[0] === years[1] &&
                        <RadarChart chartData={bkaData} year={years[0]} selectedStat={selectedStat}/>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
