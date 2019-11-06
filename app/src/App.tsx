/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-06 18:25:34
 */
import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import ItemStrip from './ItemStrip';
import MapView from './MapView';
import DataView from './DataView';
import Settings from './Settings';
// import ContrastView, { RectNode } from './ContrastView';
// import { RectNode } from './ContrastView';
import TaskQueue from './tools/TaskQueue';
// import TreeMap from './TreeMap';
import PolylineChart from './PolylineChart';
import BBS from './BBS';
import TreeChart, { TreeChartNode } from './TreeChart';


export interface TreeNode<T = any> {
  id: number;
  parent: TreeNode | null;
  children: Array<TreeNode>;
  data: T;
}

class App extends Component<{}, {}, {}> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <TaskQueue ref="DataCenter"/>
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
        <MapView id="MapView" ref="map" center={ [-98, 38] } zoom={ 3.2 } minZoom={ 3.2 } maxZoom={ 6 } />
        <div
        style={{
          position: 'absolute',
          width: '422px',
          top: '59px',
          left: '1114px',
          height: '488px',
          background: 'white'
        }} >
          <BBS width={ 422 } height={ 486 } ref="bbs" />
        </div>
        {/* <ContrastView id="ContrastView" ref="RectTree" displayLevels={ 5 } /> */}
        {/* <div className="Line"
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
        </div> */}
        <TreeChart<Array<number>> id="TreeChart" ref="TreeChart"
          width={1212.5} height={289}
          style={{
            background: 'white',
            position: 'relative',
            top: '492.2px',
            left: '321.4px'
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
    );
  }

  public componentDidMount(): void {
    this.loadSource = (url: string, json: string, topic: string, dis: string, sum: string) => {
      (this.refs["DataCenter"] as TaskQueue).open(url, (data: Array<{ id: string, lng: string, lat: string, words: string, day: string, city: string, sentiment: string }>) => {
        let dataset: Array<{
          id: string, lng: number, lat: number, words: string,
          day: string, city: string, sentiment: string, class: number}> = [];
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
          dataset.push({ ...d, lat: parseFloat(d.lat), lng: parseFloat(d.lng), class: 1 });
        });
        (this.refs["DataView"] as DataView).load(dataset.length, active, positive, neutre, A_active / active, A_positive / positive, A_neutre / neutre);
        let list: Array<{ text: string; city: string; sentiment: number; }> = [];
        let start: number = 985;    //parseInt((Math.random() * (data.length - 50)).toString());
        for (let i: number = 0; i < 20; i++) {
          list.push({
            text: data[start + i].words,
            city: data[start + i].city,
            sentiment: parseFloat(data[start + i].sentiment)
          });
        }
        (this.refs["bbs"] as BBS).import(list);
        (this.refs["map"] as MapView).setState({
          data: dataset
        });
        (this.refs["DataCenter"] as TaskQueue).open('./solution/test_presentation.json', (info: Array<{x: number, y: number, id: number, value: number, leaf_id: number}>) => {
          let box: Array<number> = [];
          info.forEach((d: {x: number, y: number, id: number, value: number, leaf_id: number}) => {
            box.push(d.leaf_id);
          });
          (this.refs["map"] as MapView).importClass(box);
        });
      });
      (this.refs["DataCenter"] as TaskQueue).open(json, (data: TreeNode<Array<number>>) => {
        let dataset: TreeChartNode<Array<number>> = this.loadTree(data, null, 'root');
        // (this.refs["RectTree"] as ContrastView).import(dataset);
        // (this.refs["TreeMap"] as TreeMap).import(dataset);
        (this.refs["TreeChart"] as TreeChart<Array<number>>).import(dataset);
      });
      (this.refs["DataCenter"] as TaskQueue).open(topic, (data: Array<{ text: string, count: number }>) => {
        (this.refs["topics"] as Settings).import(data);
      });
      (this.refs["DataCenter"] as TaskQueue).open(dis, (data: Array<[[number, number], [number, number]]>) => {
        (this.refs["dis"] as PolylineChart).import(data);
      });
      (this.refs["DataCenter"] as TaskQueue).open(sum, (data: Array<[[number, number, number], [number, number, number]]>) => {
        let pick: Array<[[number, number], [number, number]]> = [];
        data.forEach((d: [[number, number, number], [number, number, number]]) => {
          pick.push([[d[0][0], - d[0][1]], [d[1][0], - d[1][1]]]);
        });
        (this.refs["sum"] as PolylineChart).import(pick);
      });
      // (this.refs["DataCenter"] as TaskQueue).open(prun, (data: Array<number>) => {
      //   (this.refs["TreeMap"] as TreeMap).importPruning(data);
      // });
    }
  }

  private loadTree(data: TreeNode<Array<number>>, parent: TreeChartNode<Array<number>> | null, pos: 'root' | number): TreeChartNode<Array<number>> {
    let node: TreeChartNode<Array<number>> = {
      id: data.id,
      name: data.id,
      path: parent ? [ ...parent.path, pos ] : [ 'root' ],
      parent: parent,
      children: [],
      ref: $("NULL"),
      data: (data as any)["containedpoint"]
    };
    if (data.children.length > 0) {
      node.children = data.children.map((child: TreeNode<Array<number>>) => {
        return this.loadTree(child, node, child.id);
      });
    }

    return node;
  }

  private loadSource: (url: string, json: string, topic: string, dis: string, sum: string, prun: string) => void
    = (url: string, json: string, topic: string, dis: string, sum: string, prun: string) => {
      setTimeout(() => this.loadSource(url, json, topic, dis, sum, prun), 1000);
      return;
    };
}


export default App;
