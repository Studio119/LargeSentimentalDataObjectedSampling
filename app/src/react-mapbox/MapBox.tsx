/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-29 21:36:42 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-29 21:47:40
 */

import React, {Component} from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

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
}


class MapBox extends Component<MapProps, {}, {}> {
    private map?: mapboxgl.Map | null;
    private layerData: any;
    private status: boolean;

    public constructor(props: MapProps) {
        super(props);
        this.map = null;
        this.status = false;
        this.layerData = {};
    }

    public render(): JSX.Element {
        return (
            <></>
        )
    }

    public componentDidMount(): void {
        mapboxgl.accessToken = this.props.accessToken;

        this.map = new mapboxgl.Map({
            style: this.props.styleURL ? this.props.styleURL : 'mapbox://styles/mapbox/streets-v10',
            center: [this.props.center[0], this.props.center[1]],
            zoom: this.props.zoom,
            minZoom: this.props.minZoom ? this.props.minZoom : this.props.zoom - 3,
            maxZoom: this.props.maxZoom ? this.props.maxZoom : this.props.zoom + 3,
            pitch: this.props.pitch ? this.props.pitch : 0,
            bearing: this.props.bearing ? this.props.bearing : 0,
            container: this.props.containerID,
            maxBounds: this.props.bounds
        });

        this.map.on('load', () => {
            this.map!.addSource('default', {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            });
            this.map!.addLayer({
                id: "default",
                type: "circle",
                source: "default",
                paint: {
                    "circle-radius": 2,
                    "circle-color": "#B42222"
                }
            });
            this.layerData = { 'default': [] };
            this.status = true;
        });
    }

    public appendPoint(key: string, latlng: [number, number], source: string = 'default'): void {
        if (!this.status) {
            setTimeout(() => this.appendPoint(key, latlng), 400);
            return;
        }
        (this.layerData[source] as Array<Feature<Geometry, GeoJsonProperties>>).push({
            type: "Feature",
            properties: { dbh: 5 },
            geometry: {
                type: "Point",
                coordinates: [latlng[1], latlng[0]]
            }
        });
        (this.map!.getSource(source) as GeoJSONSource).setData({
            type: "FeatureCollection",
            features: (this.layerData[source] as Array<Feature<Geometry, GeoJsonProperties>>)
        });
    }
}


export default MapBox;
