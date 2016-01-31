import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import io from 'socket.io-client';
import RTChart from './react-rt-chart';

const SOCKET_URI = 'http://localhost:5000';

class Editor extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    updateText: PropTypes.func.isRequired,
    addReport: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.socket = io(SOCKET_URI);
    this.state = {
      text: props.text,
    };

    const self = this;
    this.socket.on('museData', (_museData) => {
      // TODO: this is super fragile and assumes _museData is valid JSON string if not already JSON
      const museData = (typeof _museData !== 'object') ? JSON.parse(_museData) : _museData;
      console.log('received: ' + JSON.stringify(museData));
      const lineRange = this.getLineRange();
      const fullData = {
        ...museData,
        ...lineRange
      };
      console.log('emitting: ' + JSON.stringify(fullData));
      this.socket.emit('lineRange', fullData);
      self.setState({
        museData
      })
    });
  }
  getLineRange() {
    const cm = this.refs.codemirror.getCodeMirror();
    const currLine = cm.getCursor().line;
    return {
      from: Math.max(0, currLine - 3),
      to: Math.min(currLine + 3, cm.doc.size)
    };
  }
  highlightWord() {
    // TODO: use doc.markText(from: {line, ch}, to: {line, ch}, ?options: object) → TextMarker
    // to highlight text under eyeballs

  }
  highlightLine(_lineNumber, lineClass) {
    // Zero indexing
    const lineNumber = _lineNumber - 1;
    const cm = this.refs.codemirror.getCodeMirror();
    cm.addLineClass(lineNumber, 'background', lineClass);
  }
  unHighlightLine(_lineNumber, lineClass) {
    // Zero indexing
    const lineNumber = _lineNumber - 1;
    const cm = this.refs.codemirror.getCodeMirror();
    cm.removeLineClass(lineNumber, 'background', lineClass);
  }
  highlightActiveLine() {
    const activeLineNo = parseInt(this.refs.activeLine.value);
    this.unHighlightActiveLine();
    this.highlightLine(activeLineNo, 'line-active');
    this.setState({
      activeLineNo
    });
  }
  unHighlightActiveLine() {
    if (typeof this.state.activeLineNo !== 'undefined') {
      this.unHighlightLine(this.state.activeLineNo, 'line-active')
    }
  }
  noActiveLine() {
    this.unHighlightActiveLine();
    this.setState({
      activeLineNo: undefined
    });
  }
  makeReport() {
    // TODO(feynman): AJAX with addReport as callback
    this.props.addReport({
      a: 1
      // TODO(jordan): dummy report data here
    });
  }
  render() {
    const options = {
      lineNumbers: true,
      viewportMargin: 0,
    };
    const { text, updateText } = this.props;
    return (
      <div>
        <RTChart fields={['concentration']} data={this.state.museData} />
        <Codemirror
          className='viewer'
          ref="codemirror"
          value={text}
          onChange={updateText}
          options={options} />
        <input ref="activeLine"></input>
        <button onClick={this.highlightActiveLine.bind(this)}>Highlight Active Line</button>
        <button onClick={this.makeReport.bind(this)}>Make Report</button>
      </div>
    );
  }
}

export default Editor;
