import * as fs from "fs";
// const input = fs.readFileSync("./input.txt", "utf8");
const input = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const schematic = input.split("\n");
const schematicLength = input.split("\n")[0].length;
const range = (start: number, end: number) =>
  Array.from(
    { length: Math.ceil((end - start) / 1) },
    (_, index) => start + index * 1
  );

const matches = schematic
  .map((s, i) =>
    Array.from(s.matchAll(/\d+/g)).map((m) => ({
      value: Number(m.at(0)),
      xs: range(m.index, m.index + m.at(0).length),
      y: i,
    }))
  )
  .filter((x) => Boolean(x.length));

const getLineAdjacent = (x: string, xs: Array<number>) => {
  const start = xs.at(0) - 1 <= 0 ? 0 : xs.at(0) - 1;
  const end =
    xs.at(-1) + 1 >= schematicLength - 1 ? schematicLength - 1 : xs.at(-1) + 1;

  const foo = x.slice(start, end + 1);

  return foo;
};

const hasEligibleLineAdjacent = (x: string) =>
  x.split("").some((v) => {
    return !Number.isNaN(Number(v)) ? false : v === "." ? false : true;
  });

const hasEligibleAdjacentEntries = (val: {
  value: number;
  xs: Array<number>;
  y: number;
}) => {
  const above = getLineAdjacent(schematic[val.y - 1] ?? "", val.xs);
  const beside = getLineAdjacent(schematic[val.y], val.xs);
  const below = getLineAdjacent(schematic[val.y + 1] ?? "", val.xs);

  return (
    hasEligibleLineAdjacent(above) ||
    hasEligibleLineAdjacent(beside) ||
    hasEligibleLineAdjacent(below)
  );
};

const getAdjacentEntries = (
  val: Array<{
    value: number;
    xs: Array<number>;
    y: number;
  }>
) => val.filter(hasEligibleAdjacentEntries);

const bar = matches.map(getAdjacentEntries);

const getGearAdjacent = (
  x: string,
  xs: Array<number>,
  y: number,
  value: number
) => {
  const split = x.split("");
  const gears = split
    .map((v, i) => ({ v, x: i, y, value }))
    .filter(({ v }) => v === "*");

  return gears;
};

const getEligibleSignAdjacents = (val: {
  value: number;
  xs: Array<number>;
  y: number;
}) => {
  const above = getGearAdjacent(
    schematic[val.y - 1] ?? "",
    val.xs,
    val.y,
    val.value
  );
  const beside = getGearAdjacent(schematic[val.y], val.xs, val.y, val.value);

  const below = getGearAdjacent(
    schematic[val.y + 1] ?? "",
    val.xs,
    val.y,
    val.value
  );

  return above.concat(beside).concat(below);
};

const baz = matches
  .map((x) => x.flatMap(getEligibleSignAdjacents))
  .flat()
  .reduce((acc, curr) => {
    console.log(curr);

    const key = `${curr.x}:${curr.y}`;
    return { ...acc, [key]: acc[key] ? acc[key] + 1 : 1 };
  }, {});

const hej = matches
  .map(getAdjacentEntries)
  .filter((x) => !!x.length)
  .flat()
  .reduce((acc, curr) => acc + curr.value, 0);
