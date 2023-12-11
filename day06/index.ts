import * as fs from "fs";
// const input = fs.readFileSync("./input.txt", "utf8").trim();
const input = `
Time:      7  15   30
Distance:  9  40  200
`
  .trim()
  .split("\n")
  .map((l) =>
    l
      .replace(/Time:|Distance:/, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((s) => Number(s.trim()))
  );

const parsedInput = input[0].map((d, i) => ({
  time: d,
  distance: input[1][i],
}));

const range = (start: number, end: number) =>
  Array.from(
    { length: Math.ceil((end - start) / 1) },
    (_, index) => start + index * 1
  );

const getRaceResult = (time: number, hold: number) => {
  const timeLeft = time - hold;
  return timeLeft * hold;
};

const outcomes = parsedInput.map((record) => ({
  ...record,
  breaks: range(0, record.time + 1)
    .map((s) => getRaceResult(record.time, s))
    .filter((x) => x > record.distance).length,
}));

const part1 = outcomes.reduce((a, b) => a * b.breaks, 1);

const input2 = `
Time:        55     82     64     90
Distance:   246   1441   1012   1111
`
  .trim()
  .split("\n")
  .map((l) =>
    l
      .replace(/Time:|Distance:/, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .join("")
  )
  .map((s) => Number(s.trim()));

const parsedInput2 = {
  time: input2[0],
  distance: input2[1],
};

const outcomes2 = [parsedInput2].map((record) => ({
  ...record,
  breaks: range(0, record.time + 1)
    .map((s) => getRaceResult(record.time, s))
    .filter((x) => x > record.distance).length,
}));

const part2 = outcomes2.reduce((a, b) => a * b.breaks, 1);
console.log(part2);
