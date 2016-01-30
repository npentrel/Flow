import React from 'react';
import Codemirror from 'react-codemirror';
import io from 'socket.io-client';

const SOCKET_URI = 'http://localhost:5000';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(SOCKET_URI);
    this.socket.on('museData', (data) => {
      console.log('received: ' + JSON.stringify(data));
    });
    this.state = {
      code: " Builder, in building the little house,\n\
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
    };

  }
  updateCode(newCode) {
    this.setState({
      code: newCode
    });
  }
  render() {
    const options = {
      lineNumbers: true,
      viewportMargin: 0
    };
    return (<div>
      <Codemirror ref="codemirror" value={this.state.code} onChange={this.updateCode.bind(this)} options={options} />
      <button ref="test" onClick={this.testClick.bind(this)}>Button</button>
    </div>);
  }
  testClick(ev) {
    const cm = this.refs.codemirror.getCodeMirror();
    const currLine = cm.getCursor().line;
    const lineRange = ({
      from: Math.max(0, currLine - 3),
      to: Math.min(currLine + 3, cm.doc.size)
    })
    // TODO: for test logging
    console.log(lineRange);
    // TODO: websocket this to flask backend whenever Muse reading is received
    this.socket.emit('lineRange', lineRange);
  }
  // TODO: for test logging, remove when done
  componentDidMount() {
    this.highlightLine(2, 'red');
    this.highlightLine(9, 'yellow');
    this.highlightLine(4, 'yellow');
    this.highlightLine(5, 'red');
    this.highlightLine(6, 'green');
    this.highlightLine(8, 'green');
  }
  highlightLine(_lineNumber, color) {
    // Zero indexing
    const lineNumber = _lineNumber - 1;
    const cm = this.refs.codemirror.getCodeMirror();
    switch (color) {
      case 'red':
        cm.addLineClass(lineNumber, 'background', 'line-red');
        break;
      case 'yellow':
        cm.addLineClass(lineNumber, 'background', 'line-yellow');
        break;
      case 'green':
        cm.addLineClass(lineNumber, 'background', 'line-green');
        break;
      default:
        cm.removeLineClass(lineNumber);
    }
  }
}

export default App;
