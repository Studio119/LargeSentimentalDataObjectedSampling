/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-25 20:28:40
 */
import React, { Component } from 'react';
import LeafLetMap from './re-leaflet/LeafLetMap';

export interface MapViewProps {
    id: string;
    center: [number, number];
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    options?: L.MapOptions;
}

export interface MapViewState {

}

class MapView extends Component<MapViewProps, MapViewState, {}> {
    private mounted: boolean;

    public constructor(props: MapViewProps) {
        super(props);
        this.mounted = false;
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '75.6%',
                    marginLeft: '24.12%',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
                {
                    this.mounted
                        ? <LeafLetMap element={ this.props.id } center={ this.props.center } zoom={ this.props.zoom }
                            minZoom={ this.props.minZoom } maxZoom={ this.props.maxZoom } />
                        : <></>
                }
            </div>
        )
    }

    public componentDidMount(): void {
        this.mounted = true;
        this.setState({});
    }
}

export default MapView;
