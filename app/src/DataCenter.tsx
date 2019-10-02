/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-02 15:53:12 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-02 21:44:55
 */

import React, { Component } from 'react';
import $ from 'jquery';


export interface DataCenterProps {}

export interface DataCenterState {
    tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }>;
}

export class FileInfo {
    public readonly url: string;
    public readonly type: 'csv';
    public readonly data: any;

    public constructor(url: string, type: 'csv', data: any) {
        this.url = url;
        this.type = type;
        this.data = data;
    }
}

class DataCenter extends Component<DataCenterProps, DataCenterState, {}> {
    private didRead: Array<FileInfo>;
    private debounce: boolean = false;

    public constructor(props: DataCenterProps) {
        super(props);
        this.state = {
            tasks: []
        };
        this.didRead = [];
    }

    public render(): JSX.Element {
        return (
            <div id="DataCenter" ref="DataCenter"
            style={{
                width: '600px',
                minHeight: '60px',
                paddingBottom: '20px',
                background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 18%, rgb(192, 193, 196) 80%, rgb(147, 149, 154) 93%, #282c34)',
                border: '1px solid black',
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 10000
            }}>
                <div
                style={{
                    paddingTop: '8px',
                    borderBottom: '1px solid black',
                    background: 'linear-gradient(to bottom, rgb(120, 122, 126), #eeeeee 2%, rgb(182, 182, 184) 94%, rgb(108, 110, 114))',
                    width: '100%',
                    height: '30px'
                }}>
                    <header>TASK QUEUE</header>
                </div>
                <table
                style={{
                    width: '100%'
                }}>
                    <tbody>
                        <tr key={ `taskheader` }
                        style={{
                            width: '100%',
                            height: '36px'
                        }}>
                            <td key={ `taskheader_label1`} style={{ width: '40%' }} >file path</td>
                            <td key={ `taskheader_label2`} style={{ width: '30%' }} >state</td>
                            <td key={ `taskheader_label3`} style={{ width: '30%' }} >size</td>
                        </tr>
                        {
                            this.state.tasks.length === 0
                                ?
                            <tr key={ `task_null` }
                            style={{
                                width: '100%'
                            }}>
                                <td key={ `task_null_text1`} style={{ width: '40%' }} >Nothing in the queue</td>
                                <td key={ `task_null_text2`} style={{ width: '30%' }} >...</td>
                                <td key={ `task_null_text3`} style={{ width: '30%' }} >...</td>
                            </tr>
                                :
                            this.state.tasks.map((task: { url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }, index: number) => {
                                return (
                                    <tr key={ `task${ index }` }
                                    style={{
                                        width: '100%'
                                    }}>
                                        <td key={ `task${ index }_text1`} style={{ width: '40%' }} >{ task.url }</td>
                                        <td key={ `task${ index }_text2`}
                                        style={{
                                            width: '30%',
                                            color: task.state === 'failed' ? 'rgb(215,0,34)' : task.state === 'successed' ? 'rgb(78,187,124)' : task.state === 'reading' ? 'rgb(195,96,45)' : 'rgb(86,156,178)'
                                        }} >
                                            { task.state }
                                        </td>
                                        <td key={ `task${ index }_text3`} style={{ width: '30%' }} >{ task.size }</td>
                                    </tr>
                                );
                            })
                        }   
                    </tbody>
                </table>
            </div>
        );
    }

    public componentDidMount(): void {
        // $(this.refs["DataCenter"]).hide();
        $('*').keydown((event: JQuery.KeyDownEvent<HTMLElement, null, HTMLElement, HTMLElement>) => {
            if (this.debounce) {
                return;
            }
            this.debounce = true;
            if (event.which === 81) {
                if ($(this.refs["DataCenter"]).css("display") === "none") {
                    $(this.refs["DataCenter"]).show();
                }
                else {
                    $(this.refs["DataCenter"]).hide();
                }
            }
        })
        .keyup(() => {
            this.debounce = false;
        });
    }

    public openCSV(url: string, success?: (jsondata: any) => void | undefined | null,
            labels: 'loadFromHead' | Array<string> = 'loadFromHead'): void {
        for (let i: number = this.didRead.length - 1; i >= 0; i--) {
            if (this.didRead[i].url === url) {
                if (success) {
                    success(this.didRead[i].data);
                }
                return;
            }
        }
        let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
        tasks.push({ url: url, state: 'reading', size: 0 });
        this.setState({
            tasks: tasks
        });
        $.get(url, (file: string) => {
            if (file.startsWith("<!DOCTYPE html>")) {
                console.error(`Can't find file "${ url }"`);
                let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
                for (let i: number = tasks.length - 1; i >= 0; i--) {
                    if (tasks[i].url === url) {
                        tasks[i].state = 'failed';
                        break;
                    }
                }
                this.setState({
                    tasks: tasks
                });
                return;
            }
            let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
            for (let i: number = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].url === url) {
                    tasks[i].state = 'parsing';
                    tasks[i].size = file.length;
                    break;
                }
            }
            this.setState({
                tasks: tasks
            });
            if (url.endsWith('csv')) {
                let dataset: Array<object> = [];
                let labelset: Array<string> = [];
                try {
                    let arrs: Array<string> = file.split('\r\n');
                    arrs.forEach((arr: string, index: number) => {
                        let info: Array<string> = arr.split(',');
                        if (index === 0) {
                            if (labels === 'loadFromHead') {
                                labelset = info;
                            }
                            else {
                                labelset = labels;
                            }
                            return;
                        }
                        let d: any = {};
                        if (info.length !== labelset.length) {
                            return;
                        }
                        info.forEach((value: string, index: number) => {
                            d[labelset[index]] = value;
                        });
                        dataset.push(d);
                    });
                } catch (error) {
                    let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
                    for (let i: number = tasks.length - 1; i >= 0; i--) {
                        if (tasks[i].url === url) {
                            tasks[i].state = 'failed';
                            break;
                        }
                    }
                    this.setState({
                        tasks: tasks
                    });
                    console.error(`Can't parse data from file '${ url }' into json`);
                    return;
                }
                this.didRead.push(new FileInfo(url, 'csv', dataset));
                let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
                for (let i: number = tasks.length - 1; i >= 0; i--) {
                    if (tasks[i].url === url) {
                        tasks[i].state = 'successed';
                        break;
                    }
                }
                this.setState({
                    tasks: tasks
                });
                if (success) {
                    success(dataset);
                }
            }
            else {
                console.warn(`Loaded file '${ url }' is not valid csv file! `);
            }
        });
    }

    public openCSV_nostoring(url: string, success?: (jsondata: any) => void | undefined | null,
            labels: 'loadFromHead' | Array<string> = 'loadFromHead'): void {
        for (let i: number = this.didRead.length - 1; i >= 0; i--) {
            if (this.didRead[i].url === url) {
                if (success) {
                    success(this.didRead[i].data);
                }
                return;
            }
        }
        let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
        tasks.push({ url: url, state: 'reading', size: 0 });
        this.setState({
            tasks: tasks
        });
        $.get(url, (file: string) => {
            let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
            for (let i: number = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].url === url) {
                    tasks[i].state = 'parsing';
                    tasks[i].size = file.length;
                    break;
                }
            }
            this.setState({
                tasks: tasks
            });
            if (url.endsWith('csv')) {
                let dataset: Array<object> = [];
                let labelset: Array<string> = [];
                try {
                    let arrs: Array<string> = file.split('\r\n');
                    arrs.forEach((arr: string, index: number) => {
                        let info: Array<string> = arr.split(',');
                        if (index === 0) {
                            if (labels === 'loadFromHead') {
                                labelset = info;
                            }
                            else {
                                labelset = labels;
                            }
                            return;
                        }
                        let d: any = {};
                        info.forEach((value: string, index: number) => {
                            d[labelset[index]] = value;
                        });
                        dataset.push(d);
                    });
                } catch (error) {
                    let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
                    for (let i: number = tasks.length - 1; i >= 0; i--) {
                        if (tasks[i].url === url) {
                            tasks[i].state = 'failed';
                            break;
                        }
                    }
                    this.setState({
                        tasks: tasks
                    });
                    console.error(`Can't parse data from file '${ url }' into json`);
                    return;
                }
                let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
                for (let i: number = tasks.length - 1; i >= 0; i--) {
                    if (tasks[i].url === url) {
                        tasks[i].state = 'successed';
                        break;
                    }
                }
                this.setState({
                    tasks: tasks
                });
                if (success) {
                    success(dataset);
                }
            }
            else {
                console.warn(`Loaded file '${ url }' is not valid csv file! `);
            }
        });
    }
}


export default DataCenter;
