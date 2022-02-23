import React from 'react';
import { GameTile } from './GameTile';
import { split } from '../util/languageUtil';
import { BsInfoCircle } from 'react-icons/bs'
import { Tooltip } from '@mui/material';

export class Board extends React.Component {
  constructor(props) {
    super(props);
    //this.tooltips = ['','','','','','',''];
  }

  render() {
    return (
      <div className="board">
        {this.props.board.map((word, index) => {
          var rows = [];
          var wordArr = split(word);
          for (var i = 0; i < this.props.wordleLength; i++) {
            rows.push(
              <GameTile
                id={i}
                key={i}
                value={wordArr[i]}
                color={this.props.tileColors[index][i]}
                darkMode={this.props.darkMode}
              />
            );
          }
          let tips = this.props.tooltips ? this.props.tooltips[index].map(l => <p>{l}</p>) : '';
          return (
            <div key={index} className="tile-row" length={this.props.wordleLength}>
              {rows}
              <div className='tip'>
                <Tooltip title={tips} placement="left-end" enterTouchDelay={0} leaveTouchDelay={5000}>
                  <div className='tipIcon' display={tips.length > 0 ? 'true' : 'false'} darkmode={this.props.darkMode ? 'true' : 'false'}>
                    <BsInfoCircle></BsInfoCircle>
                  </div>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
