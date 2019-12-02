/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-29 21:36:42 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-12-01 18:32:33
 */

import React, {Component} from 'react';
import $ from 'jquery';
// import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
// import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import './MapBox.css';


export interface MapProps {
    accessToken: string;
    styleURL?: string;
    containerID: string;
    center: [number, number];
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    bounds?: [[number, number], [number, number]];
    pitch?: number;
    bearing?: number;
    onDragEnd: (bounds: [[number, number], [number, number]]) => void | null | undefined;
    onZoomEnd: (bounds: [[number, number], [number, number]]) => void | null | undefined;
}


class MapBox extends Component<MapProps, {}, {}> {
    private map?: mapboxgl.Map | null;
    // private layerData: any;
    // private status: boolean;
    private heatmap: any;
    private loaded: boolean = false;

    public constructor(props: MapProps) {
        super(props);
        this.map = null;
        this.heatmap = null;
        // this.status = false;
        // this.layerData = {};
    }

    public render(): JSX.Element {
        return (
            <></>
        )
    }

    public componentDidMount(): void {
        mapboxgl.accessToken = this.props.accessToken;

        this.map = new mapboxgl.Map({
            attributionControl: false,
            interactive: true,
            style: this.props.styleURL ? this.props.styleURL : 'mapbox://styles/mapbox/streets-v10',
            center: [this.props.center[0], this.props.center[1]],
            zoom: this.props.zoom,
            minZoom: this.props.minZoom ? this.props.minZoom : this.props.zoom - 3,
            maxZoom: this.props.maxZoom ? this.props.maxZoom : this.props.zoom + 3,
            pitch: this.props.pitch ? this.props.pitch : 0,
            bearing: this.props.bearing ? this.props.bearing : 0,
            container: this.props.containerID,
            maxBounds: this.props.bounds,
            refreshExpiredTiles: false
        });

        this.map.on('load', () => {
            $('.mapboxgl-canvas').css('opacity', '0.5').css('position', 'relative');//.css('top', '-472px').css('height', '466px');
            this.loaded = true;
            
            // this.map!.addSource('default', {
            //     type: "geojson",
            //     data: {
            //         type: "FeatureCollection",
            //         features: []
            //     }
            // });
            // this.map!.addLayer({
            //     id: "default",
            //     type: "circle",
            //     source: "default",
            //     paint: {
            //         "circle-radius": 2.4,
            //         "circle-color": ['get', 'color']
            //     }
            // });
            // this.layerData = { 'default': [] };
            // this.status = true;

            this.props.onDragEnd([
                [this.map!.getBounds().getNorth(), this.map!.getBounds().getSouth()],
                [this.map!.getBounds().getWest(), this.map!.getBounds().getEast()]
            ]);
            
            this.map!.on('zoomend', () => {
                this.props.onZoomEnd([
                    [this.map!.getBounds().getNorth(), this.map!.getBounds().getSouth()],
                    [this.map!.getBounds().getWest(), this.map!.getBounds().getEast()]
                ]);
            })
            .on('zoom', () => {
                if (((new Date()).getMilliseconds() >= 10 && (new Date()).getMilliseconds() < 500)
                        || ((new Date()).getMilliseconds() >= 510 && (new Date()).getMilliseconds() < 1000)) {
                    return;
                }
                this.props.onDragEnd([
                    [this.map!.getBounds().getNorth(), this.map!.getBounds().getSouth()],
                    [this.map!.getBounds().getWest(), this.map!.getBounds().getEast()]
                ]);
            })
            .on('drag', () => {
                if (((new Date()).getMilliseconds() >= 10 && (new Date()).getMilliseconds() < 500)
                        || ((new Date()).getMilliseconds() >= 510 && (new Date()).getMilliseconds() < 1000)) {
                    return;
                }
                this.props.onDragEnd([
                    [this.map!.getBounds().getNorth(), this.map!.getBounds().getSouth()],
                    [this.map!.getBounds().getWest(), this.map!.getBounds().getEast()]
                ]);
            })
            .on('dragend', () => {
                this.props.onDragEnd([
                    [this.map!.getBounds().getNorth(), this.map!.getBounds().getSouth()],
                    [this.map!.getBounds().getWest(), this.map!.getBounds().getEast()]
                ]);
            });
        });

        // setInterval(() => {
        //     console.log(this.map!.getBounds().getNorthEast().toArray(), this.map!.getBounds().getSouthWest().toArray());
        // }, 2000);
    }

    // public addSource(id: string, color: string): void {
    //     if (!this.status) {
    //         setTimeout(() => this.addSource(id, color));
    //         return;
    //     }
    //     this.map!.addSource(id, {
    //         type: "geojson",
    //         data: {
    //             type: "FeatureCollection",
    //             features: []
    //         }
    //     });
    //     this.map!.addLayer({
    //         id: id,
    //         type: "circle",
    //         source: id,
    //         paint: {
    //             "circle-radius": 2.4,
    //             "circle-color": ['get', 'color']
    //         }
    //     });
    //     this.layerData[id] = [];
    //     this.status = true;
    // }

    // public appendPoint(key: string, latlng: [number, number], color: string, source: string = 'default'): void {
    //     if (!this.status) {
    //         setTimeout(() => this.appendPoint(key, latlng, color, source), 400);
    //         return;
    //     }
    //     (this.layerData[source] as Array<Feature<Geometry, GeoJsonProperties>>).push({
    //         type: "Feature",
    //         properties: {
    //             dbh: 5,
    //             color: color
    //         },
    //         geometry: {
    //             type: "Point",
    //             coordinates: [latlng[1], latlng[0]]
    //         }
    //     });
    //     (this.map!.getSource(source) as GeoJSONSource).setData({
    //         type: "FeatureCollection",
    //         features: (this.layerData[source] as Array<Feature<Geometry, GeoJsonProperties>>)
    //     });
    // }

    public updateHeatMap(points: Array<[number, number]>): void {
        if (!this.loaded || (!this.map!.getSource("heatmap"))) {
            if (this.loaded && !this.heatmap) {
                this.callHeatMap();
            }
            setTimeout(() => {
                this.updateHeatMap(points);
            }, 400);
            return;
        }
        let data: any = [];
        points.forEach((p: [number, number]) => {
            data.push({
                "type": "Feature",
                "properties": {
                    "mag": 1
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [ p[0], p[1], 0.0 ]
                }
            });
        });
        
        (this.map!.getSource("heatmap") as mapboxgl.GeoJSONSource).setData({
            "type": "FeatureCollection",
            "features": data
        });
    }

    public callHeatMap(): void {
        if (!this.loaded) {
            setTimeout(this.callHeatMap, 400);
            return;
        }
        if (!this.heatmap) {
            this.map!.addSource("heatmap", { type: "geojson", data: {
                "type": "FeatureCollection",
                "features": []
            } });
            this.map!.addLayer({
                id: "heatmapLayer",
                source: "heatmap",
                type: "heatmap",
                // maxzoom: 9,
                paint: {
                  // Increase the heatmap weight based on frequency and property magnitude
                  "heatmap-weight": [
                    "interpolate", ["linear"],
                    ["get", "mag"],
                    0, 0,
                    100, 0.2,
                    5000, 0.6,
                    10000, 0.7,
                    500000, 1
                  ],
                  // Increase the heatmap color weight weight by zoom level
                  // heatmap-intensity is a multiplier on top of heatmap-weight
                  "heatmap-intensity": [
                    "interpolate", ["linear"],
                    ["zoom"],
                    0, 1,
                    10, 3,
                  ],
                  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                  // Begin color ramp at 0-stop with a 0-transparancy color
                  // to create a blur-like effect.
                  "heatmap-color": [
                    "interpolate", ["linear"],
                    ["heatmap-density"],
                    0, 'rgba(34,125,81,0)',
                    0.2, 'rgba(129,199,212,0.46)',
                    0.4, 'rgba(102,186,183,0.54)',
                    0.6, 'rgba(66,90,74,0.63)',
                    0.8, 'rgba(255,196,8,0.72)',
                    1, 'rgba(208,16,76,0.8)',
                  ],
                  // Adjust the heatmap radius by zoom level
                  "heatmap-radius": [
                    "interpolate", ["linear"],
                    ["zoom"],
                    0, 39,
                    100, 28,
                    5000, 20,
                    10000, 14,
                    500000, 10
                  ],
                  // Transition from heatmap to circle layer by zoom level
                  "heatmap-opacity": [
                    "interpolate", ["linear"],
                    ["zoom"],
                    7, 1,
                    9, 0.2,
                  ],
                },
              });
            this.heatmap = true;
            this.callHeatMap();
        }
    }
}


export default MapBox;
