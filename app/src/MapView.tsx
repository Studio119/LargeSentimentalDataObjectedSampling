/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-23 19:21:41
 */
import React, { Component } from 'react';

export interface MapViewProps {
    id: string
}

export interface MapViewState {

}

class MapView extends Component<MapViewProps, MapViewState, {}> {
    public constructor(props: MapViewProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '40%',
                    marginLeft: '0.12%',
                    marginRight: '0.12%',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
            </div>
        )
    }
}

export default MapView;
