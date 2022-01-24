import React from 'react';
import { split } from '../util/languageUtil';

export class Keyboard1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: '' };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(val) {
    if (!this.props.won) {
      if (val == 'enter') {
        //TODO handle not enouth letter
        if (split(this.state.word).length === this.props.wordleLength) {
          this.props.onKeyInput('enter');
          this.setState({ word: '' });
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
          let lastLetter = this.state.word.charAt(this.state.word.length - 1);
          this.setState({ word: this.state.word.concat(val) });
          this.props.onKeyInput(this.state.word.concat(val));
        }
      }
    }
  }

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
    //['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ']
    return (
      <div class="keyboard" won={this.props.won + ''}>
        <div class="keyboardRow">
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
                  class="key"
                  keyState={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div class="keyboardRow">
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
                  class="key"
                  keyState={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div class="keyboardRow">
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
                  class="key"
                  keyState={this.props.selectedKeys[l]}
                  onClick={() => this.handleClick(l.charAt(l.length - 1))}
                >
                  {l}
                </button>
              );
            })}
        </div>
        <div class="keyboardLastRow">
          <button class="key keyLast" onClick={() => this.handleClick('ஃ')}>
            ஃ
          </button>
          <button
            class="key enterKey"
            onClick={() => this.handleClick('enter')}
          >
            Enter
          </button>
          <button
            class="key keyLast"
            onClick={() => this.handleClick('backSpace')}
          >
            ⌫
          </button>
        </div>
      </div>
    );
  }
}
