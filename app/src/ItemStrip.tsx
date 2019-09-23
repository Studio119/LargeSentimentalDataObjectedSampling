/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:27 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-23 15:02:10
 */
import React, { Component } from 'react';

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
                    }} />
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
