/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-02 21:43:18
 */
import React, { Component } from 'react';
import './App.css';
import ItemStrip from './ItemStrip';
import MapView from './MapView';
import DataView from './DataView';
import Settings from './Settings';
import ContrastView from './ContrastView';
import DataCenter from './DataCenter';

class App extends Component<{}, {}, {}> {
  public render(): JSX.Element {
    return (
      <div className="App">
        <DataCenter ref="DataCenter"/>
        <ItemStrip id="ItemStrip" />
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
          <ContrastView id="ContrastView" />
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
    (this.refs["DataCenter"] as DataCenter).openCSV('/data/93.csv', (data: Array<{ id: string, lng: string, lat: string, words: string, day: string, city: string, sentiment: string }>) => {
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
  }
}


export default App;
