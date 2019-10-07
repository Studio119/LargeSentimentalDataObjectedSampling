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
                    height: '242px',
                    width: '18%',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black',
                    position: 'absolute',
                    top: '311px',
                    left: 0
                }}>
                <div key="head">
                    <table
                    style={{
                        width: '100%',
                        padding: '8px 15px 0px 10px'
                    }}>
                        <tbody>
                            <tr key={ `listheader` }
                            style={{
                                width: '100%',
                                height: '36px'
                            }}>
                                <td key={ `listheader_label1`} style={{ width: '76%' }} >topic</td>
                                <td key={ `listheader_label2`} style={{ width: '24%' }} >count</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div key="list"
                style={{
                    height: '194px',
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
            topics: topics
        });
    }
}

export default Settings;
