/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-26 18:44:41 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-27 19:11:20
 */

import React, { Component } from 'react';
import $ from 'jquery';

export class ValueChangeCallback<T> {
    private valueBeforeChange: T;
    private onValueChange: (valueAfterChange: T) => void;

    public constructor(value: T, callback: (valueAfterChange: T) => void) {
        this.valueBeforeChange = value;
        this.onValueChange = callback;
    }

    public update(valueAfterChange: T): boolean {
        if (valueAfterChange instanceof Object) {
            let shouldUpdate: boolean = false;
            for (const key in (this.valueBeforeChange as Object)) {
                if ((this.valueBeforeChange as any).hasOwnProperty(key)) {
                    const element = (this.valueBeforeChange as any)[key];
                    if ((valueAfterChange as any).hasOwnProperty(key) && (valueAfterChange as any)[key] !== element) {
                        shouldUpdate = true;
                        break;
                    }
                }
            }
            if (!shouldUpdate) {
                return false;
            }
        }
        else {
            if (this.valueBeforeChange === valueAfterChange) {
                return false;
            }
        }
        this.valueBeforeChange = valueAfterChange;
        this.onValueChange(valueAfterChange);
        return true;
    }
}

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
    onValueChange?: (value: number) => null | void | undefined;
    style?: React.CSSProperties;
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
        let length: number = num.toString().length;
        while (level < 1) {
            num /= 10;
            if (num < 1) {
                length++;
            }
            if (num.toString().length > length) {
                num = parseInt(num.toString().substr(0, length));
            }
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
    protected placeLength: number;
    protected defaultValue: number;
    protected valueFormatter: (value: number) => (string | number);
    protected dragging: boolean;
    protected xBeforeDragging: number;
    protected cxBeforeDragging: number;
    protected debounceHandler: number;
    protected valueAfterDragging: number;
    protected timeoutHandler: NodeJS.Timeout | null;
    protected callbackHandler: ValueChangeCallback<ValueBarState>;

    public constructor(props: ValueBarProps) {
        super(props);
        this.dragging = false;
        this.xBeforeDragging = 0;
        this.cxBeforeDragging = 0;
        this.debounceHandler = 0;
        this.timeoutHandler = null;
        this.showValue = this.props.showValue ? this.props.showValue : true;
        this.defaultValue = this.props.defaultValue ? this.props.defaultValue : this.props.min;
        this.valueAfterDragging = this.props.defaultValue!;
        this.valueFormatter = this.props.valueFormatter ? this.props.valueFormatter
            : (value: number) => precisionFit(value,
                this.props.step ? this.props.step : nicer((this.props.max - this.props.min) / 100));
        this.placeLength = 0;
        if (this.props.domainArray) {
            this.isDiscrete = true;
            this.props.domainArray.forEach((d: number) => {
                let length: number = this.valueFormatter(d).toString().length;
                if (length > this.placeLength) {
                    this.placeLength = length;
                }
            });
        }
        else {
            this.isDiscrete = false;
            this.step = this.props.step ? this.props.step : nicer((this.props.max - this.props.min) / 100);
            for (let x: number = this.props.min; true; x += this.step) {
                if (x > this.props.max) {
                    x = this.props.max;
                }
                let length: number = this.valueFormatter(x).toString().length;
                if (length > this.placeLength) {
                    this.placeLength = length;
                }
                if (x === this.props.max) {
                    break;
                }
            }
        }
        this.callbackHandler = new ValueChangeCallback<ValueBarState>({ value: this.defaultValue },
            (valueAfterChange: ValueBarState) => { this.setState({ ...valueAfterChange }); });
        this.state = {
            value: this.defaultValue
        };
    }

    public render(): JSX.Element {
        return (
            <div className="ValueBar" style={{ display: 'inline-block', alignItems: 'center', transform: 'translateY(50%)',
            padding: "0px 10px 0px 6px", ...this.props.style }} ref="container" >
                {
                    this.props.label
                        ? <p key="label" style={
                            { display: 'inline-block',
                                verticalAlign: 'top',
                                margin: '0px 4px 0px 0px',
                                transform: 'translateY(-8%)',
                                fontSize: this.props.height * 0.8 + 'px' }}>
                                { this.props.label }
                            </p>
                        : <></>
                }
                {
                    this.showValue
                        ? <p key="value" ref="value" style={
                            { display: 'inline-block',
                                minWidth: `${ this.placeLength * 10 + 4 }px`,
                                maxWidth: `${ this.placeLength * 10 + 4 }px`,
                                verticalAlign: 'top',
                                margin: '0px 4px 0px 0px',
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
                        <radialGradient id="active" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ stopColor: 'rgb(141, 143, 147)', stopOpacity: 1 }} />
                            <stop offset="20%" style={{ stopColor: 'rgb(141, 143, 147)', stopOpacity: 1 }} />
                            <stop offset="85%" style={{ stopColor: 'rgb(93, 95, 102)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(93, 95, 102)', stopOpacity: 1 }} />
                        </radialGradient>
                        <linearGradient id="linear-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="15%" style={{ stopColor: 'rgb(141, 143, 147)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgb(54, 57, 65)', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <rect key="background" ref="background"
                        x={ 10 } y={ this.props.height / 2 - 4 } rx={ 4 } ry={ 4 }
                        width={ this.props.width - 20 } height={ 8 }
                        style={{ fill: 'url(#linear-grad)' }} />
                    <circle key="flag" ref="flag"
                        cx={ 10 + (this.props.width - 20)
                            * (this.state.value - this.props.min) / (this.props.max - this.props.min) }
                        cy={ this.props.height / 2 } r={ 8 }
                        style={{ fill: 'url(#grad)', stroke: 'rgb(135, 137, 142)', strokeWidth: '2px' }} />
                </svg>
            </div>
        );
    }

    public componentDidMount(): void {
        $(this.refs["flag"]).on('mousedown', (event: JQuery.MouseDownEvent<React.ReactInstance, undefined, React.ReactInstance, React.ReactInstance>) => {
            $(this.refs["flag"]).css("fill", "url(#active)").css("stroke", "rgb(240, 249, 254)");
            this.dragging = true;
            $(this.refs["value"]).css("color", "rgb(53, 140, 214)");
            this.cxBeforeDragging = event.clientX;
            this.xBeforeDragging = parseFloat($(this.refs["flag"]).css("cx"));
        });
        $(this.refs["flag"]).on('mousemove', (event: JQuery.MouseMoveEvent<React.ReactInstance, undefined, React.ReactInstance, React.ReactInstance>) => {
            this.debounceHandler = this.debounceHandler > 0 ? this.debounceHandler - 1 : 0;
            if (this.debounceHandler > 0 || !this.dragging) {
                return;
            }
            let cx: number = event.clientX - this.cxBeforeDragging;
            cx = cx + this.xBeforeDragging;
            cx = cx < 10 ? 10 : cx > this.props.width - 10 ? this.props.width - 10 : cx;
            $(this.refs["flag"]).attr("cx", cx);
            let value: number = (cx - 10) * (this.props.max - this.props.min) / (this.props.width - 20) + this.props.min;
            if (!this.isDiscrete && this.step && value !== this.props.min && value !== this.props.max) {
                let leftStep: number = this.props.min;
                let rightStep: number = this.props.min;
                while (leftStep < value && rightStep < value) {
                    leftStep += this.step;
                    rightStep += this.step;
                }
                if (leftStep > value) {
                    leftStep -= this.step;
                }
                value = (leftStep + rightStep) / 2 >= value ? leftStep : rightStep;
            }
            else if (this.isDiscrete && this.props.domainArray && !this.props.domainArray.includes(value)) {
                let leftStep: number = 0;
                let rightStep: number = 0;
                while (this.props.domainArray[leftStep] < value && this.props.domainArray[rightStep] < value) {
                    leftStep++;
                    rightStep++;
                }
                if (this.props.domainArray[leftStep] > value) {
                    leftStep--;
                }
                leftStep = this.props.domainArray[leftStep];
                rightStep = this.props.domainArray[rightStep];
                value = (leftStep + rightStep) / 2 >= value ? leftStep : rightStep;
            }
            this.valueAfterDragging = value;
            let text: string = this.valueFormatter(value).toString();
            if (text !== $(this.refs["value"]).text()) {
                $(this.refs["value"]).css("background", "rgb(230, 176, 100)").text(text);
                if (this.timeoutHandler) {
                    clearTimeout(this.timeoutHandler);
                }
                this.timeoutHandler = setTimeout(() => {
                                            $(this.refs["value"]).css("background", "none");
                                            this.timeoutHandler = null;
                                        }, 800);
            }
            this.debounceHandler = 2;
        });
        $('*').on('mouseup', () => {
            $(this.refs["flag"]).css("fill", "url(#grad)").css("stroke", "rgb(135, 137, 142)");
            $(this.refs["value"]).css("color", "black");
            this.dragging = false;
            this.callbackHandler.update({ value: this.valueAfterDragging });
            this.debounceHandler = 0;
        });
    }

    public componentDidUpdate(): void {
        if (this.props.onValueChange) {
            this.props.onValueChange(this.state.value);
        }
    }

    public val(value?: number): number | void {
        if (value) {
            this.callbackHandler.update({ value: value });
            return;
        }
        return this.state.value;
    }

    public valueDidUpdate(callback: () => void): void {
        this.componentDidUpdate = callback;
    }
}


export default ValueBar;
