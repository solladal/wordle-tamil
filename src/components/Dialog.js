import React from 'react';
import { Stats } from './Stats';
import { Board } from './Board';
import { Settings } from './Settings';
import { split } from '../util/languageUtil';
import { AiOutlineShareAlt } from 'react-icons/ai'
import Snackbar from '@mui/material/Snackbar';

export class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.wordleIndex = this.props.mode.getWordleIndex();
    this.state = { snackbar: { open: false, message: '' } }
    this.handleClose = this.handleClose.bind(this);
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

  copyClipBoard() {
    var filterTileColors = this.props.tileColors.filter(
      (row) => row.length > 0
    );
    var attemptsCount = filterTileColors.length;
    var value =
      '#WORDLE_TAMIL ' +
        this.wordleIndex +
        '  ' +
        attemptsCount +
        '/' +
        6 +
        '\n' +
        '#வேடல்' +
        '\n' + (this.props.mode.isSentamilMode() ? '#இலக்கிய_சொல்லாடல் ' : '') + (this.props.mode.isEasyMode() ? '*எளிய முறையில்*' : '') +
          '\n';

    filterTileColors.forEach((row) => {
      value = value + row.map((tile) => this.emojis[tile]).join('') + '\n';
    });

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
      value  = value + document.location.href;
      navigator.clipboard.writeText(value);
      this.setState({ snackbar: { open: true, message: 'copied to clipboard' } })
      return value;
    }
  }

  getTitle() {
    var filterTileColors = this.props.tileColors.filter(
      (row) => row.length > 0
    );
    var attemptsCount = filterTileColors.length;
    var value =
      '#WORDLE_TAMIL - ' +
      this.wordleIndex +
      '  ' +
      attemptsCount +
      '/' +
      6 +
      '\n';
    return value;
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar: { open: false } });
  };

  getContent() {
    const darkMode = this.props.darkMode ? "true" : "false";
    if (this.props.page == 'won') {
      return (
        <div id="wonDialog">
          <h2>Congrats You Won !!</h2>

          <div className="copySection">
            <div>
              <div>
                <div>
                  <strong> {this.getTitle()} </strong>
                </div>
                {this.props.tileColors.map((row) => (
                  <div>
                    {' '}
                    {Object.values(row).map((tile) => this.emojis[tile])}
                  </div>
                ))}
                <div>#வேடல்</div>
              </div>
              <br />
              <div>
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
            {/* <div className="timerSection">
              <div>
                <div>
                  <strong>
                    LAST WORDLE: <p className="lastWordle">{getPreviousWord()}</p>
                  </strong>
                </div>
                <div>
                  <b>NEXT WORDLE:</b>
                </div>
                <p className="lastWordle timer">{this.state.timer}</p>
              </div>
            </div> */}
          </div>
        </div>
      );
    } else if (this.props.page === 'stats') {
      return <Stats stats={this.props.stats} darkMode={darkMode} gameState={this.props.gameState} previousWord={this.props.mode.getPreviousWord()} />;
    } else if (this.props.page === 'lost') {
      return (
        <div>
          <h2>Sorry Better luck Next Time !!</h2>
          <section>Wait until tomorrow for the correct Wordle</section>
        </div>
      );
    } else if (this.props.page === 'prevAns') {
      return (
        <div>
          <strong>PREVIOUS WORD</strong>
          <p className="lastWordle">{this.props.mode.getPreviousWord()}</p>
          <Board
            board={this.props.prevBoard}
            wordleLength={split(this.props.mode.getPreviousWord()).length}
            tileColors={this.props.prevTileColors}
          />
        </div>
      );
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
        <div className="modal-content" darkMode={darkMode}>
          <span className="close" onClick={this.props.onClose}>
            &times;
          </span>
          <p>{this.getContent()}</p>
        </div>
      </div>
    );
  }
}
