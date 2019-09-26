/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:27 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-26 21:53:03
 */
import React, { Component } from 'react';
import ValueBar from './ValueBar';

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
                        height: '48px',
                        background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 10%, rgb(192, 193, 196) 80%, rgb(147, 149, 154) 90%, #282c34)'
                    }}>
                    <ValueBar width={ 120 } height={ 20 } min={ 0 } max={ 1 } defaultValue={ 0.4 } />
                    <ValueBar width={ 120 } height={ 20 } min={ 0 } max={ 100 } defaultValue={ 100 } />
                </div>
                <div key="border"
                    style={{
                        height: '2px',
                        background: 'linear-gradient(to right, blue, green 20%, yellow 50%, purple 80%, red)'
                    }} />
            </>
        );
    }
}


export default ItemStrip;
