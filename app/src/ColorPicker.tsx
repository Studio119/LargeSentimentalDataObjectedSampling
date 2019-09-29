/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-27 19:41:41 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-28 21:18:44
 */
import React, { Component } from 'react';
import $ from 'jquery';

export interface ColorPickerState {
    r: number;
    g: number;
    b: number;
    opacity: number;
}

class ColorPicker extends Component<ColorPickerState & { x: number; y: number }, ColorPickerState, {}> {
    public static initialized: boolean;
    private static ref: ColorPicker | null;
    private static dragging: boolean;
    private xBeforeDragging: number;
    private cxBeforeDragging: number;
    private valueAfterDragging: number;
    private static mouseOverIcon: boolean;
    private static mouseOverContainer: boolean;
    private observing: Array<{ element: JQuery<HTMLElement>, Attr: Array<string> }>;

    public constructor(props: ColorPickerState & { x: number; y: number }) {
        super(props);
        ColorPicker.ref = null;
        ColorPicker.dragging = false;
        this.xBeforeDragging = 0;
        this.cxBeforeDragging = 0;
        this.valueAfterDragging = 1;
        ColorPicker.mouseOverIcon = false;
        ColorPicker.mouseOverContainer = false;
        this.observing = [];
        this.state = {
            r: this.props.r,
            g: this.props.g,
            b: this.props.b,
            opacity: this.props.opacity
        };
    }

    public render(): JSX.Element {
        return (<div style={{ position: 'absolute', display: 'inline-block', alignItems: 'center', padding: "10px",
            left: this.props.x, top: this.props.y }} >
            <svg className="ColorPickerSVG" key="svg" xmlns="http://www.w3.org/2000/svg" ref="iconsvg"
            width={ 30 } height={ 30 } style={{ display: 'inline-block' }} >
                <circle ref="icon"
                    cx={ 15 } cy={ 15 } r={ 8 }
                    style={{ fill: `rgba(${ this.state.r }, ${ this.state.g }, ${ this.state.b },`
                    + ` ${ this.state.opacity })`, stroke: 'black' }} />
            </svg>
            
        </div>);
    }

    public componentDidMount(): void {
        if (!ColorPicker.initialized) {
            $('body').append(`<div className="ColorPickerContainer" id="containerascolorpickerstatic"
                style="position: absolute; border: 1px solid black; top: 0; left: 0; z-index: 3000;" >
                    <img alt="colortab" src="/images/rgb_tab.png" id="ColorPickerrgb_tab"
                        width="280px" height="60px"
                        style="position: relative; border: 1px solid black; opacity: 1.0;" />
                    <div className="ColorPicker"
                        style="position: relative; border: 1px solid black; width: 280px; height: 50px;
                        background: linear-gradient(to top, rgb(96, 99, 106), #282c34);" >
                        <div className="OpacityValueBar" style="display: inline-block; align-items: center;
                        transform: translateY(20%);" >
                            <p style="display: inline-block; vertical-align: top; margin: 0px 6px 0px 10px;
                            transform: translateY(-8%); font-size: 16px; color: white;" >`
                                + `opacity: `
                            + `</p>
                            <p id="ColorPickerValue" style="display: inline-block; width: 18px;
                                    vertical-align: top; margin: 0px 14px 0px 0px; transform: translateY(-8%);
                                    font-size: 16px; color: white;" >1</p>
                            <svg className="ValueBarSVG" xmlns="http://www.w3.org/2000/svg"
                                    width="160px" height="60px" style="display: inline-block;" >
                                <defs>
                                    <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" style="stop-color: rgb(127, 129, 134); stop-opacity: 1;" />
                                        <stop offset="100%" style="stop-color: #282c34; stop-opacity: 1;" />
                                    </radialGradient>
                                    <radialGradient id="active" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" style="stop-color: rgb(141, 143, 147); stop-opacity: 1;" />
                                        <stop offset="20%" style="stop-color: rgb(141, 143, 147); stop-opacity: 1;" />
                                        <stop offset="85%" style="stop-color: rgb(93, 95, 102); stop-opacity: 1;" />
                                        <stop offset="100%" style="stop-color: rgb(93, 95, 102); stop-opacity: 1;" />
                                    </radialGradient>
                                    <linearGradient id="linear-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="15%" style="stop-color: rgb(141, 143, 147); stop-opacity: 1;" />
                                        <stop offset="100%" style="stop-color: rgb(54, 57, 65); stop-opacity: 1;" />
                                    </linearGradient>
                                </defs>
                                <rect
                                    x="10" y="6" rx=4 ry=4 width="160" height=8
                                    style="fill: url(#linear-grad); stroke: black;" />
                                <circle id="ColorPickerMovingFlag" cx=150 cy=10 r=8
                                    style="fill: url(#grad); stroke: rgb(135, 137, 142); stroke-width: 2px;" />
                            </svg>
                        </div>
                    </div>
                    <div id="ColorPickerFocusBox" style="position: absolute; z-index: 3000; width: 4px; height: 4px;
                    border: 3px solid black; border-radius: 4px;" />
                </div>`);
            ColorPicker.initialized = true;
            $('#containerascolorpickerstatic').hide();
            $('#containerascolorpickerstatic').on('mouseover', () => {
                ColorPicker.mouseOverContainer = true;
            }).on('mouseleave', () => {
                setTimeout(() => {
                    ColorPicker.mouseOverContainer = false;
                    if (!ColorPicker.mouseOverIcon) {
                        $('#containerascolorpickerstatic').hide();
                        ColorPicker.ref = null;
                    }
                }, 200);
            });
            $('#ColorPickerMovingFlag').on('mousedown', (event: JQuery.MouseDownEvent<React.ReactInstance, undefined, React.ReactInstance, React.ReactInstance>) => {
                $('#ColorPickerMovingFlag').css("fill", "url(#active)").css("stroke", "rgb(240, 249, 254)");
                ColorPicker.dragging = true;
                if (ColorPicker.ref) {
                    ColorPicker.ref.cxBeforeDragging = event.clientX;
                    ColorPicker.ref.xBeforeDragging = parseFloat($('#ColorPickerMovingFlag').css("cx"));
                }
            });
            $('#ColorPickerMovingFlag').on('mousemove', (event: JQuery.MouseMoveEvent<React.ReactInstance, undefined, React.ReactInstance, React.ReactInstance>) => {
                if (!ColorPicker.dragging) {
                    return;
                }
                if (ColorPicker.ref) {
                    let cx: number = event.clientX - ColorPicker.ref.cxBeforeDragging;
                    cx = cx + ColorPicker.ref.xBeforeDragging;
                    cx = cx < 10 ? 10 : cx > 150 ? 150 : cx;
                    $('#ColorPickerMovingFlag').attr("cx", cx);
                    let value: number = (cx - 10) / 140;
                    ColorPicker.ref.valueAfterDragging = value;
                    let text: string = ColorPicker.ref.valueFormatter(value);
                    $("#ColorPickerValue").text(text);
                    $("#ColorPickerrgb_tab").css("opacity", value);
                    $(ColorPicker.ref.refs["icon"]).css("fill", `rgba(${ColorPicker.ref.state.r},`
                        + `${ColorPicker.ref.state.g}, ${ColorPicker.ref.state.b}, ${value})`);
                }
            });
            $('#containerascolorpickerstatic').on('mouseup', () => {
                $('#ColorPickerMovingFlag').css("fill", "url(#grad)").css("stroke", "rgb(135, 137, 142)");
                ColorPicker.dragging = false;
                if (ColorPicker.ref) {
                    ColorPicker.ref.setState({
                        opacity: ColorPicker.ref.valueAfterDragging
                    });
                }
            });
            $('#ColorPickerrgb_tab').on("click", (event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>) => {
                let x: number = event.offsetX / 280;
                let y: number = event.offsetY / 60;
                if (ColorPicker.ref) {
                    let r: number = ColorPicker.ref.state.r;
                    let g: number = ColorPicker.ref.state.g;
                    let b: number = ColorPicker.ref.state.b;
                    let i: number = parseInt((255 * x * 6).toString()) % 255;
                    let level: number = parseInt((x * 6).toString());
                    switch (level) {
                        case 0:
                            r = 255;
                            g = i;
                            b = 0;
                            break;
                        case 1:
                            r = 255 - i;
                            g = 255;
                            b = 0;
                            break;
                        case 2:
                            r = 0;
                            g = 255;
                            b = i;
                            break;
                        case 3:
                            r = 0;
                            g = 255 - i;
                            b = 255;
                            break;
                        case 4:
                            r = i;
                            g = 0;
                            b = 255;
                            break;
                        case 5:
                            r = 255;
                            g = 0;
                            b = 255 - i;
                            break;
                    }
                    if (y >= 0.5) {
                        r *= (2 - y * 2);
                        g *= (2 - y * 2);
                        b *= (2 - y * 2);
                    }
                    else {
                        r += (255 - r) * (1 - 2 * y);
                        g += (255 - g) * (1 - 2 * y);
                        b += (255 - b) * (1 - 2 * y);
                    }
                    ColorPicker.ref.setState({
                        r: r, g: g, b: b
                    });
                }
                $('#ColorPickerFocusBox').css("left", event.offsetX - 3).css("top", event.offsetY - 3);
                if (event.offsetY > 30) {
                    $('#ColorPickerFocusBox').css("border", "3px solid white");
                }
                else {
                    $('#ColorPickerFocusBox').css("border", "3px solid black");
                }
            });
        }
        $(this.refs["icon"]).on('mouseover', (event: JQuery.MouseOverEvent<React.ReactInstance, undefined, React.ReactInstance, React.ReactInstance>) => {
            ColorPicker.mouseOverIcon = true;
            ColorPicker.ref = this;
            $('#ColorPickerMovingFlag').attr("cx", 10 + this.state.opacity * 140);
            $("#ColorPickerValue").text(this.valueFormatter(this.state.opacity));
            $("#ColorPickerrgb_tab").css("opacity", this.state.opacity);
            $('#containerascolorpickerstatic')
                .show()
                .css("left", event.clientX - event.offsetX - 260)
                .css("top", event.clientY - event.offsetY + 16);
            ColorPicker.loadFocusBox(this.state);
        });
        $(this.refs["iconsvg"]).on('mouseleave', () => {
            setTimeout(() => {
                ColorPicker.mouseOverIcon = false;
                if (!ColorPicker.mouseOverContainer) {
                    $('#containerascolorpickerstatic').hide();
                    ColorPicker.ref = null;
                }
            }, 200);
        });
    }

    protected static loadFocusBox(rgba: ColorPickerState): void {
        let x: number = 10;
        let y: number = 10;
        if (rgba.r === 0) {
            if (rgba.g >= rgba.b) {
                x = 280 / 3 + (280 / 6) * (rgba.b / rgba.g) - 3;
                y = 30 + (255 - rgba.g) * 30 / 255 - 3;
            }
            else {
                x = 140 + (280 / 6) * (1 - rgba.g / rgba.b) - 3;
                y = 30 + (255 - rgba.b) * 30 / 255 - 3;
            }
        }
        else if (rgba.g === 0) {
            x = 560 / 3;
            if (rgba.b > rgba.r) {
                x += (280 / 6) * (rgba.r / rgba.b) - 3;
                y = 30 + (255 - rgba.b) * 30 / 255 - 3;
            }
            else {
                x += (280 / 6) * (2 - rgba.b / rgba.r) - 3;
                y = 30 + (255 - rgba.r) * 30 / 255 - 3;
            }
        }
        else if (rgba.b === 0) {
            if (rgba.r <= rgba.g) {
                x = 280 / 6 + 280 * (1 - rgba.r / rgba.g) / 6 - 3;
                y = 30 + (255 - rgba.g) * 30 / 255 - 3;
            }
            else {
                x = 280 / 6 * rgba.g / rgba.r - 3;
                y = 30 + (255 - rgba.r) * 30 / 255 - 3;
            }
        }
        else {
            if (rgba.b <= rgba.r && rgba.b <= rgba.g) {
                y = 30 * (255 - rgba.b) / 255 - 3;
                if (rgba.g === 255) {
                    x = 280 / 6 + ((255 - rgba.r) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
                else {
                    x = 280 / 6 - ((255 - rgba.g) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
            }
            else if (rgba.r <= rgba.g && rgba.r <= rgba.b) {
                y = 30 * (255 - rgba.r) / 255 - 3;
                if (rgba.b === 255) {
                    x = 140 + ((255 - rgba.g) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
                else {
                    x = 140 - ((255 - rgba.b) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
            }
            else {
                y = 30 * (255 - rgba.g) / 255 - 3;
                if (rgba.b === 255) {
                    x = 280 * 5 / 6 - ((255 - rgba.r) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
                else {
                    x = 280 * 5 / 6 + ((255 - rgba.b) * 30 / (y + 3)) * 280 / 255 / 6 - 3;
                }
            }
        }
        x = x >= 267 ? x - 271 : x;
        $('#ColorPickerFocusBox').css("left", x).css("top", y).css("border", y > 30 ? "3px solid white" : "3px solid black");
    }

    public getColor(): string {
        return `rgba(${this.state.r}, ${this.state.g}, ${this.state.b}, ${this.state.opacity})`;
    }

    public bind(element: JQuery<HTMLElement>, ...attrName: Array<string>): void {
        attrName.forEach((attr: string) => {
            element.css(attr, this.getColor());
        });
        this.observing.push({ element: element, Attr: attrName });
    }

    public unbind(element: JQuery<HTMLElement>): void {
        let update: Array<{ element: JQuery<HTMLElement>, Attr: Array<string> }> = [];
        this.observing.forEach((e: { element: JQuery<HTMLElement>, Attr: Array<string> }) => {
            if (e.element !== element) {
                update.push(e);
            }
        });
        this.observing = update;
    }

    public componentDidUpdate(): void {
        this.observing.forEach((e: { element: JQuery<HTMLElement>, Attr: Array<string> }) => {
            e.Attr.forEach((attr: string) => {
                e.element.css(attr, this.getColor());
            });
        });
    }

    private valueFormatter: (num: number) => string
        = (num: number) => {
            if (num === 0 || num === 1) {
                return num.toString();
            }
            let str: string = num.toString();
            if (str.length - 1 - str.indexOf('.') > 2) {
                str = str.substr(0, str.indexOf('.') + 3);
            }
            return str;
        };
}

ColorPicker.initialized = false;


export default ColorPicker;
