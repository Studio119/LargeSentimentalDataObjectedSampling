/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-29 21:36:42 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-11 20:35:06
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

    public constructor(props: MapProps) {
        super(props);
        this.map = null;
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
}


export default MapBox;
