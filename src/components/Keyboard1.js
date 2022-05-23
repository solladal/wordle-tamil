import React from 'react';
import { split } from '../util/languageUtil';
import Snackbar from '@mui/material/Snackbar';
import { readSettings } from '../util/stateUtil'

export class Keyboard1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: '', snackbar: { open: false, message: '' }, dictionaryCheckFailed: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate() {
    Array.from(document.getElementsByClassName("key"))
      .filter(elem => elem.id.length > 1 && ['ொ', 'ோ', 'ௌ', 'ை'].includes(elem.id.charAt(1)))
      .forEach(elem => elem.setAttribute('shorten', ''));
  }

  handleClick(val) {
    if (!this.props.won && !this.props.disableKeyBoardInput) {
      if (val === 'enter') {
        if (split(this.state.word).length === this.props.wordleLength) {
          if (this.state.word === this.props.worldToMatch) {
            this.props.onKeyInput('enter');
            this.setState({ word: '' });
          } else if (readSettings().disableDictionaryCheck || this.state.dictionaryCheckFailed) {
            this.props.onKeyInput('enter');
            this.setState({ word: '' });
          } else {
            let url = "https://ta.wiktionary.org/w/api.php?action=query&prop=categories&format=json&formatversion=2&origin=*&titles=";
            fetch(url + this.state.word).then(res => res.json()).then(res => {
              if (res.query.pages[0].missing) {
                this.setState({ snackbar: { open: true, message: 'சொல் அகராதியில் இல்லை' } })
              } else {
                this.props.onKeyInput('enter');
                this.setState({ word: '' });
              }
            }).catch(e => {
              console.log(e)
              console.log("ignore fetch error and proceed with validation")
              //ignore fetch error and proceed with validation
              this.props.onKeyInput('enter');
              this.setState({ word: '', snackbar: { open: true, message: 'அகராதியில் சரிபார்க்க முடியவில்லை' }, dictionaryCheckFailed: true });
            })
          }
        } else {
          this.setState({ snackbar: { open: true, message: this.props.wordleLength + ' எழுத்து சொல்லை முழுமையாக நிரப்புக' } })
        }
      } else if (val === 'backSpace') {
        let wordAfterBackSpace;
        if(this.state.word.endsWith('ஸ்ரீ')) {
          wordAfterBackSpace = this.state.word.replace('ஸ்ரீ', '');
        } else if (this.state.word.endsWith('க்ஷ')) {
          wordAfterBackSpace = this.state.word.replace('க்ஷ', '');
        } else {
          wordAfterBackSpace = this.state.word.substring(0, this.state.word.length - 1)
        }
        this.setState({ word: wordAfterBackSpace });
        this.props.onKeyInput(wordAfterBackSpace);
      } else {
        let tempWord = this.state.word;
        tempWord = tempWord.concat(val);
        if (split(tempWord).length <= this.props.wordleLength) {
          this.setState({ word: this.state.word.concat(val) });
          this.props.onKeyInput(this.state.word.concat(val));

        }
      }
    }
  }

  handleClose = (event, reason) => {
    // if (reason === 'clickaway') {
    //   return;
    // }

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
    const kirantham = ['ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ'];
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
    const darkMode = readSettings().darkMode ? "true" : "false";
    //['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ']
    return (
      <div className="keyboard" won={this.props.won + ''}>
        <div className="keyboardRow">
          {['அ', 'ஆ', 'இ', 'ஈ', 'க', 'ச', 'ட', 'த', 'ப', 'ற']
            .map((l) => {
              let lastLetter = this.state.word.charAt(
                this.state.word.length - 1
              );
              if(this.state.word.endsWith('க்ஷ')) {
                lastLetter = 'க்ஷ';
              }
              if ((mei.includes(lastLetter) || kirantham.includes(lastLetter)) && map[l]) {
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
                  darkmode={darkMode}
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
              if(this.state.word.endsWith('க்ஷ')) {
                lastLetter = 'க்ஷ';
              }
              if ((mei.includes(lastLetter) || kirantham.includes(lastLetter)) && map[l]) {
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
                  darkmode={darkMode}
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
              if(this.state.word.endsWith('க்ஷ')) {
                lastLetter = 'க்ஷ';
              }
              if ((mei.includes(lastLetter) || kirantham.includes(lastLetter)) && map[l]) {
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
                  darkmode={darkMode}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div className="keyboardRow" style={this.props.vadasolMode ? {justifyContent:'center'} : {justifyContent: 'space-evenly'}}>
        {this.props.vadasolMode && <div style={{display:'flex', width:'60%'}}>
          {['ஃ', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ']
            .map((l) => {
              return (
                <button
                  id={l}
                  className="key"
                  key-state={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l)}
                  darkmode={darkMode}
                >
                  {l}
                </button>
              );
            })}
          </div>}
          {!this.props.vadasolMode &&
                <button
                  id={'ஃ'}
                  className="key"
                  key-state={this.props.selectedKeys['ஃ']}
                  style={{width: '10%'}}
                  onClick={() => this.handleClick('ஃ')}
                  darkmode={darkMode}
                >
                  ஃ
                </button>
            }
        
          <button
            className="key enterKey"
            onClick={() => this.handleClick('enter')}
            darkmode={darkMode}
          >
            சரிபார்
          </button>
          
          <button
            className="key keyLast"
            onClick={() => this.handleClick('backSpace')}
            darkmode={darkMode}
          >
            ⌫
          </button>
        </div>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.snackbar.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          message={this.state.snackbar.message}
        />
      </div>
    );
  }
}
