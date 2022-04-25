import React from 'react';
import { GameTile } from './GameTile';
import {AiFillCloseCircle, AiOutlineCloseCircle} from 'react-icons/ai'
import {FaAngleDoubleDown, FaAngleDoubleUp} from 'react-icons/fa'

export class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tamil:true, moreRead:false}
    this.handleMoreRead = this.handleMoreRead.bind(this);
  }

  handleMoreRead() {
    this.setState({moreRead: !this.state.moreRead}, () => window.scrollBy(0, 300));
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
      <p>மறைந்துள்ள சொல்லை 8 முயற்சிகளில் கண்டுபிடிக்க.</p>
      <p>ஒரு சொல்லை நிரப்பி <strong>சரிபார்</strong> பொத்தானை கிளிக் செய்யவும்.</p>
      <p>
      கீழுள்ள நிற குறிப்புகளை கொண்டு சொல்லின் எழுத்துக்களை சரிபார்க்க.
      </p>
      <hr />
      <strong>நிற குறிப்புகள்</strong>
      <p/>
      <div className="tile-row helprow" length="4">
        <GameTile value="தெ" color="green" />
        <GameTile value="ன்" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ற" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ல்" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>தெ</strong> சொல்லின் சரியான இடத்தில் உள்ளது.
      </p>
      <div className="tile-row helprow" length="4">
        <GameTile value="மி" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ன்" color="yello" />
        <GameTile value="ன" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ல்" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>ன்</strong> சொல்லில் உள்ளது அனால் வேறு இடத்தில் உள்ளது.
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

      <div className="tile-row helprow" length="4">
        <GameTile value="இ" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ய" color="" darkMode={this.props.darkMode}/>
        <GameTile value="ற்" color="green-partial" darkMode={this.props.darkMode} star="true"/>
        <GameTile value="கை" color="" darkMode={this.props.darkMode}/>
      </div>
      <p>
      எழுத்து <strong>ற்</strong> சொல்லில் வேறு இடத்தில் உள்ளது, அதோடு <strong>ற்</strong> உள்ள இடத்தில் வேறு <strong>ற</strong>கர வரிசையும் இடம்பெற்றுள்ளது.
      </p>
      <hr />
      <strong>நினைவில் கொள்க</strong>
      <p><GameTile value="h" color="green" /> - சரியானது</p>
      <p><GameTile value="h" color="yello" /> - சரியானது ஆனால் வேறு இடம் </p>
      <p><GameTile value="h" color="green-partial" /> - பாதி சரியானது </p>
      <p><GameTile value="h" color="yello-partial" /> - பாதி சரியானது ஆனால் வேறு இடம் </p>
      <p><GameTile value="h" color="gray" /> - தவறானது </p>
      <hr />
      <p>
        <strong>நாள்தோறும் ஒரு புதிய சொல் இடம்பெறும்!</strong>
      </p>

      <div className="readMore" onClick={() => this.handleMoreRead()}>
      <center><strong>மேலும் படிக்க</strong></center>
      <center><strong>{this.state.moreRead ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>}</strong></center>
      </div>
      {this.state.moreRead && (
        <div className='readMoreSection'>
        <br/>
        <strong>1. ஓர் எழுத்து வரிசைக்கு இரு வண்ணங்கள் ( மஞ்சள் மற்றும் அரை-பச்சை )</strong>
          <div>மறைந்துள்ள சொல் <strong>இன்பம்</strong> எனில், </div>
        <div className="tile-row helprow" length="4">
          <GameTile value="ம" color="yello-partial"/>
          <GameTile value="னி" color="green-partial" />
          <GameTile value="த" color="gray"/>
          <GameTile value="ன்" color="yello"/>
        </div>
        <ul>
          <li>இங்கு 2<sup>வது</sup> இடம் <strong>ன</strong>-கர வரிசை உள்ளதை குறிக்கிறது (<strong>னி</strong> தவிர்த்து).</li>
          <li>4<sup>வது</sup> இடம் <strong>ன்</strong> சொல்லில் வேறு இடத்தில் உள்ளதை குறிக்கிறது.</li>
          <li>எனவே <strong>ன்</strong> 2<sup>வது</sup> இடத்தில் இருக்க அதிக வாய்ப்புகள் உள்ளது. அப்படி இல்லையேல் சொல்லில் இரு <strong>ன</strong>-கர வரிசை எழுத்துக்கள் இருக்கிறது எனலாம்.</li>
        </ul> 
        சொல்லில் ஒரே ஒரு <strong>ன்</strong> இருப்பினும் இரண்டு இடங்களிலும் வண்ண குறிப்புகள் இருப்பது குழப்பமாக தோன்றினாலும் தர்க்கரீதியாக அது சரியான குறியீடே ஆகும். ஒருவேளை 2<sup>வது</sup> இடத்தில் சாம்பல் நிறம் இருந்தால் ன-கர வரிசையே அந்த இடத்தில் இல்லை என்று தவறாக பொருள்படும்.
        </div>
      )}
    
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
