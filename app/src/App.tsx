/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-12-02 11:38:39
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

// import axios, { AxiosResponse } from 'axios';
import axios from 'axios';
import ResultView from './ResultView';
import Color from './preference/Color';


class App extends Component<{}, {}, {}> {
  private view: [number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0];
  private stopWords: Array<string> = [
    "don't", "wh", "this", "tha", "not", "for", "this", "her", "his", "the", "you", "our", "not", "watch",
    "but", "will", "today", "about", "much", "call", "won't", "well", "just", "can", "get", "i'", "tonight",
    "too", "all", "tak", "go", "man", "also", "eve", "did", "over", "other", "was", "are", "like", "way",
    "and", "false", "true", "now", "year", "day", "want", "you", "feel", "she", "tell", "one", "it's", "said",
    "out", "should", "would", "see", "hav", "has", "time", "know", "people", "look", "him", "person", "told",
    "from", "think", "via", "because", "with", "any", "let", "need", "show", "only", "big", "wld", "more",
    "more", "he's", "after", "must", "how", "wow", "keep", "say", "does", "isn", "very", "come", "came", "coming",
    "been", "using", "twitter"
  ];
  private play: () => void = () => {};

  public render(): JSX.Element {
    return (
      <div className="App"
      style={{
        background: Color.Nippon.Rurikonn
      }} >
        <TaskQueue<Global> ref="DataCenter" control={ Globe } />
        <ItemStrip id="ItemStrip" ref="ItemStrip" importSource={ this.loadSource } />
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
        left={ [8, 817] } top={ [32, 336] } />
        <div
        style={{
          position: 'absolute',
          width: '375px',
          top: '59px',
          left: '1163.2px',
          background: 'white'
        }} >
          <BBS width={ 373 } height={ 531 } ref="bbs" />
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
        width={1157} height={242.2}
        style={{
          background: 'white',
          position: 'relative',
          top: '540.4px'
        }} />
        <ResultView ref="ResultView" />
      </div>
    );
  }

  public componentDidMount(): void {
    this.loadSource = (paths: FileSet) => {
      // reset
      (this.refs["DataView"] as DataView).setState({
        total: 0,
        active: 0,
        positive: 0,
        neutre: 0,
        Aver_active: 0,
        Aver_positive: 0,
        Aver_neutre: 0
      });
      (this.refs["bbs"] as BBS).setState({
        list: []
      });
      (this.refs["map"] as MapView).setState({
        data: [],
        sampled: []
      });
      (this.refs["topics"] as Settings).setState({
        data: []
      });
      (this.refs["TreeBar"] as TreeBar<Array<number>>).setState({
        id: -1,
        name: 'root',
        path: [ 'root' ],
        parent: null,
        children: [],
        ref: $("NULL"),
        data: []
      });
      (this.refs["ResultView"] as ResultView).setState({
        classes: []
      });

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
        let start: number = 0; //985;    //parseInt((Math.random() * (data.length - 50)).toString());
        for (let i: number = start; i < dataset.length; i++) {
          list.push({
            text: data[i].words,
            city: data[i].city,
            sentiment: parseFloat(data[i].sentiment)
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

        (this.refs["topics"] as Settings).import([]);
        setTimeout(() => {
          let topics: Array<{ text: string; count: number; }> = [];
          let dict: {[word: string]: number} = {};
          dataset.forEach((d: { words: string; }) => {
            d.words.split(/[ |,|.|;|:|(|)|[|\]|?|!|“]/).forEach((word: string) => {
              if (word.length < 3 || word.includes("@") || word.includes("/")
              || word.includes("\"") || word.includes("#") || word.includes("http") || parseInt(word).toString() === word) {
                return;
              }
              const w: string = word.toLowerCase();
              for (let m: number = 0; m < this.stopWords.length; m++) {
                if (w.startsWith(this.stopWords[m])) {
                  return;
                }
              }
              if (dict.hasOwnProperty(w)) {
                dict[w] ++;
              }
              else if (w.endsWith("es") && dict.hasOwnProperty(w.substring(0, w.length - 2))) {
                dict[w.substring(0, w.length - 2)] ++;
              }
              else if (w.endsWith("s") && dict.hasOwnProperty(w.substring(0, w.length - 1))) {
                dict[w.substring(0, w.length - 1)] ++;
              }
              else {
                dict[w] = 1;
              }
            });
          });
          for (const word in dict) {
            if (dict.hasOwnProperty(word)) {
              const count: number = dict[word];
              if (topics.length === 80) {
                if (topics[79].count <= count) {
                  topics[79] = {
                    text: word,
                    count: count
                  };
                  for (let a: number = 79; a >= 1; a--) {
                    if (topics[a].count < topics[a - 1].count) {
                      const temp: {
                        text: string;
                        count: number;
                      } = topics[a];
                      topics[a] = topics[a - 1];
                      topics[a - 1] = temp;
                    }
                    else {
                      break;
                    }
                  }
                }
                continue;
              }
              topics.push({
                text: word,
                count: count
              });
            }
          }
          (this.refs["topics"] as Settings).import(topics);
        });
        
        this.play = () => {
          (this.refs["DataCenter"] as TaskQueue).open(paths.tree, (data: DataForm.Tree) => {
            let dataset: TreeBarNode<Array<number>> = this.loadTree(data, null, 'root');
            // (this.refs["RectTree"] as ContrastView).import(dataset);
            // (this.refs["TreeMap"] as TreeMap).import(dataset);
            (this.refs["TreeBar"] as TreeBar<Array<number>>).import(dataset);
          });
          this.play = () => {};
        };

        $("#run")
          .attr("src", "./images/run.png")
          .removeClass("rotating");
          
        (this.refs["ItemStrip"] as ItemStrip).end(false);
      });

      // setTimeout(() => {
      //   Globe.sample();
      // }, 1000);

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
    };
    Globe.sample = () => {
      this.play();
      setTimeout(() => {
        let c: number = 0;
        let process: NodeJS.Timeout = setInterval(() => {
          $("#goRun").css("background", Color.linearGradient([
            Color.setLightness(Color.Nippon.Nae, 0.6),
            0,
            Color.Nippon.Nae,
            c <= 0.5 ? c : c - 0.041,
            Color.setLightness(Color.Nippon.Midori, 0.7),
            c <= 0.5 ? c + 0.001 : c - 0.04,
            Color.setLightness(Color.Nippon.Midori, 0.9),
            c <= 0.5 ? c + 0.04 : c - 0.001,
            Color.setLightness(Color.Nippon.Aisumitya, 0.3),
            c <= 0.5 ? c + 0.041 : c,
            Color.setLightness(Color.Nippon.Aisumitya, 0.3),
            1
          ], 'right'));
          c += (1 - c) / 10;
        }, 50);
        (this.refs["DataCenter"] as TaskQueue).open(
          (this.refs["ItemStrip"] as ItemStrip).getSource() === 'Tweet'
            ? "./data/huisu_sampled_9.17_10_0.3_0.1_0.001.json"
            : "./data/new_huisu_sampled_9.17_24_0.3_0.1_0.2.json", (data: DataForm.Sampled) => {
          let set: Array<number> = [];
          Object.values(data).forEach((innode: Array<number>) => {
            innode.forEach((id: number) => {
              for (let i: number = 0; i < set.length; i++) {
                if (id === set[i]) {
                  return;
                }
              }
              set.push(id);
            });
            // set.push(...innode);
          });
          console.log(set.length);
          // var dict: {[key: string]: number} = {};
          // var over: Array<[number, number]> = [];
          // for (let s: number = 0; s < set.length; s++) {
          //   dict["id" + s] = 0;
          // }
          // for (let s: number = 0; s < set.length; s++) {
          //   dict["id" + set[s]]++;
          // }
          // set = [];
          // for (const key in dict) {
          //   if (dict.hasOwnProperty(key)) {
          //     const element = dict[key];
          //     const id: number = parseInt((key as string).replace("id", ""));
          //     if (element === 1) {
          //       set.push(id);
          //     }
          //     else if (element > 1) {
          //       set.push(id);
          //       over.push([id, element]);
          //     }
          //   }
          // }
          // console.log(over);
          setTimeout(() => {
            (this.refs["map"] as MapView).setState({
              sampled: set
            });
            let nodes: Array<number> = [];
            setTimeout(() => {
              Object.keys(data).forEach((str: string) => {
                nodes.push(parseInt(str));
              });
              setTimeout(() => {
                Globe.moveBars(nodes);
                setTimeout(() => {
                  (this.refs["ItemStrip"] as ItemStrip).end(true);
                  clearInterval(process);
                  $("#run")
                    .attr("src", "./images/run.png")
                    .removeClass("rotating");
                  (this.refs["ItemStrip"] as ItemStrip).setSampleRate(set.length / (this.refs["map"] as MapView).state.data.length);
                }, 1000);
              }, 300);
              (this.refs["ResultView"] as ResultView).import("all");
            }, 40);
          }, 40);
        });
      }, 1000);
    };
    Globe.random = () => {
      let total: Array<number> = [];
      let set: Array<number> = [];
      let length: number = (this.refs["map"] as MapView).state.data.length;
      for (let i: number = 0; i < length; i++) {
        total.push(i);
      }
      let k: number = 0;
      let max: number = 4e2;
      const target: number = Math.round(length * (this.refs["ItemStrip"] as ItemStrip).getSampleRate());
      const fun: () => void = () => {
        while (k < target && k < max) {
          const idx: number = Math.floor(Math.random() * total.length);
          set.push(total[idx]);
          let left: Array<number> = [];
          total.forEach((i: number) => {
            if (i !== idx) {
              left.push(i);
            }
          });
          total = left;
          k++;
        }
        if (k === target) {
          (this.refs["map"] as MapView).setState({
            sampled: set
          });
          Globe.moveBars([]);
          (this.refs["ResultView"] as ResultView).import("all");
          (this.refs["ItemStrip"] as ItemStrip).end(true);
          $("#runr")
            .attr("src", "./images/run.png")
            .removeClass("rotating");
          return;
        }
        else {
          $("#goRandom").css("background", Color.linearGradient([
            Color.setLightness(Color.Nippon.Nae, 0.6),
            0,
            Color.Nippon.Nae,
            (k / target) <= 0.5 ? k / target : k / target - 0.041,
            Color.setLightness(Color.Nippon.Midori, 0.7),
            (k / target) <= 0.5 ? k / target + 0.001 : k / target - 0.04,
            Color.setLightness(Color.Nippon.Midori, 0.9),
            (k / target) <= 0.5 ? k / target + 0.04 : k / target - 0.001,
            Color.setLightness(Color.Nippon.Aisumitya, 0.3),
            (k / target) <= 0.5 ? k / target + 0.041 : k / target,
            Color.setLightness(Color.Nippon.Aisumitya, 0.3),
            1
          ], 'right'));
          max += 4e2;
          setTimeout(fun, 10);
        }
      };
      fun();
      // for (; k < target; k++) {
      //   const idx: number = Math.floor(Math.random() * total.length);
      //   set.push(total[idx]);
      //   let left: Array<number> = [];
      //   total.forEach((i: number) => {
      //     if (i !== idx) {
      //       left.push(i);
      //     }
      //   });
      //   total = left;
      // }
      
      // (this.refs["map"] as MapView).setState({
      //   sampled: set
      // });
      // Globe.moveBars([]);
      // (this.refs["ResultView"] as ResultView).import("all");
      // $("#runr")
      //   .attr("src", "./images/run.png")
      //   .removeClass("rotating");
    };
    Globe.update = (list: Array<number> | "all") => {
      let box: Array<{ text: string; city: string; sentiment: number; }> = [];
      let texts: Array<{ text: string; }> = [];
      if (list === "all") {
        for (let i: number = 0; true; i++) {
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
          if (!data) {
            break;
          }
          texts.push({
            text: data.words
          });
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
          box.push({
            text: data.words,
            city: data.city,
            sentiment: s
          });
          texts.push({
            text: data.words
          });
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
      (this.refs["ResultView"] as ResultView).import(list);
      (this.refs["bbs"] as BBS).import(box);
      Globe.countWords(texts);
    };
    Globe.countWords = (list: Array<{ text: string; }>) => {
      (this.refs["topics"] as Settings).import([]);
      setTimeout(() => {
        let topics: Array<{ text: string; count: number; }> = [];
        let dict: {[word: string]: number} = {};
        list.forEach((d: { text: string; }) => {
          d.text.split(/[ |,|.|;|:|(|)|[|\]|?|!|“]/).forEach((word: string) => {
            if (word.length < 3 || word.includes("@") || word.includes("/")
            || word.includes("\"") || word.includes("#") || word.includes("http") || parseInt(word).toString() === word) {
              return;
            }
            const w: string = word.toLowerCase();
            for (let m: number = 0; m < this.stopWords.length; m++) {
              if (w.startsWith(this.stopWords[m])) {
                return;
              }
            }
            if (dict.hasOwnProperty(w)) {
              dict[w] ++;
            }
            else {
              dict[w] = 1;
            }
          });
        });
        for (const word in dict) {
          if (dict.hasOwnProperty(word)) {
            const count: number = dict[word];
            if (topics.length === 80) {
              if (topics[79].count <= count) {
                topics[79] = {
                  text: word,
                  count: count
                };
                for (let a: number = 79; a >= 1; a--) {
                  if (topics[a].count < topics[a - 1].count) {
                    const temp: {
                      text: string;
                      count: number;
                    } = topics[a];
                    topics[a] = topics[a - 1];
                    topics[a - 1] = temp;
                  }
                  else {
                    break;
                  }
                }
              }
              continue;
            }
            topics.push({
              text: word,
              count: count
            });
          }
        }
        (this.refs["topics"] as Settings).import(topics);
      });
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

      // Globe.mapThis = (data: Array<{user_id: string; text: string; lat: number; lng: number;}>) => {
      //   let dataset: Array<{
      //     id: string, lng: number, lat: number, words: string,
      //     day: string, city: string, sentiment: string, class: number}> = [];
      //   data.forEach((d: {user_id: string; text: string; lat: number; lng: number;}) => {
      //     dataset.push({ ...d, id: d.user_id, words: d.text, sentiment: (
      //       Math.random() * 110000 > 45000 ? 0 : Math.random() >= 0.58 ? -1 : 1
      //     ).toString(), class: 1, city: "", day: "0" });
      //   });
      //   (this.refs["map"] as MapView).setState({
      //     data: dataset
      //   });
      // }
      return;
    };
}


interface Global {
  appendWord: (word: string) => void;
  checkIfPointIsSampled: (index: number) => boolean;
  countWords: (list: Array<{ text: string; }>) => void;
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
  highlightClass: (index: number, useSampled: boolean) => void;
  loadData: () => void;
  moveBars: (nodes: Array<number>) => void;
  random: () => void;
  sample: () => void;
  update: (list: Array<number> | "all") => void;
  run: () => void;
}

export const Globe: Global = {
  appendWord: () => {},
  checkIfPointIsSampled: () => false,
  countWords: () => {},
  getPoint: () => {
    return { id: "", lng: 0, lat: 0, words: "", day: "", city: "", sentiment: "", class: -1 };
  },
  highlight: () => {},
  highlightClass: () => {},
  loadData: () => {},
  moveBars: () => {},
  random: () => {},
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
        // TODO: connect with the back-end server
        // await axios.get(
        //   "/run", {
        //     headers: {
        //       'Content-type': 'application/json;charset=utf-8'
        //     }
        //   }
        // )
        // .then((value: AxiosResponse<any>) => {
        //   // TODO: display
        // }, (reason: any) => {
        //   console.error(reason);
        // })
        // .catch((reason: any) => {
        //   console.error(reason);
        // });
        Globe.sample();
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

(window as any)["title"] = (color: string) => {
  $("div").each((i: number, e: HTMLElement) => {
    if (parseInt($(e).css("height")) === 24) {
      $(e).css("background", color);
    }
  });
};


export default App;
