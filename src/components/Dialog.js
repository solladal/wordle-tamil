import React from 'react';
import { Stats } from './Stats';
import { Board } from './Board';
import { Settings } from './Settings';
import { UpdateInfo } from './UpdateInfo';
import { split } from '../util/languageUtil';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { BiLinkExternal } from 'react-icons/bi';
import { MdReplay } from 'react-icons/md';
import Snackbar from '@mui/material/Snackbar';
import { GameTile } from './GameTile';

// Pages for which #myModal is actually visible (kept in sync with the
// #myModal[page='...'] display:inline-flex rules in style.css).
const VISIBLE_PAGES = ['stats', 'updateInfo', 'won', 'lost', 'prevAns', 'feedback'];

export class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { snackbar: { open: false, message: '' }, [props.mode.mode]: { ans: '', showAnsClicked: false } }
    this.handleClose = this.handleClose.bind(this);
    this.onShowAns = this.onShowAns.bind(this);
    this.getClipBoardContent = this.getClipBoardContent.bind(this);
    this.closeRef = React.createRef();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    if (VISIBLE_PAGES.includes(this.props.page)) {
      this.focusClose();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  // Move focus onto the close control whenever the modal becomes visible,
  // so a keyboard user can immediately press Enter/Space to close it
  // instead of needing to Tab to it first (nothing is focused by default
  // since the modal is shown/hidden purely via CSS, not conditional render).
  focusClose() {
    if (this.closeRef.current) {
      this.closeRef.current.focus();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape' && VISIBLE_PAGES.includes(this.props.page)) {
      this.props.onClose();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.state[this.props.mode.mode]) {
      this.setState({ [this.props.mode.mode]: { ans: '', showAnsClicked: false } });
    }
    if (prevProps.page !== this.props.page && VISIBLE_PAGES.includes(this.props.page)) {
      this.focusClose();
    }
  }

  onShowAns() {
    let emptyAns = split(this.props.mode.getWordOfDay()).map(l => '_').join('');

    this.setState({ [this.props.mode.mode]: { ans: emptyAns, showAnsClicked: true } })
    setTimeout(() => this.setState({ [this.props.mode.mode]: { ans: this.props.mode.getWordOfDay(), showAnsClicked: true } }), 500)
  }

  emojis = {
    green: '🟩',
    yello: '🟨',
    gray: '⬜',
    'green-partial': '🟦',
    'yello-partial': '🟦',
  };

  //   Wordle 217 2/6

  // ⬜⬜🟨🟨⬜
  // 🟩🟩🟩🟩🟩

  getClipBoardContent() {
    var filterTileColors = this.props.tileColors.filter(
      (row) => row.length > 0
    );
    var attemptsCount = this.props.gameState === 'WON' ? filterTileColors.length : 'X';
    var value =
      '#WORDLE_TAMIL ' +
      this.props.mode.wordleIndex +
      '  ' +
      attemptsCount +
      '/' +
      this.props.mode.chances +
      '\n' +
      '#வேடல்' +
      '\n' + (this.props.mode.isSentamilMode() ? '#இலக்கிய_சொல்லாடல் \n' : '') + (this.props.mode.isEasyMode() ? '*எளிய முறையில்*' : '') +
      '\n';

    filterTileColors.forEach((row) => {
      value = value + row.map((tile) => this.emojis[tile]).join('') + '\n';
    });
    return value;
  }

  copyClipBoard() {
    var value = this.getClipBoardContent();
    if (navigator.share) {
      try {
        navigator
          .share({
            title: 'WORDLE-TAMIL',
            text: value,
            url: document.location.href,
          })
          .then(() => {
            console.log('Successfully shared');
          })
          .catch((error) => {
            console.error('Something went wrong sharing the blog', error);
          });
      } catch (e) {
        alert(e);
      }
    } else {
      value = value + document.location.href;
      navigator.clipboard.writeText(value);
      this.setState({ snackbar: { open: true, message: 'copied to clipboard' } })
      return value;
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar: { open: false } });
  };

  getCopySection() {
    if(this.props.mode.gameType === 'daily') {
      return (
        <div>
        <div className="copySection">
          <div style={{ textAlign: 'left' }}>{this.getClipBoardContent().split('\n').map(item => (<div>{item}</div>))}</div>
          <br />
          <div className='share-button-container'>
            <button
              className="share-button"
              onClick={() => this.copyClipBoard()}
            >
              {navigator.share ? 'SHARE' : 'COPY'}
              {(navigator.share && <AiOutlineShareAlt className='share-button' />)}
            </button>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              open={this.state.snackbar.open}
              autoHideDuration={2000}
              onClose={this.handleClose}
              message={this.state.snackbar.message}
            />
          </div>
        </div>
        {/* <hr /> */}
        </div>);
    } else {
      return null;
    }
    
  }

  getMeaning() {
    const meaning = this.props.mode.getMeaning();
    if (!meaning) return null;
    const usageHtml = this.props.mode.getUsageHtml();
    const usageNode = this.props.mode.getUsageNode();
    return (
      <div style={{textAlign:'left'}}>
        <h3 style={{ color: '#375c71', fontFamily: 'sans-serif' }}>பொருள்:</h3>
        <p style={{ paddingLeft: '10px', fontFamily: 'sans-serif' }}>{meaning}</p>
        {(usageHtml || usageNode) && (
          <>
            <h3 style={{ color: '#375c71', fontFamily: 'sans-serif' }}>பயன்பாடு:</h3>
            <p style={{ paddingLeft: '10px', fontFamily: 'sans-serif' }}>
              {usageHtml ? <span dangerouslySetInnerHTML={{ __html: usageHtml }} /> : usageNode}
            </p>
          </>
        )}
      </div>
    );
  }

  getPreviousWordButton() {
    const darkMode = this.props.darkMode ? "true" : "false";
    // return (
    //   <div>
    //   <hr/>
    //   <div className='randomPlayIcon' onClick={this.props.onPrevious}><MdReplay className="icon" style={{fontSize:'40px'}} darkmode={darkMode}/> </div>
    //   <div className='randomPlayText'>முந்தைய வேடல்கள் விளையாட</div>
    // </div>);
    return null;
  }

  getContent() {
    const darkMode = this.props.darkMode ? "true" : "false";
    if (this.props.page === 'won') {
      return (
        <div id="wonDialog">
          <h3>வாழ்த்துக்கள்!!</h3>
          <div>
            <div style={{ display: "flex" }}>
              <div className="tile-row helprow showAnsRow" length={split(this.props.mode.getWordOfDay()).length}>
                {split(this.props.mode.getWordOfDay()).map((l, index) => <GameTile id={index}
                  value={l}
                  color={l !== '_' ? 'green' : ''}
                  darkMode={this.props.darkMode}></GameTile>)}
              </div>
              <div>
                <div className='link' >
                  <a href={'https://dt.madurai.io/' + this.props.mode.getWordOfDay()} target="_blank">
                    <BiLinkExternal />
                  </a>
                </div>
              </div>
            </div>
            {this.getMeaning()}
          </div>
          <hr />
          <br />
          {this.getCopySection()}
          {this.getPreviousWordButton()}
        </div>
      );
    } else if (this.props.page === 'stats') {
      return <Stats stats={this.props.stats}
        darkMode={darkMode}
        gameState={this.props.gameState}
        previousWord={this.props.mode.getPreviousWord()}
        rowIndex={this.props.rowIndex} />;
    } else if (this.props.page === 'lost') {
      return (
        <div className='lostDialog'>
          <h3>மன்னிக்கவும், வாய்ப்புகள் முடிந்தன!!</h3>
          {this.state[this.props.mode.mode] && !this.state[this.props.mode.mode].showAnsClicked && <button className='showAnsButton' onClick={() => this.onShowAns()}>சரியான விடை காட்டுக</button>}
          {this.state[this.props.mode.mode] && this.state[this.props.mode.mode].showAnsClicked &&
            (
              <div>
                <div style={{ display: "flex" }}>
                  <div className="tile-row helprow showAnsRow" length={split(this.props.mode.getWordOfDay()).length}>
                    {split(this.state[this.props.mode.mode].ans).map((l, index) => <GameTile
                      id={index}
                      value={l}
                      color={l !== '_' ? 'green' : ''}
                      darkMode={this.props.darkMode}></GameTile>)}
                  </div>
                  <div>
                    <div className='link' >
                      <a href={'https://dt.madurai.io/' + this.props.mode.getWordOfDay()} target="_blank">
                        <BiLinkExternal />
                      </a>
                    </div>
                  </div>
                </div>
                {this.getMeaning()}
              </div>
            )
          }
          <hr />
          <br />
          {this.getCopySection()}
          {this.getPreviousWordButton()}
        </div>
      );
    } else if (this.props.page === 'prevAns') {
      return (
        <div>
          <strong>முந்தைய வேடல்</strong>
          <p className="lastWordle">{this.props.mode.getPreviousWord()}</p>
          <Board
            board={this.props.prevBoard}
            wordleLength={split(this.props.mode.getPreviousWord()).length}
            tileColors={this.props.prevTileColors}
          />
        </div>
      );
    } else if (this.props.page === 'updateInfo') {
      return <UpdateInfo version={this.props.version} />
    } else if (this.props.page === 'feedback') {
      return <Settings />
    } else {
      return (
        <div>
          this is else part {'' + this.props.won + ',' + this.props.page}
        </div>
      );
    }
  }

  render() {
    const darkMode = this.props.darkMode ? "true" : "false";
    return (
      <div id="myModal" className="modal" page={this.props.page}>
        <div className="modal-content" darkmode={darkMode}>
          <span
            className="close"
            role="button"
            tabIndex={0}
            aria-label="மூடு - Close"
            ref={this.closeRef}
            onClick={this.props.onClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.props.onClose();
              }
            }}
          >
            &times;
          </span>
          <p>{this.getContent()}</p>
        </div>
      </div>
    );
  }
}
