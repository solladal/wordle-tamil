import React from 'react';
import { GameTile } from './GameTile';
import { split } from '../util/languageUtil';

export class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const attrs = this.props.wordleLength >= 5 ? {length:this.props.wordleLength} : {};
    return (
      <div className="board" {...attrs}>
        {this.props.board.map((word, index) => {
          var rows = [];
          var wordArr = split(word);
          for (var i = 0; i < this.props.wordleLength; i++) {
            rows.push(
              <GameTile
                id={i}
                key={i+'_'+index}
                value={wordArr[i]}
                star={this.props.tileColors[index][i] === 'green-partial' && this.props.starPositions && this.props.starPositions[index] && this.props.starPositions[index][i]}
                heart={this.props.heartPositions && this.props.heartPositions[index] && this.props.heartPositions[index][i]}
                color={this.props.tileColors[index][i]}
                darkMode={this.props.darkMode}
              />
            );
          }
          return (
            <div key={index} className="tile-row" length={this.props.wordleLength}>
              {rows}
            </div>
          );
        })}
      </div>
    );
  }
}
