import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import styled from '@emotion/styled';

import Home from 'scenes/Home';

const Wrapper = styled.div`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const App = () => (
  <Wrapper>
    <Home />
  </Wrapper>
);

export default App;
