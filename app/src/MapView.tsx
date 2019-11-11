/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-11 19:12:43
 */
import React from 'react';
import $ from 'jquery';
import MapBox from './react-mapbox/MapBox';
import Color from './preference/Color';
import Dragable from './prototypes/Dragable';


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

class MapView extends Dragable<MapViewProps, MapViewState, {}> {
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
    private behaviour: 'zoom' | 'rect' | 'circle';
    private area: [[number, number], [number, number]] = [[0, 0], [0, 0]];
    private active: boolean;
    private highLighted: Array<number> = [];

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
        this.behaviour = 'zoom';
        this.active = false;
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
                <canvas key="2" id="highlight_canvas" ref="canvas2" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-925.6px',
                    pointerEvents: 'none'
                }} />
                <canvas key="A" id="interaction" ref="table" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-1392px',
                    display: 'none'
                }}
                onMouseDown={
                    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                        if (this.behaviour === 'zoom') {
                            return;
                        }
                        this.active = true;
                        this.area[0] = [event.clientY - 62, event.clientX - 325];
                        $(this.refs["area"])
                            .show()
                            .css('top', event.clientY - 62)
                            .css('left', event.clientX - 325)
                            .css('width', 0)
                            .css('height', 0);
                    }
                }
                onMouseMove={
                    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                        if (this.behaviour === 'zoom' || !this.active) {
                            return;
                        }
                        this.area[1] = [event.clientY - 62, event.clientX - 325];
                        if (this.behaviour === 'rect') {
                            $(this.refs["area"])
                                .css('border-radius', 0)
                                .css('top', Math.min(this.area[0][0], this.area[1][0]))
                                .css('left', Math.min(this.area[0][1], this.area[1][1]))
                                .css('height', Math.abs(this.area[0][0] - this.area[1][0]))
                                .css('width', Math.abs(this.area[0][1] - this.area[1][1]));
                        }
                        else {
                            let r: number = Math.sqrt(
                                Math.pow(this.area[0][0] - this.area[1][0], 2)
                                + Math.pow(this.area[0][1] - this.area[1][1], 2)
                            );
                            $(this.refs["area"])
                                .css('border-radius', r)
                                .css('top', this.area[0][0] - r)
                                .css('left', this.area[0][1] - r)
                                .css('height', 2 * r)
                                .css('width', 2 * r);
                        }
                    }
                }
                onMouseUp={
                    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                        if (this.behaviour === 'zoom' || !this.active) {
                            return;
                        }
                        this.active = false;
                        this.area[1] = [event.clientY - 62, event.clientX - 325];
                        if (this.behaviour === 'rect') {
                            $(this.refs["area"])
                                .css('border-radius', 0)
                                .css('top', Math.min(this.area[0][0], this.area[1][0]))
                                .css('left', Math.min(this.area[0][1], this.area[1][1]))
                                .css('height', Math.abs(this.area[0][0] - this.area[1][0]))
                                .css('width', Math.abs(this.area[0][1] - this.area[1][1]));
                        }
                        else {
                            let r: number = Math.sqrt(
                                Math.pow(this.area[0][0] - this.area[1][0], 2)
                                + Math.pow(this.area[0][1] - this.area[1][1], 2)
                            );
                            $(this.refs["area"])
                                .css('border-radius', r)
                                .css('top', this.area[0][0] - r)
                                .css('left', this.area[0][1] - r)
                                .css('height', 2 * r)
                                .css('width', 2 * r);
                        }
                        this.hightLightArea(this.behaviour);
                    }
                } />
                <div key="area" ref="area"
                style={{
                    border: `3px solid ${ Color.Nippon.Akabeni }`,
                    borderRadius: 0,
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    display: 'none'
                }} />
                <div ref="drag:target" key="tooltip"
                style={{
                    width: '40px',
                    height: '154px',
                    background: Color.Nippon.Aonibi,
                    position: 'absolute',
                    top: '32px',
                    left: '8px'
                }} >
                    <div ref="drag:trigger" key="header"
                    style={{
                        width: '40px',
                        height: '10px',
                        background: Color.Nippon.Aisumitya
                    }} />
                    <div key="button:move" ref="button:move"
                    style={{
                        width: '28px',
                        height: '28px',
                        margin: '5px',
                        border: `1px solid ${ Color.Nippon.Kurotobi }`,
                        background: Color.Nippon.Ro
                    }} >
                        <img src="./images/button1.png" alt="Drag"
                        style={{
                            width: '20px',
                            margin: '4px'
                        }}
                        onClick={
                            () => {
                                this.behaviour = 'zoom';
                                $(this.refs["area"]).hide();
                                $(this.refs["table"]).hide();
                                $(this.refs["button:move"])
                                    .css('border', `1px solid ${ Color.Nippon.Kurotobi }`)
                                    .css('background', Color.Nippon.Ro);
                                $(this.refs["button:rect"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                                $(this.refs["button:circle"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                            }
                        } />
                    </div>
                    <div key="button:rect" ref="button:rect"
                    style={{
                        width: '28px',
                        height: '28px',
                        margin: '5px',
                        border: `1px solid ${ Color.Nippon.Kuroturubami }`,
                        background: Color.Nippon.Kesizumi
                    }} >
                        <img src="./images/button2.png" alt="Rect"
                        style={{
                            width: '22px',
                            margin: '3px'
                        }}
                        onClick={
                            () => {
                                this.behaviour = 'rect';
                                $(this.refs["area"]).hide();
                                $(this.refs["table"]).show();
                                $(this.refs["button:move"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                                $(this.refs["button:rect"])
                                    .css('border', `1px solid ${ Color.Nippon.Kurotobi }`)
                                    .css('background', Color.Nippon.Ro);
                                $(this.refs["button:circle"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                            }
                        } />
                    </div>
                    <div key="button:circle" ref="button:circle"
                    style={{
                        width: '28px',
                        height: '28px',
                        margin: '5px',
                        border: `1px solid ${ Color.Nippon.Kuroturubami }`,
                        background: Color.Nippon.Kesizumi
                    }} >
                        <img src="./images/button3.png" alt="Circle"
                        style={{
                            width: '20px',
                            margin: '4px'
                        }}
                        onClick={
                            () => {
                                this.behaviour = 'circle';
                                $(this.refs["area"]).hide();
                                $(this.refs["table"]).show();
                                $(this.refs["button:move"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                                $(this.refs["button:rect"])
                                    .css('border', `1px solid ${ Color.Nippon.Kuroturubami }`)
                                    .css('background', Color.Nippon.Kesizumi);
                                $(this.refs["button:circle"])
                                    .css('border', `1px solid ${ Color.Nippon.Kurotobi }`)
                                    .css('background', Color.Nippon.Ro);
                            }
                        } />
                    </div>
                    <div key="button:reset" ref="button:reset"
                    style={{
                        width: '28px',
                        height: '28px',
                        margin: '5px',
                        border: `1px solid ${ Color.Nippon.Kuroturubami }`,
                        background: Color.Nippon.Kesizumi
                    }} >
                        <img src="./images/button4.png" alt="Reset"
                        style={{
                            width: '20px',
                            margin: '4px'
                        }}
                        onClick={
                            () => {
                                $(this.refs["area"]).hide();
                                this.highLighted = [];
                                this.highLightClass(-1);
                            }
                        } />
                    </div>
                </div>
            </div>
        )
    }

    public dragableComponentDidMount(): void {
        this.mounted = true;
        this.canvas = document.getElementById("map_layer_canvas") as HTMLCanvasElement;
        this.ctx = this.canvas!.getContext("2d");
        this.ctx!.globalAlpha = 0.8;
        this.canvas_2 = document.getElementById("highlight_canvas") as HTMLCanvasElement;
        this.ctx_2 = this.canvas_2!.getContext("2d");
        this.ctx_2!.globalAlpha = 0.8;

        (window as any)['update'] = this.sample.bind(this);
    }

    private sample(result: {[index: string]: Array<number>}): void {
        let set: Array<{
            id: string;
            lng: number;
            lat: number;
            words: string;
            day: string;
            city: string;
            sentiment: string;
            class: number;
        }> = [];
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                const element: Array<number> = result[key];
                element.forEach((idx: number) => {
                    set.push(this.state.data[idx]);
                });
            }
        }
        this.setState({
            data: set
        });
    }

    public componentDidUpdate(): void {
        // this.behaviour = 'zoom';
        if (this.highLighted.length > 0 && this.behaviour !== 'zoom') {
            this.hightLightArea(this.behaviour);
        }
        else {
            this.redraw();
        }
        // this.bounds = [[ 50.55349948549696, 22.86881607932105 ], [ -128.14621384226703, -67.85378615773539 ]];
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
        ready = [];
        for (let i: number = 0; i < 100; i++) {
            ready.push([]);
        }
        this.highLighted.forEach((idx: number) => {
            let d: {
                id: string, lng: number, lat: number, words: string,
                day: string, city: string, sentiment: string
            } = this.state.data[idx];
            ready[idx % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                ? Color.Nippon.Syozyohi
                : parseFloat(d.sentiment) > 0
                    ? Color.Nippon.Tokiwa
                    : Color.Nippon.Ukonn]);
        });
        ready.forEach((list: Array<[number, number, string]>, index: number) => {
            this.timers.push(
                setTimeout(() => {
                    list.forEach((d: [number, number, string]) => {
                        this.highLightPoint(d[0], d[1], d[2]);
                    });
                }, index * 10)
            );
        });
    }

    private hightLightArea(style: 'rect' | 'circle'): void {
        this.ctx_2!.clearRect(-2, -2, 790, 464.4);
        this.highLighted = [];
        $("#map_layer_canvas").css('opacity', 0.2);
        let ready: Array<Array<[number, number, string]>> = [];
        for (let i: number = 0; i < 100; i++) {
            ready.push([]);
        }
        if (style === 'rect') {
            let x: [number, number] = [
                Math.min(this.area[0][1], this.area[1][1]),
                Math.max(this.area[0][1], this.area[1][1])
            ];
            let y: [number, number] = [
                Math.min(this.area[0][0] - 24, this.area[1][0] - 24),
                Math.max(this.area[0][0] - 24, this.area[1][0] - 24)
            ];
            this.state.data.forEach((d: {
                id: string, lng: number, lat: number, words: string,
            day: string, city: string, sentiment: string, class: number}, index: number) => {
                if (this.fx(d.lng) >= x[0] && this.fx(d.lng) <= x[1] && this.fy(d.lat) >= y[0] && this.fy(d.lat) <= y[1]) {
                    ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                        ? Color.Nippon.Syozyohi
                                                        : parseFloat(d.sentiment) > 0
                                                            ? Color.Nippon.Tokiwa
                                                            : Color.Nippon.Ukonn]);
                    this.highLighted.push(index);
                }
            });
        }
        else {
            let r: number = Math.sqrt(
                Math.pow(this.area[0][0] - this.area[1][0], 2)
                + Math.pow(this.area[0][1] - this.area[1][1], 2)
            );
            let r2: number = Math.pow(this.area[0][0] - this.area[1][0], 2)
                + Math.pow(this.area[0][1] - this.area[1][1], 2);
            this.state.data.forEach((d: {
                id: string, lng: number, lat: number, words: string,
            day: string, city: string, sentiment: string, class: number}, index: number) => {
                if (this.fx(d.lng) < this.area[0][1] - r || this.fx(d.lng) > this.area[0][1] + r
                    || this.fy(d.lat) < this.area[0][0] - r - 24 || this.fy(d.lat) > this.area[0][0] + r + 24) {
                    return;
                }
                if (Math.pow(this.area[0][0] - this.fy(d.lat) - 24, 2)
                        + Math.pow(this.area[0][1] - this.fx(d.lng), 2) <= r2) {
                    ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                        ? Color.Nippon.Syozyohi
                                                        : parseFloat(d.sentiment) > 0
                                                            ? Color.Nippon.Tokiwa
                                                            : Color.Nippon.Ukonn]);
                    this.highLighted.push(index);
                }
            });
        }
        ready.forEach((list: Array<[number, number, string]>, index: number) => {
            this.timers.push(
                setTimeout(() => {
                    list.forEach((d: [number, number, string]) => {
                        this.highLightPoint(d[0], d[1], d[2]);
                    });
                }, index * 10)
            );
        });
        // $(this.refs["area"]).hide();
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
