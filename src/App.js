import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Home from './scenes/Home';

const App = () => (
  <DndProvider backend={Backend}>
    <Home />
  </DndProvider>
);

export default App;
