/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-18 21:07:22 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-19 23:20:01
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
    private color: Array<string>;

    public constructor(props: WordCloudProps) {
        super(props);
        this.state = {};
        this.words = [];
        this.svg = $("NULL");
        this.padding = this.props.padding ? this.props.padding : [ 10, 10, 10, 10 ];
        this.color = [
            'rgb(100,54,60)', 'rgb(181,73,91)', 'rgb(204,84,58)', 'rgb(114,72,50)',
            'rgb(240,94,28)', 'rgb(143,90,60)', 'rgb(148,122,109)', 'rgb(155,110,35)',
            'rgb(209,152,38)', 'rgb(108,96,36)', 'rgb(108,106,45)', 'rgb(91,98,46)',
            'rgb(66,96,45)', 'rgb(27,129,62)', 'rgb(32,96,79)', 'rgb(12,72,66)',
            'rgb(8,25,45)', 'rgb(33,30,85)', 'rgb(102,50,124)', 'rgb(98,41,84)'
        ];
    }

    public render(): JSX.Element {
        return (
            <svg
            width={ this.props.width } height={ this.props.height * 3 } ref="svg" xmlns={`http://www.w3.org/2000/svg`}
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
        let standardSize: number = this.props.height / this.words.length;
        this.words.forEach((d: { text: string; value: number}) => {
            if (max === -1 || d.value > max) {
                max = d.value;
            }
            if (min === -1 || d.value < min) {
                min = d.value;
            }
        });
        let store: Array<{ ref: JQuery<HTMLElement>; width: number; height: number; }> = [];
        this.words.forEach((d: { text: string; value: number}, index: number) => {
            let rate: number = Math.sqrt((d.value - min) / (max - min));
            let text: JQuery<HTMLElement> = $($.parseXML(
                `<text x="${ Math.random() * this.props.width }" y="${ Math.random() * this.props.height }" `
                + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                + `text-anchor="middle" `
                + `style="stroke: ${ this.color[index % this.color.length] }; `
                    + `opacity: 0.2; `
                    + `stroke-width: ${ standardSize / 6 * rate }px; `
                    + `font-size: ${ standardSize + 2 * standardSize * rate }px; `
                    + `fill: ${ this.color[index % this.color.length] };" >`
                + d.text
                + `</text>`
            ).documentElement);
            this.svg.append(text);
            store.push({
                ref: text,
                width: text.get()[0].getBoundingClientRect().width,
                height: text.get()[0].getBoundingClientRect().height
            });
        });
        this.scanIn(store, []);
    }

    private scanIn(store: Array<{ ref: JQuery<HTMLElement>; width: number; height: number; }>,
        occupied: Array<{ y: number; width: number; height: number }>): void {
        if (store.length === 0) {
            // $('.BOUNDING').remove();
            return;
        }
        let newStore: Array<{ ref: JQuery<HTMLElement>; width: number; height: number; used: boolean }> = [];
        store.forEach((d: { ref: JQuery<HTMLElement>; width: number; height: number; }) => {
            newStore.push({ ...d, used: false });
        });
        let temp: { ref: JQuery<HTMLElement>; width: number; height: number; } = store.pop()!;
        let tempWidth: number = temp.width * 1.05;
        let tempHeight: number = temp.height * 0.9;
        occupied.forEach((line: { y: number; width: number; height: number; }) => {
            for (let y: number = line.y; y + tempHeight / 1.05 < this.props.height - this.padding[2]; y += tempHeight / 1.2) {
                let x: number = -1;
                for (x = line.width; x + tempWidth / 1.05 < this.props.width - this.padding[1]; x += tempWidth) {
                    // let bounding: JQuery<HTMLElement> = $($.parseXML(
                    //     `<rect x="${ x }" y="${ y }" `
                    //     + `class="BOUNDING" `
                    //     + `width="${ tempWidth }" height="${ tempHeight }" `
                    //     + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                    //     + `style="stroke: blue; `
                    //         + `stroke-width: 2px; `
                    //         + `fill: none;" />`
                    // ).documentElement);
                    // this.svg.append(bounding);
                    // setTimeout(() => {
                    //     bounding.remove();
                    // }, 1800);
                    for (let i: number = 0; i < newStore.length; i++) {
                        if (newStore[i].used) {
                            continue;
                        }
                        if (newStore[i].width <= tempWidth && newStore[i].height <= tempHeight * 1.5
                        && newStore[i].width >= tempWidth / 5 * 4 && newStore[i].height >= tempHeight * 0.8) {
                            line.width = x + tempWidth;
                            newStore[i].used = true;
                            newStore[i].ref
                                .attr('x', x + newStore[i].width / 2 + Math.random() * (tempWidth - newStore[i].width))
                                .attr('y', y + newStore[i].height / 2 + Math.random() * (tempHeight / 0.7 - newStore[i].height))
                                .css('opacity', '1');
                            // this.svg.append(bounding);
                            break;
                        }
                    }
                }
                // let bounding: JQuery<HTMLElement> = $($.parseXML(
                //     `<rect x="${ x }" y="${ y }" `
                //     + `class="BOUNDING" `
                //     + `width="${ (this.props.width - this.padding[1] - x) }" height="${ tempHeight }" `
                //     + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                //     + `style="stroke: blue; `
                //         + `stroke-width: 2px; `
                //         + `fill: none;" />`
                // ).documentElement);
                // this.svg.append(bounding);
                // setTimeout(() => {
                //     bounding.remove();
                // }, 1800);
                for (let i: number = 0; i < newStore.length; i++) {
                    if (newStore[i].used) {
                        continue;
                    }
                    if (newStore[i].width <= (this.props.width - this.padding[1] - x) && newStore[i].height <= tempHeight * 1.5
                    && newStore[i].width >= (this.props.width - this.padding[1] - x) / 5 * 4 && newStore[i].height >= tempHeight * 0.8) {
                        line.width = x + (this.props.width - this.padding[1] - x);
                        newStore[i].used = true;
                        newStore[i].ref
                            .attr('x', x + newStore[i].width / 2 + Math.random() * ((this.props.width - this.padding[1] - x) - newStore[i].width))
                            .attr('y', y + newStore[i].height / 2 + Math.random() * (tempHeight / 0.7 - newStore[i].height))
                            .css('opacity', '1');
                        line.y += newStore[i].height * 0.9;
                        line.height -= newStore[i].height * 0.9;
                        break;
                    }
                }
            }
        });
        let entry: boolean = false;
        for (let y: number =
            occupied.length === 0 ? this.padding[0]
            : occupied[occupied.length - 1].y + occupied[occupied.length - 1].height;
        y + tempHeight < this.props.height - this.padding[2]; y += tempHeight) {
            let flag: number = -1;
            for (let x: number = this.padding[3];
            x + tempWidth < this.props.width - this.padding[1];
            x += tempWidth) {
                entry = true;
                // let bounding: JQuery<HTMLElement> = $($.parseXML(
                //     `<rect x="${ x }" y="${ y }" `
                //     + `class="BOUNDING" `
                //     + `width="${ tempWidth }" height="${ tempHeight }" `
                //     + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                //     + `style="stroke: red; `
                //         + `stroke-width: 2px; `
                //         + `fill: none;" />`
                // ).documentElement);
                for (let i: number = 0; i < newStore.length; i++) {
                    if (newStore[i].used) {
                        continue;
                    }
                    if (newStore[i].width <= tempWidth && newStore[i].height <= tempHeight * 1.5
                    && newStore[i].width >= tempWidth / 5 * 4 && newStore[i].height >= tempHeight) {
                        flag = x + tempWidth;
                        newStore[i].used = true;
                        newStore[i].ref
                            .attr('x', x + newStore[i].width / 2 + Math.random() * (tempWidth - newStore[i].width))
                            .attr('y', y + newStore[i].height / 2 + Math.random() * (tempHeight / 0.7 - newStore[i].height))
                            .css('opacity', '1');
                        // this.svg.append(bounding);
                        break;
                    }
                }
            }
            if (flag !== -1) {
                occupied.push({ y: y, width: flag, height: tempHeight });
            }
        }
        if (!entry) {
            let y: number =
                occupied.length === 0 ? this.padding[0]
                : occupied[occupied.length - 1].y + occupied[occupied.length - 1].height
            
            let flag: number = -1;
            for (let x: number = this.padding[3];
            x + tempWidth < this.props.width - this.padding[1];
            x += tempWidth) {
                entry = true;
                // let bounding: JQuery<HTMLElement> = $($.parseXML(
                //     `<rect x="${ x }" y="${ y }" `
                //     + `class="BOUNDING" `
                //     + `width="${ tempWidth }" height="${ tempHeight }" `
                //     + `xmlns="http://www.w3.org/2000/svg" version="1.0" `
                //     + `style="stroke: red; `
                //         + `stroke-width: 2px; `
                //         + `fill: none;" />`
                // ).documentElement);
                for (let i: number = 0; i < newStore.length; i++) {
                    if (newStore[i].used) {
                        continue;
                    }
                    if (newStore[i].width <= tempWidth && newStore[i].height <= tempHeight * 1.5
                    && newStore[i].width >= tempWidth / 5 * 4 && newStore[i].height >= tempHeight) {
                        flag = x + tempWidth;
                        newStore[i].used = true;
                        newStore[i].ref
                            .attr('x', x + newStore[i].width / 2 + Math.random() * (tempWidth - newStore[i].width))
                            .attr('y', y + newStore[i].height / 2 + Math.random() * (tempHeight / 0.7 - newStore[i].height))
                            .css('opacity', '1');
                        // this.svg.append(bounding);
                        break;
                    }
                }
            }
            if (flag !== -1) {
                occupied.push({ y: y, width: flag, height: tempHeight });
            }
        }
        store = [];
        newStore.forEach((d: { ref: JQuery<HTMLElement>; width: number; height: number; used: boolean }) => {
            if (!d.used) {
                store.push({ ref: d.ref, width: d.width, height: d.height });
            }
        });
        setTimeout(() => {
            this.scanIn(store, occupied);
        });
    }

    public import(words: Array<{ text: string, value: number }>): void {
        this.words = words;
        this.layout();
    }
}


export default WordCloud;
