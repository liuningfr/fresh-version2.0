import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

const render = (Root) => {
  ReactDOM.render(<Root />, document.getElementById('root'));
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(App);
  });
}
