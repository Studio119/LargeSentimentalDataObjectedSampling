/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-03 01:36:24
 */
import React, { Component } from 'react';
import $ from 'jquery';

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
}

export interface ContrastViewState extends RectNode {}

class ContrastView extends Component<ContrastViewProps, ContrastViewState, {}> {
    private svg: JQuery<HTMLElement> | null;
    private base: RectNode;
    private baseLevel: number;

    public constructor(props: ContrastViewProps) {
        super(props);
        // this.state = {
        //     attr: {
        //         x: 0,
        //         y: 0,
        //         width: 523,
        //         height: 306
        //     },
        //     level: 0,
        //     path: [ 'root' ],
        //     parent: null,
        //     leftChild: null,
        //     rightChild: null
        // };
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
            leftChild: {
                attr: {
                    x: 0,
                    y: 0,
                    width: 203,
                    height: 306
                },
                level: 1,
                path: [ 'root', 'left' ],
                parent: null,
                leftChild: {
                    attr: {
                        x: 0,
                        y: 0,
                        width: 203,
                        height: 150
                    },
                    level: 2,
                    path: [ 'root', 'left', 'left' ],
                    parent: null,
                    leftChild: null,
                    rightChild: null
                },
                rightChild: {
                    attr: {
                        x: 0,
                        y: 150,
                        width: 203,
                        height: 157
                    },
                    level: 2,
                    path: [ 'root', 'left', 'right' ],
                    parent: null,
                    leftChild: null,
                    rightChild: null
                }
            },
            rightChild: {
                attr: {
                    x: 203,
                    y: 0,
                    width: 270,
                    height: 306
                },
                level: 1,
                path: [ 'root', 'right' ],
                parent: null,
                leftChild: {
                    attr: {
                        x: 203,
                        y: 180,
                        width: 270,
                        height: 126
                    },
                    level: 2,
                    path: [ 'root', 'right', 'left' ],
                    parent: null,
                    leftChild: {
                        attr: {
                            x: 203,
                            y: 180,
                            width: 270,
                            height: 46
                        },
                        level: 3,
                        path: [ 'root', 'right', 'left', 'left' ],
                        parent: null,
                        leftChild: null,
                        rightChild: null
                    },
                    rightChild: {
                        attr: {
                            x: 203,
                            y: 226,
                            width: 270,
                            height: 80
                        },
                        level: 3,
                        path: [ 'root', 'right', 'left', 'right' ],
                        parent: null,
                        leftChild: null,
                        rightChild: null
                    }
                },
                rightChild: {
                    attr: {
                        x: 203,
                        y: 0,
                        width: 270,
                        height: 180
                    },
                    level: 2,
                    path: [ 'root', 'right', 'right' ],
                    parent: null,
                    leftChild: {
                        attr: {
                            x: 203,
                            y: 0,
                            width: 130,
                            height: 180
                        },
                        level: 3,
                        path: [ 'root', 'right', 'right', 'left' ],
                        parent: null,
                        leftChild: null,
                        rightChild: null
                    },
                    rightChild: {
                        attr: {
                            x: 333,
                            y: 0,
                            width: 140,
                            height: 180
                        },
                        level: 3,
                        path: [ 'root', 'right', 'right', 'right' ],
                        parent: null,
                        leftChild: null,
                        rightChild: null
                    }
                }
            }
        };
        this.base = this.state;
        this.baseLevel = 0;
        this.svg = null;
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '475px',
                    paddingTop: '1px',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
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
        this.draw(this.state);
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

        if (node.level > this.baseLevel + this.props.displayLevels || this.base.path.length > node.path.length) {
            return attr;
        }
        for (let i: number = 0; i < this.base.path.length; i++) {
            if (this.base.path[i] !== node.path[i]) {
                return attr;
            }
        }
        if (this.svg) {
            let rect: JQuery<HTMLElement> = $($.parseXML(
                `<rect x="${ attr.x }" y="${ attr.y }" width="${ attr.width }" height="${ attr.height }" id="${ node.path.join("-") }" `
                + `xmlns="http://www.w3.org/2000/svg" version="1.0" style="stroke: black; fill: none; stroke-width: ${ 8 / (node.path.length * 2 + 1) }" />`
            ).documentElement);
            if (!left && !right) {
                rect.css("fill", `rgb(${ Math.random() * 255 }, ${ Math.random() * 255 }, ${ Math.random() * 255 })`);
            }
            this.svg.append(rect);
        }

        return attr;
    }
}

export default ContrastView;
