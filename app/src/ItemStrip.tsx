/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:27 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-06 17:47:49
 */
import React, { Component } from 'react';
import ValueBar from './ValueBar';
import ColorPicker from './ColorPicker';
import Dropdown from './Dropdown';

export interface ItemStripProps {
    id: string,
    importSource: (url: string, json: string, topic: string, dis: string, sum: string, prun: string) => void;
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
                        height: '40px',
                        padding: '5px 40px 9px 40px',
                        background: 'rgb(224, 232, 240)',
                        border: '1px solid rgb(149,188,239)',
                        textAlign: 'left'
                    }} >
                    <label style={{ position: 'relative', top: 8, fontSize: '18px' }}>dataset</label>
                    <Dropdown<string> width={ 100 } height={ 30 } optionList={ ['Tweet', 'yelp'] } onChange={ (option: string) => { this.load(option); } } />

                    <div style={{ display: 'inline-block', width: '40px' }}/>

                    <ValueBar label={ "Sampling Rate" } width={ 160 } height={ 20 } min={ 0 } max={ 1 } defaultValue={ 0.4 } />
                    
                    <div style={{ display: 'inline-block', width: '40px' }}/>

                    <ValueBar label={ "α =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } step={ 5 } defaultValue={ 100 } />
                    <ValueBar label={ "β =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } defaultValue={ 100 } />
                    <ValueBar label={ "γ =" } width={ 120 } height={ 20 } min={ 0 } max={ 100 } defaultValue={ 100 } />

                    <ColorPicker ref={ "cp0" } x={ 1360 } y={ 6 } r={0} g={128} b={0} opacity={1} />
                    <ColorPicker ref={ "cp1" } x={ 1410 } y={ 6 } r={255} g={0} b={0} opacity={1} />
                    <ColorPicker ref={ "cp2" } x={ 1460 } y={ 6 } r={255} g={255} b={0} opacity={1} />
                </div>
            </>
        );
    }

    public componentDidMount(): void {
        bindColorPicker = (element: JQuery<HTMLElement>, index: number, ...attrName: Array<string>) => {
            if (attrName.length === 0) {
                attrName = ['fill', 'color'];
            }
            (this.refs[`cp${index}`] as ColorPicker).bind(element, ...attrName);
        };
        this.load('Tweet');
    }

    private load(source: string): void {
        if (source === 'Tweet') {
            this.props.importSource('/data/93.csv', '/data/1/visualization_tree_dict_0.15_0.1_0.0007.json', '/data/93-wordcount.json', '/data/00sentiment_dis-0.15-0.01-20.json', '/data/00sentiment_sum-0.15-0.01-20.json', '/data/prun.json');
        }
        else if (source === 'yelp') {
            this.props.importSource('/data/NOSUCHFILE.csv', '/data/Tree.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json', '/data/NOSUCHFILE.json');
        }
    }
}

export var bindColorPicker: (element: JQuery<HTMLElement>, index: number, ...attrName: Array<string>) => void
    = () => {};


export default ItemStrip;
