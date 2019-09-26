/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-23 19:15:37
 */
import React, { Component } from 'react';

export interface ContrastViewProps {
    id: string
}

export interface ContrastViewState {

}

class ContrastView extends Component<ContrastViewProps, ContrastViewState, {}> {
    public constructor(props: ContrastViewProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '54%',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
            </div>
        )
    }
}

export default ContrastView;
