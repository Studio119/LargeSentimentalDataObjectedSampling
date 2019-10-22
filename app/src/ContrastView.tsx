/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-18 20:52:11
 */
import React, { Component } from 'react';
import $ from 'jquery';
import ValueBar from './ValueBar';

export interface ContrastViewProps {
    id: string;
    displayLevels: number;
}

export interface RectNode {
    id: number;
    attr?: { x: number, y: number, width: number, height: number };
    level: number;
    path: Array< 'root' | 'left' | 'right' >;
    parent: RectNode | null;
    leftChild: RectNode | null;
    rightChild: RectNode | null;
    ref: JQuery<HTMLElement>;
    reference: JQuery<HTMLElement>;
    sentiment?: number;
}

export interface ContrastViewState extends RectNode {}

class ContrastView extends Component<ContrastViewProps, ContrastViewState, {}> {
    private svg: JQuery<HTMLElement> | null;
    private base: RectNode;
    private baseLevel: number;
    private displayLevels: number;
    private selectBox: Array<JQuery<HTMLElement>>;
    private offset: { x1: number, x2: number, y1: number, y2: number };
    private trans: { x1: number, x2: number, y1: number, y2: number };

    public constructor(props: ContrastViewProps) {
        super(props);
        this.state = {
            id: -1,
            attr: {
                x: 0,
                y: 0,
                width: 475,
                height: 270
            },
            level: 0,
            path: [ 'root' ],
            parent: null,
            leftChild: null,
            rightChild: null,
            ref: $("NULL"),
            reference: $("NULL")
        };
        this.base = this.state;
        this.baseLevel = 0;
        this.displayLevels = this.props.displayLevels;
        this.svg = null;
        this.selectBox = [];
        for (let i: number = 0; i < 8; i++) {
            let layer: JQuery<HTMLElement> = $($.parseXML(
                `<rect x="0" y="0" width="475" height="270" `
                + `id="RectTreeMapSelector_Layer${ i }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `style="stroke: black; stroke-width: 2; `
                    + `fill: #333333aa; `
                    + `display: none" />`
            ).documentElement);
            this.selectBox.push(layer);
        }
        this.offset = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.trans = { x1: 0, x2: 475, y1: 0, y2: 270 };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    height: '335px',
                    width: '421px',
                    background: 'white',
                    border: '1px solid rgb(149,188,239)',
                    position: 'absolute',
                    left: '1114px',
                    top: '59px',
                    textAlign: 'left'
                }} >
                <div id={ this.props.id + "-Bar" }
                style={{
                    width: '421px',
                    background: 'white'
                }} >
                    <div
                    style={{
                        width: '411px',
                        background: 'rgb(120,151,213)',
                        color: 'white',
                        textAlign: 'left',
                        letterSpacing: '2px',
                        paddingLeft: '16px',
                        marginBottom: '-24px',
                        height: '25px'
                    }} >
                        Geographic Division
                    </div>
                    <br />
                    <ValueBar label={ "Depth: " } width={ 150 } height={ 20 }
                    min={ 1 } max={ 15 } step={ 1 } defaultValue={ 3 }
                    style={{
                        transform: 'translateY(19%)',
                        display: 'inline-block',
                        marginLeft: '10px'
                    }}
                    onValueChange={
                        (value: number) => {
                            this.displayLevels = value;
                            this.svg!.html("");
                            this.draw(this.state);
                            this.svg!.append(this.selectBox);
                        }
                    } />
                    <button type="button" name="relayout"
                    style={{
                        margin: '10px 0px'
                    }}
                    onClick={
                        () => {
                            this.offset = { x1: 0, x2: 420, y1: 0, y2: 270 };
                            this.trans = { x1: 0, x2: 420, y1: 0, y2: 270 };
                            this.stretch(this.state);
                        }
                    } >
                        Reset
                    </button>
                </div>
                <svg width="422px" height="272px" id={ this.props.id + '_svg' } ref="svg" xmlns={`http://www.w3.org/2000/svg`}
                onMouseDown={
                    (event) => {
                        let x1: number = event.clientX - 1115;
                        let y1: number = event.clientY - 122;
                        this.offset.x1 = x1;
                        this.offset.y1 = y1;
                        this.selectBox[0].attr("x", 0).attr("y", 0).css("display", "unset")
                                .attr("width", x1).attr("height", y1);
                        this.selectBox[1].attr("x", x1).attr("y", 0).css("display", "unset")
                                .attr("width", 0).attr("height", y1);
                        this.selectBox[2].attr("x", x1).attr("y", 0).css("display", "unset")
                                .attr("width", 420 - x1).attr("height", y1);
                        this.selectBox[3].attr("x", x1).attr("y", y1).css("display", "unset")
                                .attr("width", 420 - x1).attr("height", 0);
                        this.selectBox[4].attr("x", x1).attr("y", y1).css("display", "unset")
                                .attr("width", 420 - x1).attr("height", 863 - event.clientY);
                        this.selectBox[5].attr("x", x1).attr("y", 0).css("display", "unset")
                                .attr("width", 420 - x1).attr("height", 863 - event.clientY);
                        this.selectBox[6].attr("x", 0).attr("y", y1).css("display", "unset")
                                .attr("width", x1).attr("height", 863 - event.clientY);
                        this.selectBox[7].attr("x", 0).attr("y", y1).css("display", "unset")
                                .attr("width", x1).attr("height", 863 - event.clientY);
                    }
                }
                onMouseMove={
                    (event) => {
                        if (this.selectBox[0].css("display") === "none") {
                            return;
                        }
                        let width: number = event.clientX - 1115 - parseInt(this.selectBox[0].attr("width")!);
                        let height: number = event.clientY - 122 - parseInt(this.selectBox[0].attr("height")!);
                        if (width <= 42 || height <= 27) {
                            width = 42;
                            height = 27;
                        }
                        if (width / 420 > height / 270) {
                            width = height / 270 * 420;
                        }
                        else {
                            height = width / 420 * 270;
                        }
                        this.offset.x2 = this.offset.x1 + width;
                        this.offset.y2 = this.offset.y1 + height;
                        this.selectBox[1].attr("width", width);
                        this.selectBox[2].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 420 - width - parseInt(this.selectBox[0].attr("width")!));
                        this.selectBox[3].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 420 - width -  parseInt(this.selectBox[0].attr("width")!))
                                .attr("height", height);
                        this.selectBox[4].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 420 - width - parseInt(this.selectBox[0].attr("width")!))
                                .attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 270 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[5].attr("width", width)
                                .attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 270 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[6].attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 270 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[7].attr("height", height);
                    }
                }
                onMouseUp={
                    (event) => {
                        if (this.selectBox[0].css("display") === "none") {
                            return;
                        }
                        let width: number = event.clientX - 1115 - parseInt(this.selectBox[0].attr("width")!);
                        let height: number = event.clientY - 122 - parseInt(this.selectBox[0].attr("height")!);
                        for (let i: number = 0; i < 8; i++) {
                            this.selectBox[i].css("display", "none");
                        }
                        if (width <= 42 || height <= 27) {
                            return;
                        }
                        this.stretch(this.state);
                        this.trans = {
                            x1: (0 - this.offset.x1) * (this.trans.x2 - this.trans.x1) / (this.offset.x2 - this.offset.x1),
                            x2: (420 - this.offset.x1) * (this.trans.x2 - this.trans.x1) / (this.offset.x2 - this.offset.x1),
                            y1: (0 - this.offset.y1) * (this.trans.y2 - this.trans.y1) / (this.offset.y2 - this.offset.y1),
                            y2: (270 - this.offset.y1) * (this.trans.y2 - this.trans.y1) / (this.offset.y2 - this.offset.y1)
                        };
                    }
                } />
            </div>
        );
    }

    public componentDidMount(): void {
        this.svg = $((this.refs["svg"] as any));
        this.draw(this.state);
        this.svg!.append(this.selectBox);
    }

    public componentDidUpdate(): void {
        this.svg!.html("");
        this.draw(this.state);
        this.svg!.append(this.selectBox);
    }

    private stretch(node: RectNode): { x: number, y: number, width: number, height: number } {
        let attr: { x: number, y: number, width: number, height: number };
        let left: { x: number, y: number, width: number, height: number } | null = null;
        let right: { x: number, y: number, width: number, height: number } | null = null;
        if (node.leftChild) {
            left = this.stretch(node.leftChild);
        }
        if (node.rightChild) {
            right = this.stretch(node.rightChild);
        }
        if (node.attr) {
            attr = node.attr;
        }
        else {
            if (left && !right) {
                attr = left;
            }
            else if (!left && right) {
                attr = right;
            }
            else if (!left && !right) {
                attr = { x: 0, y: 0, width: 0, height: 0 };
            }
            else {
                attr = {
                    x: left!.x > right!.x ? right!.x : left!.x,
                    y: left!.y > right!.y ? right!.y : left!.y,
                    width: left!.x === right!.x ? left!.width : left!.width + right!.width,
                    height: left!.y === right!.y ? left!.height : left!.height + right!.height
                };
            }
        }

        if (node.level > this.baseLevel + this.displayLevels || this.base.path.length > node.path.length) {
            return attr;
        }
        for (let i: number = 0; i < this.base.path.length; i++) {
            if (this.base.path[i] !== node.path[i]) {
                return attr;
            }
        }
        let _x: number = parseInt(node.ref.attr("x")!);
        let _y: number = parseInt(node.ref.attr("y")!);
        let _width: number = parseInt(node.ref.attr("width")!);
        let _height: number = parseInt(node.ref.attr("height")!);
        let offset: { x1: number, x2: number, y1: number, y2: number } = this.offset;
        let trans: { x1: number, x2: number, y1: number, y2: number } = this.trans;
        for (let i: number = 100; i <= 400; i += 20) {
            setTimeout(() => {
                node.ref.attr("x", _x * (400 - i) / 400 + i / 400 * ((attr.x - offset.x1) * (trans.x2 - trans.x1) / (offset.x2 - offset.x1)))
                        .attr("y", _y * (400 - i) / 400 + i / 400 * ((attr.y - offset.y1) * (trans.y2 - trans.y1) / (offset.y2 - offset.y1)))
                        .attr("width", _width * (400 - i) / 400 + i / 400 * (attr.width * (trans.x2 - trans.x1) / (offset.x2 - offset.x1)))
                        .attr("height", _height * (400 - i) / 400 + i / 400 * (attr.height * (trans.y2 - trans.y1) / (offset.y2 - offset.y1)));
            }, i);
        }

        return attr;
    }

    private draw(node: RectNode): { x: number, y: number, width: number, height: number } {
        let attr: { x: number, y: number, width: number, height: number };
        let left: { x: number, y: number, width: number, height: number } | null = null;
        let right: { x: number, y: number, width: number, height: number } | null = null;
        if (node.leftChild) {
            left = this.draw(node.leftChild);
        }
        if (node.rightChild) {
            right = this.draw(node.rightChild);
        }
        if (node.attr) {
            attr = node.attr;
        }
        else {
            if (left && !right) {
                attr = left;
            }
            else if (!left && right) {
                attr = right;
            }
            else if (!left && !right) {
                attr = { x: 0, y: 0, width: 0, height: 0 };
            }
            else {
                attr = {
                    x: left!.x > right!.x ? right!.x : left!.x,
                    y: left!.y > right!.y ? right!.y : left!.y,
                    width: left!.x === right!.x ? left!.width : left!.width + right!.width,
                    height: left!.y === right!.y ? left!.height : left!.height + right!.height
                };
            }
        }

        if (node.level > this.baseLevel + this.displayLevels || this.base.path.length > node.path.length) {
            return attr;
        }
        for (let i: number = 0; i < this.base.path.length; i++) {
            if (this.base.path[i] !== node.path[i]) {
                return attr;
            }
        }
        if (this.svg) {
            let sentiment: number = node.sentiment ? node.sentiment : -1;
            let rgb: string = 'yellow';
            if (sentiment >= 1) {
                rgb = `rgb(${ 194 + 61 * 1 / sentiment * 0.7 },${ 8 + 247 * 1 / sentiment * 0.7 },${ 107 + 148 * 1 / sentiment * 0.7 })`;
            }
            else if (sentiment !== -1) {
                rgb = `rgb(${ 22 + 233 * sentiment * 0.7 },${ 83 + 172 * sentiment * 0.7 },${ 202 + 53 * sentiment * 0.7 })`;
            }
            let rect: JQuery<HTMLElement> = $($.parseXML(
                `<rect x="${ attr.x }" y="${ attr.y }" width="${ attr.width }" height="${ attr.height }" `
                + `id="${ node.path.join("-") }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `style="stroke: black; `
                    + `fill: ${ rgb }; `
                    + `display: none" />`
            ).documentElement);
            if ((!left && !right) || node.level === this.baseLevel + this.displayLevels) {
                rect.css("display", "unset");
                rect.on("mouseover", () => {
                    if (node.parent) {
                        if (node.parent.leftChild) {
                            $(node.parent.leftChild.ref)
                                .css("fill-opacity", "0.6")
                                .css("stroke", "rgb(208,160,48)")
                                .css("stroke-width", "2.4px");
                        }
                        if (node.parent.rightChild) {
                            $(node.parent.rightChild.ref)
                                .css("fill-opacity", "0.6")
                                .css("stroke", "rgb(208,160,48)")
                                .css("stroke-width", "2.4px");
                        }
                    }
                });
                rect.on("mouseout", () => {
                    if (node.parent) {
                        if (node.parent.leftChild) {
                            $(node.parent.leftChild.ref)
                                .css("fill-opacity", "1.0")
                                .css("stroke", "black")
                                .css("stroke-width", "1px");
                        }
                        if (node.parent.rightChild) {
                            $(node.parent.rightChild.ref)
                                .css("fill-opacity", "1.0")
                                .css("stroke", "black")
                                .css("stroke-width", "1px");
                        }
                    }
                });
            }
            this.svg.append(rect);
            node.ref = rect;
        }

        return attr;
    }

    public import(root: RectNode): void {
        this.setState(root);
        this.base = this.state;
        this.baseLevel = 0;
    }
}

export default ContrastView;
