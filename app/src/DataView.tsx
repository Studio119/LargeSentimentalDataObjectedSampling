/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-02 22:01:38
 */
import React, { Component } from 'react';

export interface DataViewProps {
    id: string
}

export interface DataViewState {
    total: number;
    active: number;
    positive: number;
    neutre: number;
    Aver_active: number;
    Aver_positive: number;
    Aver_neutre: number;
}

class DataView extends Component<DataViewProps, DataViewState, {}> {
    public constructor(props: DataViewProps) {
        super(props);
        this.state = {
            total: 0,
            active: 0,
            positive: 0,
            neutre: 0,
            Aver_active: 0,
            Aver_positive: 0,
            Aver_neutre: 0
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
                    top: '67px',
                    left: 0
                }}>
                <table key={'table'}
                style={{
                    marginTop: '10px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} >
                    <tbody>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >数据总量</th><td>{ DataView.format(this.state.total, false) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >积极情感</th><td>{ DataView.format(this.state.active, false) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >消极情感</th><td>{ DataView.format(this.state.positive, false) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >中性情感</th><td>{ DataView.format(this.state.neutre, false) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >积极情感均值</th><td>{ DataView.format(this.state.Aver_active, true) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >消极情感均值</th><td>{ DataView.format(this.state.Aver_positive, true) }</td></tr>
                        <tr style={{ padding: '2px 6px' }} ><th style={{ marginRight: '6px' }} >中性情感均值</th><td>{ DataView.format(this.state.Aver_neutre, true) }</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }

    private static format(num: number, float: boolean): string {
        if (float) {
            let left: string = num.toString().includes(".") ? num.toString().split(".")[0] : num.toString();
            let right: string = num.toString().includes(".") ? num.toString().split(".")[1] : "";
            right = right.length > 3 ? right.substr(0, 3) : right.length === 1 ? right + "00" : right.length === 2 ? right + "0" : right.length === 3 ? right: "000";
            return left + "." + right;
        }
        else {
            let part: string = num.toString();
            let temp: string = "";
            while (part.length > 3) {
                temp = part.substr(part.length - 3, part.length) + "," + temp;
                part = part.substr(0, part.length - 3);
            }
            temp = part + "," + temp;
            return temp.substr(0, temp.length - 1);
        }
    }

    public load(total: number, active: number, positive: number, neutre: number, Aver_active: number, Aver_positive: number, Aver_neutre: number): void {
        this.setState({
            total: total,
            active: active,
            positive: positive,
            neutre: neutre,
            Aver_active: Aver_active,
            Aver_positive: Aver_positive,
            Aver_neutre: Aver_neutre
        });
    }
}

export default DataView;
