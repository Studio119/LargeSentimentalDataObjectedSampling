/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-07 22:22:29
 */
import React, { Component } from 'react';
import $ from 'jquery';

export interface TreeMapProps {
    id: string;
}

export interface TreeNode {
    level: number;
    path: Array< 'root' | 'left' | 'right' >;
    parent: TreeNode | null;
    leftChild: TreeNode | null;
    rightChild: TreeNode | null;
    ref: JQuery<HTMLElement>;
}

export interface TreeMapState extends TreeNode {}

class TreeMap extends Component<TreeMapProps, TreeMapState, {}> {
    private svg: JQuery<HTMLElement> | null;
    private layers: Array< Array<TreeNode> >;
    private padding: { top: number, right: number, bottom: number, left: number };

    public constructor(props: TreeMapProps) {
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
        this.padding = { top: 10, right: 10, bottom: 10, left: 10 };
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                display: 'inline-block',
                height: '100%',
                width: '509px',
                border: '1px solid black'
            }}>
                <svg width="100%" height="100%" id={ this.props.id + '_svg' } ref="svg" xmlns={`http://www.w3.org/2000/svg`} />
            </div>
        );
    }

    public componentDidMount(): void {
        this.svg = $((this.refs["svg"] as any));
        this.draw(this.state);
    }

    public componentDidUpdate(): void {
        this.svg!.html("");
        this.draw(this.state);
    }

    private draw(node: TreeNode): void {
        this.layers = [];
        if (!this.svg) {
            return;
        }
        this.walk(node);
        let virtualCircles: Array< JQuery<HTMLElement> > = [];
        let circles: Array< { node: TreeNode, element: JQuery<HTMLElement>, level: number, index: number } > = [];
        let lines: Array< { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> } > = [];
        for (let level: number = 0; level < this.layers.length; level++) {
            for (let index: number = 0; index < Math.pow(2, level); index++) {
                let circle: JQuery<HTMLElement> = $($.parseXML(
                    `<circle r="2" `
                    + `cx="${ this.padding.left + (index + 0.5) * (509 - this.padding.left - this.padding.right) / Math.pow(2, level) }" `
                    + `cy="${ this.padding.top + (level + 0.5) * (306 - this.padding.top - this.padding.bottom) / this.layers.length }" `
                    + `id="${ `virtualAddr/${ level }-${ index }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    + `style="stroke: black; `
                        + `fill: rgb(${ Math.random() * 80 + 100 }, ${ Math.random() * 80 + 100 }, ${ Math.random() * 80 + 100 });`
                        + `" />`
                ).documentElement);
                virtualCircles.push(circle);
            }
        }
        for (let level: number = 0; level < this.layers.length; level++) {
            for (let index: number = 0; index < this.layers[level].length; index++) {
                let pos: number = TreeMap.path2index(this.layers[level][index].path);
                if (this.layers[level][index].leftChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 1] });
                }
                if (this.layers[level][index].rightChild) {
                    lines.push({ parent: virtualCircles[pos], child: virtualCircles[pos * 2 + 2] });
                }
                circles.push({ node: this.layers[level][index], element: virtualCircles[pos], level: level, index: index });
            }
        }
        lines.forEach((d: { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> }, index: number) => {
            let line: JQuery<HTMLElement> = $($.parseXML(
                `<line `
                + `id="${ `branch_${ index }` }" xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `x1="${ d.parent.attr("cx") }" y1="${ d.parent.attr("cy") }" `
                + `x2="${ d.child.attr("cx") }" y2="${ d.child.attr("cy") }" `
                + `style="stroke: black; " />`
            ).documentElement);
            this.svg!.append(line);
        });
        circles.forEach((d: { node: TreeNode, element: JQuery<HTMLElement>, level: number, index: number }) => {
            this.svg!.append(d.element);
            let virtualX: number = parseFloat(d.element.attr("cx")!);
            let realX: number = this.padding.left + (d.index + 0.5) * (509 - this.padding.left - this.padding.right) / this.layers[d.level].length;
            // let cx: number = realX * d.level / this.layers.length + virtualX * (1 - d.level / this.layers.length);
            let cx: number = realX * d.level / this.layers.length / 2 + virtualX * (0.5 + 0.5 - d.level / this.layers.length / 2);
            // let cx: number = realX * d.level / this.layers.length / 4 + virtualX * (0.75 + 0.25 - d.level / this.layers.length / 4);
            for (let i: number = 100; i <= 400; i += 20) {
                setTimeout(() => {
                    d.element.attr("cx", virtualX * (400 - i) / 400 + i / 400 * cx);
                }, i);
            }
        });
        lines.forEach((d: { parent: JQuery<HTMLElement>, child: JQuery<HTMLElement> }, index: number) => {
            for (let i: number = 100; i <= 400; i += 20) {
                setTimeout(() => {
                    $(`#branch_${ index }`).attr("x1", () => {
                            return $(d.parent).attr("cx")!;
                        })
                        .attr("x2", () => {
                            return $(d.child).attr("cx")!;
                        });
                }, i + 20);
            }
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

    private walk(node: TreeNode): void {
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

    public import(root: TreeNode): void {
        this.setState(root);
    }
}

export default TreeMap;
