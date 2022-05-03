export const words = ['பலகை', 'வண்ணம்', 'அஞ்சல்','கவிதை','சட்டம்','உவகை','தேநீர்', 'நாற்காலி','மழலை', 'எண்ணெய்',
'பள்ளி','கணினி','சேமிப்பு','விளக்கு','திறமை','இறைவன்','வேளாண்மை','கவசம்','பிற்பாடு','விவேகம்','எய்தல்','கடல்','பொறாமை','மடந்தை',
'பொங்கல்','சிறுவாடு','அழகு','விரதம்','கனவு','தூரிகை','யாப்பு','நாணம்','பாசாங்கு','சிறகு','பதுமை','சமூகம்','கொய்தல்','திண்ணம்','ஒற்றுமை',
'இன்பம்','பகல்','தேயிலை','சிற்பம்','காகிதம்','கழனி','பாக்கு','விண்மீன்','பற்று','அண்மை','நாட்டம்','பரிவு','மட்டு','விழுமம்','குறிஞ்சி',
'மருந்து','ஓவியம்','ஞாயிறு','சந்நிதி','முயற்சி','குழந்தை','நட்பு','குட்டு','அரங்கு','காலம்','அறம்','விருந்து','இயல்பு','தணிக்கை','நாவல்',
'கோப்பு','மைதானம்','அறுசுவை','தலைவன்','காணிக்கை','நாளிதழ்','காற்றாடி','மணல்','திடல்','கண்ணாடி','கணக்கு','சிறப்பு','அலகு',
'புதுமை','உறுதி','கட்டுரை','எல்லை','நாழிகை','தீபம்','பொருள்','நஞ்சு','தமிழ்','நெருப்பு','வானிலை','விறகு','அன்றில்','கோலம்',
'இயற்கை','மடம்','பட்டம்','கல்வி','பேருந்து','திரவம்','தங்கம்','பண்டம்','நுகர்வு','புனைவு','முற்றம்','கொழுந்து','சான்றோர்','ஊதியம்','வேட்கை'];

export const senthamilWords = ['குறுந்தொகை','யாணர்','அணங்கு','கேளிர்','மருங்கு','வெஃகாமை','நுதல்','அலங்கு','இவர்தல்',
'அமலை','உட்கு','பசலை','முன்னுதல்','பாற்று','சாகாடு','உலப்பு','செறுத்து','கூற்றன்','எழிலி','துறக்கம்','துய்ப்பு','கோடில்','சுரம்','வைகல்',
'அஞர்','குழவி','கரவு','விளம்பு','ஔவியம்','அஃகம்','துப்பார்','வியன்','உடற்று','விசும்பு','நல்கு','ஈண்டு','பனுவல்','பிறங்கு','பாயிரம்',
'ஊங்கு','புதுவது','இன்னாது','திறவோர்','மாட்சிமை','எந்தை','புரவி','ஞான்று','ஆங்கண்','மண்மலி','நல்லை','பாணன்','ஈனில்','மேவல்','தமியன்',
'பொச்சாப்பு', 'ஆங்கு', 'நிரப்பு', 'நெருநல்', 'பகடு', 'மிசைவு', 'இடும்பை', 'நென்னல்', 'புலம்', 'கரப்பு', 'சென்னி', 'வறிஞர்', 'அகடு', 'நிச்சம்',
'இறுவரை', 'ஆயிழை', 'எருத்தம்', 'ஒல்லும்', 'சுரம்', 'கண்ணி', 'கொன்றை', 'ஏமம்', 'மிடறு', 'அறவு', 'தைவரல்', 'புணரி', 'தெறல்',
'உவவு', 'நிழற்று','செயிர்','புகர்','துன்னுதல்','பொலம்', 'உயங்கு', 'பதுக்கை','பூட்கை', 'நுவலுதல்', 'வயிரியர்', 'நிவப்பு', 'இறைஞ்சு',
'ஒன்னார்', 'குணாது', 'எறுழ்', 'கம்பலை', 'மேவல்', 'மண்டிலம்', 'மீமிசை', 'விழவு', 'ஒறுத்தல்', 'விறல்'];

export const getWordOf = (mode, index) => {
  return mode === 'sentamil' ? senthamilWords[index % senthamilWords.length] : words[index % words.length];
};

// export const getPreviousWord = () => {
//   const localstate = localStorage.getItem('wordle-tamil-state');
//   const statistics = localStorage.getItem('wordle-tamil-statistics');
//   if (localstate && statistics) {
//     let lastUpdated = JSON.parse(localstate).lastUpdated;
//     let gamesPlayed = JSON.parse(statistics).gamesPlayed;
//     if(lastUpdated ) {
//       if(isSameDay(lastUpdated)) {
//         if(gamesPlayed > 1) { //means not first time
//           let prevIndex = (wordleIndex() % words.length) -1;
//           if(prevIndex > 0) {
//             return words[prevIndex];
//           }
//         }
        
//       } else {
//         const diffTime = Math.abs(new Date(lastUpdated) - startDate);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return words[diffDays % words.length];
//       } 
//     } 
//   }
//   return '';
// };

// export const wordleIndex = (lastUpdated) => {
//   const date2 = Date.now();
//   const diffTime = Math.abs(date2 - startDate);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   const index = diffDays;
//   return index;
// };

export const isSameDay = (cachedDate) => {
  var dateFromCache = new Date(new Date(cachedDate));
  var today = new Date();
  return (dateFromCache.getDate() === today.getDate()) && (dateFromCache.getMonth() === today.getMonth()) &&
  (dateFromCache.getFullYear() === today.getFullYear());
};
