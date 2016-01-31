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
      reportData: {} // TODO: fill in dummy data here
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
  componentDidMount() {
    this.highlightLine(3, 'line-bad');
    this.highlightLine(4, 'line-warning');
    this.highlightLine(5, 'line-good');
  }
  render() {
    const options = {
      lineNumbers: true,
      viewportMargin: 0,
      readOnly: true
    };
    const { text } = this.props;
    return (<div>
            <Codemirror className='viewer' ref="codemirror" value={text} options={options} />
            </div>);
  }
}

export default Report;
