import React from 'react';
import { getPreviousWord } from '../util/words';

export class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timer: '' };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    var tomorrow = new Date(new Date().setDate(new Date().getDate()+1));
    var time = new Date(
      Date.parse(
        [
          tomorrow.getMonth() + 1,
          tomorrow.getDate(),
          tomorrow.getFullYear(),
        ].join()
      ) - Date.now()
    )
      .toISOString()
      .slice(11, 19);
    this.setState({ timer: time });
  }

  render() {
    return (
      <div>
        <h3 class="statsHeader">STATISTICS</h3>
        <div class="statsContainer">
          <div>
            <div class="statsValue">{this.props.stats.gamesPlayed}</div>
            <div>Played</div>
          </div>

          <div>
            <div class="statsValue">
              {Math.round(
                (this.props.stats.gamesWon / this.props.stats.gamesPlayed) * 100
              ) || 0}
            </div>
            <div>Win%</div>
          </div>
          <div>
            <div class="statsValue">{this.props.stats.currentStreak}</div>
            <div>Current Streak</div>
          </div>
          <div>
            <div class="statsValue">{this.props.stats.maxStreak}</div>
            <div>Max Streak</div>
          </div>
          <div>
            <div class="statsValue">
              {Math.round(this.props.stats.averageGuess)}
            </div>
            <div>Average Guess</div>
          </div>
        </div>
        <div class="statsContainer2">
          <div>
            <div>
              {(getPreviousWord() &&<strong>LAST WORDLE:</strong>)}
            </div>
            <div>
              <p class="lastWordle">{getPreviousWord()}</p>
            </div>
          </div>
          <div>
            <div>
              {(this.props.gameState === 'WON' || this.props.gameState === 'LOST') && (<b>NEXT WORDLE:</b>)}
            </div>
            <div>
              {(this.props.gameState === 'WON' || this.props.gameState === 'LOST') && (<p class="lastWordle timer">{this.state.timer}</p>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
