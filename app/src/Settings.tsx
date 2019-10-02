/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-02 19:11:04
 */
import React, { Component } from 'react';
import $ from 'jquery';
import { bindColorPicker } from './ItemStrip';

export interface SettingsProps {
    id: string
}

export interface SettingsState {

}

class Settings extends Component<SettingsProps, SettingsState, {}> {
    public constructor(props: SettingsProps) {
        super(props);
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
                <p key={"p1"} ref="text1">这是测试的文本1。</p>
                <p key={"p2"} ref="text2">这是测试的文本2。</p>
                <p key={"p3"} ref="text3">这是测试的文本3。</p>
                <p key={"p4"} ref="text4">这是测试的文本4。</p>
                <p key={"p5"} ref="text5">这是测试的文本5。</p>
                <p key={"p6"} ref="text6">这是测试的文本6。</p>
            </div>
        )
    }

    public componentDidMount(): void {
        for (let i: number = 0; i < 6; i++) {
            bindColorPicker($((this.refs[`text${ i + 1 }`] as any)), i % 3);
        }
    }
}

export default Settings;
