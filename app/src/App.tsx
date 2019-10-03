/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-04 01:04:58
 */
import React, { Component } from 'react';
import './App.css';
import ItemStrip from './ItemStrip';
import MapView from './MapView';
import DataView from './DataView';
import Settings from './Settings';
import ContrastView, { RectNode } from './ContrastView';
import DataCenter from './DataCenter';


export interface TreeNode {
  data: [number, number, number, number];
  left?: TreeNode;
  right?: TreeNode;
}

class App extends Component<{}, {}, {}> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <DataCenter ref="DataCenter"/>
        <ItemStrip id="ItemStrip" importSource={ this.loadSource } />
        <DataView id="MapSettings" ref="DataView" />
        <Settings id="ActiveSettings" />
        <MapView id="MapView" ref="map" center={ [-100, 38] } zoom={ 3.2 } minZoom={ 3.2 } maxZoom={ 5 } />
        <div className="Chart"
          style={{
            position: 'absolute',
            width: '422px',
            top: '67px',
            left: '1112px',
            height: '796px',
            background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 1.3%, rgb(227, 227, 229) 97.7%, rgb(135, 137, 142))',
            border: '1px solid black'
          }} />
        <div className="Line"
          style={{
            position: 'absolute',
            top: '556px',
            height: '306px',
            width: '1111px'
          }}>
          <ContrastView id="ContrastView" ref="RectTree" displayLevels={ 3 } />
          <div
            style={{
                display: 'inline-block',
                height: '100%',
                width: '629px',
                marginLeft: '0.12%',
                background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
                border: '1px solid black'
            }}>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    this.loadSource = (url: string, json: string) => {
      (this.refs["DataCenter"] as DataCenter).openCSV(url, (data: Array<{ id: string, lng: string, lat: string, words: string, day: string, city: string, sentiment: string }>) => {
        let dataset: Array<{
          id: string, lng: number, lat: number, words: string,
          day: string, city: string, sentiment: string}> = [];
        let active: number = 0;
        let positive: number = 0;
        let neutre: number = 0;
        let A_active: number = 0;
        let A_positive: number = 0;
        let A_neutre: number = 0;
        data.forEach((d: { id: string, lng: string, lat: string, words: string, day: string, city: string, sentiment: string }) => {
          if (parseFloat(d.sentiment) > 0) {
            active++;
            A_active += parseFloat(d.sentiment);
          }
          else if (parseFloat(d.sentiment) < 0) {
            positive++;
            A_positive += parseFloat(d.sentiment);
          }
          else {
            neutre++;
            A_neutre += parseFloat(d.sentiment);
          }
          dataset.push({ ...d, lat: parseFloat(d.lat), lng: parseFloat(d.lng) });
        });
        (this.refs["DataView"] as DataView).load(dataset.length, active, positive, neutre, A_active / active, A_positive / positive, A_neutre / neutre);
        (this.refs["map"] as MapView).setState({
          data: dataset
        });
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(json, (data: TreeNode) => {
        let dataset: RectNode = this.loadTree(data, null, 'left');
        (this.refs["RectTree"] as ContrastView).import(dataset);
      });
    }
  }

  private loadTree(data: TreeNode, parent: RectNode | null, side: 'left' | 'right'): RectNode {
    let node: RectNode = {
      attr: { x: data.data[0], y: data.data[1], width: data.data[2] - data.data[0], height: data.data[3] - data.data[1] },
      level: 0,
      path: parent ? [ ...parent.path, side ] : [ 'root' ],
      parent: parent,
      leftChild: null,
      rightChild: null
    };
    if (data.left) {
      node.leftChild = this.loadTree(data.left, node, 'left');
    }
    if (data.right) {
      node.rightChild = this.loadTree(data.right, node, 'right');
    }

    return node;
  }

  private loadSource: (url: string, json: string) => void
    = (url: string, json: string) => {
      setTimeout(() => this.loadSource(url, json), 1000);
    };
}


export default App;
