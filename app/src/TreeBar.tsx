/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-10 15:04:05
 */
import React, { Component } from 'react';
import $ from 'jquery';
import { StyleReflection } from './TreeMap';
import Color from './preference/Color';


export interface TreeBarProps {
    id: Readonly<string>;
    width: number;
    height: number;
    style?: React.CSSProperties;
    circleStyle?: StyleReflection;
    pathStyle?: React.CSSProperties;
}

export interface TreeBarNode<T = any> {
    id: Readonly<number>;
    name: Readonly<string | number>;
    width?: number;
    path: Array< 'root' | number >;
    parent: TreeBarNode<T> | null;
    children: Array< TreeBarNode<T> >;
    ref: JQuery<HTMLElement>;
    data: T | null;
}

export interface TreeBarState<T = any> extends TreeBarNode<T> {}

class TreeBar<T = any> extends Component<TreeBarProps, TreeBarState<T>, {}> {
    private layers: Array<Array<TreeBarNode<T>>>;

    public constructor(props: TreeBarProps) {
        super(props);
        this.state = {
            id: -1,
            name: 'root',
            path: [ 'root' ],
            parent: null,
            children: [],
            ref: $("NULL"),
            data: null
        };
        this.layers = [];
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                height: `${ this.props.height + 24 }px`,
                width: `${ this.props.width }px`,
                border: '1px solid rgb(149,188,239)',
                ...this.props.style
            }} >
                <div
                style={{
                    height: '24px',
                    width: `${ this.props.width - 16 }px`,
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }} >
                    Tree Chart
                </div>
                <svg width={`${ this.props.width }px`} height={`${ this.props.height + 24 }px`}
                id={ this.props.id + '_svg' } xmlns={`http://www.w3.org/2000/svg`} >
                    <g key="canvas" ref="svg" xmlns={`http://www.w3.org/2000/svg`}>
                        {
                            this.layers.map((layer: Array<TreeBarNode<T>>, level: number) => {
                                let offsetX: number = 0;
                                const height: number = this.props.height / this.layers.length;
                                return layer.map((node: TreeBarNode<T>, index: number) => {
                                    if (index !== 0) {
                                        offsetX += layer[index - 1].width!;
                                    }
                                    const value: number = this.random();
                                    return [(
                                        <rect id={ `Bar_id${ node.id }` }
                                        key={ node.id }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1 }
                                        // y={ (level + 1) * this.props.height / this.layers.length }
                                        y={ level * height + 1 }
                                        width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 2 }
                                        height={ height - 2 }
                                        style={{
                                            fill: Color.Nippon.Haizakura,
                                            stroke: Color.Nippon.Yamabuki
                                        }} />
                                    ), (
                                        <rect id={ `coreBar_id${ node.id }` }
                                        key={ "C_" + node.id }
                                        className={
                                            value < 0.5 ? 'ab' : 'o'
                                        }
                                        xmlns={`http://www.w3.org/2000/svg`}
                                        x={ offsetX * this.props.width / this.layers[this.layers.length - 1].length + 1.5 }
                                        // y={ (level + 1) * this.props.height / this.layers.length }
                                        y={ (level + 1 - value) * height + 1.5 }
                                        width={ node.width! * this.props.width / this.layers[this.layers.length - 1].length - 3 }
                                        height={ value * height - 3 }
                                        style={{
                                            fill: value > 0.5
                                                    ?   Color.Nippon.Syozyohi
                                                    :   value === 0.5
                                                                ?   Color.Nippon.Ukonn
                                                                :   'rgb(0, 92, 175)'
                                        }} />
                                    )];
                                });
                            })
                        }
                    </g>
                </svg>
            </div>
        );
    }

    public UNSAFE_componentWillUpdate(nextProps: Readonly<TreeBarProps>, nextState: Readonly<TreeBarState<T>>): void {
        this.layers = [];
        this.walk(nextState);
    }

    private random(): number {
        return Math.random() >= 0.73
                ?   0.5
                :   Math.round(Math.random()) / 2 + 0.25 + (Math.round(Math.random()) - 0.5) / 2 * Math.sqrt(Math.random());
    }

    private walk(node: TreeBarNode<T>): number {
        if (node.path.length > this.layers.length) {
            this.layers.push([]);
        }
        this.layers[node.path.length - 1].push(node);
        let sum: number = 0;
        node.children.forEach((child: Readonly<TreeBarNode<T>>) => {
            sum += this.walk(child);
        });
        if (node.children.length === 0) {
            node.width = 1;
        }
        else {
            node.width = sum;
        }
        return node.width;
    }

    public import(root: Readonly<TreeBarNode<T>>): void {
        this.setState(root);
        let s: Array<string> = [];
        ['#808F7C', '#51A8DD', '#B54434', '#F0A986', '#F596AA', '#89916B', '#FAD689', '#336774', '#8D742A', '#DC9FB4', '#B28FCE', '#77428D', '#9E7A7A', '#734338', '#BA9132', '#DAC9A6', '#904840', '#6699A1', '#66BAB7', '#4A225D', '#6D2E5B', '#4E4F97', '#D9AB42', '#4B4E2A', '#005CAF', '#574C57', '#0C0C0C', '#0089A7', '#AF5F3C', '#B4A582', '#434343', '#855B32', '#6A4028', '#405B55', '#E87A90', '#113285', '#268785', '#F4A7B9', '#F9BF45', '#A8D8B9', '#62592C', '#EBB471', '#CA7A2C', '#DDA52D', '#D9CD90', '#ADA142', '#B17844', '#42602D', '#0F4C3A', '#947A6D', '#E9CD4C', '#B19693', '#F05E1C', '#305A56', '#91AD70', '#876633', '#33A6B8', '#BC9F77', '#724938', '#261E47', '#08192D', '#7D6C46', '#2D6D4B', '#FFB11B', '#2E5C6E', '#967249', '#F6C555', '#A0674B', '#884C3A', '#26453D', '#B481BB', '#572A3F', '#24936E', '#255359', '#00896C', '#96632E', '#3C2F41', '#9A5034', '#69B0AC', '#FFBA84', '#0093D3', '#5E3D50', '#8E354A', '#E16B8C', '#86473F', '#4D5139', '#7B90D2', '#9B90C2', '#91989F', '#867835', '#376B6D', '#828282', '#F75C2F', '#90B44B', '#8F5A3C', '#CAAD5F', '#7BA23F', '#516E41', '#60373E', '#006284', '#211E55', '#77969A', '#E2943B', '#0D5661', '#78C2C4', '#B07736', '#6E75A4', '#592C63', '#8B81C3', '#FF5E99', '#0B1013', '#FEDFE1', '#C46243', '#A5A051', '#2EA9DF', '#F19483', '#8F77B5', '#A8497A', '#70649A', '#554236', '#646A58', '#724832', '#1C1C1C', '#B9887D', '#4F4F48', '#ED784A', '#86A697', '#81C7D4', '#B5495B', '#563F2E', '#20604F', '#562E37', '#A28C37', '#C1693C', '#FFC408', '#C73E3A', '#AB3B3A', '#B35C37', '#E03C8A', '#FFF10C', '#CC543A', '#CC006B', '#43341B', '#C99833', '#7D532C', '#E8B647', '#854836', '#DCB879', '#86C166', '#838A2D', '#C78550', '#C18A26', '#DB8E71', '#986DB2', '#877F6C', '#E79460', '#91B493', '#A96360', '#FC9F4D', '#B55D4C', '#897D55', '#ECB88A', '#465D4C', '#D75455', '#0F2540', '#707C74', '#5B622E', '#F7D94C', '#080808', '#64363C', '#E9A368', '#BEC23F', '#656765', '#4F726C', '#D19826', '#0C4842', '#58B2DC', '#EB7A77', '#00AA90', '#EFBB24', '#6C6A2D', '#A5DEE4', '#E3916E', '#E98B2A', '#FB966E', '#2B5F75', '#FCFAF2', '#9F353A', '#66327C', '#3A3226', '#6A8372', '#6F3381', '#985F2A', '#373C38', '#E83015', '#3F2B36', '#6E552F', '#D7B98E', '#994639', '#1B813E', '#622954', '#C1328E', '#E1A679', '#607890', '#FB9966', '#577C8A', '#BF6766', '#B1B479', '#78552B', '#DDD23B', '#616138', '#3A8FB7', '#B47157', '#CA7853', '#D7C4BB', '#9B6E23', '#74673E', '#6C6024', '#B5CAA0', '#6A4C9C', '#F7C242', '#FBE251', '#f0dddd', '#52433D', '#227D51', '#F8C3CD', '#D05A6E', '#D0104C', '#1E88A8', '#C7802D', '#7DB9DE', '#F17C67', '#787878', '#DB4D6D', '#4A593D', '#939650', '#BDC0BA', '#EEA9A9', '#CB1B45', '#72636E', '#566C73', '#8A6BBE', '#A36336', '#954A45', '#096148', '#533D5B', '#5DAC81', '#535953', '#787D7B', '#A35E47', '#82663A', '#36563C', '#B68E55', '#FFFFFB', '#0B346E', '#CB4042'].forEach((d: string) => {
            let r: number = parseInt(d.substr(1, 2), 16);
            let g: number = parseInt(d.substr(3, 2), 16);
            let b: number = parseInt(d.substr(5, 2), 16);
            if ((b + g + r) / 3 <= 40) {
                s.push(d);
            }
        });
        (window as any)['set'] = s;
        (window as any)['go'] = () => {
            (window as any)['gof'] = setInterval(() => {
                $('.ab').css('fill', ((window as any)['set'] as Array<string>)[Math.floor(Math.random() * ((window as any)['set'] as Array<string>).length)]);
            }, 1000);
        }
        (window as any)['stop'] = () => {
            clearInterval((window as any)['gof']);
        }
    }
}

export default TreeBar;
