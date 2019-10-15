/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-03 00:34:28
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
                width: '318px',
                background: 'rgb(246, 249, 253)',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '59px',
                left: 0
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
                    Data Overview
                </div>
                <table key={'table'}
                style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} >
                    <tbody>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Data Size</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.total, false) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Active Data Size</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.active, false) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Positive Data Size</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.positive, false) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Neutral Data Size</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.neutre, false) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Active Sentiment Average</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.Aver_active, true) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Positive Sentiment Average</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.Aver_positive, true) }</td></tr>
                        <tr style={{ background: 'white', padding: '2px 6px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '220px' }} >Neutral Sentimental Average</th><td style={{ border: '1px solid #abe', width: '48px' }} >{ DataView.format(this.state.Aver_neutre, true) }</td></tr>
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
