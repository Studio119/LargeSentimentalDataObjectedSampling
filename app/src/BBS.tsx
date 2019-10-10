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
                border: '1px solid black',
                overflowX: 'hidden',
                overflowY: 'scroll'
            }}>
                <table
                    style={{
                        width: '100%',
                        padding: '0px'
                    }}>
                        <ul
                        style={{
                            margin: '0px'
                        }}>
                            {
                                this.state.list.map((b: { text: string; city: string; sentiment: number; }, index: number) => {
                                    return (
                                        <li key={ `row${ index }` }
                                        style={{
                                            width: '96%',
                                            marginRight: '4%',
                                            borderBottom: '1px solid black',
                                            borderTop: '1px solid black',
                                        }}>
                                            <p key={ `text${ index }` } ref={ `bbs_text${ index }` }
                                            style={{
                                                textAlign: 'left',
                                                border: '1px solid black',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                background: 'white',
                                                marginBottom: '4px'
                                            }}>{ b.text }</p>
                                            <p key={ `city${ index }` }
                                            style={{
                                                textAlign: 'right',
                                                color: '#444',
                                                marginTop: '4px'
                                            }}>shared in <u>{ b.city }</u></p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </table>
            </div>
        );
    }

    public componentDidUpdate(): void {
        for (let i: number = 0; i < this.state.list.length; i++) {
            let origin: string = $(this.refs[`bbs_text${ i }`] as any).html();
            let rich: string = "";
            let space: 'none' | 'at' | 'sharp' = 'none';
            for (let j: number = 0; j < origin.length; j++) {
                if (origin[j] === "@") {
                    space = 'at';
                    rich += "<span style='color: blue;'><u>";
                }
                else if (origin[j] === "#") {
                    space = 'sharp';
                    rich += "<span style='color: rgb(255,145,0);'>";
                }
                else if (origin[j] === " ") {
                    if (space === 'at') {
                        rich += "</u></span>";
                    }
                    else if (space === 'sharp') {
                        rich += "</span>";
                    }
                    space = "none";
                }
                rich += origin[j];
            }
            $(this.refs[`bbs_text${ i }`] as any).html(rich);
        }
    }

    public import(list: Array<{ text: string; city: string; sentiment: number; }>): void {
        this.setState({
            list: list
        });
    }
}

export default BBS;
