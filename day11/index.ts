import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8").trim();
// const input = `
// ...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....
// `.trim();

const space = input.split("\n").map((x) => x.split(""));

const cols = space.map((_, i) =>
  Array.from({ length: space[0].length })
    .fill("")
    .map((_, foo_i) => space[foo_i][i])
);

const empty_cols = cols.reduce(
  (a, b, i) => (!b.includes("#") ? a.concat(i) : a),
  [] as number[]
);

const empty_rows = space.reduce(
  (a, b, i) => (!b.includes("#") ? a.concat(i) : a),
  [] as number[]
);

const extended_cols = cols.reduce((acc, col, i) => {
  if (empty_cols.includes(i)) {
    return acc.concat(
      Array.from({ length: 1 })
        .fill("")
        .map(() => col)
    );
  }
  return acc.concat([col]);
}, [] as string[][]);

const as_rows = extended_cols.map((_, i) =>
  Array.from({ length: extended_cols.length })
    .fill("")
    .map((_, foo_i) => extended_cols[foo_i][i])
);

const extended_space = as_rows
  .reduce((acc, row, i) => {
    if (empty_rows.includes(i)) {
      return acc.concat(
        Array.from({ length: 1 })
          .fill("")
          .map(() => row)
      );
    }
    return acc.concat([row]);
  }, [] as string[][])

  .map((x) => x.join(""))
  .join("\n")
  .trim()
  .split("\n")
  .map((x) => x.split(""));

const number_space = () => {
  let num = 0;
  return extended_space.map((row) =>
    row.map((d) => {
      if (d === "#") {
        num++;
        return num;
      }
      return d;
    })
  );
};

const numbered_space = number_space();

const factor = 1000000 - 1;
const coordinates = numbered_space
  .flatMap((row, x) => {
    const row_pairs = row.reduce((acc, b, col_y) => {
      if (Number.isInteger(b)) {
        const empty_cols_left = empty_cols.filter((x) => x < col_y).length;
        const empty_rows_above = empty_rows.filter((s) => s < x).length;

        return acc.concat([
          [x + empty_rows_above * factor, col_y + empty_cols_left * factor],
        ]);
      }
      return acc;
    }, []);

    return row_pairs;
  })
  .filter((x) => !!x.length);

type Coordinate = [x: number, y: number];
function getPairs(coordinates: Coordinate[]): Coordinate[][] {
  const pairs: Coordinate[][] = [];
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      pairs.push([coordinates[i], coordinates[j]]);
    }
  }
  return pairs;
}

const pairs = getPairs(coordinates);

const manhattan = (a: Coordinate, b: Coordinate): number =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const answer = pairs
  .map(([a, b]) => manhattan(a, b))
  .reduce((a, b) => a + b, 0);

console.log(answer);
