/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-07 21:09:32
 */
import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import ItemStrip from './ItemStrip';
import MapView from './MapView';
import DataView from './DataView';
import Settings from './Settings';
import ContrastView, { RectNode } from './ContrastView';
import DataCenter from './DataCenter';
import TreeMap from './TreeMap';


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
        <Settings id="ActiveSettings" ref="topics" />
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
          <TreeMap id="TreeMap" ref="TreeMap" />
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    this.loadSource = (url: string, json: string, topic: string) => {
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
        (this.refs["TreeMap"] as TreeMap).import(dataset);
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(topic, (data: Array<{ topic: string, count: number }>) => {
        (this.refs["topics"] as Settings).import(data);
      });
    }
  }

  private loadTree(data: TreeNode, parent: RectNode | null, side: 'left' | 'right'): RectNode {
    let node: RectNode = {
      attr: {
        x: data.data[0] / 1000 * 475,
        y: data.data[1] / 600 * 306,
        width: (data.data[2] - data.data[0]) / 1000 * 475,
        height: (data.data[3] - data.data[1]) / 600 * 306
      },
      level: parent === null ? 0 : parent.level + 1,
      path: parent ? [ ...parent.path, side ] : [ 'root' ],
      parent: parent,
      leftChild: null,
      rightChild: null,
      ref: $("NULL")
    };
    if (data.left) {
      node.leftChild = this.loadTree(data.left, node, 'left');
    }
    if (data.right) {
      node.rightChild = this.loadTree(data.right, node, 'right');
    }

    return node;
  }

  private loadSource: (url: string, json: string, topic: string) => void
    = (url: string, json: string, topic: string) => {
      setTimeout(() => this.loadSource(url, json, topic), 1000);
    };
}


export default App;
