import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8");
// const input = `
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
// `;

const parsedInput = input
  .trim()
  .split("\n")
  .map((row) => {
    const [g, s] = row.split(": ");
    const [_, id] = g.split(" ");

    const sets = s.split("; ").map((s) => s.split(", "));
    return { id: Number(id), sets };
  });

const BAG = {
  red: 12,
  green: 13,
  blue: 14,
};

const isPossibleSet = (set: Array<string>) => {
  //@ts-ignore
  const parsedSet = set.map((s) => {
    const [amount, color] = s.split(" ");
    return [Number(amount), color] as const;
  });

  return parsedSet.every(([amount, color]) => amount <= BAG[color]);
};

const parsePossibleGame = (game: { id: number; sets: Array<Array<string>> }) =>
  game.sets.every((k) => {
    return isPossibleSet(k);
  });

const sum = (a: number, b: number) => a + b;

const part1 = parsedInput
  .filter(parsePossibleGame)
  .map((x) => x.id)
  .reduce(sum, 0);

// console.log(part1);

const foo = parsedInput.map((game) =>
  game.sets.flatMap((set) =>
    set.map((s) => {
      const [amount, color] = s.split(" ");
      return [Number(amount), color] as const;
    })
  )
);

const findLowestOfColor = (
  set: Array<readonly [amount: number, color: string]>,
  targetColor: string
) => {
  const [lowest] = set
    .filter(([_, color]) => color === targetColor)
    .map(([a]) => a)
    .sort((a, b) => b - a);

  return lowest;
};

const lowMaps = foo.map((x) => ({
  red: findLowestOfColor(x, "red"),
  green: findLowestOfColor(x, "green"),
  blue: findLowestOfColor(x, "blue"),
}));

const part2 = lowMaps
  .map((x) => x.red * x.blue * x.green)
  .reduce((acc, curr) => acc + curr, 0);

console.log(part2);
