import React from 'react';
import Codemirror from 'react-codemirror';

class App extends React.Component {
  constructor(props) {
    super(props);
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
      Of castles I used to build in air."
    };
  }
  updateCode = (newCode) => {
    this.setState({
      code: newCode
    });
  };
  render() {
    var options = {
      lineNumbers: true
    };
    return (<div>
      <Codemirror value={this.state.code} onChange={this.updateCode} options={options} />
      <button ref="test" onClick={this.testClick}/>Clicky</button>
    </div>);
  }

  testClick = (ev) => {
    console.log(ev);
  };
}

export default App;
