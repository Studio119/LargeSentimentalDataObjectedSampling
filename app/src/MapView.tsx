/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-03 00:43:21
 */
import React, { Component } from 'react';
import MapBox from './react-mapbox/MapBox';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapViewProps {
    id: string;
    center: [number, number];
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    options?: L.MapOptions;
}

export interface MapViewState {
    data: Array<{ id: string, lng: number, lat: number, words: string, day: string, city: string, sentiment: string }>;
}

class MapView extends Component<MapViewProps, MapViewState, {}> {
    private mounted: boolean;

    public constructor(props: MapViewProps) {
        super(props);
        this.mounted = false;
        this.state = { data: [] };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    position: 'absolute',
                    left: '18.22%',
                    top: '67px',
                    height: '486px',
                    width: '829px',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
                {
                    this.mounted
                        ? <MapBox
                            accessToken={ "pk.eyJ1IjoiaWNoZW4tYW50b2luZSIsImEiOiJjanp0OWE4OTcwMWpzM2hwZm55bzI3YW04In0.n1R77KvU56MZXAuHVez9hw" }
                            styleURL={"mapbox://styles/ichen-antoine/ck1504bas09eu1cs1op2eqsnu"}
                            containerID={ this.props.id } center={ this.props.center } zoom={ this.props.zoom }
                            minZoom={ this.props.minZoom } maxZoom={ this.props.maxZoom } ref="map" />
                        : <></>
                }
            </div>
        )
    }

    public componentDidMount(): void {
        this.mounted = true;
    }

    public componentDidUpdate(): void {
        let count: number = 0;
        this.state.data.forEach((d: {
            id: string, lng: number, lat: number, words: string,
        day: string, city: string, sentiment: string}, index: number) => {
            // if (index % 100 !== 0) {
            //     return;
            // }
            if (d.lat >= 0 || d.lat < 0 || d.lng >= 0 || d.lng < 0) {
                (this.refs["map"] as MapBox).appendPoint(d.id, [d.lat, d.lng], parseFloat(d.sentiment) < 0 ? 'red' : parseFloat(d.sentiment) > 0 ? 'green' : 'yellow');
                count++;
            }
        });
        console.log(`TOTAL: ${ count }`);
    }
}

export default MapView;
