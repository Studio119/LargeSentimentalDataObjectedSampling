/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-10 13:11:18
 */
import React, { Component } from 'react';

export interface PolylineChartProps {
    id: string;
    width: number;
    height: number;
    padding?: { top: number, right: number, bottom: number, left: number };
    style?: React.CSSProperties;
}

export interface PolylineChartState {
    data: Array<[[number, number], [number, number]]>;
}

class PolylineChart extends Component<PolylineChartProps, PolylineChartState, any> {
    private padding: { top: number, right: number, bottom: number, left: number };

    public constructor(props: PolylineChartProps) {
        super(props);
        this.state = {
            data: []
        };
        this.padding = this.props.padding ? this.props.padding : { top: 30, right: 20, bottom: 30, left: 40 };
    }

    public render(): JSX.Element {
        return (
            <svg className="PolylineChartSVG" xmlns="http://www.w3.org/2000/svg" id={ this.props.id }
                width={ this.props.width } height={ this.props.height }
                style={{
                    background: 'white',
                    ...this.props.style
                }} >
                <line key="x-scale" xmlns="http://www.w3.org/2000/svg" version="1.0"
                x1={ this.padding.left } x2={ this.props.width - this.padding.right }
                y1={ this.padding.top + (this.props.height - this.padding.top - this.padding.bottom) / 2 }
                y2={ this.padding.top + (this.props.height - this.padding.top - this.padding.bottom) / 2 }
                style={{
                    stroke: 'rgb(216,161,21)'
                }} />
                <line key="y-scale" xmlns="http://www.w3.org/2000/svg" version="1.0"
                x1={ this.padding.left } x2={ this.padding.left }
                y1={ this.padding.top } y2={ this.props.height - this.padding.bottom }
                style={{
                    stroke: 'rgb(216,161,21)'
                }} />
                {
                    this.state.data.length === 0
                        ? <text>
                            no data
                        </text>
                        :<>
                            <path key="active:before" xmlns="http://www.w3.org/2000/svg" version="1.0"
                            d={
                                this.state.data.map((e: [[number, number], [number, number]], index: number) => {
                                    return index === 0
                                        ? `M${ this.fx(index) },${ this.fy(e[0][0]) }`
                                        : `L${ this.fx(index) },${ this.fy(e[0][0]) }`;
                                }).join(" ")
                            }
                            style={{
                                stroke: 'rgb(194,8,107)',
                                strokeWidth: '2px',
                                fill: 'none'
                            }} />
                            <path key="positive:before" xmlns="http://www.w3.org/2000/svg" version="1.0"
                            d={
                                this.state.data.map((e: [[number, number], [number, number]], index: number) => {
                                    return index === 0
                                        ? `M${ this.fx(index) },${ this.fy(e[0][1]) }`
                                        : `L${ this.fx(index) },${ this.fy(e[0][1]) }`;
                                }).join(" ")
                            }
                            style={{
                                stroke: 'rgb(194,8,107)',
                                strokeWidth: '2px',
                                fill: 'none'
                            }} />
                            <path key="active:after" xmlns="http://www.w3.org/2000/svg" version="1.0"
                            d={
                                this.state.data.map((e: [[number, number], [number, number]], index: number) => {
                                    return index === 0
                                        ? `M${ this.fx(index) },${ this.fy(e[1][0]) }`
                                        : `L${ this.fx(index) },${ this.fy(e[1][0]) }`;
                                }).join(" ")
                            }
                            style={{
                                stroke: 'rgb(22,83,202)',
                                strokeWidth: '2px',
                                fill: 'none'
                            }} />
                            <path key="positive:after" xmlns="http://www.w3.org/2000/svg" version="1.0"
                            d={
                                this.state.data.map((e: [[number, number], [number, number]], index: number) => {
                                    return index === 0
                                        ? `M${ this.fx(index) },${ this.fy(e[1][1]) }`
                                        : `L${ this.fx(index) },${ this.fy(e[1][1]) }`;
                                }).join(" ")
                            }
                            style={{
                                stroke: 'rgb(22,83,202)',
                                strokeWidth: '2px',
                                fill: 'none'
                            }} />
                        </>
                }
            </svg>
        );
    }

    public shouldComponentUpdate(nextProps: any, nextState: PolylineChartState): boolean {
        let max: number = 0;
        nextState.data.forEach((value: [[number, number], [number, number]]) => {
            if (value[0][0] > max) {
                max = value[0][0];
            }
            if ( - value[0][1] > max) {
                max = - value[0][1];
            }
        });
        this.fx = (input: number) => {
            return (input + 1) / (nextState.data.length + 2) * (this.props.width - this.padding.left - this.padding.right) + this.padding.left;
        };
        this.fy = (input: number) => {
            return this.padding.top + (this.props.height - this.padding.top - this.padding.bottom) / 2 - input / max * (this.props.height - this.padding.top - this.padding.bottom) / 2;
        };
        return true;
    }

    private fx(input: number): number {
        return input;
    }

    private fy(input: number): number {
        return input;
    }

    public import(data: Array<[[number, number], [number, number]]>): void {
        data.sort((a: [[number, number], [number, number]], b: [[number, number], [number, number]]) => {
            return a[0][0] - b[0][0];
        });
        this.setState({
            data: data
        });
    }
}


export default PolylineChart;
