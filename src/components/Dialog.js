import React from 'react';
import { getPreviousWord, wordleIndex } from '../util/words';
import { Stats } from './Stats';
import { Board } from './Board';
import { split } from '../util/languageUtil';
import {AiOutlineShareAlt} from 'react-icons/ai'

export class Dialog extends React.Component {
  wordleIndex = wordleIndex();
  constructor(props) {
    super(props);
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
      '\n';
    //

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
      navigator.clipboard.writeText(value);
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

  getContent() {
    if (this.props.page == 'won') {
      return (
        <div id="wonDialog">
          <h2>Congrats You Won !!</h2>

          <div class="copySection">
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
                  class="share-button"
                  onClick={() => this.copyClipBoard()}
                >
                  {navigator.share ? 'SHARE' : 'COPY'}
                  <AiOutlineShareAlt className='share-button'/>
                </button>
              </div>
            </div>
            {/* <div class="timerSection">
              <div>
                <div>
                  <strong>
                    LAST WORDLE: <p class="lastWordle">{getPreviousWord()}</p>
                  </strong>
                </div>
                <div>
                  <b>NEXT WORDLE:</b>
                </div>
                <p class="lastWordle timer">{this.state.timer}</p>
              </div>
            </div> */}
          </div>
        </div>
      );
    } else if (this.props.page === 'stats') {
      return <Stats stats={this.props.stats} gameState={this.props.gameState}/>;
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
          <p class="lastWordle">{getPreviousWord()}</p>
          <Board
            board={this.props.prevBoard}
            wordleLength={split(getPreviousWord()).length}
            tileColors={this.props.prevTileColors}
          />
        </div>
      );
    } else if (this.props.page === 'feedback') {
      return (
        <div>
          <div class="container">
            <p>
              <strong>FEEDBACK:</strong>
            </p>
            <p>
              <a
                href="https://twitter.com/intent/tweet?screen_name=tamil_wordle"
                target="blank"
                title="@tamil_wordle"
              >
                Twitter
              </a>
            </p>
            <p>
              <a
                href="mailto:wordletamil@gmail.com?subject=Feedback"
                title="wordletamil@gmail.com"
              >
                Email
              </a>
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          this is else part {'' + this.props.won + ',' + this.props.page}
        </div>
      );
    }
  }

  render() {
    return (
      <div id="myModal" class="modal" page={this.props.page}>
        <div class="modal-content">
          <span class="close" onClick={this.props.onClose}>
            &times;
          </span>
          <p>{this.getContent()}</p>
        </div>
      </div>
    );
  }
}
