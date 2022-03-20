const languageUtil = require('./languageUtil');

test('test split', () => {
  expect(languageUtil.split("அறுசுவை").length).toBe(4);
});

test('test compare 1', () => {
  const compare = languageUtil.compare("பாட்டாளி", "பிற்பாடு");
  const letterColors = { "ட": "yello-partial", "டா": "gray", "ட்": "gray", "ப": "green-partial", "பா": "yello", "ளி": "gray", "ள": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["green-partial", "yello-partial", "gray", "gray"]);
  expect(compare[2]).toEqual(letterColors);
  expect(compare[3][0]).toMatch('பா உள்ள இடத்தில்(1) வேறு ப-கர வரிசை உள்ளதோடு, பா -வும் வேறு இடத்தில உள்ளது.');
});

test('test compare 2', () => {
  const compare = languageUtil.compare("பபபப", "சேமிப்பு");
  const letterColors = { "ப": "green-partial" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "green-partial", "green-partial"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 3', () => {
  const compare = languageUtil.compare("புபுபுபு", "சேமிப்பு");
  const letterColors = { "ப": "green-partial", "பு": "green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "green-partial", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 4', () => {
  const compare = languageUtil.compare("பசிவீடு", "சிறுவாடு");
  const letterColors = { "ப": "gray", "ச": "yello-partial", "சி": "yello", "வ": "green-partial", "வீ": "gray", "ட": "green-partial", "டு": "green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "yello", "green-partial", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 5', () => {
  const compare = languageUtil.compare("வ்வாவீவு", "சிறுவாடு");
  const letterColors = { "வ": "green-partial", "வ்": "gray", "வா": "yello", "வீ": "gray", "வு": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "yello", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 6', () => {
  const compare = languageUtil.compare("வாவாவீவா", "சிறுவாடு");
  const letterColors = { "வ": "green-partial", "வா": "yello", "வீ": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello", "gray", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 7', () => {
  const compare = languageUtil.compare("பாபிபிபா", "பிற்பாடு");
  const letterColors = { "ப": "green-partial", "பா": "yello", "பி": "yello" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["green-partial", "yello", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
  expect(compare[3][0]).toMatch('பா உள்ள இடத்தில்(1) வேறு ப-கர வரிசை உள்ளதோடு, பா -வும் வேறு இடத்தில உள்ளது.');
  expect(compare[3][1]).toMatch('பி உள்ள இடத்தில்(3) வேறு ப-கர வரிசை உள்ளதோடு, பி -வும் வேறு இடத்தில உள்ளது.');
});

test('test compare 8', () => {
  const compare = languageUtil.compare("கககக", "விளக்கு");
  const letterColors = { "க": "green-partial" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "green-partial", "green-partial"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 9', () => {
  const compare = languageUtil.compare("குகுகுகு", "விளக்கு");
  const letterColors = { "க": "green-partial", "கு": "green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "green-partial", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 10', () => {
  const compare = languageUtil.compare("குகுஞகு", "விளக்கு");
  const letterColors = { "க": "green-partial", "கு": "green", "ஞ": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello-partial", "gray", "gray", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 11', () => {
  const compare = languageUtil.compare("க்குக்ஈ", "விளக்கு");
  const letterColors = { "க்": "green", "க": "green-partial", "கு": "yello", "ஈ": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "yello", "green", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 12', () => {
  const compare = languageUtil.compare("க்க்க்ஈ", "விளக்கு");
  const letterColors = { "க்": "green", "க": "green-partial", "ஈ": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello-partial", "gray", "green", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 13', () => {
  const compare = languageUtil.compare("க்குடட", "விளக்கு");
  const letterColors = { "க": "yello-partial", "கு": "yello", "ட": "gray", "க்": "yello" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello", "yello", "gray", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 14', () => {
  const compare = languageUtil.compare("கககண", "விளக்கு");
  const letterColors = { "க": "green-partial", "ண": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello-partial", "gray", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 15', () => {
  const compare = languageUtil.compare("க்க்ஞஞ", "விளக்கு");
  const letterColors = { "க்": "yello", "க": "yello-partial", "ஞ": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello", "yello-partial", "gray", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 16', () => {
  const compare = languageUtil.compare("க்ஙக்ங", "விளக்கு");
  const letterColors = { "க்": "green", "க": "green-partial", "ங": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello-partial", "gray", "green", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 17', () => {
  const compare = languageUtil.compare("ஙஙகுங", "விளக்கு");
  const letterColors = { "கு": "yello", "க": "green-partial", "ங": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare 18', () => {
  const compare = languageUtil.compare("விக்கல்", "விளக்கு");
  const letterColors = { "வி": "green", "வ": "green-partial", "க்": "yello", "க": "green-partial", "ல்": "gray", "ல": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["green", "yello", "green-partial", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate green-partial', () => {
  const compare = languageUtil.compare("டடடட", "பிற்பாடு");
  const letterColors = { "ட": "green-partial" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "gray", "green-partial"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate green', () => {
  const compare = languageUtil.compare("டுடுடுடு", "பிற்பாடு");
  const letterColors = { "ட": "green-partial", "டு": "green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "gray", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate yello', () => {
  const compare = languageUtil.compare("டுடுடுத", "பிற்பாடு");
  const letterColors = { "ட": "yello-partial", "டு": "yello", "த": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello", "gray", "gray", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate yello-partial', () => {
  const compare = languageUtil.compare("டடடத", "பிற்பாடு");
  const letterColors = { "ட": "yello-partial", "த": "gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello-partial", "gray", "gray", "gray"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate yello and green', () => {
  const compare = languageUtil.compare("டுடடடு", "பிற்பாடு");
  const letterColors = { "ட": "green-partial", "டு": "green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["gray", "gray", "gray", "green"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate yello and green-partial', () => {
  const compare = languageUtil.compare("டுடடட", "பிற்பாடு");
  const letterColors = { "ட": "green-partial", "டு": "yello" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["yello", "gray", "gray", "green-partial"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate yello and green-partial', () => {
  const compare = languageUtil.compare("நமண்", "நாணம்");
  const letterColors = { "ந": "green-partial", "ம": "yello-partial", "ண":"yello-partial", "ண்":"gray" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["green-partial","yello-partial", "yello-partial"]);
  expect(compare[2]).toEqual(letterColors);
});

test('test compare duplicate விழுமம் and வாமனம்', () => {
  const compare = languageUtil.compare("வாமனம்", "விழுமம்");
  const letterColors = { "வா": "gray", "வ": "green-partial", "ம": "yello", "ன":"gray", "ம்":"green" };
  expect(compare[0]).toBe(false);
  expect(compare[1]).toEqual(["green-partial","yello", "gray", "green"]);
  expect(compare[2]).toEqual(letterColors);
});
