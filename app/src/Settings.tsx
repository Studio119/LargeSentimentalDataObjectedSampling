/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-28 03:22:46
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
                    height: '100%',
                    width: '24%',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
                <p ref="text1">这是测试的文本1。</p>
                <p ref="text2">这是测试的文本2。</p>
                <p ref="text3">这是测试的文本3。</p>
            </div>
        )
    }

    public componentDidMount(): void {
        bindColorPicker($((this.refs["text1"] as any)), 0);
        bindColorPicker($((this.refs["text2"] as any)), 1);
        bindColorPicker($((this.refs["text3"] as any)), 2);
    }
}

export default Settings;
