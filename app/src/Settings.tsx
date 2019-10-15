/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-07 21:10:51
 */
import React, { Component } from 'react';

export interface SettingsProps {
    id: string;
}

export interface SettingsState {
    topics: Array<{ topic: string, count: number }>;
}

class Settings extends Component<SettingsProps, SettingsState, {}> {
    public constructor(props: SettingsProps) {
        super(props);
        this.state = {
            topics: []
        };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
            style={{
                display: 'inline-block',
                height: '393.2px',
                width: '318px',
                background: 'white',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '467px',
                left: '0px'
            }}>
                <div
                style={{
                    height: '24px',
                    width: '302px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Hotspots
                </div>
                <div key="head">
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
                    height: '331.2px',
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
                </div>
            </div>
        )
    }

    private static format(num: number): string {
        let part: string = num.toString();
        let temp: string = "";
        while (part.length > 3) {
            temp = part.substr(part.length - 3, part.length) + "," + temp;
            part = part.substr(0, part.length - 3);
        }
        temp = part + "," + temp;
        return temp.substr(0, temp.length - 1);
    }

    public import(topics: Array<{ topic: string, count: number }>): void {
        this.setState({
            topics: topics.sort((a: { topic: string; count: number; }, b: { topic: string; count: number; }) => {
                return b.count - a.count;
            })
        });
    }
}

export default Settings;
