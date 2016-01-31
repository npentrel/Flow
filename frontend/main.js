import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

$(document).ready(() => {
	ReactDOM.render(<App />, document.getElementById('app'));
})
