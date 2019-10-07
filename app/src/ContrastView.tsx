/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-07 20:57:13
 */
import React, { Component } from 'react';
import $ from 'jquery';
import ValueBar from './ValueBar';

export interface ContrastViewProps {
    id: string;
    displayLevels: number;
}

export interface RectNode {
    attr?: { x: number, y: number, width: number, height: number };
    level: number;
    path: Array< 'root' | 'left' | 'right' >;
    parent: RectNode | null;
    leftChild: RectNode | null;
    rightChild: RectNode | null;
    ref: JQuery<HTMLElement>;
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
            attr: {
                x: 0,
                y: 0,
                width: 475,
                height: 306
            },
            level: 0,
            path: [ 'root' ],
            parent: null,
            leftChild: null,
            rightChild: null,
            ref: $("NULL")
        };
        this.base = this.state;
        this.baseLevel = 0;
        this.displayLevels = this.props.displayLevels;
        this.svg = null;
        this.selectBox = [];
        for (let i: number = 0; i < 8; i++) {
            let layer: JQuery<HTMLElement> = $($.parseXML(
                `<rect x="0" y="0" width="475" height="306" `
                + `id="RectTreeMapSelector_Layer${ i }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `style="stroke: black; stroke-width: 2; `
                    + `fill: #333333aa; `
                    + `display: none" />`
            ).documentElement);
            this.selectBox.push(layer);
        }
        this.offset = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.trans = { x1: 0, x2: 475, y1: 0, y2: 306 };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '595px',
                    background: 'white',
                    border: '1px solid black'
                }} >
                <svg width="475px" height="100%" id={ this.props.id + '_svg' } ref="svg" xmlns={`http://www.w3.org/2000/svg`}
                onMouseDown={
                    (event) => {
                        this.offset.x1 = event.clientX - 3;
                        this.offset.y1 = event.clientY - 557;
                        this.selectBox[0].attr("x", 0).attr("y", 0).css("display", "unset")
                                .attr("width", event.clientX - 3).attr("height", event.clientY - 557);
                        this.selectBox[1].attr("x", event.clientX - 3).attr("y", 0).css("display", "unset")
                                .attr("width", 0).attr("height", event.clientY - 557);
                        this.selectBox[2].attr("x", event.clientX - 3).attr("y", 0).css("display", "unset")
                                .attr("width", 478 - event.clientX).attr("height", event.clientY - 557);
                        this.selectBox[3].attr("x", event.clientX - 3).attr("y", event.clientY - 557).css("display", "unset")
                                .attr("width", 478 - event.clientX).attr("height", 0);
                        this.selectBox[4].attr("x", event.clientX - 3).attr("y", event.clientY - 557).css("display", "unset")
                                .attr("width", 478 - event.clientX).attr("height", 863 - event.clientY);
                        this.selectBox[5].attr("x", event.clientX - 3).attr("y", 0).css("display", "unset")
                                .attr("width", 478 - event.clientX).attr("height", 863 - event.clientY);
                        this.selectBox[6].attr("x", 0).attr("y", event.clientY - 557).css("display", "unset")
                                .attr("width", event.clientX - 3).attr("height", 863 - event.clientY);
                        this.selectBox[7].attr("x", 0).attr("y", event.clientY - 557).css("display", "unset")
                                .attr("width", event.clientX - 3).attr("height", 863 - event.clientY);
                    }
                }
                onMouseMove={
                    (event) => {
                        if (this.selectBox[0].css("display") === "none") {
                            return;
                        }
                        let width: number = event.clientX - 3 - parseInt(this.selectBox[0].attr("width")!);
                        let height: number = event.clientY - 557 - parseInt(this.selectBox[0].attr("height")!);
                        if (width <= 47.5 || height <= 30.6) {
                            width = 47.5;
                            height = 30.6;
                        }
                        if (width / 475 > height / 306) {
                            width = height / 306 * 475;
                        }
                        else {
                            height = width / 475 * 306;
                        }
                        this.offset.x2 = this.offset.x1 + width;
                        this.offset.y2 = this.offset.y1 + height;
                        this.selectBox[1].attr("width", width);
                        this.selectBox[2].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 475 - width - parseInt(this.selectBox[0].attr("width")!));
                        this.selectBox[3].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 475 - width -  parseInt(this.selectBox[0].attr("width")!))
                                .attr("height", height);
                        this.selectBox[4].attr("x", width + parseInt(this.selectBox[0].attr("width")!))
                                .attr("width", 475 - width - parseInt(this.selectBox[0].attr("width")!))
                                .attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 306 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[5].attr("width", width)
                                .attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 306 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[6].attr("y", height + parseInt(this.selectBox[0].attr("height")!))
                                .attr("height", 306 - height - parseInt(this.selectBox[0].attr("height")!));
                        this.selectBox[7].attr("height", height);
                    }
                }
                onMouseUp={
                    (event) => {
                        if (this.selectBox[0].css("display") === "none") {
                            return;
                        }
                        let width: number = event.clientX - 3 - parseInt(this.selectBox[0].attr("width")!);
                        let height: number = event.clientY - 557 - parseInt(this.selectBox[0].attr("height")!);
                        for (let i: number = 0; i < 8; i++) {
                            this.selectBox[i].css("display", "none");
                        }
                        if (width <= 47.5 || height <= 30.6) {
                            return;
                        }
                        this.stretch(this.state);
                        this.trans = {
                            x1: (0 - this.offset.x1) * (this.trans.x2 - this.trans.x1) / (this.offset.x2 - this.offset.x1),
                            x2: (475 - this.offset.x1) * (this.trans.x2 - this.trans.x1) / (this.offset.x2 - this.offset.x1),
                            y1: (0 - this.offset.y1) * (this.trans.y2 - this.trans.y1) / (this.offset.y2 - this.offset.y1),
                            y2: (306 - this.offset.y1) * (this.trans.y2 - this.trans.y1) / (this.offset.y2 - this.offset.y1)
                        };
                    }
                } />
                <div id={ this.props.id + "-Bar" }
                style={{
                    display: 'inline-block',
                    height: '307px',
                    width: '120px',
                    padding: '20px 0px',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))'
                }} >
                    <ValueBar label={ "Depth: " } width={ 120 } height={ 20 }
                    min={ 1 } max={ 15 } step={ 1 } defaultValue={ 3 }
                    style={{
                        transform: 'none',
                        display: 'unset'
                    }}
                    onValueChange={
                        (value: number) => {
                            this.displayLevels = value;
                            this.svg!.html("");
                            this.draw(this.state);
                            this.svg!.append(this.selectBox);
                        }
                    } />
                    <br />
                    <button type="button" name="relayout"
                    style={{
                        margin: '10px 0px'
                    }}
                    onClick={
                        () => {
                            this.offset = { x1: 0, x2: 475, y1: 0, y2: 306 };
                            this.trans = { x1: 0, x2: 475, y1: 0, y2: 306 };
                            this.stretch(this.state);
                        }
                    } >
                        Reset
                    </button>
                    <br />
                </div>
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
            let rect: JQuery<HTMLElement> = $($.parseXML(
                `<rect x="${ attr.x }" y="${ attr.y }" width="${ attr.width }" height="${ attr.height }" `
                + `id="${ node.path.join("-") }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `style="stroke: black; `
                    + `fill: rgb(${ Math.random() * 80 + 40 }, ${ Math.random() * 80 + 40 }, ${ Math.random() * 80 + 40 }); `
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
