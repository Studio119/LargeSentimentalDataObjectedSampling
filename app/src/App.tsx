/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-25 20:03:25
 */
import React from 'react';
import './App.css';
import ItemStrip from './ItemStrip';
import MapView from './MapView';
import Settings from './Settings';
import ContrastView from './ContrastView';

const App: React.FC = () => {
  return (
    <div className="App">
      <ItemStrip id="ItemStrip" />
      <div className="Line"
        style={{
          height: '537px',
          border: '1px solid black',
          marginBottom: '2px'
        }}>
        <Settings id="MapSettings" />
        <MapView id="MapView" center={ [38, -100] } zoom={ 5 } minZoom={ 5 } />
      </div>
      <div className="Line"
        style={{
          height: '272px',
          border: '1px solid black'
        }}>
        <ContrastView id="ContrastView" />
        <div
          style={{
              display: 'inline-block',
              height: '100%',
              width: '45.6%',
              marginLeft: '0.12%',
              background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 2%, rgb(227, 227, 229) 94%, rgb(135, 137, 142))',
              border: '1px solid black'
          }}>
        </div>
      </div>
    </div>
  );
}

export default App;
