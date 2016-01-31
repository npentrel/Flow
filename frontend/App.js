import React from 'react';
import Codemirror from 'react-codemirror';
import io from 'socket.io-client';
import RTChart from './react-rt-chart';

import DUMMY_CODE from './dummyCode';
import Editor from './Editor';
import Report from './Report';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: DUMMY_CODE,
      reportData: undefined
    };
  }
  updateText(newText) {
    this.setState({
      text: newText
    });
  }
  addReport(reportData) {
    this.setState({
      reportData
    });
  }
  render() {
    const displayComponent = (typeof this.state.reportData === 'undefined') ?
      <Editor 
        text={this.state.text}
        updateText={this.updateText.bind(this)}
        addReport={this.addReport.bind(this)} />
      : <Report 
          text={this.state.text}
          reportData={this.state.reportData} />;
    return displayComponent;
  }
}

export default App;
