import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8").trim();
// const input = `
// LR

// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)
// `.trim();

const parseInput = () => {
  const [dir, s] = input.split("\n\n");
  const steps = s.split("\n").reduce((acc, l) => {
    const [s, alts] = l.split(" = ");
    const f = alts.replace("(", "").replace(")", "").split(", ");
    return {
      ...acc,
      [s]: {
        L: f[0],
        R: f[1],
      },
    };
  }, {});

  return { dir: dir.split(""), steps };
};

const parsedInput = parseInput();

const navigateIterative = (start: string) => {
  let steps = 0;
  let current = start;
  let dir_index = 0;

  while (!current.endsWith("Z")) {
    steps += 1;
    const next = parsedInput.steps[current][parsedInput.dir[dir_index]];
    dir_index = parsedInput.dir[dir_index + 1] ? dir_index + 1 : 0;
    current = next;
  }

  return steps;
};

const endsWithA = Object.keys(parsedInput.steps).filter((c) => c.endsWith("A"));
const part2 = endsWithA.map(navigateIterative).reduce(calculateLCM, 1);

function calculateGCD(a: number, b: number): number {
  if (b === 0) {
    return a;
  } else {
    return calculateGCD(b, a % b);
  }
}

function calculateLCM(a: number, b: number): number {
  return (a * b) / calculateGCD(a, b);
}
