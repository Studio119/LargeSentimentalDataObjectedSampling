/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-06 22:04:28
 */
import React, { Component } from 'react';
import $ from 'jquery';
import { StyleReflection } from './TreeMap';


export interface TreeChartProps {
    id: string;
    width: number;
    height: number;
    style?: React.CSSProperties;
    circleStyle?: StyleReflection;
    pathStyle?: React.CSSProperties;
}

export interface TreeChartNode<T = any> {
    id: number;
    name: string | number;
    path: Array< 'root' | number >;
    parent: TreeChartNode<T> | null;
    children: Array< TreeChartNode<T> >;
    ref: JQuery<HTMLElement>;
    data: T | null;
}

export interface TreeChartState<T = any> extends TreeChartNode<T> {}

class TreeChart<T = any> extends Component<TreeChartProps, TreeChartState<T>, {}> {
    private svg: JQuery<HTMLElement> | null;
    private padding: { top: number, right: number, bottom: number, left: number };
    private r: number;
    private layers: Array<Array<TreeChartNode<T>>>;
    private circlesDict: {[id: number]: JQuery<HTMLElement>};
    private linesDict: {[pointID: number]: Array<[JQuery<HTMLElement>, 'parent' | 'child']>};
    private leavesCount: number;

    public constructor(props: TreeChartProps) {
        super(props);
        this.svg = null;
        this.state = {
            id: -1,
            name: 'root',
            path: [ 'root' ],
            parent: null,
            children: [],
            ref: $("NULL"),
            data: null
        };
        this.padding = { top: 20, right: 20, bottom: 10, left: 20 };
        this.r = 5;
        this.layers = [];
        this.circlesDict = {};
        this.linesDict = {};
        this.leavesCount = 0;
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                height: `${ this.props.height + 24 }px`,
                width: `${ this.props.width }px`,
                border: '1px solid rgb(149,188,239)',
                ...this.props.style
            }} >
                <div
                style={{
                    height: '24px',
                    width: `${ this.props.width }px`,
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Tree Chart
                </div>
                <svg width={`${ this.props.width }px`} height={`${ this.props.height + 24 }px`}
                id={ this.props.id + '_svg' } xmlns={`http://www.w3.org/2000/svg`} >
                    <g key="canvas" ref="svg" xmlns={`http://www.w3.org/2000/svg`} />
                </svg>
            </div>
        );
    }

    public componentDidMount(): void {
        this.svg = $((this.refs["svg"] as any));
        this.draw(this.state);
    }

    public componentDidUpdate(): void {
        this.layers = [];
        this.circlesDict = {};
        this.linesDict = {};
        this.leavesCount = 0;
        this.draw(this.state);
    }

    private draw(node: TreeChartNode<T>): void {
        this.svg!.html("");
        if (!this.svg) {
            return;
        }
        this.walk(node);
        this.linkage(node);
        this.layout();
    }

    private layout(): void {
        let r: number = (this.props.width - this.padding.left - this.padding.right) / this.leavesCount * 0.3;
        r = r < this.r ? r : this.r;
        for (let level: number = this.layers.length - 1; level >= 0; level--) {
            this.layers[level].forEach((node: TreeChartNode<T>) => {
                this.svg!.append(node.ref);
                node.ref.on("click", () => {
                    ((window as any)['highlight'] as ((points: Array<number> | 'all') => void))(node.data! as any);
                }).on("dblclick", () => {
                    ((window as any)['highlight'] as ((points: Array<number> | 'all') => void))('all');
                });
            });
            this.layers[level].forEach((node: TreeChartNode<T>, index: number) => {
                let cx: number = this.padding.left
                                    + (this.props.width - this.padding.left - this.padding.right)
                                        * (index + 0.5) / this.layers[level].length;
                if (node.children.length > 0) {
                    for (let i: number = 0; i < 4000; i+=500) {
                        setTimeout(() => {
                            cx = (parseFloat(node.children[0].ref.css("cx")!)
                                + parseFloat(node.children[node.children.length - 1].ref.css("cx")!)) / 2;
                            node.ref.animate({cx: cx}, 50);
                            this.linesDict[node.id].forEach((value: [JQuery<HTMLElement>, "parent" | "child"]) => {
                                let d: Array<string> = value[0].attr("d")!.replace("M", "").replace("Q", "").split(" ");
                                let s_x: number = parseFloat(d[0].split(',')[0]);
                                let s_y: number = parseFloat(d[0].split(',')[1]);
                                let p_x: number = parseFloat(d[1].split(',')[0]);
                                let p_y: number = parseFloat(d[1].split(',')[1]);
                                let t_x: number = parseFloat(d[2].split(',')[0]);
                                let t_y: number = parseFloat(d[2].split(',')[1]);
                                if (value[1] === 'parent') {
                                    s_x = cx;
                                }
                                else {
                                    t_x = cx;
                                    p_x = cx;
                                }
                                value[0].attr("d", `M${ s_x },${ s_y } Q${ p_x },${ p_y } ${ t_x },${ t_y }`);
                            });
                        }, i);
                    }
                }
                let cy: number = this.padding.top
                                + (this.props.height - this.padding.top - this.padding.bottom)
                                    * (level + 0.5) / this.layers.length;
                node.ref.animate({
                            cx: cx,
                            cy: cy,
                            r: r
                        }, 400);
                if (!this.linesDict.hasOwnProperty(node.id)) {
                    return;
                }
                this.linesDict[node.id].forEach((value: [JQuery<HTMLElement>, "parent" | "child"]) => {
                    let d: Array<string> = value[0].attr("d")!.replace("M", "").replace("Q", "").split(" ");
                    let s_y: number = parseFloat(d[0].split(',')[1]);
                    let p_x: number = parseFloat(d[1].split(',')[0]);
                    let t_x: number = parseFloat(d[2].split(',')[0]);
                    if (value[1] === 'child') {
                        t_x = cx;
                        p_x = cx;
                    }
                    value[0].attr("d", `M${ cx },${ cy } Q${ p_x },${ cy } ${ t_x },${ s_y }`);
                });
            });
        }
    }

    private linkage(node: TreeChartNode<T>): void {
        if (node.children.length > 0) {
            node.children.forEach((child: TreeChartNode<T>) => {
                let path: JQuery<HTMLElement> = $($.parseXML(
                    `<path `
                    + `class="ll" `
                    + `id="${ `branch_${ node.id }+${ child.id }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    + `d="M${ node.ref.attr("cx") },${ node.ref.attr("cy") } `
                        + `Q${ child.ref.attr("cx") },${ node.ref.attr("cy") }`
                        + ` ${ child.ref.attr("cx") },${ child.ref.attr("cy") }" `
                    + `style="`
                        + `stroke: black; `
                        + `fill: none; `
                        + `${
                            this.props.pathStyle
                                ?   Object.keys(this.props.pathStyle).map((item: string) =>
                                        TreeChart.parseCSS(item)
                                        + ": " + ((this.props.pathStyle as {[key: string]: any})[
                                            item
                                        ]! as string)
                                    ).join('; ') + ';'
                                :   ''
                        }`
                        + `" />`).documentElement);
                if (!this.linesDict.hasOwnProperty(node.id)) {
                    this.linesDict[node.id] = [];
                }
                this.linesDict[node.id].push([path, 'parent']);
                if (!this.linesDict.hasOwnProperty(child.id)) {
                    this.linesDict[child.id] = [];
                }
                this.linesDict[child.id].push([path, 'child']);
                this.linkage(child);
                this.svg!.append(path);
            });
        }
    }

    private walk(node: TreeChartNode<T>): void {
        const level: number = node.path.length - 1;
        if (this.layers.length <= level) {
            this.layers.push([]);
        }
        this.layers[level].push(node);
        let circle: JQuery<HTMLElement> = $($.parseXML(
            `<circle r="${ this.r }" `
            + `id="${ `virtualAddr_${ node.id }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
            + `cx="${ this.padding.left + (this.props.width - this.padding.left - this.padding.right) / 2 }" `
            + `cy="${ this.padding.top + (this.props.height - this.padding.top - this.padding.bottom) / 2 }" `
            + `style="stroke: black; `
                + `fill: rgb(58,201,176); `
                + `${
                    this.props.circleStyle
                        ?   Object.keys(this.props.circleStyle).map((item: string) =>
                                TreeChart.parseCSS(item)
                                + ": " + ((this.props.circleStyle as {[key: string]: any})[
                                    item
                                ]! as string)
                            ).join('; ') + ';'
                        :   ''
                }`
                + `" />`
        ).documentElement);
        node.ref = circle;
        this.circlesDict[node.id] = circle;
        if (node.children.length > 0) {
            node.children.forEach((child: TreeChartNode<T>) => {
                this.walk(child);
            });
        }
        else {
            this.leavesCount++;
        }
    }

    private static parseCSS(origin: string): string {
        const letters: Array<string> = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
            'W', 'X', 'Y', 'Z'
        ];
        letters.forEach((upper: string) => {
            origin = origin.replace(upper, `-${ upper.toLowerCase() }`);
        });
        return origin;
    }

    public import(root: TreeChartNode<T>): void {
        this.setState(root);
    }
}

export default TreeChart;
