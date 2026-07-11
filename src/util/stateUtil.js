import { isSameDay } from './words';
import { fetchWordForDate } from './wordsApi';

export class Mode {

    constructor(mode, easyMode, darkMode, chances) {
        this.mode = mode;
        this.chances = chances || 6;
        this.easyMode = easyMode;
        this.darkMode = darkMode;
        this.version = '3.1';
        if (this.mode === 'normal') {
            this.stateKey = 'wordle-tamil-state';
            this.statisticsKey = 'wordle-tamil-statistics';
            this.startDate = new Date('2022-01-26T00:00:00Z');
        } else if (this.mode === 'sentamil') {
            this.stateKey = 'wordle-sentamil-state';
            this.statisticsKey = 'wordle-sentamil-statistics';
            this.startDate = new Date('2022-02-06T00:00:00Z');
        } else if (this.mode === 'vadasol') {
            this.stateKey = 'wordle-vadasol-state';
            this.statisticsKey = 'wordle-vadasol-statistics';
            this.startDate = new Date('2022-05-18T00:00:00Z');
        }
    }

    // Converts a day-count index (1-indexed count of days since startDate, matching
    // getWordleIndex()'s Math.ceil-based counting) into the 'YYYY-MM-DD' date string the
    // words API stores words under. Subtracts 1 since index=1 represents the very first
    // calendar day (startDate itself), not one day past it. Uses UTC arithmetic so the
    // mapping is stable regardless of the player's local timezone. Used for random-mode
    // and "previous word" lookups, which target a specific past day-count, not "today".
    dateStringForIndex(index) {
        const date = new Date(this.startDate.getTime() + (index - 1) * 24 * 60 * 60 * 1000);
        return date.toISOString().slice(0, 10);
    }

    // Today's date as 'YYYY-MM-DD' (UTC), for fetching today's word directly - no day-count
    // index math needed here, since "today" is just... today.
    todayDateString() {
        return new Date().toISOString().slice(0, 10);
    }

    getRandomIndex() {
        return Math.floor(Math.random() * this.getWordleIndex());
    }

    checkForUpdate() {
        const version = localStorage.getItem('version');
        if (version) {
            // for existing user
            this.isMajorUpdate = version.charAt(0) !== this.version.charAt(0);
            this.isNewUpdate = version !== this.version;
            localStorage.setItem('version', this.version);
        } else {
            // if no localStorage then new user
            this.isMajorUpdate = false;
            this.isNewUpdate = false;
            localStorage.setItem('version', this.version);
        }
    }

    async initialiseGame(initialPage, gameType = 'daily') {
        this.gameType = gameType;
        
        if (this.gameType === 'daily') {
            this.checkForUpdate();
            this.wordleIndex = this.getWordleIndex();
            // "Today" is just today - fetch directly by today's date. wordleIndex is only
            // needed here as a fallback lookup key if the API is unreachable, plus for
            // statistics/bookkeeping below (Wordle #N numbering, previous-day detection, etc).
            this.wordEntry = await fetchWordForDate(this.mode, this.todayDateString(), this.wordleIndex);
        } else if (this.gameType === 'random') {
            this.wordleIndex = this.getRandomIndex();
            if (this.mode === 'normal') {
                this.stateKey = 'wordle-tamil-state-random';
                this.statisticsKey = 'wordle-tamil-statistics-random';
            } else if (this.mode === 'sentamil') {
                this.stateKey = 'wordle-sentamil-state-random';
                this.statisticsKey = 'wordle-sentamil-statistics-random';
            } else if (this.mode === 'vadasol') {
                this.stateKey = 'wordle-vadasol-state-random';
                this.statisticsKey = 'wordle-vadasol-statistics-random';
            }
            this.wordEntry = await fetchWordForDate(this.mode, this.dateStringForIndex(this.wordleIndex), this.wordleIndex);
        }

        const previousIndex = this.getPreviousIndex();
        this.previousWordEntry = previousIndex !== -1
            ? await fetchWordForDate(this.mode, this.dateStringForIndex(previousIndex), previousIndex)
            : null;

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
        if (this.isNewUpdate) {
            state.page = 'updateInfo';
        }
        if (!state.starPositions) {
            state.starPositions = {};
        }
        if (!state.heartPositions) {
            state.heartPositions = {};
        }
        state.wordleIndex = this.wordleIndex;
        state.disableKeyBoardInput = false;
        //notification for settings changes
        state.settingsBadgeInvisible = readNotification() ? readNotification().settingsBadgeInvisible : false;
        return state;
    }

    getWordOfDay() {
        return this.wordEntry ? this.wordEntry.word : '';
    }

    getMeaning() {
        return this.wordEntry ? this.wordEntry.meaning : null;
    }

    getUsageHtml() {
        return this.wordEntry ? this.wordEntry.usageHtml : null;
    }

    getUsageNode() {
        // Only populated when running on the bundled fallback data (API unavailable);
        // the remote API instead returns usageHtml (a plain HTML string) via getUsageHtml().
        return this.wordEntry ? this.wordEntry.usageNode : null;
    }

    getPreviousWord() {
        return this.previousWordEntry ? this.previousWordEntry.word : '';
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

    isVadaSolMode() {
        return this.mode === 'vadasol';
    }

    isDarkMode() {
        return this.darkMode;
    }

    //TODO: lastUpdated is kept for existing users,
    isSameDayCheck(wordleIndex, lastUpdated) {
        if (wordleIndex) {
            return wordleIndex === this.wordleIndex;
        } else {
            return isSameDay(lastUpdated)
        }
    }

    getStateFromLocaleStorage(localstate) {
        let state;
        let previousState = JSON.parse(localstate);
        if(this.gameType === 'daily') {
            if (this.isNewUpdate) {
                state = { ...this.getDefaultState(), gameEndTimeStamp: previousState?.gameEndTimeStamp, page: 'game' };
            }
            else if (this.isSameDayCheck(previousState.wordleIndex, previousState.lastUpdated)) {
                if (previousState.gameState === 'WON' && previousState.board[previousState.rowIndex - 1] !== this.getWordOfDay()) {
                    state = { ...this.getDefaultState(), gameEndTimeStamp: previousState.gameEndTimeStamp, page: 'game' };
                } else {
                    state = previousState;
                }
            } else {
                if (previousState.gameState === 'LOST') {
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
        } else if (this.gameType === 'random') {
            state = { ...this.getDefaultState(), page: 'game' };
        }
        
        const localStatistics = localStorage.getItem(this.statisticsKey);
        if (localStatistics) {
            state.statistics = JSON.parse(localStatistics);
            if (!state.statistics.guesses) {
                state.statistics.guesses = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
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
            starPositions: {},
            heartPositions: {}
        };
    }

    getDefaultStatistics() {
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0,
            averageGuess: 0,
            guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
        };
    }

    saveGameState(state) {
        let gameState = { ...state, lastUpdated: Date.now() };
        gameState.statistics = undefined;
        state.readNotification = undefined;
        localStorage.setItem(
            this.stateKey,
            JSON.stringify(gameState)
        );
    }

    saveGameStatistics(statistics, rowIndex) {
        if (rowIndex <= this.chances) {
            statistics.guesses[rowIndex] = statistics.guesses[rowIndex] + 1 || 1;
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
    } else if (settings.vadasolMode) {
        return new Mode('vadasol', settings.easyMode, settings.darkMode, chances);
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
        if (!settings.hasOwnProperty('disableDictionaryCheck')) {
            settings.disableDictionaryCheck = false;
        }
        if (!settings.hasOwnProperty('vadasolMode')) {
            settings.vadasolMode = false;
        }
        if (!settings.hasOwnProperty('pothuTamilMode')) {
            settings.pothuTamilMode = true;
        }
        if (!settings.hasOwnProperty('enableHeartClue')) {
            settings.enableHeartClue = true;
        }
        return settings;
    } else {
        return { pothuTamilMode: true, senthamilMode: false, vadasolMode:false, enableHeartClue: true, easyMode: false, darkMode: false, disableDictionaryCheck: false }
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