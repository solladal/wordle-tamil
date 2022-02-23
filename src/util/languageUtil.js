export function split(str) {
  if (str) {
    const thunaiEluthugal = [
      'ா',
      'ி',
      'ீ',
      'ு',
      'ூ',
      'ெ',
      'ே',
      'ை',
      'ொ',
      'ோ',
      'ௌ',
      '்',
    ];
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

// export function compare(guess, actual) {
//   if (guess === actual) {
//     return [true];
//   } else {
//     let color = [];
//     let letterColors = {};
//     let guessArr = split(guess);
//     let actualArr = split(actual);
//     for (let i in guessArr) {
//       const gussedLetter = guessArr[i];
//       if (gussedLetter === actualArr[i]) {
//         //TODO same letters in a tile with differnt positon overrides the color
//         color[i] = 'green';
//       } else if (gussedLetter.charAt(0) === actualArr[i].charAt(0)) {
//         color[i] = 'green-partial'; //partial
//         letterColors[gussedLetter] = 'green-partial';
//       } else if (actualArr.includes(gussedLetter)) {
//         color[i] = 'yello';
//         letterColors[gussedLetter] = 'yello';
//       } else if (actual.includes(gussedLetter.charAt(0))) {
//         color[i] = 'yello-partial';
//         letterColors[gussedLetter] = 'yello-partial';
//       } else {
//         color[i] = 'gray';
//         letterColors[gussedLetter] = 'gray';
//       }
//     }

//     return [false, color];
//   }
// }

// function compare1(guess, actual) {
//   if (guess === actual) {
//     return [true];
//   } else {
//     let color = [];
//     let letterColors = {};
//     let guessArr = split(guess);
//     let actualArr = split(actual);
//     for (let i in guessArr) {
//       const gussedLetter = guessArr[i];
//       if (gussedLetter === actualArr[i]) {
//         //TODO same letters in a tile with differnt positon overrides the color
//         color[i] = 'green';
//         letterColors[gussedLetter] = 'green';
//         guessArr[i] = -1;
//         actualArr[i] = -1;
//       }
//     }

//     for (let i in guessArr) {
//       const gussedLetter = guessArr[i];
//       if (gussedLetter !== -1) {
//         if (gussedLetter.charAt(0) === actualArr[i].charAt(0)) {
//           color[i] = 'green-partial'; //partial
//           letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'green-partial');
//         } else if (actualArr.includes(gussedLetter)) {
//           color[i] = 'yello';
//           letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'yello');
//         } else if (actualArr.join('').includes(gussedLetter.charAt(0))) {
//           color[i] = 'yello-partial';
//           letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'yello-partial');
//         } else {
//           color[i] = 'gray';
//           letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'gray');
//         }
//       }
//     }

//     return [false, color, letterColors];
//   }
// }

export function compare(guess, actual) {
  if (guess === actual) {
    return [true];
  } else {
    let color = [];
    let letterColors = {};
    let guessArr = split(guess);
    let actualArr = split(actual);
    let specialMessage = [];
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
        if (actualArr.includes(gussedLetter) && letterColors[gussedLetter] === undefined) {
          color[i] = 'yello';
          letterColors[gussedLetter] = pickColorByOrder(letterColors[gussedLetter], 'yello');
          letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'yello-partial');

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
            let position = Number(i)+1;
            console.warn(gussedLetter + ' உள்ள இடத்தில்('+ position +') வேறு ' + gussedLetter.charAt(0) + '-கர வரிசை உள்ளதோடு, ' + gussedLetter + ' -வும் வேறு இடத்தில உள்ளது.');
            specialMessage.push(gussedLetter + ' உள்ள இடத்தில்(' + position + ') வேறு ' + gussedLetter.charAt(0) + '-கர வரிசை உள்ளதோடு, ' + gussedLetter + ' -வும் வேறு இடத்தில உள்ளது.');
          }
          color[i] = 'green-partial'; //partial
          letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'green-partial');
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
              if (letterColors[actualArr[j]] === undefined) {
                color[i] = pickColorByOrder(color[i], 'yello-partial');
                letterColors[gussedLetter.charAt(0)] = pickColorByOrder(letterColors[gussedLetter.charAt(0)], 'yello-partial');
                actualArr[j] = -1;
              }
            }
          }
        }
      }
    }

    return [false, color, letterColors, specialMessage];
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
  gray: 0,
};

export function pickColorByOrder(color1, color2) {
  return colorPriority[color1] > colorPriority[color2] ? color1 : color2;
}