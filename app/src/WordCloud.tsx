/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-18 21:07:22 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-18 21:12:40
 */

import React, { Component } from 'react';
import $ from 'jquery';


export interface WordCloudProps {
    width: number;
    height: number;
    padding?: [ number, number, number, number ];
    style?: React.CSSProperties;
}

export interface WordCloudState {}

class WordCloud extends Component<WordCloudProps, WordCloudState, {}> {
    private words: Array<{ text: string, value: number }>;
    private svg: JQuery<HTMLElement>;
    private padding: [ number, number, number, number ];

    public constructor(props: WordCloudProps) {
        super(props);
        this.state = {};
        this.words = [];
        this.svg = $("NULL");
        this.padding = this.props.padding ? this.props.padding : [ 20, 20, 20, 20 ];
    }

    public render(): JSX.Element {
        return (
            <svg
            width={ this.props.width } height={ this.props.height } ref="svg" xmlns={`http://www.w3.org/2000/svg`}
            style={{ ...this.props.style }} />
        );
    }

    public componentDidMount(): void {
        this.svg = $(this.refs["svg"] as any);
    }

    private layout(): void {
        this.svg.html("");
        let min: number = -1;
        let max: number = -1;
        this.words.forEach((d: { text: string; value: number}) => {
            if (max === -1 || d.value > max) {
                max = d.value;
            }
            if (min === -1 || d.value < min) {
                min = d.value;
            }
        });
        this.words.forEach((d: { text: string; value: number}) => {
            let text: JQuery<HTMLElement> = $($.parseXML(
                `<text x="${ Math.random() * this.props.width }" y="${ Math.random() * this.props.height }" `
                + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `style="stroke: black; `
                    + `stroke-width: ${ 1 }px; `
                    + `font-size: ${ 16 }px; `
                    + `color: ${ 'black' };" >`
                + d.text
                + `</text>`
            ).documentElement);
            this.svg.append(text);
        });
    }

    public import(words: Array<{ text: string, value: number }>): void {
        this.words = words;
        this.layout();
    }
}


export default WordCloud;
