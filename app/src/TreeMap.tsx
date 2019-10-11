/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-10 12:08:06
 */
import React, { Component } from 'react';
import $ from 'jquery';

export interface StyleReflection<T = any> {
    fill?: string | ((data: T) => string);
    stroke?: string | ((data: T) => string);
    strokeWidth?: string | ((data: T) => string);
}

export interface TreeMapProps<T = any> {
    id: string;
    style?: React.CSSProperties;
    circleStyle?: StyleReflection<T>;
    pathStyle?: React.CSSProperties;
}

export interface TreeNode<T = any> {
    level: number;
    path: Array< 'root' | 'left' | 'right' >;
    parent: TreeNode<T> | null;
    leftChild: TreeNode<T> | null;
    rightChild: TreeNode<T> | null;
    ref: JQuery<HTMLElement>;
    data?: T;
}

export interface TreeMapState<T = any> extends TreeNode<T> {}

class TreeMap<T = any> extends Component<TreeMapProps<T>, TreeMapState<T>, {}> {
    private svg: JQuery<HTMLElement> | null;
    private layers: Array< Array<TreeNode<T>> >;
    private width: number;
    private height: number;
    private padding: { top: number, right: number, bottom: number, left: number };
    private r: number;

    public constructor(props: TreeMapProps<T>) {
        super(props);
        this.svg = null;
        this.state = {
            level: 0,
            path: [ 'root' ],
            parent: null,
            leftChild: null,
            rightChild: null,
            ref: $("NULL")
        };
        this.layers = [];
        this.width = 936;
        this.height = 282;
        this.padding = { top: 10, right: 20, bottom: 10, left: 20 };
        this.r = 3;
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                display: 'inline-block',
                height: '102%',
                width: '936px',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '0px',
                left: '598px'
            }}>
                <div
                style={{
                    height: '24px',
                    width: '100%',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }}>
                    K-D树的剪枝
                </div>
                <svg width="100%" height="294px" id={ this.props.id + '_svg' } ref="svg" xmlns={`http://www.w3.org/2000/svg`}
                style={{
                    ...this.props.style
                }} />
            </div>
        );
    }

    public componentDidMount(): void {
        this.svg = $((this.refs["svg"] as any));
        this.draw(this.state);
    }

    public componentDidUpdate(): void {
        this.draw(this.state);
    }

    private draw(node: TreeNode<T>): void {
        this.svg!.html("");
        this.layers = [];
        if (!this.svg) {
            return;
        }
        this.walk(node);
        let virtualCircles: Array< JQuery<HTMLElement> > = [];
        let circles: Array< Array< { node: TreeNode<T>, element: JQuery<HTMLElement>, level: number, index: number } > > = [];
        let lines: Array< { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> } > = [];
        for (let level: number = 0; level < this.layers.length; level++) {
            for (let index: number = 0; index < Math.pow(2, level); index++) {
                let circle: JQuery<HTMLElement> = $($.parseXML(
                    `<circle r="${ this.r }" `
                    + `cx="${ this.padding.left + (index + 0.5) * (this.width - this.padding.left - this.padding.right) / Math.pow(2, level + 4) }" `
                    + `cy="${ this.padding.top + (level + 0.5) * (this.height - this.padding.top - this.padding.bottom) / this.layers.length }" `
                    + `id="${ `virtualAddr_${ level }-${ index }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    + `style="stroke: black; `
                        + `fill: rgb(58,201,176);`
                        + `" />`
                ).documentElement);
                virtualCircles.push(circle);
            }
        }
        for (let level: number = 0; level < this.layers.length; level++) {
            circles.push([]);
            for (let index: number = 0; index < this.layers[level].length; index++) {
                let pos: number = TreeMap.path2index(this.layers[level][index].path);
                if (this.layers[level][index].leftChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 1] });
                }
                if (this.layers[level][index].rightChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 2] });
                }
                circles[level].push({ node: this.layers[level][index], element: virtualCircles[pos], level: level, index: index });
            }
        }
        lines.forEach((d: { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> }, index: number) => {
            let line: JQuery<HTMLElement> = parseFloat(d.parent.attr("cx")!) > parseFloat(d.child.attr("cx")!) // left child
                ? $($.parseXML(
                    `<path `
                    + `id="${ `branch_${ index }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    + `d="M${ d.parent.attr("cx") },${ d.parent.attr("cy") } `
                        + `A${ (parseFloat(d.parent.attr("cx")!) - parseFloat(d.child.attr("cx")!)) * 1.2 },`
                            + `${ (parseFloat(d.child.attr("cy")!) - parseFloat(d.parent.attr("cy")!)) * 2 },`
                            + `0,`
                            + `0,`
                            + `1,`
                            + `${ d.child.attr("cx") },`
                            + `${ d.child.attr("cy") }" `
                    + `style="stroke: black; fill: none; " />`).documentElement)
                : $($.parseXML(
                    `<path `
                    + `id="${ `branch_${ index }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    + `d="M${ d.parent.attr("cx") },${ d.parent.attr("cy") } `
                        + `A${ (parseFloat(d.child.attr("cx")!) - parseFloat(d.parent.attr("cx")!)) * 1.2 },`
                            + `${ (parseFloat(d.child.attr("cy")!) - parseFloat(d.parent.attr("cy")!)) * 2 },`
                            + `0,`
                            + `0,`
                            + `0,`
                            + `${ d.child.attr("cx") },`
                            + `${ d.child.attr("cy") }" `
                    + `style="stroke: black; fill: none; " />`).documentElement);
            this.svg!.append(line);
            if (this.props.pathStyle) {
                for (const key in this.props.pathStyle) {
                    if (this.props.pathStyle.hasOwnProperty(key)) {
                        const value = (this.props.pathStyle as any)[key];
                        line.css(key, value);
                    }
                }
            }
        });
        this.updateCircles(circles, lines, true);
    }

    private updateCircles(circles: Array<Array<{ node: TreeNode<T>, element: JQuery<HTMLElement>, level: number, index: number }>>, lines: Array<{ parent: JQuery<HTMLElement>; child: JQuery<HTMLElement>}>, repeat: boolean): void {
        let moving: Array<{ node: TreeNode<T>; element: JQuery<HTMLElement>; level: number; index: number; }> = [];
        for (let level: number = circles.length - 1; level >= 0; level--) {
            circles[level].forEach((d: { node: TreeNode<T>; element: JQuery<HTMLElement>; level: number; index: number; }) => {
                moving.push(d);
                d.element.css("fill-opacity", 0.3);
                if (this.props.circleStyle) {
                    if (this.props.circleStyle.fill) {
                        if (typeof this.props.circleStyle.fill === 'string') {
                            d.element.css("fill", (this.props.circleStyle.fill as string));
                        }
                        else if (d.node.data) {
                            d.element.css("fill", (this.props.circleStyle.fill as ((data: T) => string))(d.node.data));
                        }
                    }
                    if (this.props.circleStyle.stroke) {
                        if (typeof this.props.circleStyle.stroke === 'string') {
                            d.element.css("stroke", (this.props.circleStyle.stroke as string));
                        }
                        else if (d.node.data) {
                            d.element.css("stroke", (this.props.circleStyle.stroke as ((data: T) => string))(d.node.data));
                        }
                    }
                    if (this.props.circleStyle.strokeWidth) {
                        if (typeof this.props.circleStyle.strokeWidth === 'string') {
                            d.element.css("stroke-width", (this.props.circleStyle.strokeWidth as string));
                        }
                        else if (d.node.data) {
                            d.element.css("stroke-width", (this.props.circleStyle.strokeWidth as ((data: T) => string))(d.node.data));
                        }
                    }
                }
                if (repeat) {
                    this.svg!.append(d.element);
                }
            });
        }
        moving.sort((a: { node: TreeNode<T>; element: JQuery<HTMLElement>; level: number; index: number; }, b: { node: TreeNode<T>; element: JQuery<HTMLElement>; level: number; index: number; }) => {
            return parseFloat(a.element.attr("cx")!) - parseFloat(b.element.attr("cx")!);
        });
        let lastX: Array<number> = [];
        for (let i: number = 0; i < circles.length; i++) {
            lastX.push(-1);
        }
        for (let i: number = 0; i < moving.length; i++) {
            setTimeout(() => {
                let level: number = moving[i].node.level;
                let offset: number = parseFloat(moving[i].element.attr("cx")!);
                if (lastX[level] !== -1) {
                    if (offset - lastX[level] <= this.r * 3) {
                        for (let t: number = i; t < moving.length; t++) {
                            let originX: number = parseFloat(moving[t].element.attr("cx")!);
                            let offsetNew: number = this.r * 3 - offset + lastX[level];
                            moving[t].element.attr("cx", originX + offsetNew);
                        }
                        this.updateBranches(lines);
                    }
                }
                lastX[level] = offset;
                if (i === moving.length - 1) {
                    if (repeat) {
                        setTimeout(() => {
                            this.updateCircles(circles, lines, false);
                        }, 10);
                    }
                    else {
                        this.adjustBorder(circles, lines);
                    }
                }
            }, i * 10);
        }
    }

    private adjustBorder(circles: Array<Array<{ node: TreeNode<T>, element: JQuery<HTMLElement>, level: number, index: number }>>, lines: Array<{ parent: JQuery<HTMLElement>; child: JQuery<HTMLElement>}>): void {
        let max: number = 0;
        let box: Array<JQuery<HTMLElement>> = [];
        for (let level: number = circles.length - 1; level >= 0; level--) {
            circles[level].forEach((d: { node: TreeNode<T>; element: JQuery<HTMLElement>; level: number; index: number; }) => {
                let cx: number = parseFloat(d.element.attr("cx")!);
                if (cx > max) {
                    max = cx;
                }
                box.push(d.element);
            });
        }
        let zoomRate: number = (this.width - this.padding.left - this.padding.right) / (max - this.padding.left);
        box.forEach((e: JQuery<HTMLElement>, index: number) => {
            setTimeout(() => {
                let cx: number = parseFloat(e.attr("cx")!);
                e.attr("cx", (cx - this.padding.left) * zoomRate + this.padding.left)
                    .attr("r", this.r * Math.sqrt(zoomRate))
                    .css("fill-opacity", 1);
                this.updateBranches(lines);
            }, index * 10);
        });
    }

    private updateBranches(lines: Array< { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> } >): void {
        lines.forEach((d: { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> }, index: number) => {
                setTimeout(() => {
                    $(`#branch_${ index }`).attr("d", () => {
                        return parseFloat(d.parent.attr("cx")!) > parseFloat(d.child.attr("cx")!) // left child
                            ? `M${ d.parent.attr("cx") },${ d.parent.attr("cy") } `
                                + `A${ (parseFloat(d.parent.attr("cx")!) - parseFloat(d.child.attr("cx")!)) * 1.2 },`
                                    + `${ (parseFloat(d.child.attr("cy")!) - parseFloat(d.parent.attr("cy")!)) * 2 },`
                                    + `0,`
                                    + `0,`
                                    + `0,`
                                    + `${ d.child.attr("cx") },`
                                    + `${ d.child.attr("cy") }`
                            : `M${ d.parent.attr("cx") },${ d.parent.attr("cy") } `
                                + `A${ (parseFloat(d.child.attr("cx")!) - parseFloat(d.parent.attr("cx")!)) * 1.2 },`
                                    + `${ (parseFloat(d.child.attr("cy")!) - parseFloat(d.parent.attr("cy")!)) * 2 },`
                                    + `0,`
                                    + `0,`
                                    + `1,`
                                    + `${ d.child.attr("cx") },`
                                    + `${ d.child.attr("cy") }`;
                    });
                }, 10);
        });
    }

    private static path2index(path: Array< "root" | "left" | "right" >): number {
        if (path.length === 1) {
            return 0;
        }
        let pos: number = 0;
        let level: number = 1;
        while (level < path.length) {
            if (path[level] === 'left') {
                pos = pos * 2 + 1;
            }
            else if (path[level] === 'right') {
                pos = pos * 2 + 2;
            }
            level++;
        }
        return pos;
    }

    private walk(node: TreeNode<T>): void {
        if (this.layers.length < node.level + 1) {
            this.layers.push([]);
        }
        this.layers[node.level].push(node);
        if (node.leftChild) {
            this.walk(node.leftChild);
        }
        if (node.rightChild) {
            this.walk(node.rightChild);
        }
    }

    public import(root: TreeNode<T>): void {
        this.setState(root);
    }
}

export default TreeMap;
