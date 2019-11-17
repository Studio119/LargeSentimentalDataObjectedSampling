/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-10 13:26:24 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-15 18:36:04
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
    private name: Array<string> = [
        "Mathieu Jarry",
        "Jenny Randria",
        "Nicolas Bellec",
        "Emma Prévieux",
        "Flavie Qui",
        "Gabriela Girundi",
        "Sarah Iacobucci (Bellarke)",
        "Nicolò Dughetti",
        "Gaia Dondossola",
        "Leo Mora",
        "Carolina Nocco",
        "Davide Rustioni",
        "Francesco De Siati",
        "Frank Lecerf",
        "Luigi Defendi",
        "Elia Colombo",
        "Matteo Colombo",
        "Nicolò Santini",
        "Simone Carminati",
        "Stefano Mariani",
        "Filippo Regonesi",
        "Marco Borsari",
        "Aldo Miglioli",
        "Stefano Mondonico",
        "Giada Mossali",
        "Ale Giorgetti",
        "Daniele De Pace",
        "Stefano Brigatti",
        "Viola Beretta",
        "Riccardo Bertoletti",
        "Carlotta Mosconi",
        "Margherita Pavia",
        "Beatrice Rondelli",
        "Alessandro Maggioni",
        "Mimmo Sambuco"
    ];

    public constructor(props: BBSprops) {
        super(props);
        this.state = {
            list: []
        };
    }

    public render(): JSX.Element {
        let iconset: Array<number> = [];
        let idset: Array<string> = [];
        while (iconset.length < 20) {
            let num: number = parseInt((Math.random() * 30).toString());
            for (let i: number = 0; i <= iconset.length; i++) {
                if (i === iconset.length) {
                    iconset.push(num);
                    break;
                }
                if (iconset[i] === num) {
                    break;
                }
            }
        }
        while (idset.length < 20) {
            let num: number = parseInt((Math.random() * this.name.length).toString());
            for (let i: number = 0; i <= idset.length; i++) {
                if (i === idset.length) {
                    idset.push(this.name[num]);
                    break;
                }
                if (idset[i] === this.name[num]) {
                    break;
                }
            }
        }
        return (
            <div
            style={{
                width: this.props.width,
                height: this.props.height,
                border: '1px solid rgb(149,188,239)',
                background: 'rgb(248, 250, 254)'
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
                    overflowY: 'scroll',
                    textAlign: 'left'
                }}>
                    {
                        this.state.list.map((b: { text: string; city: string; sentiment: number; }, index: number) => {
                            return (
                                <li key={ `row${ index }` }
                                style={{
                                    width: '100%',
                                    marginRight: '4%',
                                    marginLeft: '-4%'
                                }} >
                                    <div key={`irow${ index }`}
                                    style={{
                                        margin: '6px 0px -22px 37px'
                                    }} >
                                        <p>
                                            <b>
                                                { this.hide(idset[index]) }
                                            </b>
                                            <span key={ `city${ index }` }
                                            style={{
                                                display: 'block',
                                                color: '#668',
                                                marginTop: '-21px',
                                                marginRight: '8px',
                                                textAlign: 'right'
                                            }}>
                                                { b.city }
                                            </span>
                                        </p>
                                    </div>
                                    <div key={`idDIV${ index }`}
                                    style={{
                                        display: 'inline-block',
                                        height: '40px',
                                        width: '40px',
                                        verticalAlign: 'top',
                                        margin: '-20px 18px 0px -12px'
                                    }} >
                                        <img src={ `./images/icon${ iconset[index] }.jpg` }
                                        alt={ idset[index].split(' ').map((p: string) => {
                                            return p[0] + ".";
                                        }).join('') }
                                        width="40px" height="40px"
                                        style={{
                                            borderRadius: '20px'
                                        }} />
                                    </div>
                                    <div key={`textDIV${ index }`}
                                    style={{
                                        width: '320px',
                                        display: 'inline-block',
                                        marginLeft: '-8px'
                                    }} >
                                        <p key={ `text${ index }` }
                                        style={{
                                            textAlign: 'left',
                                            border: '1px solid rgb(223,235,250)',
                                            borderRadius: '0px 12px 12px 12px',
                                            padding: '8px 14px',
                                            background: 'white',
                                            marginBottom: '4px',
                                            marginTop: '14px'
                                        }}>
                                            <span ref={ `bbs_text${ index }`} >
                                                { b.text }
                                            </span>
                                            {/* <br />
                                            <span key={ `city${ index }` }
                                            style={{
                                                display: 'block',
                                                textAlign: 'right',
                                                color: '#668',
                                                marginTop: '4px'
                                            }}>
                                                shared in <u>{ b.city }</u>
                                            </span> */}
                                        </p>
                                    </div>
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
                        rich += "</{></span>";
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

    private hide(name: string): string {
        let paras: Array<string> = name.split(' ');
        let hidden: string = paras[0][0] + "?";
        for (let i: number = 0; i < 6; i++) {
            hidden += (parseInt("" + (Math.random() * 16).toString())).toString(16);
        }
        paras.forEach((p: string, index: number) => {
            if (index !== 0) {
                hidden += " " + p;
            }
        });
        return hidden;
    }
}

export default BBS;
