import React from 'react';
import BarTreeView from './features/tree-mock-up/TreeMockup'
import { Counter } from './features/counter/Counter'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BarTreeView />
        <Counter />
      </header>
    </div>
  );
}

export default App;
