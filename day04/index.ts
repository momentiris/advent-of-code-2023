import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8");

// const input = `
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `;

const tickets = input
  .trim()
  .split("\n")
  .map((l) =>
    l
      .replace(/(Card( +)\d+): /, "")
      .split(" | ")
      .map((x) => x.split(" ").filter(Boolean))
  );

const part1 = tickets
  .map(([wins, nums]) =>
    wins.reduce(
      (acc, curr) => (!nums.includes(curr) ? acc : !acc ? 1 : acc * 2),
      0
    )
  )
  .reduce((a, b) => a + b, 0);

const ticketsWithNumber = input
  .trim()
  .split("\n")
  .map((l) =>
    l
      .replace(/(Card( +)\d+): /, "")
      .split(" | ")
      .map((x) => x.split(" ").filter(Boolean))
  )
  .map((x, i) => ({ ticket: i + 1, wins: x[0], nums: x[1] }));

const getNextScratchcards = (
  scratchcard: number,
  wins: Array<string>,
  nums: Array<string>
) => {
  const numWins = wins.filter((w) => nums.includes(w)).length;
  const next = ticketsWithNumber.slice(scratchcard, scratchcard + numWins);
  return next;
};

const bar = ({ ticket, wins, nums }) => {
  const next = getNextScratchcards(ticket, wins, nums);

  return [ticket].concat(...next.map(bar));
};

const result = ticketsWithNumber.reduce(
  (acc, curr) => acc.concat(bar(curr)),
  []
);

console.log(result.length);
