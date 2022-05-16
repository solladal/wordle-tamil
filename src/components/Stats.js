import React from 'react';
import { StatsBar } from './StatsBar';

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
    var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    tomorrow.setHours(0, 0, 0, 0);
    var time = new Date(tomorrow - Date.now()).toISOString().slice(11, 19);
    this.setState({ timer: time });
  }

  render() {

    return (
      <div>
        <h3 className="statsHeader">புள்ளி விவரங்கள்</h3>
        <div className="statsContainer" darkmode={this.props.darkMode}>
          <div>
            <div className="statsValue">{this.props.stats.gamesPlayed}</div>
            <div className="statsDesc">ஆடியது</div>
          </div>

          <div>
            <div className="statsValue">
              {Math.round(
                (this.props.stats.gamesWon / this.props.stats.gamesPlayed) * 100
              ) || 0}
            </div>
            <div className="statsDesc">வாகை%</div>
          </div>
          <div>
            <div className="statsValue">{this.props.stats.currentStreak}</div>
            <div className="statsDesc">நடப்பு வாகை நீட்சி</div>
          </div>
          <div>
            <div className="statsValue">{this.props.stats.maxStreak}</div>
            <div className="statsDesc">உச்ச வாகை நீட்சி</div>
          </div>
          <div>
            <div className="statsValue">
              {Math.round(this.props.stats.averageGuess)}
            </div>
            <div className="statsDesc">சராசரி கணிப்பு</div>
          </div>
        </div>
        <StatsBar guesses={this.props.stats.guesses} rowIndex={this.props.rowIndex} gameState={this.props.gameState} />
        <div className="statsContainer2" darkmode={this.props.darkMode}>
          <div>
            <div>
              {(this.props.previousWord && <strong>முந்தைய வேடல்:</strong>)}
            </div>
            <div>
              <p className="lastWordle">{this.props.previousWord}</p>
            </div>
          </div>
          <div>
            <div>
              {(this.props.gameState === 'WON' || this.props.gameState === 'LOST') && (<b>அடுத்த வேடல்:</b>)}
            </div>
            <div>
              {(this.props.gameState === 'WON' || this.props.gameState === 'LOST') && (<p className="lastWordle timer">{this.state.timer}</p>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
