/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-12-03 21:50:52
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
                left: '294px',
                top: '59px',
                height: '531px',
                width: '863.6px',
                background: 'white',
                border: '1px solid rgb(149,188,239)',
                fontSize: '12.4px',
                overflow: 'hidden'
            }} >
                <div
                style={{
                    height: '24px',
                    width: '848px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: Color.linearGradient([
                        Color.setLightness(Color.Nippon.Berimidori, 0.56),
                        0,
                        Color.setLightness(Color.Nippon.Berimidori, 0.47),
                        0.15,
                        Color.setLightness(Color.Nippon.Berimidori, 0.65),
                        1
                    ], 'right'),//Color.Nippon.Berimidori, // Color.Nippon.Tutuzi, //'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px',
                    fontSize: 'larger'
                }} >
                    Map View
                </div>
                <div
                id={ this.props.id + ">>" }
                style={{
                    height: '506.6px',
                    width: '865px'
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
                <div id="scatter"
                style={{
                    display: 'unset'
                }} >
                    {/* 这个画布用于展现全部的点 */}
                    <canvas key="1" id="map_layer_canvas" ref="canvas" width="867px" height="508.64px" style={{
                        position: 'relative',
                        top: '-506px',
                        pointerEvents: 'none'
                    }} />
                    {/* 这个画布用于展现被高亮的点 */}
                    <canvas key="2" id="highlight_canvas" ref="canvas2" width="867px" height="508.64px" style={{
                        position: 'relative',
                        top: '-1018.6px',
                        pointerEvents: 'none'
                    }} />
                    {/* 这个元素用于放置每一个框选的交互组件 */}
                    <svg ref="svg"
                    xmlns={`http://www.w3.org/2000/svg`}
                    style={{
                        width: '867px',
                        height: '508.64px',
                        position: 'absolute',
                        left: '0px',
                        top: '24px',
                        pointerEvents: 'none'
                    }} />
                </div>
                {/* 这个画布用于接受框选交互事件 */}
                <canvas key="A" id="interaction" ref="table" width="867px" height="508.64px" style={{
                    position: 'relative',
                    top: '-1530px',
                    display: 'none'
                }}
                onMouseDown={
                    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                        if (this.behaviour === 'zoom') {
                            return;
                        }
                        this.active = true;
                        this.area[0] = [event.clientY - 62, event.clientX - 296.7];
                        $(this.refs["area"])
                            .show()
                            .css('top', event.clientY - 62)
                            .css('left', event.clientX - 296.7)
                            .css('width', 0)
                            .css('height', 0);
                    }
                }
                onMouseMove={
                    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                        if (this.behaviour === 'zoom' || !this.active) {
                            return;
                        }
                        this.area[1] = [event.clientY - 62, event.clientX - 296.7];
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
                        this.area[1] = [event.clientY - 62, event.clientX - 296.7];
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
                    height: '190px',
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
                        }
                        onDoubleClick={
                            () => {
                                this.area[0] = [ Infinity, Infinity ];
                                this.area[1] = [ -Infinity, -Infinity ];
                                this.hightLightArea('rect');
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
                                this.highlightClass(-1, false);
                                $(this.refs['svg']).html("");
                                this.rounds = [];
                                Globe.update("all");
                            }
                        } />
                    </div>
                    <div key="button:heatmap" ref="button:heatmap"
                    style={{
                        width: '28px',
                        height: '28px',
                        margin: '5px',
                        border: `1px solid ${ Color.Nippon.Kuroturubami }`,
                        background: Color.Nippon.Kesizumi
                    }} >
                        <img src="./images/heatmapOff.png" alt="Heatmap" id="heatmapButton"
                        style={{
                            width: '24px',
                            margin: '2px'
                        }}
                        onClick={
                            () => {
                                let cors: Array<[number, number]> = [];
                                switch ($("#heatmapButton").attr("src")) {
                                    case "./images/heatmapOff.png":
                                        $("#heatmapButton").attr("src", "./images/heatmapBefore.png");
                                        this.state.data.forEach((d: {lng: number, lat: number}) => {
                                            cors.push([d.lng, d.lat]);
                                        });
                                        $("#scatter").hide();
                                        break;
                                    case "./images/heatmapBefore.png":
                                        $("#heatmapButton").attr("src", "./images/heatmapAfter.png");
                                        this.state.sampled.forEach((i: number) => {
                                            cors.push([this.state.data[i].lng, this.state.data[i].lat]);
                                        });
                                        $("#scatter").hide();
                                        break;
                                    case "./images/heatmapAfter.png":
                                        $("#heatmapButton").attr("src", "./images/heatmapOff.png");
                                        $("#scatter").show();
                                        break;
                                }
                                (this.refs["map"] as MapBox).updateHeatMap(cors);
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

        Globe.highlightClass = this.highlightClass.bind(this);
        Globe.getPoint = (idx: number) => {
            return this.state.data[idx];
        };
        Globe.highlight = this.highlight.bind(this);

        Globe.checkIfPointIsSampled = (index: number) => {
            for (let i: number = 0; i < this.state.sampled.length; i++) {
                if (index === this.state.sampled[i]) {
                    return true;
                }
            }
            return false;
        };
        
        const attemp = () => {
            if (this.refs["map"]) {
                (this.refs["map"] as MapBox).callHeatMap();
                (this.refs["map"] as MapBox).updateHeatMap([]);
            }
            else {
                setTimeout(() => {
                    attemp();
                }, 800);
            }
        };
        attemp();
    }

    public componentDidUpdate(): void {
        $(this.refs['svg']).html("");
        this.rounds = [];
        // this.behaviour = 'zoom';
        // if (this.highLighted.length > 0 && this.behaviour !== 'zoom') {
        //     this.hightLightArea(this.behaviour);
        // }
        if (this.state.sampled.length > 0) {
            this.area[0] = [ Infinity, Infinity ];
            this.area[1] = [ -Infinity, -Infinity ];
            this.hightLightArea('rect');
        }
        else {
            this.highLighted = [];
            this.redraw();
            this.highLighted = [];
            $("#map_layer_canvas").css('opacity', 1);
            $(this.refs['svg']).html("");
            this.rounds = [];

            try {
                setTimeout(() => {
                    Globe.update("all");
                }, 2000);
            } catch (error) {
                console.error(error);
            }
        }
        // this.bounds = [[ 50.55349948549696, 22.86881607932105 ], [ -128.14621384226703, -67.85378615773539 ]];

        let cors: Array<[number, number]> = [];
        switch ($("#heatmapButton").attr("src")) {
            case "./images/heatmapOff.png":
                $("#heatmapButton").attr("src", "./images/heatmapBefore.png");
                this.state.data.forEach((d: {lng: number, lat: number}) => {
                    cors.push([d.lng, d.lat]);
                });
                break;
            case "./images/heatmapBefore.png":
                $("#heatmapButton").attr("src", "./images/heatmapAfter.png");
                this.state.sampled.forEach((i: number) => {
                    cors.push([this.state.data[i].lng, this.state.data[i].lat]);
                });
                break;
            case "./images/heatmapAfter.png":
                $("#heatmapButton").attr("src", "./images/heatmapOff.png");
                break;
        }
        (this.refs["map"] as MapBox).updateHeatMap(cors);
    }

    private redraw(): void {
        this.ctx!.clearRect(-2, -2, 869, 510.64);
        this.ctx_2!.clearRect(-2, -2, 869, 510.64);
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
        for (let i: number = 0; i < 20; i++) {
            heap.push(0);
        }
        $("#map_layer_canvas").css('opacity', 0.2);
        let ready: Array<Array<[number, number, string]>> = [];
        for (let i: number = 0; i < 100; i++) {
            ready.push([]);
        }
        let set: Array<number> = [];
        if (style === 'rect') {
            this.ctx_2!.clearRect(-2, -2, 869, 510.64);
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
                        set.push(index);
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
                        set.push(index);
                    }
                });
            }
            Globe.update(set);
        }
        else {
            let heap_origin: Array<number> = [];
            let set_sp: Array<number> = [];
            for (let i: number = 0; i < 20; i++) {
                heap_origin.push(0);
            }
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
                        heap_origin[Math.floor(parseFloat(d.sentiment) * (10 - 1e-6) + 10)]++;
                        set.push(index);
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
                        set.push(index);
                    }
                });
            }
            this.state.data.forEach((d: {
                id: string, lng: number, lat: number, words: string,
            day: string, city: string, sentiment: string, class: number}, index: number) => {
                if (this.fx(d.lng) < this.area[0][1] - r || this.fx(d.lng) > this.area[0][1] + r
                    || this.fy(d.lat) < this.area[0][0] - r - 24 || this.fy(d.lat) > this.area[0][0] + r + 24) {
                    return;
                }
                if (Math.pow(this.area[0][0] - this.fy(d.lat) - 24, 2)
                        + Math.pow(this.area[0][1] - this.fx(d.lng), 2) <= r2) {
                    set_sp.push(index);
                }
            });
            this.analyze(set_sp, heap_origin, heap, r);
            Globe.update(set);
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

    private paint(index: number): string {
        const set: Array<string> = [
            Color.Nippon.Akabeni, Color.Nippon.Nae, Color.Nippon.Rokusyou, Color.Nippon.Ruri, Color.Nippon.Hasita
        ];
        return set[index * 2 % set.length];
    }

    private analyze(set: Array<number>, heap_origin: Array<number>, heap: Array<number>, r: number): void {
        let setAft: Array<number> = [];
        set.forEach((i: number) => {
            if (Globe.checkIfPointIsSampled(i)) {
                setAft.push(i);
            }
        });
        const color: string = this.paint(this.rounds.length);
        let circle: JQuery<HTMLElement> = $($.parseXML(
            `<circle xmlns="http://www.w3.org/2000/svg" `
            + `class="chosen" `
            + `color="${ color }" `
            + `cx="${ this.area[0][1] + 1 }px" cy="${ this.area[0][0] - 22 }px" r="${ r + 2.5 }px" `
            + `style="`
                + `fill: none; `
                // + `fill: ${ color }; `
                + `stroke: ${ color + "C0" }; `
                + `stroke-width: 4px; `
                + `pointer-Events: none; `
            + `" `
            + `/>`
        ).documentElement);
        $(this.refs['svg']).append(circle);
        this.rounds.push({
            element: circle,
            data: heap_origin,
            count: set.length,
            data_sp: heap,
            count_sp: setAft.length
        });
        $(".arc").remove();
        $(".Bar").css("stroke-width", 1).css("stroke", Color.setLightness(Color.Nippon.Aisumitya, 0.7));
        let nodeset: {[id: number]: [Array<number>, Array<number>]} = {};
        let leafCount: number = 0;
        set.forEach((id: number) => {
            const p: {
                id: string;
                lng: number;
                lat: number;
                words: string;
                day: string;
                city: string;
                sentiment: string;
                class: number;
            } = Globe.getPoint(id);
            const leafId: number = p.class;
            const value: number = parseFloat(p.sentiment);
            if (!nodeset.hasOwnProperty(leafId)) {
                nodeset[leafId] = [[], []];
                $(`#Bar_id${ leafId }`).css("stroke-width", 4).css("stroke", Color.Nippon.Kinntya);
                if (value === 0) {
                    return;
                }
            }
            if (value === 0) {
                return;
            }
            nodeset[leafId][0].push(value);
            if (Globe.checkIfPointIsSampled(id)) {
                nodeset[leafId][1].push(value);
            }
        });
        for (const leafId in nodeset) {
            if (nodeset.hasOwnProperty(leafId)) {
                const element: [Array<number>, Array<number>] = nodeset[leafId];
                if (element[0].length > 0) {
                    leafCount++;
                }
            }
        }
        if (this.rounds.length === 1)  {
            let idx: number = 0;
            for (const leafId in nodeset) {
                if (nodeset.hasOwnProperty(leafId)) {
                    const element: [Array<number>, Array<number>] = nodeset[leafId];
                    if (element[0].length === 0) {
                        continue;
                    }
                    let value: number = 0;
                    element[0].forEach((v: number) => {
                        value += v;
                    });
                    value /= element[0].length;
                    const r2: number = r + Math.sqrt(r * 2 + 36) * (0.1 + 4 * Math.abs(value));
                    const color: string = Color.setLightness(value < -5e-4
                        ?   Color.Nippon.Syozyohi
                        :   value < 5e-4
                                    ?   Color.Nippon.Ukonn
                                    :   Color.Nippon.Ruri, 0.8 + 0.16 * Math.abs(value));
                    const lightness: number = Color.toHsl(color).l;
                    let arc: JQuery<HTMLElement> = $($.parseXML(
                        `<path xmlns="http://www.w3.org/2000/svg" `
                        + `class="arc" `
                        + `d="M${ this.area[0][1] + 1 + Math.sin(idx / leafCount * 2 * Math.PI) * (r + 3) },`
                            + `${ this.area[0][0] - 22 - Math.cos(idx / leafCount * 2 * Math.PI) * (r + 3) }`
                            + ` A${ r + 3 },${ r + 3 },0,0,1,`
                            + `${ this.area[0][1] + 1 + Math.sin((idx + 1) / leafCount * 2 * Math.PI) * (r + 3) },`
                            + `${ this.area[0][0] - 22 - Math.cos((idx + 1) / leafCount * 2 * Math.PI) * (r + 3) }`
                            + ` L${ this.area[0][1] + 1 + Math.sin((idx + 1) / leafCount * 2 * Math.PI) * (r2 + 3) },`
                            + `${ this.area[0][0] - 22 - Math.cos((idx + 1) / leafCount * 2 * Math.PI) * (r2 + 3) }`
                            + ` A${ r2 + 3 },${ r2 + 3 },0,0,0,`
                            + `${ this.area[0][1] + 1 + Math.sin(idx / leafCount * 2 * Math.PI) * (r2 + 3) },`
                            + `${ this.area[0][0] - 22 - Math.cos(idx / leafCount * 2 * Math.PI) * (r2 + 3) }`
                            + ` Z" `
                        + `style="`
                            // + `fill: ${ Color.interpolate(
                            //     Color.Nippon.Syozyohi + "C0",
                            //     Color.Nippon.Ruri + "C0",
                            //     i / 19
                            // ) }; `
                            + `fill: ${ color }; `
                            + `stroke: ${ Color.setLightness(color, lightness * 0.7) }; `
                            + `stroke-width: 0.6px; `
                            + `pointer-Events: none; `
                        + `" `
                        + `/>`
                    ).documentElement);
                    $(this.refs['svg']).append(arc);
                    if (element[1].length > 0) {
                        let value: number = 0;
                        element[1].forEach((v: number) => {
                            value += v;
                        });
                        value /= element[1].length;
                        const r3: number = r + Math.sqrt(r * 2 + 36) * (0.1 + 4 * Math.abs(value));
                        let arc_sp: JQuery<HTMLElement> = $($.parseXML(
                            `<path xmlns="http://www.w3.org/2000/svg" `
                            + `class="arc" `
                            + `d="M${ this.area[0][1] + 1 + Math.sin((idx + 0.35) / leafCount * 2 * Math.PI) * (r + 3) },`
                                + `${ this.area[0][0] - 22 - Math.cos((idx + 0.35) / leafCount * 2 * Math.PI) * (r + 3) }`
                                + ` A${ r + 3 },${ r + 3 },0,0,1,`
                                + `${ this.area[0][1] + 1 + Math.sin((idx + 0.65) / leafCount * 2 * Math.PI) * (r + 3) },`
                                + `${ this.area[0][0] - 22 - Math.cos((idx + 0.65) / leafCount * 2 * Math.PI) * (r + 3) }`
                                + ` L${ this.area[0][1] + 1 + Math.sin((idx + 0.65) / leafCount * 2 * Math.PI) * (r3 + 3) },`
                                + `${ this.area[0][0] - 22 - Math.cos((idx + 0.65) / leafCount * 2 * Math.PI) * (r3 + 3) }`
                                + ` A${ r3 + 3 },${ r3 + 3 },0,0,0,`
                                + `${ this.area[0][1] + 1 + Math.sin((idx + 0.35) / leafCount * 2 * Math.PI) * (r3 + 3) },`
                                + `${ this.area[0][0] - 22 - Math.cos((idx + 0.35) / leafCount * 2 * Math.PI) * (r3 + 3) }`
                                + ` Z" `
                            + `style="`
                                + `fill: ${ Color.setLightness(color, 0.3 + lightness * 0.7) }; `
                                + `stroke: ${ Color.setLightness(color, lightness * 0.5) }; `
                                + `stroke-width: 0.6px; `
                                + `pointer-Events: none; `
                            + `" `
                            + `/>`
                        ).documentElement);
                        $(this.refs['svg']).append(arc_sp);
                    }
                    idx++;
                }
            }
            
            // for (let i: number = 0; i < 20; i++) {
            //     const r2: number = r + Math.sqrt(r * 2 + 36) * (0.1 + 8 * heap[i] / count);
            //     const color: string = this.getColor(i);
            //     const lightness: number = Color.toHsl(color).l;
            //     let arc: JQuery<HTMLElement> = $($.parseXML(
            //         `<path xmlns="http://www.w3.org/2000/svg" `
            //         + `class="arc" `
            //         + `d="M${ this.area[0][1] + 1 + Math.sin(i / 20 * 2 * Math.PI) * (r + 3) },`
            //             + `${ this.area[0][0] - 22 - Math.cos(i / 20 * 2 * Math.PI) * (r + 3) }`
            //             + ` A${ r + 3 },${ r + 3 },0,0,1,`
            //             + `${ this.area[0][1] + 1 + Math.sin((i + 1) / 20 * 2 * Math.PI) * (r + 3) },`
            //             + `${ this.area[0][0] - 22 - Math.cos((i + 1) / 20 * 2 * Math.PI) * (r + 3) }`
            //             + ` L${ this.area[0][1] + 1 + Math.sin((i + 1) / 20 * 2 * Math.PI) * (r2 + 3) },`
            //             + `${ this.area[0][0] - 22 - Math.cos((i + 1) / 20 * 2 * Math.PI) * (r2 + 3) }`
            //             + ` A${ r + 3 },${ r + 3 },0,0,0,`
            //             + `${ this.area[0][1] + 1 + Math.sin(i / 20 * 2 * Math.PI) * (r2 + 3) },`
            //             + `${ this.area[0][0] - 22 - Math.cos(i / 20 * 2 * Math.PI) * (r2 + 3) }`
            //             + ` Z" `
            //         + `style="`
            //             // + `fill: ${ Color.interpolate(
            //             //     Color.Nippon.Syozyohi + "C0",
            //             //     Color.Nippon.Ruri + "C0",
            //             //     i / 19
            //             // ) }; `
            //             + `fill: ${ color }; `
            //             + `stroke: ${ Color.setLightness(color, lightness * 0.7) }; `
            //             + `stroke-width: 0.6px; `
            //             + `pointer-Events: none; `
            //         + `" `
            //         + `/>`
            //     ).documentElement);
            //     $(this.refs['svg']).append(arc);
            //     if (count_sp > 0) {
            //         const r3: number = r + Math.sqrt(r * 2 + 36) * (0.1 + 8 * heap_sp[i] / count_sp);
            //         // const color: string = Color.interpolate(
            //         //     Color.Nippon.Syozyohi + "C0",
            //         //     Color.Nippon.Ruri + "C0",
            //         //     i / 19
            //         // );
            //         let arc_sp: JQuery<HTMLElement> = $($.parseXML(
                        // `<path xmlns="http://www.w3.org/2000/svg" `
                        // + `class="arc" `
                        // + `d="M${ this.area[0][1] + 1 + Math.sin((i + 0.35) / 20 * 2 * Math.PI) * (r + 3) },`
                        //     + `${ this.area[0][0] - 22 - Math.cos((i + 0.35) / 20 * 2 * Math.PI) * (r + 3) }`
                        //     + ` A${ r + 3 },${ r + 3 },0,0,1,`
                        //     + `${ this.area[0][1] + 1 + Math.sin((i + 0.65) / 20 * 2 * Math.PI) * (r + 3) },`
                        //     + `${ this.area[0][0] - 22 - Math.cos((i + 0.65) / 20 * 2 * Math.PI) * (r + 3) }`
                        //     + ` L${ this.area[0][1] + 1 + Math.sin((i + 0.65) / 20 * 2 * Math.PI) * (r3 + 3) },`
                        //     + `${ this.area[0][0] - 22 - Math.cos((i + 0.65) / 20 * 2 * Math.PI) * (r3 + 3) }`
                        //     + ` A${ r + 3 },${ r + 3 },0,0,0,`
                        //     + `${ this.area[0][1] + 1 + Math.sin((i + 0.35) / 20 * 2 * Math.PI) * (r3 + 3) },`
                        //     + `${ this.area[0][0] - 22 - Math.cos((i + 0.35) / 20 * 2 * Math.PI) * (r3 + 3) }`
                        //     + ` Z" `
            //             + `style="`
            //                 + `fill: ${ Color.setLightness(color, 0.3 + lightness * 0.7) }; `
            //                 + `stroke: ${ Color.setLightness(color, lightness * 0.5) }; `
            //                 + `stroke-width: 0.6px; `
            //                 + `pointer-Events: none; `
            //             + `" `
            //             + `/>`
            //         ).documentElement);
            //         $(this.refs['svg']).append(arc_sp);
            //     }
            // }
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
                let value1: number =
                    setAft.length > 0
                            ? Math.sqrt(2 * heap[i] / setAft.length + 1e-6)
                            : Math.sqrt(2 * heap_origin[i] / set.length + 1e-6);
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
                    let value0: number = setAft.length > 0
                                ? Math.sqrt(2 * heap[i - 1] / setAft.length + 1e-6)
                                : Math.sqrt(2 * heap_origin[i - 1] / set.length + 1e-6);
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
                    + `stroke: ${ color }; `
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
                    + `stroke: ${ e.element.attr("color")! }; `
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
        return (d - this.bounds[1][0]) / (this.bounds[1][1] - this.bounds[1][0]) * (867 - 2);
    }

    private fy(d: number): number {
        d = (d - this.bounds[0][0]) / (this.bounds[0][1] - this.bounds[0][0])
            * (this.originBounds[0][1] - this.originBounds[0][0]) + this.originBounds[0][0]
            + 2 * (1 - (this.bounds[0][1] - this.bounds[0][0]) / (this.originBounds[0][1] - this.originBounds[0][0]));
        return 508.6 * (d * d * (-0.00025304519602050573) - d * 0.01760550015218513 + 1.5344062688366468);
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

    private highlightClass(index: number, useSampled: boolean): void {
        this.ctx_2!.clearRect(-2, -2, 869, 510.64);
        $(".Bar").css("stroke-width", 1).css("stroke", Color.setLightness(Color.Nippon.Aisumitya, 0.7));
        if (index === -1) {
            $("#map_layer_canvas").css('opacity', 1);
            return;
        }
        else {
            $("#map_layer_canvas").css('opacity', 0.2);
            $(`#Bar_id${ index }`).css("stroke-width", 4).css("stroke", Color.Nippon.Kinntya);
            let ready: Array<[number, number, string]> = [];
            let set: Array<number> = [];
            this.state.data.forEach((d: {
                id: string, lng: number, lat: number, words: string,
            day: string, city: string, sentiment: string, class: number}, idx: number) => {
                if (d.class === index && (d.lat >= 0 || d.lat < 0 || d.lng >= 0 || d.lng < 0)) {
                    ready.push([d.lng, d.lat, parseFloat(d.sentiment) < 0
                                                        ? Color.Nippon.Syozyohi
                                                        : parseFloat(d.sentiment) > 0
                                                            ? Color.Nippon.Ruri // Tokiwa
                                                            : Color.Nippon.Ukonn]);
                    if (this.state.sampled.length) {
                        if (!useSampled || Globe.checkIfPointIsSampled(idx)) {
                            set.push(idx);
                        }
                    }
                    else {
                        set.push(idx);
                    }
                }
            });
            ready.forEach((d: [number, number, string]) => {
                this.highLightPoint(d[0], d[1], d[2]);
            });
        }
    }

    private highlight(points: Array<number> | 'all'): void {
        this.ctx_2!.clearRect(-2, -2, 869, 510.64);
        Globe.update(points);
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
