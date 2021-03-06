/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:27 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-12-03 22:02:42
 */
import React, { Component } from 'react';
import $ from 'jquery';
import ValueBar from './ValueBar';
import ColorPicker from './ColorPicker';
import Dropdown from './Dropdown';
import { FileSet } from './DataLib';
import Color from './preference/Color';
import { Globe } from './App';


export interface ItemStripProps {
    id: string,
    importSource: (paths: FileSet) => void;
}

export interface ItemStripState {
    sampled: boolean;
}

class ItemStrip extends Component<ItemStripProps, ItemStripState, any> {
    private source: 'Tweet' | 'yelp';

    public constructor(props: ItemStripProps) {
        super(props);
        this.state = {
            sampled: false
        };
        this.source = 'Tweet';
    }

    public render(): JSX.Element {
        return (
            <>
                <div id={ this.props.id } key="container"
                style={{
                    height: '40px',
                    padding: '5px 18px 8px 18px',
                    background: Color.linearGradient([
                        Color.Nippon.Touou, 0,
                        Color.Nippon.Touou, 0.87,
                        Color.setLightness(Color.Nippon.Touou, 0.86), 0.88,
                        Color.setLightness(Color.Nippon.Touou, 0.97), 0.90,
                        Color.setLightness(Color.Nippon.Touou, 0.97), 0.966,
                        Color.setLightness(Color.Nippon.Touou, 0.86), 0.986,
                        Color.Nippon.Touou, 0.996,
                        Color.Nippon.Touou, 1
                    ], 'right'),
                    border: `1px solid ${ Color.Nippon.Tokiwa }`,
                    textAlign: 'left'
                }} >
                    <div style={{
                        display: 'inline-block',
                        height: '41.8px',
                        border: `1px solid ${ Color.Nippon.Mizu }`,
                        background: Color.setLightness(Color.Nippon.Mizu, 0.94),
                        marginRight: '10.2px'
                    }} >
                        <label style={{
                            position: 'relative',
                            top: 6.5,
                            fontSize: '17px',
                            paddingLeft: '10px'
                        }} >
                            dataset
                        </label>
                        <Dropdown<string> width={ 80 } height={ 30 } optionList={ ['Tweet', 'yelp'] }
                        defaultIndex={ 0 }
                        onChange={
                            (option: string) => {
                                this.load(option);
                                Globe.loadData = this.load.bind(this, option);
                            }
                        } />
                    </div>

                    <div style={{
                        display: 'inline-block',
                        height: '41.8px',
                        padding: '0 12px',
                        border: `1px solid ${ Color.Nippon.Mizu }`,
                        background: Color.setLightness(Color.Nippon.Mizu, 0.94),
                        width: '938px'
                    }} >
                        <div style={{
                            fontSize: '14px',
                            padding: '6px 8px',
                            display: 'inline-block',
                            transform: 'translateY(5.4px)',
                            marginRight: '18px',
                            background: Color.Nippon.Gohunn + 'A0',
                            color: Color.Nippon.Midori // Color.Nippon.Tokiwa
                        }} >
                            + New Sample
                        </div>

                        <ValueBar label={ "Sampling Rate" } ref="SamplingRate"
                        width={ 90 } height={ 18 } min={ 0 } max={ 0.30 } step={ 0.01 } defaultValue={ 0.20 }
                        valueFormatter={
                            (num: number) => {
                                return num.toFixed(4);
                            }
                        } />
                        
                        <div style={{ display: 'inline-block', width: '6px' }}/>

                        <ValueBar label={ "r =" } width={ 80 } height={ 18 } ref="radius"
                            min={ 0.001 } max={ 0.2 } defaultValue={ 0.001 }
                            valueFormatter={
                                (num: number) => {
                                    return num.toFixed(4);
                                }
                            }
                        />
                        <ValueBar label={ "\u03BB =" } width={ 80 } height={ 18 } ref="beta"
                            min={ 0 } max={ 1 } step={ 0.01 } defaultValue={ 0.3 }
                        />
                        <ValueBar label={ "\u03B3 =" } width={ 80 } height={ 18 } ref="gamma"
                            min={ 0 } max={ 1 } step={ 0.01 } defaultValue={ 0.2 }
                        />

                        <button id="goRun"
                        style={{
                            fontSize: '15px',
                            width: '73.2px',
                            transform: 'translateY(5.8px)',
                            marginLeft: '32px',
                            background: this.state.sampled
                                ? Color.Nippon.Akabeni
                                : Color.Nippon.Aisumitya,
                            color: Color.setLightness(Color.Nippon.Aisumitya, 0.9),
                            padding: '2px 9px',
                            height: '25.6px'
                        }}
                        onClick={
                            this.state.sampled
                                ? () => {
                                    if ($("#run").attr("src") === "./images/loading.png"
                                    || $("#runr").attr("src") === "./images/loading.png") {
                                        return;
                                    }
                                    $("#run").attr("src", "./images/loading.png").addClass("rotating");
                                    setTimeout(() => {
                                        (this.refs["SamplingRate"] as ValueBar).val(
                                            (this.refs["SamplingRate"] as ValueBar).val()
                                        );
                                        Globe.loadData();
                                    }, 200);
                                }
                                :  () => {
                                    if ($("#run").attr("src") === "./images/loading.png"
                                    || $("#runr").attr("src") === "./images/loading.png") {
                                        return;
                                    }
                                    $("#run").attr("src", "./images/loading.png").addClass("rotating");
                                    setTimeout(() => {
                                        Globe.run();
                                    }, 200);
                                }
                        } >
                            {
                                this.state.sampled
                                    ? null
                                    : <img src={ `./images/run.png` } id="run"
                                    alt={ ">>" }
                                    width="14px" height="14px"
                                    style={{
                                        margin: this.state.sampled ? '0px 2px 0px -2px' : '0px 7px 0px -2px'
                                    }} />
                            }
                            {
                                this.state.sampled
                                    ? "Cancel" : "Run"
                            }
                        </button>
                    </div>


                    <ColorPicker ref={ "cp0" } x={ 1360 } y={ 6 } r={0} g={92} b={175} opacity={1} />
                    <ColorPicker ref={ "cp1" } x={ 1410 } y={ 6 } r={232} g={48} b={21} opacity={1} />
                    <ColorPicker ref={ "cp2" } x={ 1460 } y={ 6 } r={239} g={187} b={36} opacity={1} />
                
                    <div style={{
                        position: 'relative',
                        height: '42px',
                        padding: '0px 12px',
                        border: `1px solid ${ Color.Nippon.Mizu }`,
                        background: Color.setLightness(Color.Nippon.Mizu, 0.94),
                        top: '-3px',
                        width: '158px',
                        left: '0px',
                        display: 'inline-block'
                    }} >
                        <button id="goRandom"
                        style={{
                            fontSize: '14px',
                            width: '60px',
                            transform: 'translateY(8px)',
                            marginLeft: '5px',
                            marginRight: '9px',
                            background: this.state.sampled
                                ? Color.setLightness(Color.Nippon.Aisumitya, 0.6)
                                : Color.Nippon.Aisumitya,
                            color: Color.setLightness(Color.Nippon.Aisumitya, 0.9),
                            padding: '2px 9px',
                            height: '25.6px'
                        }}
                        onClick={
                            this.state.sampled
                                ? () => {
                                    return;
                                }
                                : () => {
                                    if ($("#run").attr("src") === "./images/loading.png"
                                    || $("#runr").attr("src") === "./images/loading.png") {
                                        return;
                                    }
                                    $("#runr").attr("src", "./images/loading.png").addClass("rotating");
                                    setTimeout(() => {
                                        Globe.random();
                                    }, 200);
                                }
                        } >
                            <img src={ `./images/run.png` } id="runr"
                            alt={ ">>" }
                            width="14px" height="14px"
                            style={{
                                margin: this.state.sampled ? '0px 2px 0px -2px' : '0px 7px 0px -2px'
                            }} />
                            RS
                        </button>
                        <button id="goBN"
                        style={{
                            fontSize: '14px',
                            width: '70px',
                            transform: 'translateY(8px)',
                            marginLeft: '5px',
                            marginRight: '9px',
                            background: this.state.sampled
                                ? Color.setLightness(Color.Nippon.Aisumitya, 0.6)
                                : Color.Nippon.Aisumitya,
                            color: Color.setLightness(Color.Nippon.Aisumitya, 0.9),
                            padding: '2px 9px',
                            height: '25.6px'
                        }}
                        onClick={
                            this.state.sampled
                                ? () => {
                                    return;
                                }
                                : () => {
                                    if ($("#run").attr("src") === "./images/loading.png"
                                    || $("#runb").attr("src") === "./images/loading.png") {
                                        return;
                                    }
                                    $("#runb").attr("src", "./images/loading.png").addClass("rotating");
                                    setTimeout(() => {
                                        Globe.blueNoise();
                                    }, 200);
                                }
                        } >
                            <img src={ `./images/run.png` } id="runb"
                            alt={ ">>" }
                            width="14px" height="14px"
                            style={{
                                margin: this.state.sampled ? '0px 2px 0px -2px' : '0px 7px 0px -2px'
                            }} />
                            BNS
                        </button>
                    </div>
                </div>
            </>
        );
    }

    public componentDidMount(): void {
        bindColorPicker = (element: JQuery<HTMLElement>, index: number, ...attrName: Array<string>) => {
            if (attrName.length === 0) {
                attrName = ['fill', 'color'];
            }
            (this.refs[`cp${index}`] as ColorPicker).bind(element, ...attrName);
        };
        this.load('Tweet');
        Globe.loadData = this.load.bind(this, 'Tweet');
    }

    public getSnapshotBeforeUpdate(): {
        rate: number;
        radius: number;
        beta: number;
        gamma: number;
    } {
        return {
            rate: (this.refs["SamplingRate"] as ValueBar).val(),
            radius: (this.refs["radius"] as ValueBar).val(),
            beta: (this.refs["beta"] as ValueBar).val(),
            gamma: (this.refs["gamma"] as ValueBar).val()
        };
    }

    public componentDidUpdate(prevProps: Readonly<ItemStripProps>, prevState: Readonly<ItemStripState>,
    snapshot: {
        rate: number;
        radius: number;
        beta: number;
        gamma: number;
    }): void {
        (this.refs["SamplingRate"] as ValueBar).val(snapshot.rate);
        (this.refs["radius"] as ValueBar).val(snapshot.radius);
        (this.refs["beta"] as ValueBar).val(snapshot.beta);
        (this.refs["gamma"] as ValueBar).val(snapshot.gamma);
    }

    public end(b: boolean): void {
        this.setState({
            sampled: b
        });
    }

    public getSource(): 'Tweet' | 'yelp' {
        return this.source;
    }

    public getLambda(): number {
        return parseFloat(((this.refs["beta"] as ValueBar).val()!).toFixed(1));
    }
    
    public getGamma(): number {
        return parseFloat(((this.refs["gamma"] as ValueBar).val()!).toFixed(1));
    }
    
    public getRadius(): number {
        return (this.refs["radius"] as ValueBar).val()! < 0.1 ? 0.001 : 0.2;
    }

    private load(source: string): void {
        let src: FileSet;
        if (source === 'Tweet') {
            this.source = 'Tweet';
            src = {
                origin: './data/93_new.json',
                tree: './data/visualization_tree_dict_0.1_0.3_0.001.json',
                gathering: './data/new_93.json'
            };
            this.props.importSource(src);
            // src = {
            //     origin: './data/99_new.json',
            //     tree: './data/visualization_tree_dict_0.08_0.2_0.001.json',
            //     gathering: './data/new_99.json'
            // };
            // this.props.importSource(src);
            // this.props.importSource('/data/93.csv', '/data/visualization_tree_dict_0.2_0.1_0.02.json', '/data/93-wordcount.json', '/data/00sentiment_dis-0.15-0.01-20.json', '/data/00sentiment_sum-0.15-0.01-20.json', '/data/prun.json');
            // this.props.importSource('/data/9-17.json', '/data/1/visualization_tree_dict_0.15_0.1_0.0007.json', '/data/93-wordcount.json', '/data/00sentiment_dis-0.15-0.01-20.json', '/data/00sentiment_sum-0.15-0.01-20.json', '/data/prun.json');
            // this.props.importSource('/data/917-51K.json', '/data/1/visualization_tree_dict_0.15_0.1_0.0007.json', '/data/93-wordcount.json', '/data/00sentiment_dis-0.15-0.01-20.json', '/data/00sentiment_sum-0.15-0.01-20.json', '/data/prun.json');
        }
        else if (source === 'yelp') {
            this.source = 'yelp';
            src = {
                origin: './data/97_new.json',
                tree: './data/new_visualization_tree_dict_0.1_0.3_0.2.json',
                gathering: './data/new_97.json'
                
                // origin: './data/97_new.json',
                // tree: './data/new_visualization_tree_dict_0.1_0.3_0.07.json',
                // gathering: './data/new_97.json'
            };
            this.props.importSource(src);
            // this.props.importSource('/data/NOSUCHFILE.csv', '/data/Tree.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json');
        }
    }

    public setSampleRate(rate: number): void {
        (this.refs["SamplingRate"] as ValueBar).val(rate);
    }

    public getSampleRate(): number {
        return (this.refs["SamplingRate"] as ValueBar).val();
    }
}

export var bindColorPicker: (element: JQuery<HTMLElement>, index: number, ...attrName: Array<string>) => void
    = () => {};


export default ItemStrip;
