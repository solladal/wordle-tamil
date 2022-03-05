import React from 'react';
import { split } from '../util/languageUtil';
import Snackbar from '@mui/material/Snackbar';
import { readSettings } from '../util/stateUtil'

export class Keyboard1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: '', settings: readSettings(), snackbar: { open: false, message: '' } };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate() {
    Array.from(document.getElementsByClassName("key"))
    .filter(elem => elem.id.length > 1 && ['ொ', 'ோ','ௌ','ை'].includes(elem.id.charAt(1)))
    .forEach(elem => elem.setAttribute('shorten', ''));
  }

  handleClick(val) {
    if (!this.props.won && !this.props.disableKeyBoardInput) {
      if (val == 'enter') {
        if (split(this.state.word).length === this.props.wordleLength) {
          this.props.onKeyInput('enter');
          this.setState({ word: '' });
        } else {
          this.setState({ snackbar: { open: true, message: this.props.wordleLength + ' எழுத்து சொல்லை முழுமையாக நிரப்புக' } })
        }
      } else if (val == 'backSpace') {
        this.setState({
          word: this.state.word.substring(0, this.state.word.length - 1),
        });
        this.props.onKeyInput(
          this.state.word.substring(0, this.state.word.length - 1)
        );
      } else {
        let tempWord = this.state.word;
        tempWord = tempWord.concat(val);
        if (split(tempWord).length <= this.props.wordleLength) {
          // if (this.state.settings.easyMode) {
             
          //   let tempWordSplit = split(this.state.word.concat(val))
          //   let currentIndex = tempWordSplit.length-1;
          //   let tempCorrectWordSplit = split(this.props.worldToMatch);
          //   if (tempCorrectWordSplit[currentIndex].length === 2 && (tempWordSplit[currentIndex].slice(0,1) === tempCorrectWordSplit[currentIndex].slice(0,1))) {
          //     this.setState({ word: this.state.word.concat(val).concat(tempCorrectWordSplit[tempWordSplit.length-1].slice(1))});
          //     this.props.onKeyInput(this.state.word.concat(val).concat(tempCorrectWordSplit[tempWordSplit.length-1].slice(1)));
          //   } else {
          //     this.setState({ word: this.state.word.concat(val) });
          //     this.props.onKeyInput(this.state.word.concat(val));
          //   }

          // } else {
          //   this.setState({ word: this.state.word.concat(val) });
          //   this.props.onKeyInput(this.state.word.concat(val));
          // }
          this.setState({ word: this.state.word.concat(val) });
            this.props.onKeyInput(this.state.word.concat(val));

        }
      }
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar: { open: false } });
  };

  render() {
    const mei = [
      'க',
      'ங',
      'ச',
      'ஞ',
      'ட',
      'ண',
      'த',
      'ந',
      'ப',
      'ம',
      'ய',
      'ர',
      'ல',
      'வ',
      'ழ',
      'ள',
      'ற',
      'ன',
    ];
    const map = {
      அ: '்',
      ஆ: 'ா',
      இ: 'ி',
      ஈ: 'ீ',
      உ: 'ு',
      ஊ: 'ூ',
      எ: 'ெ',
      ஏ: 'ே',
      ஐ: 'ை',
      ஒ: 'ொ',
      ஓ: 'ோ',
      ஔ: 'ௌ',
    };
    const darkMode = this.props.darkMode ? "true" : "false";
    //['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ']
    return (
      <div className="keyboard" won={this.props.won + ''}>
        <div className="keyboardRow">
          {['அ', 'ஆ', 'இ', 'ஈ', 'க', 'ச', 'ட', 'த', 'ப', 'ற']
            .map((l) => {
              let lastLetter = this.state.word.charAt(
                this.state.word.length - 1
              );
              if (mei.includes(lastLetter) && map[l]) {
                return lastLetter.concat(map[l]);
              } else {
                return l;
              }
            })
            .map((l) => {
              return (
                <button
                  id={l}
                  className="key"
                  key-state={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                  darkMode={darkMode}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div className="keyboardRow">
          {['உ', 'ஊ', 'எ', 'ஏ', 'ங', 'ஞ', 'ண', 'ந', 'ம', 'ன']
            .map((l) => {
              let lastLetter = this.state.word.charAt(
                this.state.word.length - 1
              );
              if (mei.includes(lastLetter) && map[l]) {
                return lastLetter.concat(map[l]);
              } else {
                return l;
              }
            })
            .map((l) => {
              return (
                <button
                  id={l}
                  className="key"
                  key-state={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                  darkMode={darkMode}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div className="keyboardRow">
          {['ஐ', 'ஒ', 'ஓ', 'ஔ', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள']
            .map((l) => {
              let lastLetter = this.state.word.charAt(
                this.state.word.length - 1
              );
              if (mei.includes(lastLetter) && map[l]) {
                return lastLetter.concat(map[l]);
              } else {
                return l;
              }
            })
            .map((l) => {
              return (
                <button
                  id={l}
                  className="key"
                  key-state={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                  darkMode={darkMode}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div className="keyboardLastRow">
          <button className="key keyLast" onClick={() => this.handleClick('ஃ')} darkMode={darkMode}>
            ஃ
          </button>
          <button
            className="key enterKey"
            onClick={() => this.handleClick('enter')}
            darkMode={darkMode}
          >
            சரிபார்
          </button>
          <button
            className="key keyLast"
            onClick={() => this.handleClick('backSpace')}
            darkMode={darkMode}
          >
            ⌫
          </button>
        </div>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.snackbar.open}
          autoHideDuration={1000}
          onClose={this.handleClose}
          message={this.state.snackbar.message}
        />
      </div>
    );
  }
}
