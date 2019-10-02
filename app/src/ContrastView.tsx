/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 18:41:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-02 21:36:23
 */
import React, { Component } from 'react';

export interface ContrastViewProps {
    id: string
}

export interface RectNode {
    attr?: { x: number, y: number, width: number, height: number };
    level: number;
    path: Array< 'root' | 'left' | 'right' >;
    leftChild: RectNode | null;
    rightChild: RectNode | null;
}

export interface ContrastViewState extends RectNode {}

class ContrastView extends Component<ContrastViewProps, ContrastViewState, {}> {
    // priva
    public constructor(props: ContrastViewProps) {
        super(props);
        this.state = {
            attr: {
                x: 0,
                y: 0,
                width: 523,
                height: 306
            },
            level: 0,
            path: [ 'root' ],
            leftChild: null,
            rightChild: null
        };
    }

    public render(): JSX.Element {
        return (
            <div id={ this.props.id }
                style={{
                    display: 'inline-block',
                    height: '100%',
                    width: '475px',
                    paddingTop: '1px',
                    background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                    border: '1px solid black'
                }}>
                <svg width="100%" height="100%" id={ this.props.id + '_svg' } />
            </div>
        );
    }

    public componentDidUpdate(): void {
        this.draw(this.state);
    }

    private draw(node: RectNode): void {
        // TODO
        if (node.leftChild) {
            this.draw(node.leftChild);
        }
        if (node.rightChild) {
            this.draw(node.rightChild);
        }
    }
}

export default ContrastView;
