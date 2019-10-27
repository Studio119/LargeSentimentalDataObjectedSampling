/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-10 14:26:39
 */
import React, { Component } from 'react';
import MapBox from './react-mapbox/MapBox';
import Color from './preference/Color';


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
                left: '322px',
                top: '59px',
                height: '486px',
                width: '788px',
                background: 'white',
                border: '1px solid rgb(149,188,239)',
                fontSize: '12.4px'
            }}>
                <div
                style={{
                    height: '22px',
                    width: '772px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    paddingTop: '2px',
                    letterSpacing: '2px',
                    fontSize: 'larger'
                }} >
                    Map View
                </div>
                <div
                style={{
                    height: '462px',
                    width: '773px'
                }} >
                    {
                        this.mounted
                            ? <MapBox
                                accessToken={ "pk.eyJ1IjoiaWNoZW4tYW50b2luZSIsImEiOiJjazF5bDh5eWUwZ2tiM2NsaXQ3bnFvNGJ1In0.sFDwirFIqR4UEjFQoKB8uA" }
                                styleURL={"mapbox://styles/ichen-antoine/ck1504bas09eu1cs1op2eqsnu"}
                                containerID={ this.props.id } center={ this.props.center } zoom={ this.props.zoom }
                                minZoom={ this.props.minZoom } maxZoom={ this.props.maxZoom } ref="map" />
                            : <></>
                    }
                </div>
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
            if (index % 100 !== 0) {
                return;
            }
            if (d.lat >= 0 || d.lat < 0 || d.lng >= 0 || d.lng < 0) {
                (this.refs["map"] as MapBox).appendPoint(d.id, [d.lat, d.lng],
                    parseFloat(d.sentiment) < 0
                        ? Color.Nippon.Syozyohi
                        : parseFloat(d.sentiment) > 0
                            ? Color.Nippon.Tokiwa
                            : Color.Nippon.Ukonn
                );
                count++;
            }
        });
        console.log(`TOTAL: ${ count }`);
    }
}

export default MapView;
