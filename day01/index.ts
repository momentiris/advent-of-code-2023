import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8");
// const input = `two1nine
// eightwothree
// abcone2threexyz
// xtwone3four
// 4nineeightseven2
// zoneight234
// 7pqrstsixteen`;

const parsedInput = input.split("\n");

const getFirstDigit = ([char, ...chars]: Array<string>) => {
  if (!char) {
    return undefined;
  }
  return Number(char) || getFirstDigit(chars);
};

const foundPairs = parsedInput
  .map((x) => x.split(""))
  .map((chars) => [
    getFirstDigit(chars),
    getFirstDigit(Array.from(chars).reverse()),
  ]);

const joinedPairs = foundPairs.map((pair) => Number(pair.join("")));
const partOne = joinedPairs.reduce((acc, curr) => acc + curr, 0);

// Part 2
const digitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
function matchOverlap(input, re) {
  var r = [],
    m;
  // Prevent infinite loops
  if (!re.global) re = new RegExp(re.source, (re + "").split("/").pop() + "g");
  while ((m = re.exec(input))) {
    re.lastIndex -= m[0].length - 1;
    r.push(m[0]);
  }
  return r;
}
const regex = new RegExp(/\d|one|two|three|four|five|six|seven|eight|nine/g);

const foo = parsedInput
  .filter((x) => x.length)
  .map((x) => matchOverlap(x, regex));

const pairs = foo.map(([first, ...last]) => [first, last.at(-1) ?? first]);
const mappedPairs = pairs.map(([first, last]) =>
  [Number(first) || digitMap[first], Number(last) || digitMap[last]].join("")
);

mappedPairs.forEach((p) => console.log(p));
// console.log(mappedPairs.forEach((x) => console.log(x)));
const partTwo = mappedPairs.reduce((acc, curr) => acc + parseInt(curr), 0);
console.log(partTwo);
