/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-26 18:44:41 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-26 23:09:15
 */

import React, { Component } from 'react';
import $ from 'jquery';

export interface ValueBarProps {
    width: number;
    height: number;
    min: number;
    max: number;
    defaultValue?: number;
    domainArray?: Array<number>;
    step?: number;
    label?: string;
    showValue?: boolean;
    valueFormatter?: (value: number) => (string | number);
}

export interface ValueBarState {
    value: number;
}

export var nicer: (num: number) => number
    = (num : number) => {
        let flag: number = 1;
        if (num < 0) {
            flag = -1;
            num *= -1;
        }
        let level: number = 1;
        while (num < 0.1) {
            num *= 10;
            level--;
        }
        while (num > 1) {
            num /= 10;
            level++;
        }
        num = num >= 0.8 ? 1 : num >= 0.6 ? parseInt((num * 20).toString()) / 20
            : num >= 0.4 ? 0.5 : parseInt((num * 20).toString()) / 20;
        while (level < 1) {
            num /= 10;
            level++;
        }
        while (level > 1) {
            num *= 10;
            level--;
        }
        return flag * num;
    };

export var precisionFit: (num: number, model: number) => number
    = (num: number, model: number) => {
        if (num === 0 || model === 0) {
            return num;
        }
        model = model > 0 ? model : -1 * model;
        let flag: number = 1;
        let level: number = 1;
        if (num < 0) {
            num *= -1;
            flag = -1;
        }
        while (parseInt(model.toString()) !== model) {
            model *= 10;
            num *= 10;
            level--;
        }
        while (model % 10 === 0) {
            model /= 10;
            num /= 10;
            level++;
        }
        num = parseInt((num + 0.5).toString());
        while (level < 1) {
            num /= 10;
            level++;
        }
        while (level > 1) {
            num *= 10;
            level--;
        }
        return flag * num;
    };

class ValueBar extends Component<ValueBarProps, ValueBarState, {}> {
    protected isDiscrete: boolean;
    protected step?: number;
    protected showValue: boolean;
    protected defaultValue: number;
    protected valueFormatter: (value: number) => (string | number);

    public constructor(props: ValueBarProps) {
        super(props);
        this.showValue = this.props.showValue ? this.props.showValue : true;
        this.defaultValue = this.props.defaultValue ? this.props.defaultValue : this.props.min;
        this.valueFormatter = this.props.valueFormatter ? this.props.valueFormatter
            : (value: number) => precisionFit(value,
                this.props.step ? this.props.step : nicer((this.props.max - this.props.min) / 100));
        if (this.props.domainArray) {
            this.isDiscrete = true;
        }
        else {
            this.isDiscrete = false;
            this.step = this.props.step ? this.props.step : nicer((this.props.max - this.props.min) / 100);
        }
        this.state = {
            value: this.defaultValue
        };
    }

    public render(): JSX.Element {
        return (
            <div className="ValueBar" style={{ display: 'inline-block', alignItems: 'center', transform: 'translateY(50%)' }}>
                {
                    this.props.label
                        ? <p key="label" style={
                            { display: 'inline-block',
                                minWidth: '20px',
                                maxWidth: '20px',
                                verticalAlign: 'top',
                                margin: '0px 8px 0px 4px',
                                transform: 'translateY(-8%)',
                                fontSize: this.props.height * 0.8 + 'px' }}>
                                { this.props.label }
                            </p>
                        : <></>
                }
                {
                    this.showValue
                        ? <p key="value" style={
                            { display: 'inline-block',
                                minWidth: '20px',
                                maxWidth: '20px',
                                verticalAlign: 'top',
                                margin: '0px 8px 0px 4px',
                                transform: 'translateY(-8%)',
                                fontSize: this.props.height * 0.8 + 'px' }}>
                                { this.valueFormatter(this.state.value) }
                            </p>
                        : <></>
                }
                <svg className="ValueBarSVG" key="svg" xmlns="http://www.w3.org/2000/svg"
                        width={ this.props.width } height={ this.props.height }
                        style={{ display: 'inline-block' }} >
                    <defs>
                        <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ stopColor: 'rgb(127, 129, 134)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#282c34', stopOpacity: 1 }} />
                        </radialGradient>
                        <linearGradient id="linear-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="15%" style={{ stopColor: 'rgb(141, 143, 147)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(54, 57, 65)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <rect key="background"
                        x={ 10 } y={ this.props.height / 2 - 3 } rx={ 3 } ry={ 3 }
                        width={ this.props.width - 20 } height={ 6 }
                        style={{ fill: 'url(#linear-grad)' }} />
                    <circle key="flag" ref="flag"
                        cx={ 10 + (this.props.width - 20)
                            * (this.state.value - this.props.min) / (this.props.max - this.props.min) }
                        cy={ this.props.height / 2 } r={ 6 }
                        style={{fill: 'url(#grad)', stroke: 'rgb(135, 137, 142)', strokeWidth: '2px' }} />
                </svg>
            </div>
        );
    }

    public componentDidMount(): void {
        // $(this.refs["flag"]).on('mousedown')
    }

    public val(value?: number): number | void {
        if (value) {
            this.setState({
                value: value
            });
            return;
        }
        return this.state.value;
    }
}


export default ValueBar;
