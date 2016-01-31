import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';

class Report extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    reportData: PropTypes.object.isRequired
    /* TODO: validate reportData shape
     data: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      title: React.PropTypes.string
    })
     */
  };
  constructor(props) {
    super(props);
    this.state = {
      code: DUMMY_CODE,
      reportData: [
        {lineNo: '1',
        highlight: 'warning'},
        {lineNo: '2',
        highlight: 'bad'},
        {lineNo: '3',
        highlight: 'warning'},
        {lineNo: '4',
        highlight: 'warning'},
        {lineNo: '5',
        highlight: 'good'},
        {lineNo: '6',
        highlight: 'good'},
        {lineNo: '7',
        highlight: 'good'},
        {lineNo: '8',
        highlight: 'good'},
        {lineNo: '9',
        highlight: 'good'},
        {lineNo: '10',
        highlight: 'good'}, // TODO: replace with actual data
        {lineNo: '19',
        highlight: 'good'},
      ]
    };
  }
  updateCode(newCode) {
    this.setState({
      code: newCode
    });
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
  componentWillUpdate() {
    let that = this; 
    this.state.reportData.forEach(function(line, indx) {
      that.highlightLine(line.lineNo, 'line-' + line.highlight);
    });
  }
  render() {
    const options = {
      lineNumbers: true,
      viewportMargin: 0,
      readOnly: true
    };
    const chart = {
      axis: {
        y: { min: 0, max: 1}
      },
    };
    const { text } = this.props;
    return (<div>
            <Codemirror className='viewer-report' ref="codemirror" value={text} onChange={this.updateCode.bind(this)} options={options} />
            </div>);
  }
}

export default Report;
