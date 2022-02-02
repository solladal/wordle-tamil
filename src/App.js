import React from 'react';
import './style.css';
import { Keyboard1 } from './components/Keyboard1';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { Help } from './components/Help';
import { Dialog } from './components/Dialog';
import { split, compare, pickColorByOrder } from './util/languageUtil';

import { getWordOfDay, isSameDay } from './util/words';

export default class App extends React.Component {
  //TOTO
  // .tile-row -> correct auto align based in wordleLength

  chances = 6;
  worldToMatch = getWordOfDay();
  wordleLength = split(this.worldToMatch).length;

  constructor(props) {
    super(props);
    // localStorage.removeItem('wordle-tamil-state');
    const localstate = localStorage.getItem('wordle-tamil-state');

    if (localstate) {
      this.state = this.getStateFromLocaleStorage(localstate);
    } else {
      this.state = this.getDefaultState();
    }

    this.onKeyInput = this.onKeyInput.bind(this);
  }

  getStateFromLocaleStorage(localstate) {
    let state;
    let previousState = JSON.parse(localstate);
    if (isSameDay(previousState.lastUpdated)) {
      state = JSON.parse(localstate);
    } else {
      if (previousState.gameState == 'LOST') {
        state = {
          ...this.getDefaultState(),
          page: 'prevAns',
          prevBoard: previousState.board,
          prevTileColors: previousState.tileColors,
        };
      } else {
        state = { ...this.getDefaultState(),gameEndTimeStamp:previousState.gameEndTimeStamp, page: 'game' };
      }
    }
    const localStatistics = localStorage.getItem('wordle-tamil-statistics');
    if (localStatistics) {
      state.statistics = JSON.parse(localStatistics);
    } else {
      state.statistics = this.getDefaultStatistics();
    }
    return state;
  }

  getDefaultState() {
    return {
      board: Array(this.chances).fill(null),
      tileColors: Array(this.chances).fill([]),
      rowIndex: 0,
      won: false,
      selectedKeys: {},
      page: 'help',
      gameState: 'INPROGRESS',
      gameEndTimeStamp: { previous: '', current: '' },
      statistics: this.getDefaultStatistics(),
    };
  }

  getDefaultStatistics() {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      averageGuess: 0,
    };
  }

  getUpdatedSelectedKeys(letterColors) {
    let tempSelectedKeys = this.state.selectedKeys;
    for (let i in letterColors) {
      if (tempSelectedKeys[i]) {
        tempSelectedKeys[i] = pickColorByOrder(
          tempSelectedKeys[i],
          letterColors[i]
        );
      } else {
        tempSelectedKeys[i] = letterColors[i];
      }
      if (i.length == 2) {
        const firstLetter = i.charAt(i.length - 2);
        if(tempSelectedKeys[i].includes('partial')) {
          //if வே is partially correct, set வ as partial correct and வே as incorrect
          tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter],tempSelectedKeys[i]);
          tempSelectedKeys[i] = 'gray';
        } else if(tempSelectedKeys[i] == 'yello'){
          //if வே is in wrong spot, set வ as partial correct
          tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter],'yello-partial');
        } else if(tempSelectedKeys[i] == 'gray') {
          //if வே is in incorrect, set வ is also inorrect
          tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter],'gray');
        } else if(tempSelectedKeys[i] == 'green') {
          //if வே is in correct, set வ is also partially correct
          tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter],'green-partial');
        }
        
      }
    }
    return tempSelectedKeys;
  }

  getIncrementedStatistics(won, guessNumber) {
    let statistics = this.state.statistics;
    statistics.gamesPlayed = statistics.gamesPlayed + 1;
    statistics.gamesWon = won ? statistics.gamesWon + 1 : statistics.gamesWon;
    statistics.currentStreak = won ? statistics.currentStreak + 1 : 0;
    if (statistics.currentStreak > statistics.maxStreak) {
      statistics.maxStreak = statistics.currentStreak;
    }
    statistics.averageGuess =
      statistics.averageGuess +
      (guessNumber - statistics.averageGuess) / statistics.gamesPlayed;
    return statistics;
  }

  getUpdatedGameEndTimeStamp() {
    return {
      previous: this.state.gameEndTimeStamp.current,
      current: Date.now(),
    };
  }

  onKeyInput(val) {
    if (this.state.gameState === 'INPROGRESS') {
      if (val === 'enter') {
        let guess = this.state.board[this.state.rowIndex];
        if (split(guess).length == this.wordleLength) {
          let result = compare(guess, this.worldToMatch);
          if (result[0]) {
            let tempTileColors = this.state.tileColors;
            let letterColors = result[1];
            let tempSelectedKeys = this.getUpdatedSelectedKeys(letterColors);
            tempTileColors[this.state.rowIndex] = Array(this.wordleLength).fill(
              'green'
            );
            this.setState(
              {
                won: true,
                page: 'won',
                gameState: 'WON',
                tileColors: tempTileColors,
                selectedKeys: tempSelectedKeys,
                gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                statistics: this.getIncrementedStatistics(
                  true,
                  this.state.rowIndex + 1
                ),
              },
              () => {
                let gameState = { ...this.state, lastUpdated: Date.now() };
                gameState.statistics = undefined;
                localStorage.setItem(
                  'wordle-tamil-state',
                  JSON.stringify(gameState)
                );
                localStorage.setItem(
                  'wordle-tamil-statistics',
                  JSON.stringify(this.state.statistics)
                );
              }
            );
          } else {
            let tempTileColors = this.state.tileColors;
            tempTileColors[this.state.rowIndex] = result[1];
            
            let tempSelectedKeys = this.getUpdatedSelectedKeys(result[2]);
            if (this.state.rowIndex == 5) {
              this.setState(
                (prevState, props) => ({
                  page: 'lost',
                  gameState: 'LOST',
                  rowIndex: prevState.rowIndex + 1, //
                  tileColors: tempTileColors,
                  selectedKeys: tempSelectedKeys,
                  gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                  statistics:
                    prevState.rowIndex == 5
                      ? this.getIncrementedStatistics(
                          false,
                          this.state.rowIndex + 1
                        )
                      : this.state.statistics,
                }),
                () => {
                  let gameState = { ...this.state, lastUpdated: Date.now() };
                  gameState.statistics = undefined;
                  localStorage.setItem(
                    'wordle-tamil-state',
                    JSON.stringify(gameState)
                  );
                  localStorage.setItem(
                    'wordle-tamil-statistics',
                    JSON.stringify(this.state.statistics)
                  );
                }
              );
            } else {
              this.setState(
                (prevState, props) => ({
                  page: 'game',
                  gameState: 'INPROGRESS',
                  rowIndex: prevState.rowIndex + 1, //
                  tileColors: tempTileColors,
                  selectedKeys: tempSelectedKeys,
                }),
                () => {
                  let gameState = { ...this.state, lastUpdated: Date.now() };
                  gameState.statistics = undefined;
                  localStorage.setItem(
                    'wordle-tamil-state',
                    JSON.stringify(gameState)
                  );
                }
              );
            }
          }
        }
      } else {
        const currentBoard = this.state.board;
        currentBoard[this.state.rowIndex] = val;
        this.setState({ board: currentBoard });
      }
    }
  }

  render() {
    return (
      <div class="game">
        {this.state.page && (
          <div class="mainBoard" page={this.state.page}>
            <Header
              onHelp={() => this.setState({ page: 'help' })}
              onStats={() => this.setState({ page: 'stats' })}
              onFeedback={() => this.setState({ page: 'feedback' })}
            />
            <Board
              board={this.state.board}
              wordleLength={this.wordleLength}
              tileColors={this.state.tileColors}
              page={this.state.page}
            />
            <Keyboard1
              onKeyInput={this.onKeyInput}
              wordleLength={this.wordleLength}
              selectedKeys={this.state.selectedKeys}
              won={this.state.won}
              page={this.state.page}
            />
          </div>
        )}
        {this.state.page === 'help' && (
          <Help
            page={this.state.page}
            onClose={() => this.setState({ page: 'game' })}
          />
        )}
        <Dialog
          tileColors={this.state.tileColors}
          page={this.state.page}
          stats={this.state.statistics}
          prevBoard={this.state.prevBoard}
          prevTileColors={this.state.prevTileColors}
          gameState={this.state.gameState}
          onClose={() => this.setState({ page: 'game' })}
        />
      </div>
    );
  }
}
