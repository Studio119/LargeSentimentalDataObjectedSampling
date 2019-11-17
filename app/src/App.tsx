/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-11-16 20:35:04
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
// import PolylineChart from './PolylineChart';
import BBS from './BBS';
import TreeBar, { TreeBarNode } from './TreeBar';
import { FileSet, DataForm } from './DataLib';

import axios, { AxiosResponse } from 'axios';


class App extends Component<{}, {}, {}> {
  private view: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];

  public render(): JSX.Element {
    return (
      <div className="App">
        <TaskQueue<Global> ref="DataCenter" control={ Globe } />
        <ItemStrip id="ItemStrip" importSource={ this.loadSource } />
        <DataView id="MapSettings" ref="DataView" />
        {/* <div className="Chart"
        style={{
          position: 'absolute',
          width: '318px',
          top: '281.8px',
          left: '0px',
          height: '263.2px',
          background: 'white',
          border: '1px solid rgb(149,188,239)'
        }} > */}
          {/* <div
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
          </div> */}
          {/* <p
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
        </div> */}
        <Settings id="ActiveSettings" ref="topics" />
        <MapView id="MapView" ref="map" center={ [-98, 38] } zoom={ 3.2 } minZoom={ 3.2 } maxZoom={ 12 }
        left={ [8, 740] } top={ [32, 328] } />
        <div
        style={{
          position: 'absolute',
          width: '422px',
          top: '59px',
          left: '1114px',
          height: '488px',
          background: 'white'
        }} >
          <BBS width={ 422 } height={ 805 } ref="bbs" />
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
        <TreeBar<Array<number>> id="TreeBar" ref="TreeBar"
          width={1109.8} height={289}
          style={{
            background: 'white',
            position: 'relative',
            top: '492.2px'
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
    this.loadSource = (paths: FileSet) => {
      (this.refs["DataCenter"] as TaskQueue).open(paths.origin, (data: DataForm.Origin) => {
        let dataset: Array<{
          id: string, lng: number, lat: number, words: string,
          day: string, city: string, sentiment: string, class: number}> = [];
        let active: number = 0;
        let positive: number = 0;
        let neutre: number = 0;
        let A_active: number = 0;
        let A_positive: number = 0;
        let A_neutre: number = 0;
        data.forEach((d: {
              id: string, lng: string, lat: string, words: string, day: string, city: string, sentiment: string
            }) => {
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
        this.view = [dataset.length, active, positive, neutre, A_active / active, A_positive / positive, A_neutre / neutre];
        (this.refs["DataView"] as DataView).load(
          ...this.view
        );
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
        (this.refs["DataCenter"] as TaskQueue).open(paths.gathering, (info: DataForm.Gathering) => {
          let box: Array<number> = [];
          info.forEach((d: {x: number, y: number, id: number, value: number, leaf_id: number}) => {
            box.push(d.leaf_id);
          });
          (this.refs["map"] as MapView).importClass(box);
        });
      });
      (this.refs["DataCenter"] as TaskQueue).open(paths.tree, (data: DataForm.Tree) => {
        let dataset: TreeBarNode<Array<number>> = this.loadTree(data, null, 'root');
        // (this.refs["RectTree"] as ContrastView).import(dataset);
        // (this.refs["TreeMap"] as TreeMap).import(dataset);
        (this.refs["TreeBar"] as TreeBar<Array<number>>).import(dataset);
      });
      (this.refs["DataCenter"] as TaskQueue).open(paths.cloud, (data: DataForm.Cloud) => {
        (this.refs["topics"] as Settings).import(data);
      });
      setTimeout(() => {
        Globe.sample();
      }, 1000);
      // (this.refs["DataCenter"] as TaskQueue).open(dis, (data: Array<[[number, number], [number, number]]>) => {
      //   (this.refs["dis"] as PolylineChart).import(data);
      // });
      // (this.refs["DataCenter"] as TaskQueue).open(sum, (data: Array<[[number, number, number], [number, number, number]]>) => {
      //   let pick: Array<[[number, number], [number, number]]> = [];
      //   data.forEach((d: [[number, number, number], [number, number, number]]) => {
      //     pick.push([[d[0][0], - d[0][1]], [d[1][0], - d[1][1]]]);
      //   });
      //   (this.refs["sum"] as PolylineChart).import(pick);
      // });
      // (this.refs["DataCenter"] as TaskQueue).open(prun, (data: Array<number>) => {
      //   (this.refs["TreeMap"] as TreeMap).importPruning(data);
      // });
    }
    Globe.sample = () => {
      (this.refs["DataCenter"] as TaskQueue).open("./data/huisu_sampled.json", (data: DataForm.Sampled) => {
        let set: Array<number> = [];
        Object.values(data).forEach((innode: Array<number>) => {
          set.push(...innode);
        });
        (this.refs["map"] as MapView).setState({
          sampled: set
        });
        let nodes: Array<number> = [];
        Object.keys(data).forEach((str: string) => {
          nodes.push(parseInt(str));
        });
        Globe.moveBars(nodes);
      });
    };
    Globe.update = (list: Array<number> | "all") => {
      let box: Array<{ text: string; city: string; sentiment: number; }> = [];
      if (list === "all") {
        for (let i: number = 0; i < 20; i++) {
          const data: {
            id: string;
            lng: number;
            lat: number;
            words: string;
            day: string;
            city: string;
            sentiment: string;
            class: number;
          } = Globe.getPoint(i);
          box.push({
            text: data.words,
            city: data.city,
            sentiment: parseFloat(data.sentiment)
          });
        }
        (this.refs["DataView"] as DataView).load(
          ...this.view
        );
      }
      else {
        let active: number = 0;
        let positive: number = 0;
        let neutre: number = 0;
        let A_active: number = 0;
        let A_positive: number = 0;
        for (let i: number = 0; i < list.length; i++) {
          const data: {
            id: string;
            lng: number;
            lat: number;
            words: string;
            day: string;
            city: string;
            sentiment: string;
            class: number;
          } = Globe.getPoint(list[i]);
          const s: number = parseFloat(data.sentiment);
          if (i < 20) {
            box.push({
              text: data.words,
              city: data.city,
              sentiment: s
            });
          }
          if (s === 0) {
            neutre++;
          }
          else if (s > 0) {
            active++;
            A_active += s;
          }
          else {
            positive++;
            A_positive += s;
          }
        }
        (this.refs["DataView"] as DataView).load(
          list.length, active, positive, neutre, A_active / active, A_positive / positive, 0
        );
      }
      (this.refs["bbs"] as BBS).import(box);
    };
  }

  private loadTree(data: DataForm.Tree, parent: TreeBarNode<Array<number>> | null, pos: 'root' | number): TreeBarNode<Array<number>> {
    let node: TreeBarNode<Array<number>> = {
      id: data.id,
      name: data.id,
      path: parent ? [ ...parent.path, pos ] : [ 'root' ],
      parent: parent,
      children: [],
      ref: $("NULL"),
      data: data.containedpoint
    };
    if (data.children.length > 0) {
      node.children = data.children.map((child: DataForm.Tree) => {
        return this.loadTree(child, node, child.id);
      });
    }

    return node;
  }

  private loadSource: (paths: FileSet) => void
    = (paths: FileSet) => {
      setTimeout(() => this.loadSource(paths), 1000);
      return;
    };
}


interface Global {
  checkIfPointIsSampled: (index: number) => boolean;
  getPoint: (index: number) => {
    id: string;
    lng: number;
    lat: number;
    words: string;
    day: string;
    city: string;
    sentiment: string;
    class: number;
  };
  highlight: (points: Array<number> | "all") => void;
  highlightClass: (index: number) => void;
  moveBars: (nodes: Array<number>) => void;
  sample: () => void;
  update: (list: Array<number> | "all") => void;
  run: () => void;
}

export var Globe: Global = {
  checkIfPointIsSampled: () => false,
  getPoint: () => {
    return { id: "", lng: 0, lat: 0, words: "", day: "", city: "", sentiment: "", class: -1 };
  },
  highlight: () => {},
  highlightClass: () => {},
  moveBars: () => {},
  sample: () => {},
  update: () => {},
  run: () => {}
};


var checkIfBackEndServerAvailable: () => void = () => {
  (async () => {
    await axios.get(
      "/", {
        headers: {
          'Content-type': 'application/json;charset=utf-8'
      }}
    )
    .then(() => {
      Globe.run = async () => {
        await axios.get(
          "/run", {
            headers: {
              'Content-type': 'application/json;charset=utf-8'
            }
          }
        )
        .then((value: AxiosResponse<any>) => {
          // TODO: display
        }, (reason: any) => {
          console.error(reason);
        })
        .catch((reason: any) => {
          console.error(reason);
        })
      };
      console.info("Back-end server is ready.");
    }, () => {
      console.warn("Falied to build connection with back-end server.");
    })
    .catch(() => {
      console.warn("Falied to build connection with back-end server.");
    });
  })();
};

setTimeout(checkIfBackEndServerAvailable, 2000);


export default App;
