/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-21 21:34:23
 */
import React, { Component } from 'react';
import $ from 'jquery';
import ReactWordCloud, { Scale, Spiral } from 'react-wordcloud';

export interface SettingsProps {
    id: string;
}

export interface SettingsState {
    data: Array<{ text: string, value: number }>;
}

class Settings extends Component<SettingsProps, SettingsState, {}> {
    public color: Array<string> = [
        'rgb(100,54,60)', 'rgb(181,73,91)', 'rgb(204,84,58)', 'rgb(114,72,50)',
        'rgb(240,94,28)', 'rgb(143,90,60)', 'rgb(148,122,109)', 'rgb(155,110,35)',
        'rgb(209,152,38)', 'rgb(108,96,36)', 'rgb(108,106,45)', 'rgb(91,98,46)',
        'rgb(66,96,45)', 'rgb(27,129,62)', 'rgb(32,96,79)', 'rgb(12,72,66)',
        'rgb(8,25,45)', 'rgb(33,30,85)', 'rgb(102,50,124)', 'rgb(98,41,84)'
    ];

    public constructor(props: SettingsProps) {
        super(props);
        this.state = {
            data: []
        };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
            style={{
                display: 'inline-block',
                height: '308.8px',
                width: '288px',
                background: 'white',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '281.5px',
                left: '0px'
            }}>
                <div
                style={{
                    height: '24px',
                    width: '272px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Hotspots
                </div>
                {/* <div key="head">
                    <table
                    style={{
                        width: '100%',
                        padding: '2px 46px 0px 9px'
                    }}>
                        <tbody>
                            <tr key={ `listheader` }
                            style={{
                                width: '100%',
                                height: '26px'
                            }}>
                                <td key={ `listheader_label1`} style={{ width: '76%' }} >topic</td>
                                <td key={ `listheader_label2`} style={{ width: '24%' }} >count</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div key="list"
                style={{
                    height: '231.2px',
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                }}>
                    <table
                    style={{
                        width: '100%',
                        padding: '0px 30px 0px 10px'
                    }}>
                        <tbody>
                            {
                                this.state.topics.map((item: { topic: string, count: number }, index: number) => {
                                    return (
                                        <tr key={ index } style={{ padding: '2px 6px' }} >
                                            <td style={{ paddingRight: '6px', width: '70%' }} >{ item.topic }</td>
                                            <td style={{ width: '30%' }} >{ Settings.format(item.count) }</td>
                                        </tr>                                    
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div> */}
                {/* <WordCloud width={ 318 } height={ 291 } ref="WordCloud" /> */}
                <div id="cloud">
                    <ReactWordCloud
                    size={[300, 300]}
                    options={{
                        colors: this.color,
                        enableTooltip: true,
                        deterministic: false,
                        fontFamily: 'mono',
                        fontSizes: [12, 36],
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        padding: 1.2,
                        rotations: 3,
                        rotationAngles: [0, 0],//[0, 90],
                        scale: Scale.Sqrt,
                        spiral: Spiral.Archimedean,
                        transitionDuration: 100
                    }}
                    words={ this.state.data } />
                </div>
            </div>
        )
    }

    // private static format(num: number): string {
    //     let part: string = num.toString();
    //     let temp: string = "";
    //     while (part.length > 3) {
    //         temp = part.substr(part.length - 3, part.length) + "," + temp;
    //         part = part.substr(0, part.length - 3);
    //     }
    //     temp = part + "," + temp;
    //     return temp.substr(0, temp.length - 1);
    // }

    public componentDidUpdate(): void {
        setTimeout(() => {
            $('#cloud svg').attr('width', '288px').attr('height', '285px');
            $('#cloud g:first').attr('transform', 'translate(144,142.5)');
        }, 100);
    }

    public import(topics: Array<{ text: string, count: number }>): void {
        let box: Array<{ text: string, count: number }>
            = topics.sort((a: { text: string; count: number; }, b: { text: string; count: number; }) => {
                return b.count - a.count;
            });
        let data: Array<{ text: string, value: number }> = [];
        box.forEach((d: { text: string, count: number }, index: number) => {
            if (index >=  30) {
                return;
            }
            data.push({ text: d.text, value: d.count });
        });
        this.setState({
            // data: data.sort(() => {
            //     return Math.random() - 0.5;
            // })
            data: data
        });
    }
}

export default Settings;
