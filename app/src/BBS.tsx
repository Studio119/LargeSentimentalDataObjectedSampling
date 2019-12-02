/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-10 13:26:24 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-12-01 17:35:16
 */
import React, { Component } from "react";
import $ from "jquery";
import Color from "./preference/Color";
import { Globe } from "./App";

export interface BBSprops {
    width: number;
    height: number;
}

export interface BBSstate {
    list: Array<{ text: string; city: string; sentiment: number; }>;
    filter: string;
}

class BBS extends Component<BBSprops, BBSstate, {}> {
    private name: Array<string> = [
        "Mathieu Jarry",
        "Jenny Randria",
        "Nicolas Bellec",
        "Emma Pr√©vieux",
        "Flavie Qui",
        "Gabriela Girundi",
        "Sarah Iacobucci (Bellarke)",
        "Nicol√≤ Dughetti",
        "Gaia Dondossola",
        "Leo Mora",
        "Carolina Nocco",
        "Davide Rustioni",
        "Francesco De Siati",
        "Frank Lecerf",
        "Luigi Defendi",
        "Elia Colombo",
        "Matteo Colombo",
        "Nicol√≤ Santini",
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

    private displayList: Array<{ text: string; city: string; sentiment: number; }>;

    public constructor(props: BBSprops) {
        super(props);
        this.state = {
            list: [],
            filter: '*'
        };
        this.displayList = [];
    }

    public componentDidMount(): void {
        Globe.appendWord = (word: string) => {
            if ($("#wordSearch").val() === "*") {
                $("#wordSearch").val(word);
            }
            else {
                $("#wordSearch").val($("#wordSearch").val() + ',' + word);
            }
            this.setState({
                filter: $("#wordSearch").val() as string
            });
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

        this.displayList = [];

        let words: Array<string> = [];
        if (this.state.filter !== '*') {
            this.state.filter.split(/ |,/).forEach((str: string) => {
                if (str.length && (str[str.length - 1] !== "-" || str.length > 1)) {
                    words.push(str.toLowerCase());
                }
            });
        }
        
        this.state.list.forEach((d: { text: string; city: string; sentiment: number; }, index: number) => {
            let flag: boolean = words.length ? false : true;
            const tb: Array<string> = d.text.split(/[ |,|.|;|:|(|)|[|\]|?|!|ì]/);
            if (flag) {
                this.displayList.push(d);
                return;
            }
            for (let m: number = 0; m < tb.length; m++) {
                const t: string = tb[m];
                for (let i: number = 0; i < words.length; i++) {
                    if (words[i][words[i].length - 1] === '-') {
                        if (t.toLowerCase().startsWith(words[i].substring(0, words[i].length - 1))) {
                            flag = true;
                            break;
                        }
                    }
                    else {
                        if (t.toLowerCase() === words[i]) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag) {
                    break;
                }
            }
            if (flag) {
                this.displayList.push(d);
            }
        });
        
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
                    width: this.props.width - 16,
                    borderBottom: '1px solid rgb(149,188,239)',
                    background: Color.linearGradient([
                        Color.setLightness(Color.Nippon.Berimidori, 0.54),
                        0,
                        Color.setLightness(Color.Nippon.Berimidori, 0.45),
                        0.15,
                        Color.setLightness(Color.Nippon.Berimidori, 0.63),
                        1
                    ], 'right'),//Color.Nippon.Berimidori, // Color.Nippon.Tutuzi, //'rgb(120,151,213)',
                    color: 'white',
                    textAlign: 'left',
                    paddingLeft: '16px',
                    letterSpacing: '2px'
                }}>
                    Text Information
                </div>
                <input
                name="wordSearch"
                id="wordSearch"
                placeholder="*"
                style={{
                    margin: '6px 10px 4px 0px',
                    fontSize: '14px',
                    width: '188px',
                    padding: '2px 6px'
                }} />
                <button
                style={{
                    margin: '6px 41px 4px 4px',
                    fontSize: '14px',
                    padding: '1px 10px',
                    letterSpacing: '1.2px',
                    transform: 'translateY(-2px)',
                    background: Color.setLightness(Color.Nippon.Kesizumi, 0.98),
                    borderTop: '1px solid ' + Color.setLightness(Color.Nippon.Kesizumi, 0.9),
                    borderLeft: '1px solid ' + Color.setLightness(Color.Nippon.Kesizumi, 0.9),
                    borderBottom: '3px solid ' + Color.setLightness(Color.Nippon.Kesizumi, 0.6),
                    borderRight: '2px solid ' + Color.setLightness(Color.Nippon.Kesizumi, 0.42)
                }}
                onClick={
                    () => {
                        if (!$("#wordSearch").val()) {
                            return;
                        }
                        const val: string = $("#wordSearch").val()! as string;
                        if (val.length || val !== '*') {
                            this.setState({
                                filter: val
                            });
                        }
                        else {
                            $("#wordSearch").val("*");
                            this.setState({
                                filter: '*'
                            });
                        }
                    }
                } >
                    filter
                </button>
                <ul ref="container"
                style={{
                    margin: '0px',
                    height: this.props.height - 24.8 - 33.2,
                    listStyle: 'none',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    textAlign: 'left'
                }}>
                    {
                        this.displayList.length <= 20 ||
                        <p style={{
                            color: "#888",
                            margin: "6px -29px 22px",
                            fontSize: '12.4px'
                        }} >
                            Too many to display ({ this.displayList.length }), showing 20 results only.
                        </p>
                    }
                    {
                        this.displayList.map((b: { text: string; city: string; sentiment: number; }, index: number) => {
                            if (index >= 20) {
                                return null;
                            }

                            return (
                                <li key={ `row${ index }` }
                                style={{
                                    width: '96%',
                                    margin: '-10px 4% 28px -4%'
                                }} >
                                    <div key={`irow${ index }`}
                                    style={{
                                        margin: '6px 0px -34px 24px'
                                    }} >
                                        <p>
                                            <span style={{
                                                fontSize: '13px'
                                            }} >
                                                { this.hide(idset[index % 20]) }
                                            </span>
                                            <span key={ `city${ index }` }
                                            style={{
                                                display: 'block',
                                                color: '#668',
                                                marginRight: '8px',
                                                textAlign: 'right',
                                                fontSize: '13px'
                                            }}>
                                                { b.city }
                                            </span>
                                        </p>
                                    </div>
                                    <div key={`idDIV${ index }`}
                                    style={{
                                        display: 'inline-block',
                                        height: '32px',
                                        width: '32px',
                                        verticalAlign: 'top',
                                        margin: '-12px 18px 0px -18px'
                                    }} >
                                        <img src={ `./images/icon${ iconset[index % 20] }.jpg` }
                                        alt={ idset[index % 20].split(' ').map((p: string) => {
                                            return p[0] + ".";
                                        }).join('') }
                                        width="32px" height="32px"
                                        style={{
                                            borderRadius: '16px'
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
                                            padding: '4px 10px 5px',
                                            background: 'white',
                                            marginBottom: '-6px',
                                            marginTop: '2px',
                                            marginLeft: '10px',
                                            fontSize: '13.4px'
                                        }} >
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
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    public componentDidUpdate(): void {
        let words: Array<string> = [];
        if (this.state.filter !== '*') {
            this.state.filter.split(/ |,/).forEach((str: string) => {
                if (str.length && (str[str.length - 1] !== "-" || str.length > 1)) {
                    words.push(str.toLowerCase());
                }
            });
        }
        this.displayList.forEach((d: { text: string; city: string; sentiment: number; }, i: number) => {
            let origin: string = $(this.refs[`bbs_text${ i }`] as any).html();
            if (!origin) {
                return;
            }

            if (this.state.filter !== '*') {
                let box: Array<string> = [];
                const tb: Array<string> = origin.split(/[ |,|.|;|:|(|)|[|\]|?|!|ì]/);
                for (let m: number = 0; m < tb.length; m++) {
                    const t: string = tb[m];
                    for (let i: number = 0; i < words.length; i++) {
                        if (words[i][words[i].length - 1] === '-') {
                            if (t.toLowerCase().startsWith(words[i].substring(0, words[i].length - 1))) {
                                let flag: boolean = false;
                                for (let s: number = 0; s < box.length; s++) {
                                    if (box[s] === t) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    box.push(t);
                                }
                            }
                        }
                        else {
                            if (t.toLowerCase() === words[i]) {
                                let flag: boolean = false;
                                for (let s: number = 0; s < box.length; s++) {
                                    if (box[s] === t) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    box.push(t);
                                }
                            }
                        }
                    }
                }
                for (let j: number = 0; j < box.length; j++) {
                    origin = origin.replace(box[j], "?" + box[j]);
                }
            }

            let rich: string = "";
            let space: 'none' | 'at' | 'sharp' | 'found' = 'none';
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
                    else if (origin[j] === "?") {
                        space = 'found';
                        rich += `<span style='color: ${ Color.Nippon.Karakurenai };`
                                + `background: ${ Color.Nippon.Touou }80;'>`;
                        tab++;
                    }
                }
                else if (origin[j] === " ") {
                    if (space === 'at') {
                        rich += "</u></span>";
                        tab--;
                    }
                    else if (space === 'sharp' || space === 'found') {
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
                    else if (space === 'sharp' || space === 'found') {
                        rich += "</span>";
                        tab--;
                    }
                    space = "none";
                }
            }
            if (tab === 0) {
                $(this.refs[`bbs_text${ i }`] as any).html(rich.replace("?", ""));
            }
        });
        $(this.refs["container"]).animate({
            scrollTop: 0
        }, 800);
    }

    public import(list: Array<{ text: string; city: string; sentiment: number; }>): void {
        this.setState({
            list: list
        });
    }

    private hide(name: string): string {
        let paras: Array<string> = name.split(' ');
        let hidden: string = paras[0][0] + "x";
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
