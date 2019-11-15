/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-15 18:36:53
 */
import React from 'react';
import $ from 'jquery';
import MapBox from './react-mapbox/MapBox';
import Color from './preference/Color';
import Dragable from './prototypes/Dragable';
import { Globe } from './App';


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
    sampled: Array<number>;
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
    private rounds: Array<{
        element: JQuery<HTMLElement>;
        data: Array<number>;
        count: number;
        data_sp: Array<number>;
        count_sp: number;
    }> = [];

    public constructor(props: MapViewProps) {
        super(props);
        this.mounted = false;
        this.state = { data: [], sampled: [] };
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
                {/* 这个画布用于展现全部的点 */}
                <canvas key="1" id="map_layer_canvas" ref="canvas" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-462px',
                    pointerEvents: 'none'
                }} />
                {/* 这个画布用于展现被高亮的点 */}
                <canvas key="2" id="highlight_canvas" ref="canvas2" width="788px" height="462.4px" style={{
                    position: 'relative',
                    top: '-925.6px',
                    pointerEvents: 'none'
                }} />
                {/* 这个元素用于放置每一个框选的交互组件 */}
                <svg ref="svg"
                xmlns={`http://www.w3.org/2000/svg`}
                style={{
                    width: '788px',
                    height: '462.2px',
                    position: 'absolute',
                    left: '0px',
                    top: '24px',
                    pointerEvents: 'none'
                }} />
                {/* 这个画布用于接受框选交互事件 */}
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
                                $(this.refs['svg']).html("");
                                this.rounds = [];
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
                                $(this.refs['svg']).html("");
                                this.rounds = [];
                                Globe.update("all");
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

        Globe.highlightClass = this.highLightClass.bind(this);
        Globe.getPoint = (idx: number) => {
            return this.state.data[idx];
        };
        Globe.highlight = this.highlight.bind(this);
    }

    public componentDidUpdate(): void {
        $(this.refs['svg']).html("");
        this.rounds = [];
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
                                                        ? Color.Nippon.Ruri // Tokiwa
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
                    ? Color.Nippon.Ruri // Tokiwa
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
        // this.ctx_2!.clearRect(-2, -2, 790, 464.4);
        // this.highLighted = [];
        let heap: Array<number> = [];
        let count: number = 0;
        for (let i: number = 0; i < 20; i++) {
            heap.push(0);
        }
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
            if (this.state.sampled.length > 0) {
                this.state.sampled.forEach((index: number) => {
                    if (index >= this.state.data.length) {
                        return;
                    }
                    const d: {
                        id: string;
                        lng: number;
                        lat: number;
                        words: string;
                        day: string;
                        city: string;
                        sentiment: string;
                        class: number;
                    } = this.state.data[index];
                    if (this.fx(d.lng) >= x[0] && this.fx(d.lng) <= x[1] && this.fy(d.lat) >= y[0] && this.fy(d.lat) <= y[1]) {
                        ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                            ? Color.Nippon.Syozyohi
                                                            : parseFloat(d.sentiment) > 0
                                                                ? Color.Nippon.Ruri // Tokiwa
                                                                : Color.Nippon.Ukonn]);
                        this.highLighted.push(index);
                        heap[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        count++;
                    }
                });
            }
            else {
                this.state.data.forEach((d: {
                    id: string, lng: number, lat: number, words: string,
                day: string, city: string, sentiment: string, class: number}, index: number) => {
                    if (this.fx(d.lng) >= x[0] && this.fx(d.lng) <= x[1] && this.fy(d.lat) >= y[0] && this.fy(d.lat) <= y[1]) {
                        ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                            ? Color.Nippon.Syozyohi
                                                            : parseFloat(d.sentiment) > 0
                                                                ? Color.Nippon.Ruri // Tokiwa
                                                                : Color.Nippon.Ukonn]);
                        this.highLighted.push(index);
                        heap[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        count++;
                    }
                });
            }
        }
        else {
            let heap_origin: Array<number> = [];
            let count_origin: number = 0;
            let r2: number = Math.pow(this.area[0][0] - this.area[1][0], 2)
                + Math.pow(this.area[0][1] - this.area[1][1], 2);
            let r: number = Math.sqrt(r2);
            if (this.state.sampled.length > 0) {
                this.state.sampled.forEach((index: number) => {
                    if (index >= this.state.data.length) {
                        return;
                    }
                    const d: {
                        id: string;
                        lng: number;
                        lat: number;
                        words: string;
                        day: string;
                        city: string;
                        sentiment: string;
                        class: number;
                    } = this.state.data[index];
                    if (this.fx(d.lng) < this.area[0][1] - r || this.fx(d.lng) > this.area[0][1] + r
                        || this.fy(d.lat) < this.area[0][0] - r - 24 || this.fy(d.lat) > this.area[0][0] + r + 24) {
                        return;
                    }
                    if (Math.pow(this.area[0][0] - this.fy(d.lat) - 24, 2)
                            + Math.pow(this.area[0][1] - this.fx(d.lng), 2) <= r2) {
                        ready[index % 100].push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                            ? Color.Nippon.Syozyohi
                                                            : parseFloat(d.sentiment) > 0
                                                                ? Color.Nippon.Ruri // Tokiwa
                                                                : Color.Nippon.Ukonn]);
                        this.highLighted.push(index);
                        heap[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        count++;
                    }
                });
                this.state.data.forEach((d: {
                    id: string, lng: number, lat: number, words: string,
                day: string, city: string, sentiment: string, class: number}) => {
                    if (this.fx(d.lng) < this.area[0][1] - r || this.fx(d.lng) > this.area[0][1] + r
                        || this.fy(d.lat) < this.area[0][0] - r - 24 || this.fy(d.lat) > this.area[0][0] + r + 24) {
                        return;
                    }
                    if (Math.pow(this.area[0][0] - this.fy(d.lat) - 24, 2)
                            + Math.pow(this.area[0][1] - this.fx(d.lng), 2) <= r2) {
                        heap_origin[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        count_origin++;
                    }
                });
            }
            else {
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
                                                                ? Color.Nippon.Ruri // Tokiwa
                                                                : Color.Nippon.Ukonn]);
                        this.highLighted.push(index);
                        heap_origin[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        count_origin++;
                    }
                });
            }
            this.analyze(heap_origin, count_origin, heap, count, r);
            if (count > 0) {
                Globe.update(heap);
            }
            else {
                Globe.update(heap_origin);
            }
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
        $(this.refs["area"]).hide();
    }

    private analyze(heap_ori: Array<number>, count_ori: number, heap_sp: Array<number>, count_sp: number, r: number): void {
        const heap: Array<number> = count_sp === 0 ? heap_ori : heap_sp;
        const count: number = count_sp === 0 ? count_ori : count_sp;
        let circle: JQuery<HTMLElement> = $($.parseXML(
            `<circle xmlns="http://www.w3.org/2000/svg" `
            + `class="chosen" `
            + `cx="${ this.area[0][1] + 1 }px" cy="${ this.area[0][0] - 22 }px" r="${ r + 2.5 }px" `
            + `style="`
                + `fill: none; `
                + `stroke: ${ Color.Nippon.Hasita + "C0" }; `
                + `stroke-width: 2px; `
                + `pointer-Events: none; `
            + `" `
            + `/>`
        ).documentElement);
        $(this.refs['svg']).append(circle);
        this.rounds.push({
            element: circle,
            data: heap,
            count: count,
            data_sp: heap_sp,
            count_sp: count_sp
        });
        for (let i: number = 0; i < 20; i++) {
            const r2: number = r + Math.sqrt(r * 2 + 36) * (0.2 + heap[i] / count);
            let arc: JQuery<HTMLElement> = $($.parseXML(
                `<path xmlns="http://www.w3.org/2000/svg" `
                + `class="arc" `
                + `d="M${ this.area[0][1] + 1 + Math.sin(i / 20 * 2 * Math.PI) * (r + 3) },`
                    + `${ this.area[0][0] - 22 - Math.cos(i / 20 * 2 * Math.PI) * (r + 3) }`
                    + ` A${ r + 3 },${ r + 3 },0,0,1,`
                    + `${ this.area[0][1] + 1 + Math.sin((i + 1) / 20 * 2 * Math.PI) * (r + 3) },`
                    + `${ this.area[0][0] - 22 - Math.cos((i + 1) / 20 * 2 * Math.PI) * (r + 3) }`
                    + ` L${ this.area[0][1] + 1 + Math.sin((i + 1) / 20 * 2 * Math.PI) * (r2 + 3) },`
                    + `${ this.area[0][0] - 22 - Math.cos((i + 1) / 20 * 2 * Math.PI) * (r2 + 3) }`
                    + ` A${ r + 3 },${ r + 3 },0,0,0,`
                    + `${ this.area[0][1] + 1 + Math.sin(i / 20 * 2 * Math.PI) * (r2 + 3) },`
                    + `${ this.area[0][0] - 22 - Math.cos(i / 20 * 2 * Math.PI) * (r2 + 3) }`
                    + ` Z" `
                + `style="`
                    // + `fill: ${ Color.interpolate(
                    //     Color.Nippon.Syozyohi + "C0",
                    //     Color.Nippon.Ruri + "C0",
                    //     i / 19
                    // ) }; `
                    + `fill: ${ this.getColor(i) }; `
                    + `stroke: none; `
                    + `pointer-Events: none; `
                + `" `
                + `/>`
            ).documentElement);
            $(this.refs['svg']).append(arc);
            if (count_sp > 0) {
                // const color: string = Color.interpolate(
                //     Color.Nippon.Syozyohi + "C0",
                //     Color.Nippon.Ruri + "C0",
                //     i / 19
                // );
                const color: string = this.getColor(i);
                const lightness: number = Color.toHsl(color).l;
                let arc_sp: JQuery<HTMLElement> = $($.parseXML(
                    `<path xmlns="http://www.w3.org/2000/svg" `
                    + `class="arc" `
                    + `d="M${ this.area[0][1] + 1 + Math.sin((i + 0.35) / 20 * 2 * Math.PI) * (r + 3) },`
                        + `${ this.area[0][0] - 22 - Math.cos((i + 0.35) / 20 * 2 * Math.PI) * (r + 3) }`
                        + ` A${ r + 3 },${ r + 3 },0,0,1,`
                        + `${ this.area[0][1] + 1 + Math.sin((i + 0.65) / 20 * 2 * Math.PI) * (r + 3) },`
                        + `${ this.area[0][0] - 22 - Math.cos((i + 0.65) / 20 * 2 * Math.PI) * (r + 3) }`
                        + ` L${ this.area[0][1] + 1 + Math.sin((i + 0.65) / 20 * 2 * Math.PI) * (r2 + 3) },`
                        + `${ this.area[0][0] - 22 - Math.cos((i + 0.65) / 20 * 2 * Math.PI) * (r2 + 3) }`
                        + ` A${ r + 3 },${ r + 3 },0,0,0,`
                        + `${ this.area[0][1] + 1 + Math.sin((i + 0.35) / 20 * 2 * Math.PI) * (r2 + 3) },`
                        + `${ this.area[0][0] - 22 - Math.cos((i + 0.35) / 20 * 2 * Math.PI) * (r2 + 3) }`
                        + ` Z" `
                    + `style="`
                        + `fill: ${ Color.setLightness(color, 0.75 + lightness * 0.25) }; `
                        + `stroke: none; `
                        + `pointer-Events: none; `
                    + `" `
                    + `/>`
                ).documentElement);
                $(this.refs['svg']).append(arc_sp);
            }
        }
        this.rounds.forEach((e: {
                    element: JQuery<HTMLElement>;
                    data: Array<number>;
                    count: number;
                    data_sp: Array<number>;
                    count_sp: number;
                }) => {
            const _data: Array<number> = e.count_sp === 0 ? e.data : e.data_sp;
            const _count: number = e.count_sp === 0 ? e.count : e.count_sp;
            const round: JQuery<HTMLElement> = e.element;
            let x1: number = this.area[0][1] + 1;
            let y1: number = this.area[0][0] - 22;
            let r1: number = r + 4;
            let x2: number = parseFloat(round.attr('cx')!);
            let y2: number = parseFloat(round.attr('cy')!);
            let r2: number = parseFloat(round.attr('r')!) + 1.5;
            let s: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            if (s <= r1 + r2) {
                return;
            }
            let tx: number = x1 + (x2 - x1) * r1 / s;
            let ty: number = y1 + (y2 - y1) * r1 / s;
            x2 += (x1 - x2) * r2 / s;
            y2 += (y1 - y2) * r2 / s;
            let strip: JQuery<HTMLElement> = $($.parseXML(
                `<line xmlns="http://www.w3.org/2000/svg" `
                + `x1="${ tx }px" y1="${ ty }px" x2="${ x2 }px" y2="${ y2 }px" `
                + `style="`
                    + `fill: none; `
                    + `stroke: ${ Color.Nippon.Hasita + "60" }; `
                    + `stroke-width: 1px; `
                    + `pointer-Events: none; `
                + `" `
                + `/>`
            ).documentElement);
            const stepX: number = (x2 - tx) / 21;
            const stepY: number = (y2 - ty) / 21;
            const width: number = Math.sqrt(Math.pow((s - r2 - r1) / 30, 1.5) + 16);
            const height: number = Math.sqrt(Math.pow(width * 10, 1.5) + 900);
            const offsetX: number = width / 2 * (tx - x2) / s;
            const offsetY: number = offsetX / (tx - x2) * (ty - y2);
            let d1: string = `M${ tx },${ ty }`;
            let d2: string = `M${ tx },${ ty }`;
            for (let i: number = 0; i < 20; i++) {
                let x: number = tx + (i + 1) * stepX;
                let y: number = ty + (i + 1) * stepY;
                let value1: number = Math.sqrt(2 * heap[i] / count + 1e-6);
                let rect1: JQuery<HTMLElement> = $($.parseXML(
                    `<path xmlns="http://www.w3.org/2000/svg" `
                    + `d="M${ x - offsetX },${ y - offsetY } `
                        + `L${ x - offsetX - height * value1 * (y2 - ty) / s },`
                            + `${ y - offsetY + height * value1 * (x2 - tx) / s } `
                        + `L${ x + offsetX - height * value1 * (y2 - ty) / s },`
                            + `${ y + offsetY + height * value1 * (x2 - tx) / s } `
                        + `L${ x + offsetX },${ y + offsetY } `
                        + `" `
                    + `style="`
                        // + `fill: ${ Color.interpolate(
                        //     Color.Nippon.Syozyohi + "C0",
                        //     Color.Nippon.Ruri + "C0",
                        //     i / 19
                        // ) }; `
                        // + `stroke: ${ Color.interpolate(
                        //     Color.Nippon.Syozyohi + "C0",
                        //     Color.Nippon.Ruri + "C0",
                        //     i / 19
                        // ) }; `
                        + `fill: ${ this.getColor(i) }; `
                        + `stroke: ${ this.getColor(i) }; `
                        + `stroke-width: 2px; `
                        + `pointer-Events: none; `
                    + `" `
                    + `/>`
                ).documentElement);
                $(this.refs['svg']).append(rect1);
                if (i === 0) {
                    d1 += ` L${ x - (height + 3) * value1 * (y2 - ty) / s },`
                        + `${ y + (height + 3) * value1 * (x2 - tx) / s }`;
                }
                else {
                    let value0: number = Math.sqrt(2 * heap[i - 1] / count + 1e-6);
                    // d1 += ` L${ x - height * value1 * (y2 - ty) / s },${ y + height * value1 * (x2 - tx) / s }`;
                    d1 += ` C${ x - (height + 3) * value0 * (y2 - ty) / s - stepX * 2 / 3 },`
                        + `${ y + (height + 3) * value0 * (x2 - tx) / s - stepY * 2 / 3 }`
                        + ` ${ x - (height + 3) * value1 * (y2 - ty) / s - stepX / 3 },`
                        + `${ y + (height + 3) * value1 * (x2 - tx) / s - stepY / 3 }`
                        + ` ${ x - (height + 3) * value1 * (y2 - ty) / s },`
                        + `${ y + (height + 3) * value1 * (x2 - tx) / s }`;
                }
                let value2: number = Math.sqrt(2 * _data[i] / _count + 1e-6);
                let rect2: JQuery<HTMLElement> = $($.parseXML(
                    `<path xmlns="http://www.w3.org/2000/svg" `
                    + `d="M${ x - offsetX },${ y - offsetY } `
                        + `L${ x - offsetX + height * value2 * (y2 - ty) / s },`
                            + `${ y - offsetY - height * value2 * (x2 - tx) / s } `
                        + `L${ x + offsetX + height * value2 * (y2 - ty) / s },`
                            + `${ y + offsetY - height * value2 * (x2 - tx) / s } `
                        + `L${ x + offsetX },${ y + offsetY } `
                        + `" `
                    + `style="`
                        // + `fill: ${ Color.interpolate(
                        //     Color.Nippon.Syozyohi + "C0",
                        //     Color.Nippon.Ruri + "C0",
                        //     i / 19
                        // ) }; `
                        // + `stroke: ${ Color.interpolate(
                        //     Color.Nippon.Syozyohi + "C0",
                        //     Color.Nippon.Ruri + "C0",
                        //     i / 19
                        // ) }; `
                        + `fill: ${ this.getColor(i) }; `
                        + `stroke: ${ this.getColor(i) }; `
                        + `stroke-width: 2px; `
                        + `pointer-Events: none; `
                    + `" `
                    + `/>`
                ).documentElement);
                $(this.refs['svg']).append(rect2);
                if (i === 0) {
                    d2 += ` L${ x + (height + 3) * value2 * (y2 - ty) / s },`
                        + `${ y - (height + 3) * value2 * (x2 - tx) / s }`;
                }
                else {
                    let value0: number = Math.sqrt(2 * _data[i - 1] / _count + 1e-6);
                    // d2 += ` L${ x + height * value2 * (y2 - ty) / s },${ y - height * value2 * (x2 - tx) / s }`;
                    d2 += ` C${ x + (height + 3) * value0 * (y2 - ty) / s - stepX * 2 / 3 },`
                        + `${ y - (height + 3) * value0 * (x2 - tx) / s - stepY * 2 / 3 }`
                        + ` ${ x + (height + 3) * value2 * (y2 - ty) / s - stepX / 3 },`
                        + `${ y - (height + 3) * value2 * (x2 - tx) / s - stepY / 3 }`
                        + ` ${ x + (height + 3) * value2 * (y2 - ty) / s },${ y - (height + 3) * value2 * (x2 - tx) / s }`;
                }
                if (value1 > value2) {
                    rect1.css("fill", Color.setLightness(rect1.css("fill")! as string, 0.7));
                    rect2.css("fill", Color.setLightness(rect2.css("fill")! as string, 0.25));
                }
                else if (value1 < value2) {
                    rect1.css("fill", Color.setLightness(rect1.css("fill")! as string, 0.25));
                    rect2.css("fill", Color.setLightness(rect2.css("fill")! as string, 0.7));
                }
            }
            d1 += ` L${ x2 },${ y2 }`;
            d2 += ` L${ x2 },${ y2 }`;
            $(this.refs['svg']).append(strip);
            let wave1: JQuery<HTMLElement> = $($.parseXML(
                `<path xmlns="http://www.w3.org/2000/svg" `
                + `d="${ d1 }" `
                + `style="`
                    + `fill: none; `
                    // + `stroke: ${ Color.Nippon.Ukonn }; `
                    + `stroke: ${ Color.Nippon.Ukonn }; `
                    + `stroke-width: ${ Math.sqrt(width * 0.7 + 4) }px; `
                    + `pointer-Events: none; `
                + `" `
                + `/>`
            ).documentElement);
            $(this.refs['svg']).append(wave1);
            let wave2: JQuery<HTMLElement> = $($.parseXML(
                `<path xmlns="http://www.w3.org/2000/svg" `
                + `d="${ d2 }" `
                + `style="`
                    + `fill: none; `
                    // + `stroke: ${ Color.Nippon.Ukonn }; `
                    + `stroke: ${ Color.Nippon.Ukonn }; `
                    + `stroke-width: ${ Math.sqrt(width * 0.7 + 4) }px; `
                    + `pointer-Events: none; `
                + `" `
                + `/>`
            ).documentElement);
            $(this.refs['svg']).append(wave2);
        });
    }

    private getColor(index: number): string {
        if (index === 10) {
            return Color.Nippon.Ukonn;
        }
        else if (index < 10) {
            return Color.interpolate(
                Color.Nippon.Syozyohi,
                Color.Nippon.Ukonn,
                index / 10
            );
        }
        else {
            return Color.interpolate(
                Color.Nippon.Ukonn,
                Color.Nippon.Ruri,
                (index - 10) / 10
            );
        }
    }

    private onDragEnd(bounds: [[number, number], [number, number]]): void {
        this.bounds = bounds;
        $(this.refs['svg']).html("");
        this.rounds = [];
        this.redraw();
    }

    private onZoomEnd(bounds: [[number, number], [number, number]]): void {
        this.bounds = bounds;
        $(this.refs['svg']).html("");
        this.rounds = [];
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
        let max: number = 0;
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
            if (data[i] > max) {
                max = data[i];
            }
        }
        this.setState({
            data: box
        });
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
                                                            ? Color.Nippon.Ruri // Tokiwa
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
                                                            ? Color.Nippon.Ruri // Tokiwa
                                                            : Color.Nippon.Ukonn]);
            });
            ready.forEach((d: [number, number, string]) => {
                this.highLightPoint(d[0], d[1], d[2]);
            });
        }
    }
}

export default MapView;
