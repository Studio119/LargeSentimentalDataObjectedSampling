/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:27 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-28 03:20:11
 */
import React, { Component } from 'react';
import ValueBar from './ValueBar';
import ColorPicker from './ColorPicker';

export interface ItemStripProps {
    id: string
}

export interface ItemStripState {

}

class ItemStrip extends Component<ItemStripProps, ItemStripState, any> {
    public constructor(props: ItemStripProps) {
        super(props);
        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <>
                <div id={ this.props.id } key="container"
                    style={{
                        height: '58px',
                        paddingTop: '6px',
                        background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 10%, rgb(192, 193, 196) 80%, rgb(147, 149, 154) 90%, #282c34)'
                    }}>
                    <ValueBar label={ "采样率" } width={ 160 } height={ 20 } min={ 0 } max={ 1 } defaultValue={ 0.4 } />
                    <ValueBar label={ "α =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } step={ 5 } defaultValue={ 100 } />
                    <ValueBar label={ "β =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } defaultValue={ 100 } />
                    <ValueBar label={ "γ =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } defaultValue={ 100 } />

                    <ColorPicker ref={ "cp0" } x={ 1280 } y={ 6 } r={255} g={0} b={0} opacity={1} />
                    <ColorPicker ref={ "cp1" } x={ 1340 } y={ 6 } r={0} g={255} b={0} opacity={1} />
                    <ColorPicker ref={ "cp2" } x={ 1400 } y={ 6 } r={0} g={0} b={255} opacity={1} />
                </div>
                <div key="border"
                    style={{
                        height: '2px',
                        background: 'linear-gradient(to right, blue, green 20%, yellow 50%, purple 80%, red)'
                    }} />
            </>
        );
    }

    public componentDidMount(): void {
        bindColorPicker = (element: JQuery<HTMLElement>, index: number) => {
            (this.refs[`cp${index}`] as ColorPicker).bind(element);
        };
    }
}

export var bindColorPicker: (element: JQuery<HTMLElement>, index: number) => void
    = () => {};


export default ItemStrip;
