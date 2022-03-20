import { getWordOf, isSameDay } from './words';

export class Mode {

    constructor(mode, easyMode, darkMode, chances) {
        this.mode = mode;
        this.chances = chances || 6;
        this.easyMode = easyMode;
        this.darkMode = darkMode;

        if (this.mode === 'normal') {
            this.stateKey = 'wordle-tamil-state';
            this.statisticsKey = 'wordle-tamil-statistics';
            this.startDate = new Date('1/26/2022');
        } else {
            this.stateKey = 'wordle-sentamil-state';
            this.statisticsKey = 'wordle-sentamil-statistics';
            this.startDate = new Date('2/6/2022');
        }
        this.wordleIndex = this.getWordleIndex();
    }


    initialiseGame(initialPage) {
        const localstate = localStorage.getItem(this.stateKey);
        let state;
        if (localstate) {
            state = this.getStateFromLocaleStorage(localstate);
        } else {
            state = this.getDefaultState();
        }
        if (initialPage) {
            state.page = initialPage;
        }
        state.wordleIndex = this.wordleIndex;
        state.disableKeyBoardInput = false;
        state.tooltips = [[], [], [], [], [], [], []];
        //notification for settings changes
        state.settingsBadgeInvisible = readNotification() ? readNotification().settingsBadgeInvisible : false;
        return state;
    }

    getWordOfDay() {
        return getWordOf(this.mode, this.wordleIndex);
    }

    getPreviousWord() {
        let previousIndex = this.getPreviousIndex();
        if (previousIndex !== -1) {
            return getWordOf(this.mode, previousIndex);
        } else {
            return '';
        }

    }

    getWordleIndex() {
        const date2 = Date.now();
        const diffTime = Math.abs(date2 - this.startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const index = diffDays;
        return index;
    }

    getPreviousIndex() {
        const localstate = localStorage.getItem(this.stateKey);
        const statistics = localStorage.getItem(this.statisticsKey);

        if (localstate && statistics) {
            let localStateJson = JSON.parse(localstate);
            let lastUpdated = localStateJson.lastUpdated;
            let gamesPlayed = JSON.parse(statistics).gamesPlayed;
            if (lastUpdated) {
                if (this.isSameDayCheck(localStateJson.wordleIndex, lastUpdated)) {
                    if (gamesPlayed > 1) { //means not first time
                        let prevIndex = (this.wordleIndex - 1);
                        if (prevIndex > 0) {
                            return prevIndex;
                        }
                    }

                } else {
                    const diffTime = Math.abs(new Date(lastUpdated) - this.startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays;
                }
            }
        }
        return -1;
    }

    isEasyMode() {
        return this.easyMode;
    }

    isSentamilMode() {
        return this.mode === 'sentamil';
    }

    isDarkMode() {
        return this.darkMode;
    }

    //TODO: lastUpdated is kept for existing users,
    isSameDayCheck(wordleIndex, lastUpdated) {
        if(wordleIndex) {
            return wordleIndex === this.wordleIndex;
        } else {
            return isSameDay(lastUpdated)
        }
    }

    getStateFromLocaleStorage(localstate) {
        let state;
        let previousState = JSON.parse(localstate);
        if (this.isSameDayCheck(previousState.wordleIndex, previousState.lastUpdated)) {
            if(previousState.gameState === 'WON' && previousState.board[previousState.rowIndex-1] !== this.getWordOfDay()) {
                state = { ...this.getDefaultState(), gameEndTimeStamp: previousState.gameEndTimeStamp, page: 'game' };
            } else {
                state = previousState;
            }
        } else {
            if (previousState.gameState == 'LOST') {
                state = {
                    ...this.getDefaultState(),
                    page: 'prevAns',
                    prevBoard: previousState.board,
                    prevTileColors: previousState.tileColors,
                };
            } else {
                state = { ...this.getDefaultState(), gameEndTimeStamp: previousState.gameEndTimeStamp, page: 'game' };
            }
        }

        const localStatistics = localStorage.getItem(this.statisticsKey);
        if (localStatistics) {
            state.statistics = JSON.parse(localStatistics);
            if (!state.statistics.guesses) {
                state.statistics.guesses = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            }
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
            page: (this.mode === 'normal' ? 'help' : 'board'),
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
            guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
    }

    saveGameState(state) {
        let gameState = { ...state, lastUpdated: Date.now() };
        gameState.statistics = undefined;
        state.readNotification = undefined;
        state.tooltips = undefined;
        localStorage.setItem(
            this.stateKey,
            JSON.stringify(gameState)
        );
    }

    saveGameStatistics(statistics, rowIndex) {
        if (rowIndex <= 6) {
            statistics.guesses[rowIndex] = statistics.guesses[rowIndex] + 1;
        }
        localStorage.setItem(
            this.statisticsKey,
            JSON.stringify(statistics)
        );
    }

}

export function getMode(chances) {
    let settings = readSettings();
    const body = document.querySelector("body");
    body.style.backgroundColor = settings.darkMode ? '#121213' : 'white';
    if (settings.senthamilMode) {
        return new Mode('sentamil', settings.easyMode, settings.darkMode, chances);
    } else {
        return new Mode('normal', settings.easyMode, settings.darkMode, chances);
    }
}

export function saveSettings(settings) {
    localStorage.setItem('wordle-tamil-settings', JSON.stringify(settings));
}

export function readSettings() {
    const localSettings = localStorage.getItem('wordle-tamil-settings');

    if (localSettings) {
        let settings = JSON.parse(localSettings)
        if(!settings.hasOwnProperty('disableDictionaryCheck')) {
            settings.disableDictionaryCheck = false;
        }
        return settings;
    } else {
        return { senthamilMode: false, easyMode: false, darkMode: false, disableDictionaryCheck: false }
    }
}

export function saveNotification(notification) {
    localStorage.setItem('wordle-tamil-notification', JSON.stringify(notification));
}

export function readNotification() {
    const localNotification = localStorage.getItem('wordle-tamil-notification');

    if (localNotification) {
        return JSON.parse(localNotification);
    } else {
        return null;
    }
}