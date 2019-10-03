/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-02 15:53:12 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-04 00:52:32
 */

import React, { Component } from 'react';
import $ from 'jquery';


export interface DataCenterProps {}

export interface DataCenterState {
    tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }>;
}

export class FileInfo {
    public readonly url: string;
    public readonly type: 'csv' | 'json';
    public readonly data: any;

    public constructor(url: string, type: 'csv' | 'json', data: any) {
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
                <div key="title"
                style={{
                    paddingTop: '8px',
                    borderBottom: '1px solid black',
                    background: 'linear-gradient(to bottom, rgb(120, 122, 126), #eeeeee 2%, rgb(182, 182, 184) 94%, rgb(108, 110, 114))',
                    width: '100%',
                    height: '30px'
                }}>
                    <header>TASK QUEUE</header>
                </div>
                <div key="head">
                    <table
                    style={{
                        width: '100%',
                        padding: '0px 52px 0px 10px'
                    }}>
                        <tbody>
                            <tr key={ `taskheader` }
                            style={{
                                width: '100%',
                                height: '36px'
                            }}>
                                <td key={ `taskheader_label1`} style={{ width: '36%' }} >file path</td>
                                <td key={ `taskheader_label2`} style={{ width: '20%' }} >state</td>
                                <td key={ `taskheader_label3`} style={{ width: '24%' }} >size</td>
                                <td key={ `taskheader_label4`} style={{ width: '10%' }} >print</td>
                                <td key={ `taskheader_label5`} style={{ width: '10%' }} >cancel</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div key="list"
                style={{
                    minHeight: '80px',
                    maxHeight: '200px',
                    overflowY: 'scroll'
                }}>
                    <table
                    style={{
                        width: '100%',
                        padding: '0px 30px 0px 10px'
                    }}>
                        <tbody>
                            {
                                this.state.tasks.length === 0
                                    ?
                                <tr key={ `task_null` }
                                style={{
                                    width: '100%'
                                }}>
                                    <td key={ `task_null_text1`} style={{ width: '36%' }} >Nothing in the queue</td>
                                    <td key={ `task_null_text2`} style={{ width: '20%' }} >...</td>
                                    <td key={ `task_null_text3`} style={{ width: '24%' }} >...</td>
                                    <td key={ `task_null_button1`} style={{ width: '10%' }} />
                                    <td key={ `task_null_button2`} style={{ width: '10%' }} />
                                </tr>
                                    :
                                this.state.tasks.map((task: { url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }, index: number) => {
                                    return (
                                        <tr key={ `task${ index }` }
                                        style={{
                                            width: '100%',
                                            paddingBottom: '4px'
                                        }}>
                                            <td key={ `task${ index }_text1`} style={{ width: '36%' }} >{ task.url }</td>
                                            <td key={ `task${ index }_text2`}
                                            style={{
                                                width: '20%',
                                                color: task.state === 'failed' ? 'rgb(215,0,34)' : task.state === 'successed' ? 'rgb(78,187,124)' : task.state === 'reading' ? 'rgb(195,96,45)' : 'rgb(86,156,178)'
                                            }} >
                                                { task.state }
                                            </td>
                                            <td key={ `task${ index }_text3`} style={{ width: '24%' }} >{ DataCenter.format(task.size) }</td>
                                            <td key={ `task${ index }_button1`} style={{ width: '10%' }} >
                                                <button onClick={() => {
                                                    for (let i: number = this.didRead.length - 1; i >= 0; i--) {
                                                        if (this.didRead[i].url === task.url) {
                                                            console.log({ ...this.didRead[i], size: task.size });
                                                            break;
                                                        }
                                                    }
                                                } } >print</button>
                                            </td>
                                            <td key={ `task${ index }_button2`} style={{ width: '10%' }} >
                                                <button onClick={() => this.cancel(index) } >cancel</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }   
                        </tbody>
                    </table>
                </div>
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
        setInterval(() => {
            this.setState({});
        }, 1000);
    }

    private static format(num: number): string {
        let part: string = num.toString();
        let temp: string = "";
        while (part.length > 3) {
            temp = part.substr(part.length - 3, part.length) + "," + temp;
            part = part.substr(0, part.length - 3);
        }
        temp = part + "," + temp;
        return temp.substr(0, temp.length - 1) + " B";
    }

    private cancel(index: number): void {
        let url: string = "";
        let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = [];
        this.state.tasks.forEach((task: { url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }, i: number) => {
            if (i !== index) {
                tasks.push(task);
            }
            else {
                url = task.url;
            }
        });
        this.setState({tasks});
        if (url.length === 0) {
            return;
        }
        let queue: Array<FileInfo> = [];
        this.didRead.forEach((file: FileInfo) => {
            if (file.url !== url) {
                queue.push(file);
            }
        });
        this.didRead = queue;
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
                console.error(`Can't find file "${ url }"`);
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
            if (file.startsWith("<!DOCTYPE html>")) {
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
                console.error(`Can't find file "${ url }"`);
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

    public openJSON(url: string, success?: (jsondata: any) => void | undefined | null): void {
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
        $.getJSON(url, (file: any) => {
            let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
            for (let i: number = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].url === url) {
                    tasks[i].state = 'parsing';
                    break;
                }
            }
            this.setState({
                tasks: tasks
            });
            tasks = this.state.tasks;
            for (let i: number = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].url === url) {
                    tasks[i].state = 'successed';
                    break;
                }
            }
            this.didRead.push(new FileInfo(url, 'json', file));
            this.setState({
                tasks: tasks
            });
            if (success) {
                success(file);
            }
        });
    }

    public openJSON_nostoring(url: string, success?: (jsondata: any) => void | undefined | null): void {
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
        $.getJSON(url, (file: any) => {
            let tasks: Array<{ url: string, state: 'reading' | 'parsing' | 'successed' | 'failed', size: number }> = this.state.tasks;
            for (let i: number = tasks.length - 1; i >= 0; i--) {
                if (tasks[i].url === url) {
                    tasks[i].state = 'parsing';
                    tasks[i].size = file.toString().length;
                    break;
                }
            }
            this.setState({
                tasks: tasks
            });
            tasks = this.state.tasks;
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
                success(file);
            }
        });
    }
}


export default DataCenter;
