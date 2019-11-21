/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-21 21:42:35
 */

import React, { Component } from 'react';
import $ from 'jquery';
import Color from './preference/Color';
import { Globe } from './App';


export interface TreeBarProps {
    id: Readonly<string>;
    width: number;
    height: number;
    style?: React.CSSProperties;
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
                <svg width={`${ this.props.width }px`} height={`${ this.props.height }px`}
                id={ this.props.id + '_svg' } xmlns={`http://www.w3.org/2000/svg`}
                style={{
                    // background: Color.Nippon.Aonibi
                }} >
                    <g key="canvas_layer" ref="layer" xmlns={`http://www.w3.org/2000/svg`} />
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
                                    const value: number = ((res[0] / 2 + 0.5) / res[1]);// / 2 + 0.5;
                                    if (level === this.layers.length - 1) {
                                        const y: number = value > -5e-4 && value < 5e-4
                                            ? (level + 0.72) * height + 3
                                            : (level + 0.72 - Math.abs(value) * 0.8 * 0.84) * height + 3;
                                        const top: number = value > -5e-4 && value < 5e-4
                                            ? 0.2 * height - 3
                                            : (Math.abs(value) * 0.8 + 0.2) * height - 3;
                                        return [(
                                            <rect id={ `Bar_id${ node.id }` }
                                            key={ node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                            y={ (level + 0.08) * height + 1 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                            height={ height * 0.84 - 2 }
                                            style={{
                                                fill: 'white',
                                                // fill: Color.setLightness(value < -5e-4
                                                //     ?   Color.Nippon.Syozyohi
                                                //     :   value < 5e-4
                                                //                 ?   Color.Nippon.Ukonn
                                                //                 :   Color.Nippon.Ruri, 0.1),
                                                fillOpacity: 0.8,
                                                stroke: Color.Nippon.Aisumitya
                                            }}
                                            onClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                    Globe.highlight((node.data as any) as Array<number>);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                }
                                            } />
                                        ), (
                                            <rect id={ `smpBar_id${ node.id }` }
                                            key={ "S_" + node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1.5 }
                                            // y={ (level + 1) * this.props.height / this.layers.length }
                                            // y={ (level + 1 - value) * height + 1.5 }
                                            y={ (level + 0.08) * height + 1.5 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 3 }
                                            // height={ Math.abs(value) * height - 3 }
                                            height={ height * 0.84 - 3 }
                                            style={{
                                                fill: Color.setLightness(value < -5e-4
                                                    ?   Color.Nippon.Syozyohi
                                                    :   value < 5e-4
                                                                ?   Color.Nippon.Ukonn
                                                                :   Color.Nippon.Ruri, 0.84),
                                                stroke: Color.Nippon.Aisumitya
                                            }}
                                            onClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                    let set: Array<number> = [];
                                                    (node.data as any as Array<number>).forEach((id: number) => {
                                                        if (Globe.checkIfPointIsSampled(id)) {
                                                            set.push(id);
                                                        }
                                                    });
                                                    Globe.highlight(set);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                }
                                            } />
                                        ), (
                                            <rect id={ `coreBar_id${ node.id }` }
                                            key={ "C_" + node.id }
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1.5 }
                                            // y={ (level + 1) * this.props.height / this.layers.length }
                                            // y={ (level + 1 - value) * height + 1.5 }
                                            y={ y }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 3 }
                                            // height={ Math.abs(value) * height - 3 }
                                            height={ top * 0.84 }
                                            style={{
                                                fill: value < -5e-4//0.5 - 5e-4
                                                        ?   Color.Nippon.Syozyohi
                                                        :   value < 5e-4//0.5 + 5e-4
                                                                    ?   Color.Nippon.Ukonn
                                                                    :   Color.Nippon.Ruri,
                                                stroke: Color.Nippon.Aisumitya,
                                                strokeWidth: 1
                                            }}
                                            onClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                    Globe.highlight(node.data as any as Array<number>);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                }
                                            } />
                                        )];
                                    }
                                    else {
                                        return (
                                            <rect id={ `Bar_id${ node.id }` }
                                            key={ node.id }
                                            className="node"
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                            y={ (level + 0.08) * height + 1 }
                                            rx={ 2 }
                                            ry={ 2 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                            height={ height * 0.84 - 2 }
                                            style={{
                                                fill: Color.setLightness(value < -5e-4
                                                    ?   Color.Nippon.Syozyohi
                                                    :   value < 5e-4
                                                                ?   Color.Nippon.Ukonn
                                                                :   Color.Nippon.Ruri, 0.8 + 0.16 * Math.abs(value)),
                                                stroke: Color.Nippon.Aisumitya
                                            }}
                                            onClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                    Globe.highlight(node.data as any as Array<number>);
                                                }
                                            }
                                            onDoubleClick={
                                                () => {
                                                    Globe.highlightClass(-1);
                                                }
                                            } />
                                        );
                                    }
                                });
                            })
                        }
                        {
                            this.layers.map((layer: Array<TreeBarNode<T>>, level: number) => {
                                let offsetX: number = 0;
                                const height: number = this.props.height / this.layers.length;
                                return layer.map((node: TreeBarNode<T>, index: number) => {
                                    if (index !== 0) {
                                        offsetX += layer[index - 1].width!;
                                    }
                                    if (level === this.layers.length - 2) {
                                        return (
                                            <rect id={ `Rect_id${ node.id }` }
                                            key={ "rect" + node.id }
                                            className="lastlevel"
                                            xmlns={`http://www.w3.org/2000/svg`}
                                            x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                            y={ (level + 1.08) * height + 1 }
                                            width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                            height={ height * 0.84 - 2 }
                                            style={{
                                                fill: "none",
                                                stroke: "none",
                                                strokeWidth: 2,
                                                pointerEvents: "none"
                                            }} />
                                        );
                                    }
                                    else {
                                        return null;
                                    }
                                });
                            })
                        }
                        {
                            // this.layers.length > 0 &&
                            //     <path xmlns="http://www.w3.org/2000/svg" key="origin"
                            //     d={
                            //         `M${ 0 },${ this.props.height }` + [0].map(() => {
                            //             let set: Array<number> = [];
                            //             let max: number = 0;
                            //             this.layers[this.layers.length - 1].forEach((node: TreeBarNode<T>) => {
                            //                 const count = this.tot(node)[1];
                            //                 set.push(count);
                            //                 max = count > max ? count : max;
                            //             });
                            //             this.maxOfPointsContained = max;
                            //             return this.layers[this.layers.length - 1].map((node: TreeBarNode<T>, index: number) => {
                            //                 const value: number = set[index] / max * 0.8;
                            //                 return `L${ (index + 0.5) * this.props.width
                            //                         / this.layers[this.layers.length - 1].length },${ 
                            //                             (1/*this.layers.length*/ - value) * this.props.height// / this.layers.length
                            //                         }`
                            //             }).join(' ')
                            //         })[0] + ` L${ this.props.width },${ this.props.height }`
                            //     }
                            //     style={{
                            //         fill: Color.Nippon.Ukonn + '80',
                            //         stroke: Color.Nippon.Ukonn,
                            //         strokeWidth: 3,
                            //         pointerEvents: 'none'
                            //     }} />
                        }
                    </g>
                </svg>
            </div>
        );
    }

    public componentDidMount(): void {
        Globe.moveBars = this.moveTo.bind(this);
    }

    public componentDidUpdate(): void {
        $(this.refs['layer']).html("");
        $('.node').each((index: number, e: HTMLElement) => {
            const element: JQuery<HTMLElement> = $(e);
            const width: number = parseFloat(element.css('width'));
            const height: number = parseFloat(element.css('height'));
            element.attr('__width', width).attr('__height', height);
            const x: number = parseFloat(element.css('x'));
            const y: number = parseFloat(element.css('y'));
            element.animate({
                width: height / 5,
                height: height / 5,
                rx: height / 16,
                ry: height / 16,
                x: x + width / 2 - height / 10,
                y: y + height / 2 - height / 10
            }, 20);
        });
        setTimeout(() => {
            this.relink(this.state);
        }, 40);
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
                value += parseFloat(Globe.getPoint(idx).sentiment);
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

    private countRate(node: TreeBarNode<T>): number {
        let sampled: number = 0;
        (node.data as any as Array<number>).forEach((idx: number) => {
            if (Globe.checkIfPointIsSampled(idx)) {
                sampled++;
            }
        });

        return sampled / (node.data as any as Array<number>).length;
    }

    private relink(node: TreeBarNode<T>): void {
        node.children.forEach((child: TreeBarNode<T>) => {
            const path: JQuery<HTMLElement> = $($.parseXML(
                `<path xmlns="http://www.w3.org/2000/svg" key="sampled" `
                + `d="M${
                        parseInt($(`#Bar_id${ node.id }`).css("x")) + parseInt($(`#Bar_id${ node.id }`).css("width")) / 2
                    },${
                        parseInt($(`#Bar_id${ node.id }`).css("y")) + parseInt($(`#Bar_id${ node.id }`).css("height")) * 0.9
                    } Q${
                        (parseInt($(`#Bar_id${ node.id }`).css("x")) + parseInt($(`#Bar_id${ node.id }`).css("width")) / 2) / 2
                        + (parseInt($(`#Bar_id${ child.id }`).css("x")) + parseInt($(`#Bar_id${ child.id }`).css("width")) / 2) / 2
                    },${
                        parseInt($(`#Bar_id${ node.id }`).css("y")) + parseInt($(`#Bar_id${ node.id }`).css("height"))
                    } ${
                        parseInt($(`#Bar_id${ child.id }`).css("x")) + parseInt($(`#Bar_id${ child.id }`).css("width")) / 2
                    },${
                        parseInt($(`#Bar_id${ child.id }`).css("y")) + parseInt($(`#Bar_id${ child.id }`).css("height")) * 0.1
                    }" `
                + `style="fill: none; stroke: ${ Color.Nippon.Rokusyou }; stroke-width: 2; pointer-events: none;" />`
            ).documentElement);
            $(this.refs['layer']).append(path);
            setTimeout(() => this.relink(child), 40);
        });
    }

    // private random(): number {
    //     return Math.random() >= 0.73
    //             ?   0.5
    //             :   Math.round(Math.random()) / 2 + 0.25 + (Math.round(Math.random()) - 0.5) / 2 * Math.sqrt(Math.random());
    // }

    private moveTo(nodes: Array<number>): void {
        nodes.forEach((id: number) => {
            if (parseInt($(`#Bar_id${ id }`).css("y")) + parseInt($(`#Bar_id${ id }`).css("height")) >= this.props.height - 10) {
                $(`#coreBar_id${ id }`).fadeOut(800);
                return;
            }
            $(`#Bar_id${ id }`)
                .removeClass("node")
                .addClass('nodebox')
                .css("fill", "white")
                .css("stroke", Color.setLightness(Color.Nippon.Kinntya, 0.75))
                .css("stroke-width", 1.6);//.css('fill-opacity', 0.35);
            this.moveBars("search", this.state, id, 0);
        });

        $('.nodebox').each((index: number, e: HTMLElement) => {
            const element: JQuery<HTMLElement> = $(e);
            const width: number = parseFloat(element.attr("__width")!);
            const height: number = parseFloat(element.attr('__height')!);
            const x: number = parseFloat(element.css('x'));
            const y: number = parseFloat(element.css('y'));
            element.animate({
                width: width,
                height: height,
                rx: height / 16,
                ry: height / 16,
                x: x - width / 2 + height / 10,
                y: y - height / 2 + height / 10
            }, 640);
        });
        $(this.refs['layer']).html("");
        // $('.nodebox').css("rx", 2).css("ry", 2);
        setTimeout(() => {
            this.relink(this.state);
            $('.lastlevel').css('stroke', Color.Nippon.Rokusyou);
        }, 800);
        // const path: JQuery<HTMLElement> = $($.parseXML(
        //     `<path xmlns="http://www.w3.org/2000/svg" key="sampled" `
        //     + `d="${
        //         `M${ 0 },${ this.props.height }` + [0].map(() => {
        //             let set: Array<number> = [];
        //             // let max: number = 0;
        //             this.layers[this.layers.length - 1].forEach((node: TreeBarNode<T>) => {
        //                 let count: number = 0;
        //                 (node.data as any as Array<number>).forEach((id: number) => {
        //                     if (Globe.checkIfPointIsSampled(id)) {
        //                         count++;
        //                     }
        //                 });
        //                 set.push(count);
        //                 // max = count > max ? count : max;
        //             });
        //             return this.layers[this.layers.length - 1].map((node: TreeBarNode<T>, index: number) => {
        //                 const value: number = set[index] / this.maxOfPointsContained * 0.8;
        //                 return `L${ (index + 0.5) * this.props.width
        //                         / this.layers[this.layers.length - 1].length },${ 
        //                             (1/*this.layers.length*/ - value) * this.props.height// / this.layers.length
        //                         }`
        //             }).join(' ');
        //         })[0] + ` L${ this.props.width },${ this.props.height }`
        //     }" `
        //     + `style="fill: ${ Color.Nippon.Rokusyou }60; stroke: ${ Color.Nippon.Rokusyou }C0; stroke-width: 3; pointer-events: none;" />`
        // ).documentElement);
        // $(this.refs['svg']).append(path);
        
        // const path2: JQuery<HTMLElement> = $($.parseXML(
        //     `<path xmlns="http://www.w3.org/2000/svg" key="sampled2" `
        //     + `d="${
        //         ` M${ 0 },${ this.props.height }` + [0].map(() => {
        //             let set: Array<number> = [];
        //             let max: number = 0;
        //             this.layers[this.layers.length - 1].forEach((node: TreeBarNode<T>) => {
        //                 let count: number = 0;
        //                 (node.data as any as Array<number>).forEach((id: number) => {
        //                     if (Globe.checkIfPointIsSampled(id)) {
        //                         count++;
        //                     }
        //                 });
        //                 set.push(count);
        //                 max = count > max ? count : max;
        //             });
        //             return this.layers[this.layers.length - 1].map((node: TreeBarNode<T>, index: number) => {
        //                 const value: number = set[index] / max * 0.8;
        //                 return `L${ (index + 0.5) * this.props.width
        //                         / this.layers[this.layers.length - 1].length },${ 
        //                             (1/*this.layers.length*/ - value) * this.props.height// / this.layers.length
        //                         }`
        //             }).join(' ');
        //         })[0] + ` L${ this.props.width },${ this.props.height }`
        //     }" `
        //     + `style="fill: ${ Color.Nippon.Rokusyou }20; stroke: ${ Color.Nippon.Rokusyou }C0; stroke-dasharray: 5; stroke-width: 3; pointer-events: none;" />`
        // ).documentElement);
        // $(this.refs['svg']).append(path2);
    }

    private moveBars(act: "search" | "move", parent: TreeBarNode<T>, id: number, level: number): TreeBarNode<T> | null {
        if (act === "move") {
            if (parent.children.length === 0) {
                const height: number = this.props.height / this.layers.length;
                const value: number = 0.08 + 0.92 * this.countRate(parent);
                const y: number = parseFloat($(`#smpBar_id${ parent.id }`).css("y"));
                // $(`#smpBar_id${ parent.id }`)
                //     .css("height", height * value + 3)
                //     .css("y", parseFloat($(`#smpBar_id${ parent.id }`).css("y")) + (height * (1 - value)) + "px");
                // $(`#coreBar_id${ parent.id }`).css("transform", `translateY(-${
                //     level * this.props.height / this.layers.length
                // }px)`);
                for (let t: number = 0; t < 1000; t+=50) {
                    setTimeout(() => {
                        $(`#coreBar_id${ parent.id }`).css("transform", `translateY(-${
                            level * this.props.height / this.layers.length * t / 950
                        }px)`);
                        $(`#smpBar_id${ parent.id }`)
                            .css("height", height * (1 - t / 950 + value * t / 950) * 0.84 - 3)
                            .css("y", y + height * (1 - value) * t / 950 * 0.84 + "px");
                    }, 800 + t * 0.8);
                }
                // $(`#coreBar_id${ parent.id }`).animate({
                //     transform: `translateY(-${
                //         level * this.props.height / this.layers.length
                //     }px)`
                // }, 1000);
            }
            else {
                parent.children.forEach((child: TreeBarNode<T>) => {
                    this.moveBars("move", child, id, level + 1);
                });
            }
            return null;
        }
        if (parent.id === id) {
            parent.children.forEach((child: TreeBarNode<T>) => {
                this.moveBars("move", child, id, 1);
            });
            return parent;
        }
        let res: TreeBarNode<T> | null = null;
        for (let i: number = 0; i < parent.children.length; i++) {
            res = this.moveBars("search", parent.children[i], id, 0);
            if (res) {
                return res;
            }
        }
        return res;
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
