/*
 * @Author: Antoine YANG 
 * @Date: 2019-11-24 14:10:09 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-24 19:40:50
 */

import React, { Component } from 'react';
import $ from 'jquery';
import Color from './preference/Color';
import { Globe } from './App';


export interface ResultViewState {
    classes: Array<{
        id: number;
        valueBefore: number;
        valueAfter: number;
    }>;
}

class ResultView extends Component<{}, ResultViewState, {}> {
    private y: {[id: number]: [number, number]};

    public constructor(props: {}) {
        super(props);
        this.state = {
            classes: []
        };
        this.y = {};
    }

    public render(): JSX.Element {
        return (
            <div id="ResultView"
            style={{
                border: '1px solid rgb(149, 188, 239)',
                background: 'white none repeat scroll 0% 0%',
                position: 'absolute',
                left: '1163px',
                top: '595.4px',
                width: '373px',
                height: '266.2px'
            }} >
                <div key="title"
                style={{
                    height: '24px',
                    width: `358px`,
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Average Sentiment Value
                </div>
                <div key="header"
                style={{
                    height: '24.2px',
                    width: `100%`
                }} >
                    <p style={{
                        margin: '4px 0px',
                        paddingRight: '22px'
                    }} >
                        <span key="1" style={{
                            width: '150px',
                            textAlign: 'center',
                            display: 'inline-block'
                        }} >
                            Before Sampling
                        </span>
                        <span key="strip" style={{
                            width: '47.8px',
                            textAlign: 'center',
                            display: 'inline-block'
                        }} >
                            |
                        </span>
                        <span key="2" style={{
                            width: '150px',
                            textAlign: 'center',
                            display: 'inline-block'
                        }} >
                            After Sampling
                        </span>
                    </p>
                </div>
                <div key="container" ref="container"
                style={{
                    height: '213px',
                    width: `100%`,
                    overflowY: 'scroll'
                }} >
                    <svg width="100%" height={`${ this.state.classes.length * 20 }px`} xmlns={`http://www.w3.org/2000/svg`}
                    ref="svg" >
                        {
                            this.state.classes.sort((a: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }, b: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }) => {
                                const dif: number = b.valueBefore - a.valueBefore;
                                return dif === 0 ? b.id - a.id : dif;
                            }).map((leaf: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }, index: number) => {
                                const y: number = index * 20 + 4;
                                this.y[leaf.id] = [y, NaN];
                                return (
                                    <g key={ "g0_" + leaf.id }>
                                        <text id={ `prevResId${ leaf.id }` }
                                        key={ `prevResId${ leaf.id }` }
                                        x={ 7 }
                                        y={ index * 20 + 16 }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        style={{
                                            textAlign: 'right'
                                        }} >
                                            { leaf.id }
                                        </text>
                                        <rect id={ `prevRes${ leaf.id }` }
                                        key={ `prevRes${ leaf.id }` }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        x={ 48 + 100 * (1 - Math.abs(leaf.valueBefore)) }
                                        y={ y }
                                        width={ 100 * Math.abs(leaf.valueBefore) }
                                        height={ 12 }
                                        style={{
                                            fill: leaf.valueBefore === 0
                                                ? Color.Nippon.Kinntya
                                                : leaf.valueBefore < 0
                                                    ? Color.Nippon.Syozyohi
                                                    : Color.Nippon.Ruri,
                                            stroke: Color.setLightness(Color.Nippon.Aisumitya, 0.7)
                                        }} />
                                    </g>);
                            })
                        }
                        {
                            this.state.classes.sort((a: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }, b: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }) => {
                                const dif: number = b.valueAfter - a.valueAfter;
                                return dif === 0 ? b.id - a.id : dif;
                            }).map((leaf: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }, index: number) => {
                                const y: number = index * 20 + 4;
                                this.y[leaf.id][1] = y;
                                return isNaN(leaf.valueAfter) ? null : (
                                    <g key={ "g1_" + leaf.id }>
                                        <text id={ `nextResId${ leaf.id }` }
                                        key={ `nextResId${ leaf.id }` }
                                        x={ 315 }
                                        y={ index * 20 + 16 }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        style={{
                                            textAlign: 'left'
                                        }} >
                                            { leaf.id }
                                        </text>
                                        <rect id={ `nextRes${ leaf.id }` }
                                        key={ `nextRes${ leaf.id }` }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        x={ 205 }
                                        y={ index * 20 + 4 }
                                        width={ 100 * Math.abs(leaf.valueAfter) }
                                        height={ 12 }
                                        style={{
                                            fill: leaf.valueAfter === 0
                                                ? Color.Nippon.Kinntya
                                                : leaf.valueAfter < 0
                                                    ? Color.Nippon.Syozyohi
                                                    : Color.Nippon.Ruri,
                                            stroke: Color.setLightness(Color.Nippon.Aisumitya, 0.7)
                                        }} />
                                    </g>);
                            })
                        }
                        {
                            this.state.classes.map((leaf: {
                                id: number;
                                valueBefore: number;
                                valueAfter: number;
                            }) => {
                                const prevY: number = this.y[leaf.id][0];
                                const nextY: number = this.y[leaf.id][1];
                                return (
                                    <path id={ `link${ leaf.id }` }
                                    key={ `link${ leaf.id }` }
                                    xmlns={`http://www.w3.org/2000/svg`}
                                    d={
                                        `M148,${ prevY + 3 } `
                                        + `L205,${ nextY + 3 } L205,${ nextY + 9 } L148,${ prevY + 9 } Z`
                                    }
                                    style={{
                                        fill: (prevY === nextY
                                            ? Color.Nippon.Tokiwa
                                            : Color.Nippon.Enzi) + '60',
                                        stroke: Color.setLightness(prevY === nextY
                                            ? Color.Nippon.Tokiwa
                                            : Color.Nippon.Enzi, 0.4)
                                    }} />
                                );
                            })
                        }
                    </svg>
                </div>
            </div>
        );
    }

    public import(points: Array<number> | "all"): void {
        $(this.refs["svg *"]).remove();
        setTimeout(() => {
            let classes: {
                [id: number]: {
                    valueBefore: number;
                    valueAfter: number;
                    countBefore: number;
                    countAfter: number;
                }
            } = [];
            if (points === 'all') {
                for (let i: number = 0; true; i++) {
                    const point = Globe.getPoint(i);
                    if (!point) {
                        break;
                    }
                    const heap: number = point.class;
                    const value: number = parseFloat(point.sentiment);
                    if (value === 0) {
                        continue;
                    }
                    if (classes.hasOwnProperty(heap)) {
                        classes[heap].countBefore++;
                        classes[heap].valueBefore += value;
                    }
                    else {
                        classes[heap] = {
                            valueBefore: value,
                            valueAfter: 0,
                            countBefore: 1,
                            countAfter: 0
                        };
                    }
                    if (Globe.checkIfPointIsSampled(i)) {
                        classes[heap].countAfter++;
                        classes[heap].valueAfter += value;
                    }
                }
            }
            else {
                points.forEach((i: number) => {
                    const point = Globe.getPoint(i);
                    const heap: number = point.class;
                    const value: number = parseFloat(point.sentiment);
                    if (value === 0) {
                        return;
                    }
                    if (classes.hasOwnProperty(heap)) {
                        classes[heap].countBefore++;
                        classes[heap].valueBefore += value;
                    }
                    else {
                        classes[heap] = {
                            valueBefore: value,
                            valueAfter: 0,
                            countBefore: 1,
                            countAfter: 0
                        };
                    }
                    if (Globe.checkIfPointIsSampled(i)) {
                        classes[heap].countAfter++;
                        classes[heap].valueAfter += value;
                    }
                });
            }
            this.setState({
                classes: Object.entries(classes).map((value: [string, {
                    valueBefore: number;
                    valueAfter: number;
                    countBefore: number;
                    countAfter: number;
                }]) => {
                    return {
                        id: parseInt(value[0]),
                        valueBefore: value[1].valueBefore / value[1].countBefore,
                        valueAfter: value[1].valueAfter / value[1].countAfter
                    };
                })
            });
        }, 400);
    }

    public componentDidUpdate(): void {
        $(this.refs["container"]).animate({
            scrollTop: 0
        }, 800);
    }

    public componentDidMount(): void {
        setTimeout(() => {
            this.import("all");
        }, 4000);
    }
}


export default ResultView;