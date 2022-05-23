export function split(str) {
  if (str) {
    const thunaiEluthugal = ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்'];
    var ar = [];
    for (const c of str.split('')) {
      if (thunaiEluthugal.includes(c)) {
        let lastletter = ar.pop();
        ar.push(lastletter.concat(c));
      } else {
        ar.push(c);
      }
    }
    return ar;
  } else {
    return [];
  }
}

const uyirmeiMap = { ஆ: 'ா', இ: 'ி', ஈ: 'ீ', உ: 'ு', ஊ: 'ூ', எ: 'ெ', ஏ: 'ே', ஐ: 'ை', ஒ: 'ொ', ஓ: 'ோ', ஔ: 'ௌ' };

const uriMeiMuthalVarisai = ['க', 'ச', 'ட', 'த', 'ப', 'ற', 'ங', 'ஞ', 'ண', 'ந', 'ம', 'ன', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள'];

function isAkaraVarisai(letter) {
  //checks if it's அ or akara varisai uyirmei (uriMeiMuthalVarisai)
  return (letter === 'அ' || uriMeiMuthalVarisai.includes(letter));
}

export function compare(guess, actual) {
  if (guess === actual) {
    return [true];
  } else {
    let color = [];
    let letterColors = {};
    let guessArr = split(guess);
    let actualArr = split(actual);
    
    let starPositions = [];
    let heartPositions = [];
    for (let i in guessArr) {
      const gussedLetter = guessArr[i];
      if (gussedLetter === actualArr[i]) {
        color[i] = 'green';
        letterColors[gussedLetter] = 'green';
        letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'green-partial');
        guessArr[i] = -1;
        actualArr[i] = -1;
      }
    }
    for (let i in guessArr) {
      const gussedLetter = guessArr[i];
      if (gussedLetter !== -1) {
        if (actualArr.includes(gussedLetter) && letterColors[gussedLetter] !== 'yello') {
          color[i] = 'yello';
          if (letterColors[gussedLetter] === 'green-partial') {
            //check test compare duplicate விழுமம் and வாமனம்
            letterColors[gussedLetter] = 'yello';
          } else {
            letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'yello');
          }
          letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'yello-partial');

        } else {
          //color[i] = 'pink';
          const guestCharLast = guessArr[i].charAt(guessArr[i].length - 1);
          const actualCharLast = actualArr[i].charAt(actualArr[i].length - 1);
          if (guestCharLast === actualCharLast ||
            uyirmeiMap[actualCharLast] === guestCharLast ||
            uyirmeiMap[guestCharLast] === actualCharLast ||
            (isAkaraVarisai(actualCharLast) && isAkaraVarisai(guestCharLast))) {
            heartPositions.push(i);
          }
        }
        if (color[i] === undefined) {
          color[i] = 'gray';
          letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'gray');
          letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'gray');
        }
      }
    }
    for (let i in guessArr) {
      const gussedLetter = guessArr[i];
      if (gussedLetter !== -1 && actualArr[i] !== -1) {
        if (gussedLetter.charAt(0) === actualArr[i].charAt(0)) {
          if (letterColors[gussedLetter] === 'yello') {
            let position = Number(i) + 1;
            console.warn(gussedLetter + ' உள்ள இடத்தில்(' + position + ') வேறு ' + gussedLetter.charAt(0) + '-கர வரிசை உள்ளதோடு, ' + gussedLetter + ' -வும் வேறு இடத்தில உள்ளது.');
            //specialMessage.push(gussedLetter + ' உள்ள இடத்தில்(' + position + ') வேறு ' + gussedLetter.charAt(0) + '-கர வரிசை உள்ளதோடு, ' + gussedLetter + ' -வும் வேறு இடத்தில உள்ளது.');
            starPositions.push(i);
          } else {
            letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'green-partial');
          }
          color[i] = 'green-partial'; //partial   
          guessArr[i] = -1;
          actualArr[i] = -1;
        }
      }
    }

    for (let i in actualArr) {
      if (letterColors[actualArr[i]] === 'yello') {
        let guessIndex = guessArr.indexOf(actualArr[i]);
        actualArr[i] = -1;
        guessArr[guessIndex] = -1;
      }
    }

    for (let i in guessArr) {
      const gussedLetter = guessArr[i];
      if (gussedLetter !== -1) {
        for (let j in actualArr) {
          if (actualArr[j] !== -1) {
            if (actualArr[j].includes(gussedLetter.charAt(0))) {
              if (letterColors[actualArr[j]] === undefined || letterColors[actualArr[j]] === 'gray') {
                color[i] = pickColorByOrder(color[i], 'yello-partial');
                letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'yello-partial');
                actualArr[j] = -1;
              }
            }
          }
        }
      }
    }

    return [false, color, letterColors, starPositions, heartPositions];
  }
}

export function compareEasyMode(guess, actual, colors, letterColors) {
  let guessArr = split(guess);
  let actualArr = split(actual);
  for (let i in colors) {
    if (colors[i] === 'green-partial') {
      guessArr[i] = actualArr[i];
      colors[i] = 'green';
      letterColors[guessArr[i]] = 'green';
    }
  }
  return [guessArr.join('') === actualArr.join(''), colors, letterColors, guessArr.join('')]
}

const colorPriority = {
  green: 5,
  'green-partial': 4,
  yello: 3,
  'yello-partial': 2,
  pink: 1,
  gray: 0,
};

export function pickColorByOrder(color1, color2) {
  return colorPriority[color1] > colorPriority[color2] ? color1 : color2;
}


//used for jest testing
// module.exports= {split, compareEasyMode,compare,pickColorByOrder}