/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-10 22:02:45
 */
import React, { Component } from 'react';
import $ from 'jquery';
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
    data: Array<{
        id: string;
        lng: number;
        lat: number;
        words: string;
        day: string;
        city: string;
        sentiment: string;
        class: number;
    }>;
}

class MapView extends Component<MapViewProps, MapViewState, {}> {
    private map?: MapBox;
    private originBounds: Readonly<[[number, number], [number, number]]>
        = [[ 50.55349948549696, 22.86881607932105 ], [ -128.14621384226703, -67.85378615773539 ]];
    private bounds: [[number, number], [number, number]]
        = [[ 50.55349948549696, 22.86881607932105 ], [ -128.14621384226703, -67.85378615773539 ]];
    private mounted: boolean;
    private canvas: null | HTMLCanvasElement;
    private lastStyle: string;
    private ctx: null | CanvasRenderingContext2D;
    private canvas_2: null | HTMLCanvasElement;
    private lastStyle_2: string;
    private ctx_2: null | CanvasRenderingContext2D;
    private timers: Array<NodeJS.Timeout>;

    public constructor(props: MapViewProps) {
        super(props);
        this.mounted = false;
        this.state = { data: [] };
        this.canvas = null;
        this.ctx = null;
        this.lastStyle = '#FF0000';
        this.canvas_2 = null;
        this.ctx_2 = null;
        this.lastStyle_2 = '#FF0000';
        this.timers = [];
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
            }} >
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
                id={ this.props.id + ">>" }
                style={{
                    height: '461px',
                    width: '788px'
                }} >
                    {
                        this.mounted
                            ? <MapBox
                                accessToken={ "pk.eyJ1IjoiaWNoZW4tYW50b2luZSIsImEiOiJjazF5bDh5eWUwZ2tiM2NsaXQ3bnFvNGJ1In0.sFDwirFIqR4UEjFQoKB8uA" }
                                styleURL={"mapbox://styles/ichen-antoine/ck1504bas09eu1cs1op2eqsnu"}
                                containerID={ this.props.id + ">>" } center={ this.props.center } zoom={ this.props.zoom }
                                minZoom={ this.props.minZoom } maxZoom={ this.props.maxZoom } ref="map"
                                onDragEnd={ this.onDragEnd.bind(this) }
                                onZoomEnd={ this.onZoomEnd.bind(this) } />
                            : null
                    }
                </div>
                <canvas key="1" id="map_layer_canvas" ref="canvas" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-462px',
                    pointerEvents: 'none'
                }} />
                <canvas key="2" id="highlight_canvas" ref="canvas" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-925.6px',
                    pointerEvents: 'none'
                }} />
            </div>
        )
    }

    public componentDidMount(): void {
        this.mounted = true;
        this.canvas = document.getElementById("map_layer_canvas") as HTMLCanvasElement;
        this.ctx = this.canvas!.getContext("2d");
        this.ctx!.globalAlpha = 0.8;
        this.canvas_2 = document.getElementById("highlight_canvas") as HTMLCanvasElement;
        this.ctx_2 = this.canvas_2!.getContext("2d");
        this.ctx_2!.globalAlpha = 0.8;
    }

    public componentDidUpdate(): void {
        this.redraw();
        this.bounds = [[ 50.55349948549696, 22.86881607932105 ], [ -128.14621384226703, -67.85378615773539 ]];
        
        this.map = this.refs['map'] as MapBox;
    }

    private redraw(): void {
        this.ctx!.clearRect(-2, -2, 790, 464.4);
        this.ctx_2!.clearRect(-2, -2, 790, 464.4);
        this.timers.forEach((timer: NodeJS.Timeout) => {
            clearTimeout(timer);
        });
        this.timers = [];
        let ready: Array<Array<[number, number, string]>> = [];
        for (let i: number = 0; i < 100; i++) {
            ready.push([]);
        }
        this.state.data.forEach((d: {
            id: string, lng: number, lat: number, words: string,
        day: string, city: string, sentiment: string}, index: number) => {
            if (d.lat >= 0 || d.lat < 0 || d.lng >= 0 || d.lng < 0) {
                ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                    ? Color.Nippon.Syozyohi
                                                    : parseFloat(d.sentiment) > 0
                                                        ? Color.Nippon.Tokiwa
                                                        : Color.Nippon.Ukonn]);
            }
        });
        ready.forEach((list: Array<[number, number, string]>, index: number) => {
            this.timers.push(
                setTimeout(() => {
                    list.forEach((d: [number, number, string]) => {
                        this.addPoint(d[0], d[1], d[2]);
                    });
                }, index * 10)
            );
        });
    }

    private onDragEnd(bounds: [[number, number], [number, number]]): void {
        this.bounds = bounds;
        this.redraw();
    }

    private onZoomEnd(bounds: [[number, number], [number, number]]): void {
        this.bounds = bounds;
        this.redraw();
    }

    private fx(d: number): number {
        return (d - this.bounds[1][0]) / (this.bounds[1][1] - this.bounds[1][0]) * 788;
    }

    private fy(d: number): number {
        d = (d - this.bounds[0][0]) / (this.bounds[0][1] - this.bounds[0][0])
            * (this.originBounds[0][1] - this.originBounds[0][0]) + this.originBounds[0][0]
            + 2 * (1 - (this.bounds[0][1] - this.bounds[0][0]) / (this.originBounds[0][1] - this.originBounds[0][0]));
        return 462.4 * (d * d * (-0.00025304519602050573) - d * 0.01760550015218513 + 1.5344062688366468);
    }

    private addPoint(x: number, y: number, style: string): void {
        if (style !== this.lastStyle) {
            this.ctx!.fillStyle = style;
            this.lastStyle = style;
        }
        x = this.fx(x) - 1;
        y = this.fy(y) - 1;
        this.ctx!.fillRect(x, y, 2, 2);
    }

    private highLightPoint(x: number, y: number, style: string): void {
        if (style !== this.lastStyle_2) {
            this.ctx_2!.fillStyle = style;
            this.lastStyle_2 = style;
        }
        x = this.fx(x) - 1.5;
        y = this.fy(y) - 1.5;
        this.ctx_2!.fillRect(x, y, 3, 3);
    }

    public importClass(data: Array<number>): void {
        let box: Array<{
                id: string;
                lng: number;
                lat: number;
                words: string;
                day: string;
                city: string;
                sentiment: string;
                class: number;
            }> = this.state.data;
        for (let i: number = 0; i < data.length; i++) {
            box[i].class = data[i];
        }
        this.setState({
            data: box
        });
        (window as any)['show'] = this.highLightClass.bind(this);
        (window as any)['highlight'] = this.highlight.bind(this);
    }

    private highLightClass(index: number): void {
        this.ctx_2!.clearRect(-2, -2, 790, 464.4);
        if (index === -1) {
            $("#map_layer_canvas").css('opacity', 1);
            return;
        }
        else {
            $("#map_layer_canvas").css('opacity', 0.2);
            let ready: Array<[number, number, string]> = [];
            this.state.data.forEach((d: {
                id: string, lng: number, lat: number, words: string,
            day: string, city: string, sentiment: string, class: number}) => {
                if (d.class === index && (d.lat >= 0 || d.lat < 0 || d.lng >= 0 || d.lng < 0)) {
                    ready.push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                        ? Color.Nippon.Syozyohi
                                                        : parseFloat(d.sentiment) > 0
                                                            ? Color.Nippon.Tokiwa
                                                            : Color.Nippon.Ukonn]);
                }
            });
            ready.forEach((d: [number, number, string]) => {
                this.highLightPoint(d[0], d[1], d[2]);
            });
        }
    }

    private highlight(points: Array<number> | 'all'): void {
        this.ctx_2!.clearRect(-2, -2, 790, 464.4);
        if (points === 'all') {
            $("#map_layer_canvas").css('opacity', 1);
            return;
        }
        else {
            $("#map_layer_canvas").css('opacity', 0.2);
            let ready: Array<[number, number, string]> = [];
            points.forEach((index: number) => {
                const d: {
                    id: string, lng: number, lat: number, words: string,
                    day: string, city: string, sentiment: string, class: number
                } = this.state.data[index];
                ready.push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                        ? Color.Nippon.Syozyohi
                                                        : parseFloat(d.sentiment) > 0
                                                            ? Color.Nippon.Tokiwa
                                                            : Color.Nippon.Ukonn]);
            });
            ready.forEach((d: [number, number, string]) => {
                this.highLightPoint(d[0], d[1], d[2]);
            });
        }
    }
}

export default MapView;
