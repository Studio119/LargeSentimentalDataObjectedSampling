/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-22 17:57:12
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
    id: number;
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
    private handler: NodeJS.Timeout | null;
    private circlesDict: any;
    private linesDict: any;
    private prun: Array<number>;

    public constructor(props: TreeMapProps<T>) {
        super(props);
        this.svg = null;
        this.state = {
            id: -1,
            level: 0,
            path: [ 'root' ],
            parent: null,
            leftChild: null,
            rightChild: null,
            ref: $("NULL")
        };
        this.layers = [];
        this.width = 788;
        this.height = 282;
        this.padding = { top: 10, right: 20, bottom: 10, left: 20 };
        this.r = 3;
        this.handler = null;
        this.circlesDict = {};
        this.linesDict = {};
        this.prun = [];
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                height: '311px',
                width: '788px',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '-7px',
                left: '321.3px'
            }}>
                <div
                style={{
                    height: '24px',
                    width: '772px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }}>
                    Pruning of K-D Tree
                </div>
                <svg width="788px" height="283px" id={ this.props.id + '_svg' } xmlns={`http://www.w3.org/2000/svg`}
                style={{
                    ...this.props.style
                }}>
                    <g key="canvas" ref="svg" xmlns={`http://www.w3.org/2000/svg`} />
                    <g key="tools" xmlns={`http://www.w3.org/2000/svg`} >
                        <path xmlns={`http://www.w3.org/2000/svg`} key="origin" ref="button1"
                        d="M10,4 L58,4 L68,18 L58,32 L10,32 Z"
                        style={{
                            stroke: 'black',
                            fill: 'dimgrey'
                        }} />
                        <text xmlns={`http://www.w3.org/2000/svg`} key="originT"
                        textAnchor="middle" x="38" y="22"
                        style={{
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            userSelect: 'none'
                        }}
                        onDragStart={
                            () => false
                        } >
                            before
                        </text>
                        <path xmlns={`http://www.w3.org/2000/svg`} key="prun" ref="button2"
                        d="M66,4 L120,4 L130,18 L120,32 L66,32 L76,18 Z"
                        style={{
                            stroke: 'black',
                            fill: 'dimgrey'
                        }} />
                        <text xmlns={`http://www.w3.org/2000/svg`} key="prunT" ref="bt2"
                        textAnchor="middle" x="100" y="22"
                        style={{
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            userSelect: 'none'
                        }}
                        onDragStart={
                            () => false
                        } >
                            prun
                        </text>
                        <path xmlns={`http://www.w3.org/2000/svg`} key="after" ref="button3"
                        d="M128,4 L182,4 L192,18 L182,32 L128,32 L138,18 Z"
                        style={{
                            stroke: 'black',
                            fill: 'dimgrey'
                        }} />
                        <text xmlns={`http://www.w3.org/2000/svg`} key="afterT"
                        textAnchor="middle" x="163" y="22"
                        style={{
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            userSelect: 'none'
                        }}
                        onDragStart={
                            () => false
                        } >
                            after
                        </text>
                    </g>
                </svg>
            </div>
        );
    }

    public componentDidMount(): void {
        this.svg = $((this.refs["svg"] as any));
        this.draw(this.state);
    }

    public componentDidUpdate(): void {
        this.circlesDict = {};
        this.linesDict = {};
        $(this.refs['button1']).css('fill', 'dimgrey');
        $(this.refs['button2']).css('fill', 'dimgrey');
        $(this.refs['button3']).css('fill', 'dimgrey');
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
        let lines: Array< { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement>, id: number } > = [];
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
                this.circlesDict["id_" + this.layers[level][index].id] = { node: this.layers[level][index], ref: virtualCircles[pos] };
                if (this.layers[level][index].leftChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 1], id: this.layers[level][index].leftChild!.id });
                }
                if (this.layers[level][index].rightChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 2], id: this.layers[level][index].rightChild!.id });
                }
                circles[level].push({ node: this.layers[level][index], element: virtualCircles[pos], level: level, index: index });
            }
        }
        lines.forEach((d: { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement>, id: number }, index: number) => {
            let line: JQuery<HTMLElement> = parseFloat(d.parent.attr("cx")!) > parseFloat(d.child.attr("cx")!) // left child
                ? $($.parseXML(
                    `<path `
                    + `class="ll" `
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
                    + `class="ll" `
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
            this.linesDict["id_" + d.id] = line;
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
                        if (this.handler) {
                            clearTimeout(this.handler);
                        }
                        this.handler = setTimeout(() => {
                            this.updateBranches(lines);
                        }, 0);
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
                    .attr("r", this.r * zoomRate)
                    .css("fill-opacity", 1);
                this.updateBranches(lines);
                if (index === box.length - 1) {
                    setTimeout(() => {
                        $(this.refs['button1']).css('fill', 'paleturquoise');
                        $(this.refs['button2']).css('fill', 'lawngreen')
                            .css('stroke', 'none')
                            .on('click', () => {
                                $(this.refs['button2']).css('fill', 'paleturquoise')
                                    .css('stroke', 'black')
                                    .on('click', () => {});
                                this.cut();
                            });
                        $(this.refs['bt2'])
                            .on('click', () => {
                                $(this.refs['button2']).css('fill', 'paleturquoise')
                                    .css('stroke', 'black')
                                    .on('click', () => {});
                                this.cut();
                            });
                    });
                }
            }, index * 10);
        });
        $('.ll').css('stroke-width', zoomRate + 'px');
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

    private cut(): void {
        this.prun.forEach((id: number) => {
            this.cutChildren(id);
        });
        $(this.refs['button3']).css('fill', 'paleturquoise');
    }

    private cutChildren(id: number): void {
        if (this.circlesDict["id_" + id]) {
            const e: { node: TreeNode<T>; ref: JQuery<HTMLElement>; }
                = (this.circlesDict["id_" + id] as { node: TreeNode<T>; ref: JQuery<HTMLElement>; });
            e.ref.css("fill", "dimgrey").css('stroke', 'none').css('fill-opacity', 0.4);
            if (e.node.leftChild) {
                this.cutChildren(e.node.leftChild.id);
            }
            if (e.node.rightChild) {
                this.cutChildren(e.node.rightChild.id);
            }
        }
        if (this.linesDict["id_" + id]) {
            const e: JQuery<HTMLElement> = (this.linesDict["id_" + id] as JQuery<HTMLElement>);
            e.css('stroke', 'burlywood');
        }
    }

    public importPruning(data: Array<number>): void {
        this.prun = data;
    }
}

export default TreeMap;
