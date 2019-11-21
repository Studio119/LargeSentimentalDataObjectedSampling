/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-15 23:19:54
 */
import React, { Component } from 'react';
import Color from './preference/Color';

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
                height: '218.8px',
                width: '288px',
                background: 'rgb(246, 249, 253)',
                border: '1px solid rgb(149,188,239)',
                position: 'absolute',
                top: '59px',
                left: 0
            }}>
                <div
                style={{
                    height: '24px',
                    width: '272px',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: Color.Nippon.Gohunn,
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Data Overview
                </div>
                <table key={'table'}
                style={{
                    margin: '0px',
                    color: '#0c0c0c'
                }} >
                    <tbody>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Data Size</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.total, false) }</td></tr>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Active Data Size</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.active, false) }</td></tr>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Positive Data Size</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.positive, false) }</td></tr>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Neutral Data Size</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.neutre, false) }</td></tr>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Active Sentiment Average</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.Aver_active, true) }</td></tr>
                        <tr style={{ background: Color.Nippon.Gohunn, padding: '2px 6px', height: '30px' }} ><th style={{ paddingRight: '6px', border: '1px solid #78d', width: '230px' }} >Positive Sentiment Average</th><td style={{ border: '1px solid #abe', width: '60px' }} >{ DataView.format(this.state.Aver_positive, true) }</td></tr>
                    </tbody>
                </table>
            </div>
        )
    }

    private static format(num: number, float: boolean): string {
        if (isNaN(num)) {
            return "NaN";
        }
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
