import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8").trim();
// const input = `
// 0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45
// `.trim();

const parsedInput = input.split("\n").map((x) => x.split(" ").map(Number));
const diff = (a: Array<number>) => a.slice(1).map((n, i) => n - a[i]);

const buildSequenceTree = (nums: number[][]) => {
  if (nums.at(-1)?.every((x) => x === 0)) return nums;
  const next = diff(nums.at(-1));
  return buildSequenceTree(nums.concat([next]));
};

const ts = parsedInput.map((x) => buildSequenceTree([x]));

const increment = ([line, ...lines]: number[][], result: number[][]) => {
  if (!line) return result;
  const incremented = [...line, line.at(-1) + result.at(-1)?.at(-1) || 0];
  return increment(lines, result.concat([incremented]));
};

const decrement = ([line, ...lines]: number[][], result: number[][]) => {
  if (!line) return result;
  const decremented = [line.at(0) - result.at(-1)?.at(0) || 0, ...line];
  return decrement(lines, result.concat([decremented]));
};

const p_1 = ts
  .map((tree: number[][]) => increment(Array.from(tree).reverse(), []))
  .map((x) => x.at(-1).at(-1))
  .reduce((a, b) => a + b, 0);

console.log(p_1);

const p_2 = ts
  .map((tree: number[][]) => decrement(Array.from(tree).reverse(), []))
  .map((x) => x.at(-1).at(0))
  .reduce((a, b) => a + b, 0);

console.log(p_2);
