export const words = ['தெறல்', 'அஞ்சல்', 'பொருல்', 'அசல்'];

const startDate = new Date('1/1/2022');
export const getWordOfDay = () => {
  return words[wordleIndex() % words.length];
};

export const getPreviousWord = () => {
  const localstate = localStorage.getItem('wordle-tamil-state');
  if (localstate) {
    let lastTimeStamp = JSON.parse(localstate).gameEndTimeStamp;
    if (lastTimeStamp.previous) {
      const diffTime = Math.abs(new Date(lastTimeStamp.previous) - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return words[diffDays % words.length];
    } else if (
      new Date().getDate() - new Date(lastTimeStamp.current).getDate() >
      0
    ) {
      const diffTime = Math.abs(new Date(lastTimeStamp.current) - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return words[diffDays % words.length];
    }
  } else {
    return '';
  }
};

export const wordleIndex = (lastUpdated) => {
  // January 1, 2022 Game Epoch
  // const epochMs = Date.now();
  // const now = Date.now()
  // const msInDay = 86400000
  // const index = Math.floor((now - epochMs) / msInDay)

  // return {
  //   solution: WORDS[index].toUpperCase(),
  //   solutionIndex: index,
  // }
  const date2 = Date.now();
  const diffTime = Math.abs(date2 - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const index = diffDays;
  return index;
};

export const isSameDay = (cachedDate) => {
  return new Date().getDate() - new Date(cachedDate).getDate() == 0;
};
