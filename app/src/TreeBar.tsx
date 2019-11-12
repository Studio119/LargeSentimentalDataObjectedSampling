/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-12 19:13:35
 */
import React, { Component } from 'react';
import $ from 'jquery';
import { StyleReflection } from './TreeMap';
import Color from './preference/Color';


export interface TreeBarProps {
    id: Readonly<string>;
    width: number;
    height: number;
    style?: React.CSSProperties;
    circleStyle?: StyleReflection;
    pathStyle?: React.CSSProperties;
}

export interface TreeBarNode<T = any> {
    id: Readonly<number>;
    name: Readonly<string | number>;
    width?: number;
    path: Array< 'root' | number >;
    parent: TreeBarNode<T> | null;
    children: Array< TreeBarNode<T> >;
    ref: JQuery<HTMLElement>;
    data: T | null;
}

export interface TreeBarState<T = any> extends TreeBarNode<T> {}

class TreeBar<T = any> extends Component<TreeBarProps, TreeBarState<T>, {}> {
    private layers: Array<Array<TreeBarNode<T>>>;

    public constructor(props: TreeBarProps) {
        super(props);
        this.state = {
            id: -1,
            name: 'root',
            path: [ 'root' ],
            parent: null,
            children: [],
            ref: $("NULL"),
            data: null
        };
        this.layers = [];
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
                    width: `${ this.props.width - 16 }px`,
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
                    <g key="canvas" ref="svg" xmlns={`http://www.w3.org/2000/svg`}>
                        {
                            this.layers.map((layer: Array<TreeBarNode<T>>, level: number) => {
                                let offsetX: number = 0;
                                const height: number = this.props.height / this.layers.length;
                                return layer.map((node: TreeBarNode<T>, index: number) => {
                                    if (index !== 0) {
                                        offsetX += layer[index - 1].width!;
                                    }
                                    const res: [number, number] = this.tot(node);
                                    const value: number = ((res[0] / 2 + 0.5) / res[1]) / 2 + 0.5;
                                    if (level === this.layers.length - 1) {
                                        return [(
                                            <rect id={ `Bar_id${ node.id }` }
                                            key={ node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                            y={ level * height + 1 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                            height={ height - 2 }
                                            style={{
                                                fill: 'rgb(248, 250, 254)',
                                                // stroke: Color.Nippon.Yamabuki
                                                stroke: Color.Nippon.Aisumitya
                                            }}
                                            onClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                    (window as any)['highlight'](node.data);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                }
                                            } />
                                        ), (
                                            <rect id={ `coreBar_id${ node.id }` }
                                            key={ "C_" + node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1.5 }
                                            // y={ (level + 1) * this.props.height / this.layers.length }
                                            y={ (level + 1 - value) * height + 1.5 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 3 }
                                            height={ value * height - 3 }
                                            style={{
                                                fill: value < 0.5
                                                        ?   Color.Nippon.Syozyohi
                                                        :   value === 0.5
                                                                    ?   Color.Nippon.Ukonn
                                                                    :   Color.Nippon.Ruri
                                            }}
                                            onClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                    (window as any)['highlight'](node.data);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                }
                                            } />
                                        )];
                                    }
                                    else {
                                        return (
                                            <rect id={ `Bar_id${ node.id }` }
                                            key={ node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                            y={ level * height + 1 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                            height={ height - 2 }
                                            style={{
                                                fill: value < 0.5
                                                        ?   Color.Nippon.Syozyohi + Math.floor(128 + (value - 0.5) * 256).toString(16).padStart(2, '0').toUpperCase()
                                                        :   value === 0.5
                                                                    ?   Color.Nippon.Ukonn
                                                                    :   Color.Nippon.Ruri + Math.floor(128 + (0.5 - value) * 256).toString(16).padStart(2, '0').toUpperCase(),
                                                // stroke: Color.Nippon.Yamabuki
                                                stroke: Color.Nippon.Aisumitya
                                            }}
                                            onClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                    (window as any)['highlight'](node.data);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    (window as any)['highlightClass'](-1);
                                                }
                                            } />
                                        );
                                    }
                                });
                            })
                        }
                    </g>
                </svg>
            </div>
        );
    }

    public UNSAFE_componentWillUpdate(nextProps: Readonly<TreeBarProps>, nextState: Readonly<TreeBarState<T>>): void {
        this.layers = [];
        this.walk(nextState);
    }

    private tot(node: TreeBarNode<T>): [number, number] {
        if (typeof node.data !== 'object' || typeof (node.data as any)[0] !== 'number') {
            return [-1, -1];
        }
        let value: number = 0;
        let count: number = 0;
        if (node.children.length === 0) {
            ((node.data as any) as Array<number>).forEach((idx: number) => {
                value += parseFloat((window as any)['getPoint'](idx).sentiment);
            });
            count = ((node.data as any) as Array<number>).length;
        }
        else {
            node.children.forEach((child: TreeBarNode<T>) => {
                const res: [number, number] = this.tot(child);
                value += res[0];
                count += res[1];
            });
        }
        return [value, count];
    }

    private random(): number {
        return Math.random() >= 0.73
                ?   0.5
                :   Math.round(Math.random()) / 2 + 0.25 + (Math.round(Math.random()) - 0.5) / 2 * Math.sqrt(Math.random());
    }

    private walk(node: TreeBarNode<T>): number {
        if (node.path.length > this.layers.length) {
            this.layers.push([]);
        }
        this.layers[node.path.length - 1].push(node);
        let sum: number = 0;
        node.children.forEach((child: Readonly<TreeBarNode<T>>) => {
            sum += this.walk(child);
        });
        if (node.children.length === 0) {
            node.width = 1;
        }
        else {
            node.width = sum;
        }
        return node.width;
    }

    public import(root: Readonly<TreeBarNode<T>>): void {
        this.setState(root);
    }
}

export default TreeBar;
