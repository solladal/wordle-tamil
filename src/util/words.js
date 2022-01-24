export const words = ['பலகை', 'வண்ணம்', 'அஞ்சல்','கவிதை','சட்டம்','உவகை','தேநீர்', 'நாற்காலி','மழலை', 'எண்ணெய்',
'பள்ளி','கணினி','சேமிப்பு','விளக்கு','திறமை','இறைவன்','வேளாண்மை','கவசம்','பிற்பாடு','விவேகம்','எய்தல்','கடல்','பொறாமை','மடந்தை',
'பொங்கல்','அழகு','விரதம்','கனவு','தூரிகை','யாப்பு','நாணம்','பாசாங்கு','சிறகு','பதுமை','சமூகம்','கொய்தல்','திண்ணம்','ஒற்றுமை',
'இன்பம்','பகல்','தேயிலை','சிற்பம்','காகிதம்','பாக்கு','விண்மீன்',,'பற்று','அண்மை','நாட்டம்','பரிவு','மட்டு','விழுமம்','குறிஞ்சி',
'மருந்து','ஓவியம்','ஞாயிறு','சந்நிதி','முயற்சி','குழந்தை','நட்பு','குட்டு','அரங்கு','காலம்','ஞானம்','விருந்து','இயல்பு','தணிக்கை','நாவல்',
'கோப்பு','மைதானம்','அறுசுவை','தலைவன்','காணிக்கை','நாளிதழ்','காற்றாடி','மணல்','திடல்','கண்ணாடி','அமாவாசை','கணக்கு','சிறப்பு','அலகு',
'புதுமை','உறுதி','கட்டுரை','எல்லை','நாழிகை','தீபம்','பொருள்','நஞ்சு','தமிழ்','நெருப்பு','வானிலை','விறகு','அன்றில்','கோலம்',
'இயற்கை','மடம்','பட்டம்','கல்வி','பேருந்து','திரவம்','தங்கம்'];

const startDate = new Date('1/26/2022');
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
