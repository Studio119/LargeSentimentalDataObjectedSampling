/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-02 15:53:12 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-26 21:56:05
 */

import React from 'react';
import $ from 'jquery';
import Color from '../preference/Color';
import Dragable from '../prototypes/Dragable';

/**
 * Props of Component TaskQueue.
 * @export
 * @interface TaskQueueProps
 */
export interface TaskQueueProps {}

/**
 * State of Component TaskQueue.
 * @export
 * @interface TaskQueueState
 */
export interface TaskQueueState {
    log: Array<string>;
}


/**
 * Use queue to manage file getting requests.
 * @class GetRequest
 */
class GetRequest {
    /**
     * Tells if any request is running.
     * @private
     * @static
     * @type {boolean}
     * @memberof GetRequest
     */
    private static occupied: boolean = false;

    /**
     * Queue struct to store unstarted requests.
     * @private
     * @static
     * @type {Array<GetRequest>}
     * @memberof GetRequest
     */
    private static queue: Array<GetRequest> = [];

    /**
     * URL of the file which this request linked at.
     * @readonly
     * @type {string}
     * @memberof GetRequest
     */
    public readonly url: string;

    /**
     * Callback triggered when the request successes.
     * @readonly
     * @private
     * @memberof GetRequest
     */
    private readonly success: (data: any) => void | undefined | null;

    /**
     * Sends information to print.
     * @readonly
     * @private
     * @memberof GetRequest
     */
    private readonly send: (log: string) => void | undefined | null;
    
    /**
     * Tells whether the request is healthy or time-out.
     * @private
     * @memberof GetRequest
     */
    private active: boolean;

    /**
     * Sets a timeout handler to avoid hanging on too long.
     * @private
     * @memberof GetRequest
     */
    private timer: NodeJS.Timeout;

    /**
     * Creates an instance of GetRequest.
     * @param {string} url URL of the file which this request linked at.
     * @param {((data: any) => (void | undefined | null))} success Callback triggered when the request successes.
     * @param {((log: string) => (void | undefined | null))} send Sends information to print.
     * @memberof GetRequest
     */
    public constructor(url: string, success: (data: any) => (void | undefined | null), send: (log: string) => (void | undefined | null)) {
        this.url = url;
        this.success = success;
        this.send = send;
        this.active = true;
        this.timer = setTimeout(() => {}, 0);
        if (!GetRequest.occupied) {
            this.run();
        }
        else {
            GetRequest.queue.push(this);
        }
    }

    /**
     * Activates the file request.
     * @memberof GetRequest
     */
    public run(): void {
        GetRequest.occupied = true;
        this.send(`Start loading file @url${ this.url }:!...`);
        if (this.url.endsWith('.json')) {
            this.timer = setTimeout(() => {
                this.active = false;
                this.send(`@errRunTimeError:! URL: @url${ this.url }:!`);
                this.send("@r:!");
                this.success(undefined);
                GetRequest.occupied = false;
                GetRequest.next();
            }, 2000);
            $.getJSON(this.url, (data: any) => {
                if (!this.active) {
                    return;
                }
                clearTimeout(this.timer);
                this.send(`File @url${ this.url }:! loaded successfully.`);
                this.send("@r:!");
                this.success(data);
                GetRequest.occupied = false;
                GetRequest.next();
            });
        }
        else if (this.url.endsWith('.csv')) {
            this.timer = setTimeout(() => {
                this.active = false;
                this.send(`@errRunTimeError:! URL: @url${ this.url }:!`);
                this.send("@r:!");
                this.success(undefined);
                GetRequest.occupied = false;
                GetRequest.next();
            }, 2000);
            $.get(this.url, (data: any) => {
                if (!this.active) {
                    return;
                }
                clearTimeout(this.timer);
                this.send(`Parsing character stream from @url${ this.url }:! to JavaScript object...`);
                let dataset: Array<{[key: string]: string}> = [];
                let labelset: Array<string> = [];
                try {
                    let arrs: Array<string> = data.split('\r\n');
                    arrs.forEach((arr: string, index: number) => {
                        let info: Array<string> = arr.split(',');
                        if (index === 0) {
                            labelset = info;
                            return;
                        }
                        let d: {[key: string]: string} = {};
                        if (info.length !== labelset.length) {
                            return;
                        }
                        info.forEach((value: string, index: number) => {
                            d[labelset[index]] = value;
                        });
                        dataset.push(d);
                    });
                    this.send(`File @url${ this.url }:! loaded successfully.`);
                    this.send("@r:!");
                    this.success(dataset);
                    GetRequest.occupied = false;
                    GetRequest.next();
                } catch (error) {
                    this.active = false;
                    this.send('@errTypeError:!: Failed to parse @url' + this.url + ':!.');
                    this.send("@r:!");
                    this.success(undefined);
                    GetRequest.occupied = false;
                    GetRequest.next();
                    return;
                }
            });
        }
        else {
            this.timer = setTimeout(() => {
                this.active = false;
                this.send(`@errRunTimeError:! URL: @url${ this.url }:!`);
                this.success(undefined);
                GetRequest.occupied = false;
                GetRequest.next();
            }, 2000);
            $.get(this.url, (data: any) => {
                if (!this.active) {
                    return;
                }
                clearTimeout(this.timer);
                this.send(`File @url${ this.url }:! loaded successfully.`);
                this.success(data);
                GetRequest.occupied = false;
                GetRequest.next();
            });
        }
    }

    /**
     * Starts next request in the queue.
     * @private
     * @static
     * @memberof GetRequest
     */
    private static next(): void {
        if (GetRequest.queue.length > 0) {
            let q: Array<GetRequest> = [];
            GetRequest.queue.forEach((req: GetRequest, index: number) => {
                if (index === 0) {
                    req.run();
                }
                else {
                    q.push(req);
                }
            });
            GetRequest.queue = q;
        }
    }
}


export const Window: any = window;


/**
 * Provides a visible component as an abstract level beyond file reading requests.
 * Switch it on or off by typing key Q.
 * @class TaskQueue
 * @extends {Dragable<TaskQueueProps, TaskQueueState, {}>} This component is draggable.
 */
class TaskQueue extends Dragable<TaskQueueProps, TaskQueueState, {}> {
    /**
     * Avoids calling the switching too often.
     * @private
     * @type {boolean}
     * @memberof TaskQueue
     */
    private debounce: boolean;

    /**
     * Checks if there's already an instance of TaskQueue object.
     * @private
     * @static
     * @type {boolean}
     * @memberof TaskQueue
     */
    private static instance: boolean = false;

    /**
     * The dictionary struct to manage the files.
     * @private
     * @static
     * @type {{ [key: string]: any; }}
     * @memberof TaskQueue
     */
    private static files: { [key: string]: any; } = {};

    /**
     * Creates an instance of TaskQueue.
     * @param {TaskQueueProps} props
     * @memberof TaskQueue
     */
    public constructor(props: TaskQueueProps) {
        super(props);
        this.state = {
            log: []
        };
        this.debounce = false;
        if (TaskQueue.instance) {
            console.error("TaskQueue is constructed more than once, which is not suggested.");
        }
        TaskQueue.instance = true;
    }

    public render(): JSX.Element {
        return (
            <div id="TaskQueue" ref="drag:target"
            style={{
                width: '600px',
                borderRight: `2px solid ${ Color.Nippon.Kuroturubami }80`,
                borderBottom: `2px solid ${ Color.Nippon.Kuroturubami }80`,
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 10000
            }}>
                <div ref="drag:trigger" key="head"
                style={{
                    background: Color.Nippon.Aonibi,
                    width: '100%',
                    fontSize: '16px',
                    textAlign: 'left',
                    color: Color.Nippon.Gohunn
                }}>
                    <header
                    style={{
                        padding: '8px 36px',
                        fontFamily: 'monospace'
                    }} >
                        task queue
                    </header>
                </div>
                <div key="list"
                style={{
                    height: '260px',
                    overflow: 'hidden',
                    background: Color.linearGradient([
                        Color.Nippon.Aisumitya + 'f6',
                        Color.Nippon.Sumi + 'f6',
                        Color.Nippon.Ro + 'f6'
                    ]),
                    fontFamily: 'monospace',
                    color: Color.Nippon.Gohunn,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '1.16px',
                    textAlign: 'left',
                    paddingTop: '6px',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    userSelect: 'none'
                }}
                onDragStart={
                    () => false
                } >
                    <div ref="paper" key="left"
                    style={{
                        minHeight: '20px',
                        position: 'relative',
                        top: '0px',
                        wordBreak: 'break-all',
                        display: 'inline-block',
                        width: '580px',
                        marginRight: '-20px'
                    }} >
                        {
                            this.state.log.map((d: string, index: number) => {
                                return (
                                    d === "@r:!"
                                        ? index < this.state.log.length - 1
                                            ?   <br key={ index } ref={ `log_${ index }` }
                                                style={{
                                                    margin: '0px',
                                                    padding: '0% 2%',
                                                    fontSize: '14px',
                                                    lineHeight: '20px'
                                                }} />
                                            :   []
                                        :   <p key={ index } ref={ `log_${ index }` }
                                            style={{
                                                margin: '0px',
                                                padding: '0% 2%',
                                                fontSize: '14px',
                                                lineHeight: '20px',
                                                letterSpacing: '1.16px',
                                                fontFamily: 'monospace'
                                            }} >
                                                { d }
                                            </p>
                                );
                            })
                        }
                    </div>
                    <div ref="bar" key="right"
                    style={{
                        float: 'right',
                        height: '256px',
                        padding: '0px 10px'
                    }}
                    onMouseEnter={
                        () => {
                            $(this.refs["handler"])
                                .animate({
                                    opacity: 0.4
                                }, 100);
                        }
                    }
                    onMouseLeave={
                        () => {
                            $(this.refs["handler"])
                                .animate({
                                    opacity: 0.1
                                }, 100);
                        }
                    } >
                        <div ref="handler"
                        style={{
                            width: 17,
                            height: 256,
                            background: Color.Nippon.Gohunn,
                            opacity: 0.1
                        }} />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Adds text preference.
     * @memberof TaskQueue
     */
    public componentDidUpdate(): void {
        this.state.log.forEach((text: string, index: number) => {
            let rich: string
            = text.replace("@url", `<span style="color: ${ Color.Nippon.Ukonn }; text-decoration: underline;">`)
                .replace("@err", `<span style="color: ${ Color.Nippon.Syozyohi };">`)
                .replace(":!", "</span>");
            $(this.refs[`log_${ index }`]).html(rich);
        });
    }

    public dragableComponentDidMount(): void {
        // $(this.refs["drag:target"]).hide();
        $('html').keydown((event: JQuery.KeyDownEvent<HTMLElement, null, HTMLElement, HTMLElement>) => {
            if (this.debounce) {
                return;
            }
            this.debounce = true;
            if (event.which === 81) /* Q */ {
                if ($(this.refs["drag:target"]).css("display") === "none") {
                    $(this.refs["drag:target"])
                        .css('opacity', 0)
                        .show()
                        .animate({
                            opacity: 1,
                            width: 601.6,
                            height: 300.4,
                            top: $(this.refs["drag:target"]).attr('_y'),
                            left: $(this.refs["drag:target"]).attr('_x')
                        }, 200);
                }
                else {
                    $(this.refs["drag:target"])
                        .css('opacity', 1)
                        .attr('_x', $(this.refs["drag:target"]).css('left'))
                        .attr('_y', $(this.refs["drag:target"]).css('top'))
                        .animate({
                            opacity: 0,
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0
                        }, 200, () => {
                            $(this.refs["drag:target"]).hide();
                        });
                }
            }
        })
        .keyup(() => {
            this.debounce = false;
        })
        .keydown((event: JQuery.KeyDownEvent<HTMLElement, null, HTMLElement, HTMLElement>) => {
            if ($(this.refs["drag:target"]).css("display") === "none") {
                return;
            }
            if (event.which === 38) /* up */ {
                let cur: number = parseInt($(this.refs["paper"]).css("top")!) + 3;
                cur = cur > -2 ? -2 : cur;
                $(this.refs["paper"]).css("top", cur + "px");
            }
            else if (event.which === 40) /* down */ {
                let cur: number = parseInt($(this.refs["paper"]).css("top")!) - 3;
                cur = cur < -1 * (($(this.refs["paper"])).outerHeight()! - 15)
                    ? -1 * (($(this.refs["paper"])).outerHeight()! - 15)
                    : cur;
                $(this.refs["paper"]).css("top", cur + "px");
            }
        });
        Window.open = this.open.bind(this);
    }

    /**
     * Adds a log as a new line.
     * @private
     * @param {string} text Content of the log.
     * @memberof TaskQueue
     */
    private print(text: string): void {
        let log: Array<string> = this.state.log;
        log.push(text);
        this.setState({
            log: log
        });
        if (($(this.refs["paper"])).outerHeight()! > 260) {
            let cur: number = -1 * (($(this.refs["paper"])).outerHeight()! - 260);
            $(this.refs["paper"]).css("top", cur + "px");
        }
    }

    /**
     * Opens a file.
     * This object will bind an "open" attribute which is a reference of this function on object window.
     * @param {string} url The path of the file.
     * @param {((jsondata: any) => void | undefined | null)} [success] Callback called when the request success.
     * @returns {void}
     * @memberof TaskQueue
     */
    public open(url: string, success?: (jsondata: any) => void | undefined | null): void {
        if (TaskQueue.files[url] === "REQUEST_NOW_WAITING_IN_THE_QUEUE") {
            return;
        }
        else if (TaskQueue.files[url] !== undefined) {
            this.print(`Data from file @url${ url }:! already loaded.`);
            return;
        }
        else {
            TaskQueue.files[url] = "REQUEST_NOW_WAITING_IN_THE_QUEUE";
            new GetRequest(url, (data: any) => {
                TaskQueue.files[url] = data;
                if (success && data) {
                    success(data);
                }
            }, (log: string) => {
                this.print(log);
            });
            return;
        }
    }
}


export default TaskQueue;
