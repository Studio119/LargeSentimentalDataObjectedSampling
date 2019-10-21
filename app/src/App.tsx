/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-18 21:39:22
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
import PolylineChart from './PolylineChart';
import BBS from './BBS';


export interface TreeNode {
  data: [number, number, number, number];
  left?: TreeNode;
  right?: TreeNode;
  sentiment?: number;
}

class App extends Component<{}, {}, {}> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <DataCenter ref="DataCenter"/>
        <ItemStrip id="ItemStrip" importSource={ this.loadSource } />
        <DataView id="MapSettings" ref="DataView" />
        <div className="Chart"
        style={{
          position: 'absolute',
          width: '318px',
          top: '281.8px',
          left: '0px',
          height: '263.2px',
          background: 'white',
          border: '1px solid rgb(149,188,239)'
        }} >
          <div
          style={{
            height: '24px',
            width: '302px',
            borderBottom: '1px solid rgb(149,188,239)',
            background: 'rgb(120,151,213)',
            color: 'white',
            textAlign: 'left',
            paddingLeft: '16px',
            letterSpacing: '2px'
          }}>
            Sampling Result Evaluation
            <br />
            <button className="OptionButton" key="button1" id="button1"
            style={{
              position: 'relative',
              left: '-16px',
              top: '3px',
              width: 159,
              height: 34,
              background: 'white',
              border: 'none',
              letterSpacing: '0.05em',
              fontSize: '12px'
            }}
            onClick={
                () => {
                  $("#button1").css('background', 'white');
                  $("#button2").css('background', 'rgb(199, 214, 240)');
                  $("#p_dis").show();
                  $("#p_sum").hide();
                }
            } >
              Sentiment Type Density
            </button>
            <button className="OptionButton" key="button2" id="button2"
            style={{
              position: 'relative',
              left: '143px',
              top: '-31px',
              width: 159,
              height: 34,
              background: 'rgb(199, 214, 240)',
              border: 'none',
              letterSpacing: '0.05em',
              fontSize: '12px'
            }}
            onClick={
                () => {
                  $("#button1").css('background', 'rgb(199, 214, 240)');
                  $("#button2").css('background', 'white');
                  $("#p_sum").show();
                  $("#p_dis").hide();
                }
            } >
              Sentiment Characteristic Distribution
            </button>
          </div>
          <p
          style={{
            position: 'relative',
            left: '-30px',
            top: '38px',
            margin: '2px',
            fontSize: '12px'
          }} >
            <b style={{ color: 'rgb(194,8,107)' }} >—— </b> Active Side: Before Sampling
          </p>
          <p
          style={{
            position: 'relative',
            left: '-34.6px',
            top: '36px',
            margin: '2px',
            fontSize: '12px'
          }} >
            <b style={{ color: 'rgb(22,83,202)' }} >—— </b> Active Side: After Sampling
          </p>
          <PolylineChart id="p_dis" width={ 318 } height={ 120 } ref="dis"
          padding={{
            top: 6,
            right: 24,
            bottom: 6,
            left: 24
          }}
          style={{
            margin: '33px 6px 6px 6px',
            background: 'none'
          }} />
          <PolylineChart id="p_sum" width={ 318 } height={ 120 } ref="sum"
          padding={{
            top: 6,
            right: 24,
            bottom: 6,
            left: 24
          }}
          style={{
            margin: '33px 6px 6px 6px',
            display: 'none',
            background: 'none'
          }} />
          <p
          style={{
            position: 'relative',
            right: '24px',
            top: '-16px',
            margin: '2px',
            fontSize: '12px',
            textAlign: 'right'
          }} >
            Positive Side: Before Sampling <b style={{ color: 'rgb(194,8,107)' }} > ——</b>
          </p>
          <p
          style={{
            position: 'relative',
            right: '24px',
            top: '-18px',
            margin: '2px',
            fontSize: '12px',
            textAlign: 'right'
          }} >
            Positive Side: After Sampling <b style={{ color: 'rgb(22,83,202)' }} > ——</b>
          </p>
        </div>
        <Settings id="ActiveSettings" ref="topics" />
        <MapView id="MapView" ref="map" center={ [-100, 38] } zoom={ 3.2 } minZoom={ 3.2 } maxZoom={ 5 } />
        <div
        style={{
          position: 'absolute',
          width: '422px',
          top: '398px',
          left: '1114px',
          height: '464px',
          background: 'white'
        }} >
          <BBS width={ 422 } height={ 462 } ref="bbs" />
        </div>
        <ContrastView id="ContrastView" ref="RectTree" displayLevels={ 5 } />
        <div className="Line"
          style={{
            position: 'absolute',
            top: '556px',
            height: '306px',
            width: '595px'
          }}>
          <TreeMap id="TreeMap" ref="TreeMap"
          style={{
            background: 'white'
          }}
          circleStyle={{
            stroke: 'rgb(134,44,59)',
            strokeWidth: '0.6px',
            fill: 'rgb(230,28,65)'
          }}
          pathStyle={{
            stroke: 'rgb(71,23,120)'
          }} />
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    this.loadSource = (url: string, json: string, topic: string, dis: string, sum: string) => {
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
        let list: Array<{ text: string; city: string; sentiment: number; }> = [];
        let start: number = parseInt((Math.random() * (data.length - 50)).toString());
        for (let i: number = 0; i < 20; i++) {
          list.push({
            text: data[start + i].words,
            city: data[start + i].city,
            sentiment: parseFloat(data[start + i].sentiment)
          });
        }
        (this.refs["bbs"] as BBS).import(list);
        // (this.refs["map"] as MapView).setState({
        //   data: dataset
        // });
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(json, (data: TreeNode) => {
        let dataset: RectNode = this.loadTree(data, null, 'left');
        (this.refs["RectTree"] as ContrastView).import(dataset);
        (this.refs["TreeMap"] as TreeMap).import(dataset);
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(topic, (data: Array<{ text: string, count: number }>) => {
        (this.refs["topics"] as Settings).import(data);
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(dis, (data: Array<[[number, number], [number, number]]>) => {
        (this.refs["dis"] as PolylineChart).import(data);
      });
      (this.refs["DataCenter"] as DataCenter).openJSON(sum, (data: Array<[[number, number, number], [number, number, number]]>) => {
        let pick: Array<[[number, number], [number, number]]> = [];
        data.forEach((d: [[number, number, number], [number, number, number]]) => {
          pick.push([[d[0][0], - d[0][1]], [d[1][0], - d[1][1]]]);
        });
        (this.refs["sum"] as PolylineChart).import(pick);
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
      sentiment: data.sentiment,
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

  private loadSource: (url: string, json: string, topic: string, dis: string, sum: string) => void
    = (url: string, json: string, topic: string, dis: string, sum: string) => {
      setTimeout(() => this.loadSource(url, json, topic, dis, sum), 1000);
      return;
    };
}


export default App;
