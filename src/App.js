import React from 'react';
import './style.css';
import { Keyboard1 } from './components/Keyboard1';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { Help } from './components/Help';
import { Dialog } from './components/Dialog';
import { split, compare, pickColorByOrder, compareEasyMode } from './util/languageUtil';
import { getMode, saveNotification } from './util/stateUtil'
import { Settings } from './components/Settings';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.chances = 8; // coupled with css class .board grid-template-rows: repeat(8, 1fr);
    this.mode = getMode(this.chances);
    this.state = this.mode.initialiseGame();
    this.initialise();
    this.onKeyInput = this.onKeyInput.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.onSettingsClose = this.onSettingsClose.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
  }

  componentDidMount() {
    document.getElementsByClassName('board')[0].scrollTop = this.state.rowIndex >= 6 ? 135 : 0;
  }

  componentDidUpdate() {
    document.getElementsByClassName('board')[0].scrollTop = this.state.rowIndex >= 6 ? 135 : 0;
  }

  initialise() {
    this.worldToMatch = this.mode.getWordOfDay();
    this.wordleLength = split(this.worldToMatch).length;
  }

  getUpdatedSelectedKeys(letterColors) {
    let tempSelectedKeys = this.state.selectedKeys;
    if (letterColors) {
      for (let i in letterColors) {
        if (tempSelectedKeys[i]) {
          tempSelectedKeys[i] = pickColorByOrder(
            tempSelectedKeys[i],
            letterColors[i]
          );
        } else {
          tempSelectedKeys[i] = letterColors[i];
        }
        if (i.length === 2) {
          const firstLetter = i.charAt(i.length - 2);
          if (tempSelectedKeys[i] === 'green-partial') {
            if (letterColors[firstLetter] !== 'yello') {
              tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter], tempSelectedKeys[i]);
            }
            tempSelectedKeys[i] = 'gray'
          } else if (tempSelectedKeys[i] === 'yello-partial') {
            //if வே is partially correct, set வ as partial correct and வே as incorrect
            tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter], tempSelectedKeys[i]);
            tempSelectedKeys[i] = 'gray';
          } else if (tempSelectedKeys[i] === 'yello') {
            //if வே is in wrong spot, set வ as partial correct
            tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter], 'yello-partial');
          } else if (tempSelectedKeys[i] === 'gray') {
            //if வே is in incorrect, set வ is also inorrect
            tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter], 'gray');
          } else if (tempSelectedKeys[i] === 'green') {
            //if வே is in correct, set வ is also partially correct
            if (letterColors[firstLetter] !== 'yello') {
              tempSelectedKeys[firstLetter] = pickColorByOrder(tempSelectedKeys[firstLetter], 'green-partial');
            }
          }
        } else {
          if (letterColors[i] === 'yello' && tempSelectedKeys[i] === 'green-partial') {
            tempSelectedKeys[i] = 'yello';
          }
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
    if (won) {
      statistics.averageGuess =
        statistics.averageGuess +
        (guessNumber - statistics.averageGuess) / statistics.gamesPlayed;
    }
    return statistics;
  }

  getUpdatedGameEndTimeStamp() {
    return {
      previous: this.state.gameEndTimeStamp?.current || Date.now(),
      current: Date.now(),
    };
  }

  onKeyInput(val) {
    this.setState({ disableKeyBoardInput: true });
    if (this.state.gameState === 'INPROGRESS') {
      if (val === 'enter') {
        let guess = this.state.board[this.state.rowIndex];
        if (split(guess).length === this.wordleLength) {
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
                rowIndex: this.state.rowIndex + 1,
                gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                statistics: this.getIncrementedStatistics(
                  true,
                  this.state.rowIndex + 1
                ),
              },
              () => {
                this.mode.saveGameState(this.state);
                this.mode.saveGameStatistics(this.state.statistics, this.state.rowIndex);
              }
            );
          } else {
            let tempTileColors = this.state.tileColors;
            tempTileColors[this.state.rowIndex] = result[1];
            let tempSelectedKeys = this.getUpdatedSelectedKeys(result[2]);
            if (this.state.rowIndex === (this.chances - 1)) {
              this.setState(
                (prevState, props) => ({
                  rowIndex: this.state.rowIndex + 1, //
                  tileColors: tempTileColors,
                  selectedKeys: tempSelectedKeys,
                  starPositions: this.getUpdatedStarPositions(result[3]),
                  heartPositions: this.getUpdatedHeartPositions(result[4])
                }),
                () => {
                  if (this.mode.isEasyMode()) {
                    let timeout = result[1].includes('green-partial') ? 1000 : 0;
                    result = compareEasyMode(guess, this.worldToMatch, result[1], result[2]);

                    setTimeout(() => {
                      let tempBoard = [...this.state.board];
                      tempBoard[this.state.rowIndex - 1] = result[3];
                      this.setState(
                        {
                          board: tempBoard,
                          tileColors: tempTileColors,
                          selectedKeys: tempSelectedKeys,
                        },
                        () => {
                          setTimeout(() => {
                            this.setState({
                              won: true,
                              page: result[0] ? 'won' : 'lost',
                              gameState: result[0] ? 'WON' : 'LOST',
                              rowIndex: result[0] ? this.chances : (this.chances + 1),
                              gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                              statistics: this.getIncrementedStatistics(
                                result[0],
                                result[0] ? this.state.rowIndex : this.state.rowIndex + 1
                              ),
                            }, () => {
                              this.mode.saveGameState(this.state);
                              this.mode.saveGameStatistics(this.state.statistics, this.state.rowIndex);
                            })
                          }, timeout)
                        }
                      )
                    }, timeout);


                  } else {
                    this.setState((prevState, props) => ({
                      page: 'lost',
                      gameState: 'LOST',
                      rowIndex: (this.chances + 1),
                      gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                      statistics: this.getIncrementedStatistics(false, (this.chances + 1))
                    }),
                      () => {
                        this.mode.saveGameState(this.state);
                        this.mode.saveGameStatistics(this.state.statistics, (this.chances + 1));
                      })
                  }

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
                  starPositions: this.getUpdatedStarPositions(result[3]),
                  heartPositions: this.getUpdatedHeartPositions(result[4])
                }),
                () => {
                  if (this.mode.isEasyMode()) {
                    let timeout = result[1].includes('green-partial') ? 1000 : 0;
                    result = compareEasyMode(guess, this.worldToMatch, result[1], result[2]);
                    if (result[0]) {
                      //EasyMode- right after convertion 
                      let tempTileColors = this.state.tileColors;
                      let letterColors = result[1];
                      let tempSelectedKeys = this.getUpdatedSelectedKeys(letterColors);
                      tempTileColors[this.state.rowIndex - 1] = Array(this.wordleLength).fill(
                        'green'
                      );
                      setTimeout(() => {
                        let tempBoard = [...this.state.board];
                        tempBoard[this.state.rowIndex - 1] = result[3];
                        this.setState(
                          {
                            board: tempBoard,
                            tileColors: tempTileColors,
                            selectedKeys: tempSelectedKeys,
                          },
                          () => {
                            setTimeout(() => {
                              this.setState({
                                won: true,
                                page: 'won',
                                gameState: 'WON',
                                gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                                statistics: this.getIncrementedStatistics(
                                  true,
                                  this.state.rowIndex
                                ),
                              }, () => {
                                this.mode.saveGameState(this.state);
                                this.mode.saveGameStatistics(this.state.statistics, this.state.rowIndex);
                              })
                            }, timeout)
                          }
                        )
                      }, timeout);
                    } else {
                      //EasyMode- still not right, after convertion
                      let tempTileColors = this.state.tileColors;
                      tempTileColors[this.state.rowIndex - 1] = result[1];
                      let tempSelectedKeys = this.getUpdatedSelectedKeys(result[2]);
                      if (this.state.rowIndex === this.chances) {
                        // this.setState(
                        //   (prevState, props) => ({
                        //     page: 'lost',
                        //     gameState: 'LOST',
                        //     tileColors: tempTileColors,
                        //     selectedKeys: tempSelectedKeys,
                        //     gameEndTimeStamp: this.getUpdatedGameEndTimeStamp(),
                        //     statistics:this.getIncrementedStatistics(false,this.state.rowIndex)
                        //   }),
                        //   () => {
                        //     this.mode.saveGameState(this.state);
                        //     this.mode.saveGameStatistics(this.state.statistics);
                        //   }
                        // );
                      } else {
                        let tempBoard = [...this.state.board];
                        tempBoard[this.state.rowIndex - 1] = result[3];
                        setTimeout(() => {
                          this.setState(
                            (prevState, props) => ({
                              board: tempBoard,
                              page: 'game',
                              gameState: 'INPROGRESS',
                              tileColors: tempTileColors,
                              selectedKeys: tempSelectedKeys,
                              disableKeyBoardInput: false
                            }),
                            () => {
                              this.mode.saveGameState(this.state);
                            }
                          );
                        }, timeout)
                      }
                    }

                  } else {
                    this.setState({ disableKeyBoardInput: false }, () => this.mode.saveGameState(this.state));
                  }
                }
              );
            }
          }
        }
      } else {
        const currentBoard = this.state.board;
        currentBoard[this.state.rowIndex] = val;
        this.setState({ board: currentBoard, disableKeyBoardInput: false });
      }
    }
  }

  getUpdatedStarPositions(starPositions) {
    const tempStarPositions = { ...this.state.starPositions };
    if (starPositions) {
      for (let i of starPositions) {
        if (!tempStarPositions[this.state.rowIndex]) {
          tempStarPositions[this.state.rowIndex] = {};
        }
        tempStarPositions[this.state.rowIndex][i] = true;
      }
    }
    return tempStarPositions;
  }

  getUpdatedHeartPositions(heartPositions) {
    const tempHeartPositions = { ...this.state.heartPositions };
    if (heartPositions) {
      for (let i of heartPositions) {
        if (!tempHeartPositions[this.state.rowIndex]) {
          tempHeartPositions[this.state.rowIndex] = {};
        }
        tempHeartPositions[this.state.rowIndex][i] = true;
      }
    }
    return tempHeartPositions;
  }

  onModeChange(newSettings) { 
    this.mode = getMode(this.chances);
    this.setState(this.mode.initialiseGame('settings', 'daily'));
    this.initialise();
  }

  onPrevious() {
    this.setState(this.mode.initialiseGame('game', 'random'));
    this.initialise();
  }


  onSettingsClose() {
    if (this.state.gameState === 'WON') {
      this.setState({ page: 'won' });
    } else if (this.state.gameState === 'LOST') {
      this.setState({ page: 'lost' });
    } else {
      this.setState({ page: 'game' });
    }
  }

  render() {
    return (
      <div className="game">
        {this.state.page && (
          <div className="mainBoard" page={this.state.page}>
            <Header
              onHelp={() => this.setState({ page: 'help' })}
              onStats={() => this.setState({ page: 'stats' })}
              onFeedback={() => {
                this.setState({ page: 'settings', settingsBadgeInvisible: true });
                if (!this.state.settingsBadgeInvisible) {
                  saveNotification({ settingsBadgeInvisible: true });
                }

              }}
              darkMode={this.mode.isDarkMode()}
              badgeInvisible={this.state.settingsBadgeInvisible}
            />
            <Board
              board={this.state.board}
              wordleLength={this.wordleLength}
              tileColors={this.state.tileColors}
              page={this.state.page}
              darkMode={this.mode.isDarkMode()}
              starPositions={this.state.starPositions}
              heartPositions={this.state.heartPositions}
            />
            <Keyboard1
              onKeyInput={this.onKeyInput}
              worldToMatch={this.worldToMatch}
              wordleLength={this.wordleLength}
              selectedKeys={this.state.selectedKeys}
              won={this.state.won}
              disableKeyBoardInput={this.state.disableKeyBoardInput}
              vadasolMode={this.mode.isVadaSolMode()}
            />
          </div>
        )}
        {this.state.page === 'help' && (
          <Help
            page={this.state.page}
            onClose={() => this.setState({ page: 'game' })}
            darkMode={this.mode.isDarkMode()}
          />
        )}
        {this.state.page === 'settings' && (
          <Settings
            page={this.state.page}
            onClose={() => this.onSettingsClose()}
            onModeChange={this.onModeChange}
            darkMode={this.mode.isDarkMode()}
          />
        )}
        <Dialog
          tileColors={this.state.tileColors}
          page={this.state.page}
          stats={this.state.statistics}
          prevBoard={this.state.prevBoard}
          prevTileColors={this.state.prevTileColors}
          gameState={this.state.gameState}
          mode={this.mode}
          onClose={() => this.setState({ page: 'game' })}
          darkMode={this.mode.isDarkMode()}
          rowIndex={this.state.rowIndex}
          version={this.mode.version}
          onPrevious={() => this.onPrevious()}
        />
      </div>
    );
  }
}
