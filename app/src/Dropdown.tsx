/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-29 15:24:57 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-03 00:48:02
 */

import React, { Component } from 'react';
import $ from 'jquery';

export interface DropdownProps<T> {
    width: number;
    height: number;
    optionList: Array<T>;
    defaultIndex?: number;
    onChange?: (option: T) => null | void | undefined;
}

export interface DropdownState<T> {
    optionList: Array<T>;
    value: number;
}

class Dropdown<T = any> extends Component<DropdownProps<T>, DropdownState<T>, {}> {
    public constructor(props: DropdownProps<T>) {
        super(props);
        this.state = {
            optionList: this.props.optionList,
            value: this.props.defaultIndex ? this.props.defaultIndex : 0
        };
    }

    public render(): JSX.Element {
        return (
            <>
                <button className="DropdownButton" key="button" ref="button"
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    background: 'rgb(218, 202, 229)',
                    border: '4px solid rgb(150, 0, 170)',
                    margin: `auto 10px`,
                    transform: 'translateY(25%)',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em'
                }}
                onMouseOver={
                    () => {
                        let button: JQuery<HTMLElement> = $((this.refs["button"] as any));
                        button.css("background", "rgb(209, 98, 212)");
                    }
                }
                onMouseOut={
                    () => {
                        let button: JQuery<HTMLElement> = $((this.refs["button"] as any));
                        button.css("background", "rgb(218, 202, 229)");
                    }
                }
                onClick={
                    () => {
                        let list: JQuery<HTMLElement> = $((this.refs["list"] as any));
                        if (list.css("display") === "none") {
                            list.show();
                        }
                        else {
                            list.hide();
                        }
                    }
                } >
                    { this.state.optionList[this.state.value] }
                </button>
                <ul key="list" ref="list" style={{ position: 'absolute', zIndex: 2000, margin: '8px 0px 0px',
                width: this.props.width, background: 'rgb(218, 202, 229)',
                padding: '2px 0px 6px', display: 'none' }} >
                    {
                        this.state.optionList.map((value: T, index: number) => {
                            return (
                                <li key={ index } ref={ `li_${index}` } style={{
                                    listStyle: this.state.value === index ? 'disclosure-closed' : 'none',
                                    padding: '4px 0px',
                                    border: 'none',
                                    WebkitUserSelect: 'none',
                                    MozUserSelect: 'none',
                                    userSelect: 'none',
                                    background: `rgb(`
                                        + `${ 183 + 53 * index / this.state.optionList.length }, `
                                        + `${ 101 + 127 * index / this.state.optionList.length }, `
                                        + `${ 199 + 45 * index / this.state.optionList.length })`
                                }}
                                onDragStart={
                                    () => void 0
                                }
                                onClick={
                                    () => {
                                        if (this.state.value === index) {
                                            return;
                                        }
                                        this.setState({
                                            value: index
                                        });
                                        if (this.props.onChange) {
                                            this.props.onChange(this.state.optionList[index]);
                                        }
                                        $((this.refs["list"] as any)).hide();
                                    }
                                }
                                onMouseEnter={
                                    () => {
                                        $(this.refs[`li_${index}`])
                                            .css("border-left", "5px solid rgb(120, 0, 136)")
                                            .css("border-right", "5px solid rgb(120, 0, 136)")
                                            .css("list-style", "inside");
                                    }
                                }
                                onMouseLeave={
                                    () => {
                                        setTimeout(() => {
                                            $(this.refs[`li_${index}`])
                                                .css("list-style", this.state.value === index ? 'disclosure-closed' : 'none')
                                                .css("border", "none");
                                        }, 60);
                                    }
                                } >
                                    { value }
                                </li>
                            )
                        })
                    }
                </ul>
            </>
        );
    }

    public componentDidMount(): void {
        let button: React.ReactInstance = this.refs["button"];
        $(this.refs["list"]).css("left", $(button).offset()!.left)
            .css("top", (button as any)["offsetTop"] + (button as any)["offsetHeight"]);
    }
}


export default Dropdown;
