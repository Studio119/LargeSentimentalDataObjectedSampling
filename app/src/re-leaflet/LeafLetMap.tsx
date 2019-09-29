/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-25 18:59:40 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-29 20:02:46
 */

import React, { Component } from "react";
import L from "leaflet";
import './leaflet.css';

export interface LeafLetMapProps {
    element: string | HTMLElement;
    center: [number, number];
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    options?: L.MapOptions;
}

export interface LeafLetMapState {}

class LeafLetMap extends Component<LeafLetMapProps, LeafLetMapState, {}> {
    protected map: L.Map | null;
    protected layers: Array<L.FeatureGroup<any>>;

    public constructor(props: LeafLetMapProps) {
        super(props);
        this.map = null;
        this.layers = [];
    }

    public componentDidMount(): void {
        let maxZoom: number = this.props.maxZoom ? this.props.maxZoom
            : this.props.options && this.props.options.maxZoom ? this.props.options.maxZoom : this.props.zoom + 3;
        let minZoom: number = this.props.minZoom ? this.props.minZoom
                : this.props.options && this.props.options.minZoom ? this.props.options.minZoom : this.props.zoom - 3;
        this.map = L.map(this.props.element, { ...this.props.options, zoom: this.props.zoom, center: this.props.center,
                    maxZoom: maxZoom, minZoom: minZoom });
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: maxZoom,
            minZoom: minZoom,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiaWNoZW4tYW50b2luZSIsImEiOiJjanp0OWE4OTcwMWpzM2hwZm55bzI3YW04In0.n1R77KvU56MZXAuHVez9hw'
        }).addTo(this.map);
        this.addLayer();
    }

    public render(): JSX.Element {
        return (<></>);
    }

    public addLayer(layers?: L.Layer[] | undefined, options?: L.LayerOptions | undefined): void {
        this.layers.push(new L.FeatureGroup(layers, options));
    }

    public layer(index: number): L.FeatureGroup<any> {
        return this.layers[index];
    }

    public addPoint(lat: number, lng: number, options: L.CircleMarkerOptions | undefined,
            comment?: string | ((layer: L.Layer) => L.Content) | HTMLElement | L.Popup): void {
        let point: L.Circle<any> = L.circle([lat, lng], 1, {
            color: 'red',
            fillColor: '#f03',
            ...options
        }).addTo(this.map!);
        if (comment) {
            point.bindPopup(comment);
        }
    }
}


export default LeafLetMap;
