import React from 'react';
import { GameTile } from './GameTile';
import { split } from '../util/languageUtil';

export class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="board">
        {this.props.board.map((word, index) => {
          var rows = [];
          var wordArr = split(word);
          for (var i = 0; i < this.props.wordleLength; i++) {
            rows.push(
              <GameTile
                value={wordArr[i]}
                color={this.props.tileColors[index][i]}
              />
            );
          }
          return (
            <div class="tile-row" length={this.props.wordleLength}>
              {rows}
            </div>
          );
        })}
      </div>
    );
  }
}
