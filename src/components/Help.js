import React from 'react';
import { GameTile } from './GameTile';
import {AiFillCloseCircle, AiOutlineCloseCircle} from 'react-icons/ai'

export class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tamil:true}
  }

  getContentInEnglish() {
    return (<div className="dialog" page={this.props.page}>
    <div className="helpHeader">
      <div />
      <h2>HOW TO PLAY</h2>
      <AiFillCloseCircle onClick={this.props.onClose}/>
      {/* <icon className="closeIcon" onClick={this.props.onClose}>
        X
      </icon> */}
    </div>
    <div>
      <p>
        Guess the <strong>WORDLE</strong> in 6 tries.
      </p>
      <p>Hit the enter button to submit.</p>
      <p>
        After each guess, the color of the tiles will change to show how
        close your guess was to the word.
      </p>
      <hr />
      <strong>REMEMBER</strong>
      <p><GameTile value="h" color="green" /> - right</p>
      <p><GameTile value="h" color="yello" /> - right letter but wrong position </p>
      <p><GameTile value="h" color="green-partial" /> - half correct in same position </p>
      <p><GameTile value="h" color="yello-partial" /> - half correct but different position</p>
      <p><GameTile value="h" color="gray" /> - wrong </p>
      <hr />

      <div className="tile-row helprow" length="4">
        <GameTile value="தெ" color="green" />
        <GameTile value="ன்" color="" />
        <GameTile value="ற" color="" />
        <GameTile value="ல்" color="" />
      </div>
      <p>
        The letter <strong>தெ</strong> is in the word and in the correct
        spot.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="மி" color="" />
        <GameTile value="ன்" color="yello" />
        <GameTile value="ன" color="" />
        <GameTile value="ல்" color="" />
      </div>
      <p>
        The letter <strong>ன்</strong> is in the word but in the wrong spot.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="அ" color="" />
        <GameTile value="ச்" color="" />
        <GameTile value="ச" color="" />
        <GameTile value="ம்" color="gray" />
      </div>
      <p>
        The letter <strong>ம்</strong> is not in the word in any spot.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="பௌ" color="" />
        <GameTile value="ர்" color="green-partial" />
        <GameTile value="ண" color="" />
        <GameTile value="மி" color="" />
      </div>
      <p>
        The letter <strong>ர்</strong> is not in the word but one of the
        variations of
        <strong> ர்</strong>, like <strong>ரா, ரி , ரீ, ரு, ... </strong> is
        in the word in the same spot.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="அ" color="" />
        <GameTile value="கி" color="yello-partial" />
        <GameTile value="ல" color="" />
        <GameTile value="ம்" color="" />
      </div>
      <p>
        The letter <strong> கி</strong> is not in the word but one of
        the variations of
        <strong> கி</strong>, like <strong>க், க, கா, கு, ... </strong> is
        in the word but in different spot.
      </p>
      <hr />
     
      <p>
        <strong>A new WORDLE will be available each day!</strong>
      </p>
    
      <br />
    </div>
  </div>)
  }

  getContentInTamil() {
    const darkMode = this.props.darkMode ? "true" : "false";
    return (<div className="dialog" darkMode={darkMode} page={this.props.page}>
    <div className="helpHeader" darkMode={darkMode}>
      <div />
      <h2>எப்படி விளையாடுவது</h2>
      <AiOutlineCloseCircle className='closeIcon' onClick={this.props.onClose}/>
      {/* <icon className="closeIcon" onClick={this.props.onClose}>
        X
      </icon> */}
    </div>
    <div>
      <p>மறைந்துள்ள சொல்லை 6 முயற்சிகளில் கண்டுபிடிக்க.</p>
      <p>ஒரு சொல்லை நிரப்பி <strong>சரிபார்</strong> பொத்தானை கிளிக் செய்யவும்.</p>
      <p>
      கீழுள்ள நிற குறிப்புகளை கொண்டு சொல்லின் எழுத்துக்களை சரிபார்க்க.
      </p>
      <hr />
      <strong>நினைவில் கொள்க</strong>
      <p><GameTile value="h" color="green" /> - சரியானது</p>
      <p><GameTile value="h" color="yello" /> - சரியானது ஆனால் வேறு இடம் </p>
      <p><GameTile value="h" color="green-partial" /> - பாதி சரியானது </p>
      <p><GameTile value="h" color="yello-partial" /> - பாதி சரியானது ஆனால் வேறு இடம் </p>
      <p><GameTile value="h" color="gray" /> - தவறானது </p>
      <hr />
      
      <div className="tile-row helprow" length="4">
        <GameTile value="தெ" color="green" />
        <GameTile value="ன்" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ற" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ல்" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>தெ</strong> சொல்லின் சரியான இடத்தில உள்ளது.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="மி" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ன்" color="yello" />
        <GameTile value="ன" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ல்" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>ன்</strong> சொல்லில் உள்ளது அனால் வேறு இடத்தில உள்ளது.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="அ" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ச்" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ச" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ம்" color="gray" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>ம்</strong> சொல்லில் எங்கும் இடம்பெறவில்லை.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="பௌ" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ர்" color="green-partial" />
        <GameTile value="ண" color="" darkMode={this.props.darkMode}/>
        <GameTile value="மி" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>ர்</strong> சொல்லில் இடம்பெறவில்லை தவிர <strong>ர</strong>கர வரிசையில் வேறு ஏதோ எழுத்து (<strong>ரா, ரி , ரீ, ரு, ...</strong>) <strong>இதே இடத்தில்</strong> இடம்பெற்றுள்ளது.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="அ" color="" darkMode={this.props.darkMode}/>
        <GameTile value="கி" color="yello-partial" />
        <GameTile value="ல" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ம்" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>கி</strong> சொல்லில் இடம்பெறவில்லை தவிர <strong>க</strong>கர வரிசையில் வேறு ஏதோ எழுத்து (<strong>க், க, கா, கு, ...</strong>) <strong>வேறு இடத்தில்</strong> இடம்பெற்றுள்ளது.
      </p>
      <hr />
     
      <p>
        <strong>நாள்தோறும் ஒரு புதிய சொல் இடம்பெறும்!</strong>
      </p>
    
      <br />
    </div>
  </div>)
  }

  getContent() {
    if(this.state.tamil) {
      return this.getContentInTamil();
    } else {
      return this.getContentInEnglish();
    }
  }

  render() {
    return this.getContentInTamil();
  }
}
