import React from 'react';
import BarTreeView from './features/tree-mock-up/TreeMockup'
import './App.css';
import TreeMockupChart from './features/tree-mock-up/TreeMockupChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BarTreeView />
        <TreeMockupChart />
      </header>
    </div>
  );
}

export default App;
