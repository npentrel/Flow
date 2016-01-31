import React from 'react';
import Codemirror from 'react-codemirror';
import io from 'socket.io-client';
import RTChart from './react-rt-chart';

const SOCKET_URI = 'http://localhost:5000';

const DUMMY_CODE = "\
      Builder, in building the little house,\n\
      In every way you may please yourself;\n\
      But please please me in the kitchen chimney:\n\
      Don't build me a chimney upon a shelf.\n\
      \n\
      However far you must go for bricks,\n\
      Whatever they cost a-piece or a pound,\n\
      But me enough for a full-length chimney,\n\
      And build the chimney clear from the ground.\n\
      \n\
      It's not that I'm greatly afraid of fire,\n\
      But I never heard of a house that throve\n\
      (And I know of one that didn't thrive)\n\
      Where the chimney started above the stove.\n\
      \n\
      And I dread the ominous stain of tar\n\
      That there always is on the papered walls,\n\
      And the smell of fire drowned in rain\n\
      That there always is when the chimney's false.\n\
      \n\
      A shelf's for a clock or vase or picture,\n\
      But I don't see why it should have to bear\n\
      A chimney that only would serve to remind me\n\
      Of castles I used to build in air.\n\
      \n\
      In every way you may please yourself;\n\
      But please please me in the kitchen chimney:\n\
      Don't build me a chimney upon a shelf.\n\
      \n\
      However far you must go for bricks,\n\
      Whatever they cost a-piece or a pound,\n\
      But me enough for a full-length chimney,\n\
      And build the chimney clear from the ground.\n\
      \n\
      It's not that I'm greatly afraid of fire,\n\
      But I never heard of a house that throve\n\
      (And I know of one that didn't thrive)\n\
      Where the chimney started above the stove.\n\
      \n\
      And I dread the ominous stain of tar\n\
      That there always is on the papered walls,\n\
      And the smell of fire drowned in rain\n\
      That there always is when the chimney's false.\n\
      \n\
      A shelf's for a clock or vase or picture,\n\
      But I don't see why it should have to bear\n\
      A chimney that only would serve to remind me\n\
      Of castles I used to build in air.\n\
      In every way you may please yourself;\n\
      But please please me in the kitchen chimney:\n\
      Don't build me a chimney upon a shelf.\n\
      \n\
      However far you must go for bricks,\n\
      Whatever they cost a-piece or a pound,\n\
      But me enough for a full-length chimney,\n\
      And build the chimney clear from the ground.\n\
      \n\
      It's not that I'm greatly afraid of fire,\n\
      But I never heard of a house that throve\n\
      (And I know of one that didn't thrive)\n\
      Where the chimney started above the stove.\n\
      \n\
      And I dread the ominous stain of tar\n\
      That there always is on the papered walls,\n\
      And the smell of fire drowned in rain\n\
      That there always is when the chimney's false.\n\
      \n\
      A shelf's for a clock or vase or picture,\n\
      But I don't see why it should have to bear\n\
      A chimney that only would serve to remind me\n\
      Of castles I used to build in air.\n\
      In every way you may please yourself;\n\
      But please please me in the kitchen chimney:\n\
      Don't build me a chimney upon a shelf.\n\
      \n\
      However far you must go for bricks,\n\
      Whatever they cost a-piece or a pound,\n\
      But me enough for a full-length chimney,\n\
      And build the chimney clear from the ground.\n\
      \n\
      It's not that I'm greatly afraid of fire,\n\
      But I never heard of a house that throve\n\
      (And I know of one that didn't thrive)\n\
      Where the chimney started above the stove.\n\
      \n\
      And I dread the ominous stain of tar\n\
      That there always is on the papered walls,\n\
      And the smell of fire drowned in rain\n\
      That there always is when the chimney's false.\n\
      \n\
      A shelf's for a clock or vase or picture,\n\
      But I don't see why it should have to bear\n\
      A chimney that only would serve to remind me\n\
      Of castles I used to build in air."

class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(SOCKET_URI);
    this.state = {
      code: DUMMY_CODE,
    };

    const self = this;
    this.socket.on('museData', (_museData) => {
      const museData = JSON.parse(_museData);
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
  updateCode(newCode) {
    this.setState({
      code: newCode
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
    unHighlightActiveLine();
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
    unHighlightActiveLine();
    this.setState({
      activeLineNo: undefined
    });
  }
  render() {
    const options = {
      lineNumbers: true,
      viewportMargin: 0,
    };
    return (<div>
            <RTChart fields={['concentration']} data={this.state.museData} />
            <Codemirror className='viewer' ref="codemirror" value={this.state.code} onChange={this.updateCode.bind(this)} options={options} />
            <input ref="activeLine"></input>
            <button onClick={this.highlightActiveLine.bind(this)}>Highlight Active Line</button>
            </div>);
  }
}

export default App;
