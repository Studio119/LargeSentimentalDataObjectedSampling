/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-10 13:26:24 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-10 14:11:52
 */
import React, { Component } from "react";
import $ from "jquery";

export interface BBSprops {
    width: number;
    height: number;
}

export interface BBSstate {
    list: Array<{ text: string; city: string; sentiment: number; }>;
}

class BBS extends Component<BBSprops, BBSstate, {}> {
    public constructor(props: BBSprops) {
        super(props);
        this.state = {
            list: []
        };
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                width: this.props.width,
                height: this.props.height,
                border: '1px solid rgb(149,188,239)'
            }}>
                <div
                style={{
                    height: '24px',
                    width: '100%',
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: 'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }}>
                    Tweets List
                </div>
                <ul
                style={{
                    margin: '0px',
                    height: this.props.height - 24,
                    listStyle: 'none',
                    overflowX: 'hidden',
                    overflowY: 'scroll'
                }}>
                    {
                        this.state.list.map((b: { text: string; city: string; sentiment: number; }, index: number) => {
                            return (
                                <li key={ `row${ index }` }
                                style={{
                                    width: '100%',
                                    marginRight: '4%',
                                    marginLeft: '-4%'
                                }}>
                                    <p key={ `text${ index }` }
                                    style={{
                                        textAlign: 'left',
                                        border: '1px solid rgb(149,188,239)',
                                        borderRadius: '10px 10px 0px 10px',
                                        padding: '8px 14px',
                                        background: 'rgb(234,242,252)',
                                        marginBottom: '4px',
                                        marginTop: '14px'
                                    }}>
                                        <span ref={ `bbs_text${ index }`} >
                                            { b.text }
                                        </span>
                                        <br />
                                        <span key={ `city${ index }` }
                                        style={{
                                            display: 'block',
                                            textAlign: 'right',
                                            color: '#668',
                                            marginTop: '4px'
                                        }}>
                                            shared in <u>{ b.city }</u>
                                        </span>
                                    </p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    public componentDidUpdate(): void {
        for (let i: number = 0; i < this.state.list.length; i++) {
            let origin: string = $(this.refs[`bbs_text${ i }`] as any).html();
            let rich: string = "";
            let space: 'none' | 'at' | 'sharp' = 'none';
            let tab: number = 0;
            for (let j: number = 0; j < origin.length; j++) {
                if (space === 'none') {
                    if (origin[j] === "@") {
                        space = 'at';
                        rich += "<span style='color: blue;'><u>";
                        tab++;
                    }
                    else if (origin[j] === "#") {
                        space = 'sharp';
                        rich += "<span style='color: rgb(255,145,0);'>";
                        tab++;
                    }
                }
                else if (origin[j] === " ") {
                    if (space === 'at') {
                        rich += "</u></span>";
                        tab--;
                    }
                    else if (space === 'sharp') {
                        rich += "</span>";
                        tab--;
                    }
                    space = "none";
                }
                rich += origin[j];
                if (j === origin.length - 1) {
                    if (space === 'at') {
                        rich += "</u></span>";
                        tab--;
                    }
                    else if (space === 'sharp') {
                        rich += "</span>";
                        tab--;
                    }
                    space = "none";
                }
            }
            if (tab === 0) {
                $(this.refs[`bbs_text${ i }`] as any).html(rich);
            }
        }
    }

    public import(list: Array<{ text: string; city: string; sentiment: number; }>): void {
        this.setState({
            list: list
        });
    }
}

export default BBS;
