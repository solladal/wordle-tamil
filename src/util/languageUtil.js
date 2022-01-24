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

export function compare(guess, actual) {
  if (guess === actual) {
    return [true];
  } else {
    let color = [];
    let letterColors = {};
    let guessArr = split(guess);
    let actualArr = split(actual);
    for (let i in guessArr) {
      const gussedLetter = guessArr[i];
      if (gussedLetter === actualArr[i]) {
        //TODO same letters in a tile with differnt positon overrides the color
        color[i] = 'green';
      } else if (gussedLetter.charAt(0) === actualArr[i].charAt(0)) {
        color[i] = 'green-partial'; //partial
        letterColors[gussedLetter] = 'green-partial';
      } else if (actualArr.includes(gussedLetter)) {
        color[i] = 'yello';
        letterColors[gussedLetter] = 'yello';
      } else if (actual.includes(gussedLetter.charAt(0))) {
        color[i] = 'yello-partial';
        letterColors[gussedLetter] = 'yello-partial';
      } else {
        color[i] = 'gray';
        letterColors[gussedLetter] = 'gray';
      }
    }

    return [false, color];
  }
}

const colorPriority = {
  green: 5,
  'green-partial': 4,
  yello: 3,
  'yello-partial': 2,
  grey: 0,
};

export function pickColorByOrder(color1, color2) {
  return colorPriority[color1] > colorPriority[color2] ? color1 : color2;
}
