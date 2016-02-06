import $ from 'jquery';
import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import io from 'socket.io-client';
import RTChart from './react-rt-chart';
import DUMMY_CODE from './dummyCode';

const SOCKET_URI = 'http://localhost:5000';
const REPORT_URL = 'http://localhost:5000/report/';

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

  componentDidMount() {
    const self = this;
    var Demo = {

      update : function() {
        var x = xLabs.getConfig( "state.head.x" );
        var y = xLabs.getConfig( "state.head.y" );
        var xs = parseFloat( xLabs.getConfig("mouseEmulator.cursor.x") ) +  screen.width * 0.5 +0; // screen coords
        var ys = parseFloat( xLabs.getConfig("mouseEmulator.cursor.y") ) + screen.height * 0.5;
        // console.log(xLabs.getTimestamp());
        // console.log("x: " + xs);
        // console.log("y: " + ys);
//        console.log("offsetx: " + xLabs.getConfig("documentOffset").x);
        console.log(document.elementFromPoint(xs, ys).closest('.CodeMirror-line'))
        // console.log(document.elementFromPoint(xs, ys).closest('span[class="CodeMirror-line"]').parentElement.firstChild)
        var elem = document.elementFromPoint(xs, ys).closest('.CodeMirror-line').parentElement.firstChild;
        console.log(elem)
        if (typeof elem !== 'undefined') {
          if (typeof parseInt(elem.textContent) === 'number') {
            const activeLineNo = parseInt(elem.textContent);
            console.log(activeLineNo);
            console.log(self.state.activeLineNo);
            if (activeLineNo !== self.state.activeLineNo) {
              self.highlightActiveLine(activeLineNo);
            }
          }
        } else {
          self.unHighlightActiveLine();
        }
      },

      ready : function() {
        xLabs.setConfig( "system.mode", "mouse" );
        xLabs.setConfig( "browser.canvas.paintHeadPose", "0" );
        window.addEventListener( "beforeunload", function() {
            xLabs.setConfig( "system.mode", "off" );
        });
      }
    };

    setImmediate(xLabs.setup( Demo.ready, Demo.update, null, "YOUR_XLABS_API_KEY_HERE" ));
  }

  getLineRange() {
    const cm = this.refs.codemirror.getCodeMirror(); // current cursor line
    // const currLine = cm.getCursor().line;
    const currLine= this.state.activeLineNo;
    return {
      from: Math.max(0, currLine - 1),
      to: Math.min(currLine + 1, cm.doc.size)
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
  highlightActiveLine(activeLineNo) {
    // const activeLineNo = parseInt(this.refs.activeLine.value);
    console.log(activeLineNo)
    console.log(this.state.activeLineNo)
    if (typeof activeLineNo === 'number' && !isNaN(activeLineNo) && activeLineNo !== this.state.activeLineNo) this.unHighlightActiveLine();
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
  reportUrl() {
    const cm = this.refs.codemirror.getCodeMirror();
    const maxLineNo = cm.doc.size;
    return REPORT_URL + maxLineNo;
  }
  makeReport() {
    $.ajax({
      url: this.reportUrl(),
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        console.log('Got report data:');
        console.log(JSON.stringify(data));
        this.props.addReport(data);
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
        var lineAnotations = []
        for (var i = DUMMY_CODE.split('\n').length - 1; i >= 0; i--) {
          var average = 0.2 + 0.8*Math.random();
          var highlight = 'good';
          
          if (average <= 0.33) {
            highlight = 'bad';
          } else if (average > 0.33 && average < 0.66) {
            highlight = 'warning';
          }

          lineAnotations.push({
            lineNo: i,
            highlight: highlight,
            average: average
          })
        }
        window.lineAnotations = lineAnotations;
        var data = {
          text: DUMMY_CODE,
          lineAnotations: lineAnotations
        }
        this.props.addReport(data);
      }
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
        <div className='graphWindow'>
          <RTChart fields={['concentration']} data={this.state.museData} />
        </div>
        <Codemirror
          className='viewer'
          ref="codemirror"
          value={text}
          onChange={updateText}
          options={options} />
        <br/>
        <button onClick={this.makeReport.bind(this)}>Finished Reading</button>
      </div>
    );
  }
}

export default Editor;
