/*
 * @Author: Antoine YANG 
 * @Date: 2019-09-23 14:07:23 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-09-23 15:05:17
 */
import React from 'react';
import './App.css';
import ItemStrip from './ItemStrip';

const App: React.FC = () => {
  return (
    <div className="App">
      <ItemStrip id="ItemStrip" />
      <div className="Line"
        style={{
          height: '540px',
          background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 10%, rgb(192, 193, 196) 80%, rgb(147, 149, 154) 90%, #282c34)'
        }}>
      </div>
      <div className="Line"
        style={{
          height: '272px',
          background: 'linear-gradient(to bottom, rgb(150, 152, 157), #ffffff 10%, rgb(192, 193, 196) 80%, rgb(147, 149, 154) 90%, #282c34)'
        }}>
      </div>
    </div>
  );
}

export default App;
