import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8").trim();

// const input = `
// seeds: 79 14 55 13

// seed-to-soil map:
// 50 98 2
// 52 50 48

// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15

// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4

// water-to-light map:
// 88 18 7
// 18 25 70

// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13

// temperature-to-humidity map:
// 0 69 1
// 1 0 69

// humidity-to-location map:
// 60 56 37
// 56 93 4
// `.trim();

type Map = {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
};

const parseInput = () => {
  const [s, ...mps] = input.split("\n\n");
  const seeds = s.replace("seeds: ", "").split(" ").map(Number);
  const maps = mps.reduce((acc, m) => {
    const [rel, nums] = m.split(" map:\n");

    return {
      ...acc,
      [`${rel.replace("-to-", ":")}`]: nums
        .split("\n")
        .map((x) => x.split(" ").map(Number))
        .map(([destinationStart, sourceStart, rangeLength]) => ({
          destinationStart,
          sourceStart,
          rangeLength,
        })),
    };
  }, {});

  return { seeds, maps };
};

const parsedInput = parseInput();

const getNext = (target: number, maps: Array<Map>) => {
  const goodmap = maps.find(
    (map) =>
      map.sourceStart + map.rangeLength > target && map.sourceStart <= target
  );

  if (goodmap) {
    if (goodmap.destinationStart < goodmap.sourceStart) {
      return target - Math.abs(goodmap.sourceStart - goodmap.destinationStart);
    }

    return target + Math.abs(goodmap.sourceStart - goodmap.destinationStart);
  }

  return target;
};

// const part1 = parsedInput.seeds.map((s) => {
// const seedSoil = getNext(s, parsedInput.maps["seed:soil"]);
// const soilFertilizer = getNext(seedSoil, parsedInput.maps["soil:fertilizer"]);
// const fertilizerWater = getNext(
// soilFertilizer,
// parsedInput.maps["fertilizer:water"]
// );
// const waterLight = getNext(fertilizerWater, parsedInput.maps["water:light"]);
// const lightTemperature = getNext(
// waterLight,
// parsedInput.maps["light:temperature"]
// );
// const tempHumidity = getNext(
// lightTemperature,
// parsedInput.maps["temperature:humidity"]
// );

// const humidityLocation = getNext(
// tempHumidity,
// parsedInput.maps["humidity:location"]
// );

// return humidityLocation;
// });

const seedranges = parsedInput.seeds
  .reduce((acc, curr, i) => {
    if ((i + 1) % 2 === 0) return [...acc, acc.at(-1).concat(curr)];
    else return [...acc, [curr]];
  }, [])
  .filter((x) => x.length === 2);

const hej = seedranges.map(([start, range]) => {
  let res;
  for (let seed = start; seed < start + range; seed++) {
    const seedSoil = getNext(seed, parsedInput.maps["seed:soil"]);
    const soilFertilizer = getNext(
      seedSoil,
      parsedInput.maps["soil:fertilizer"]
    );
    const fertilizerWater = getNext(
      soilFertilizer,
      parsedInput.maps["fertilizer:water"]
    );
    const waterLight = getNext(
      fertilizerWater,
      parsedInput.maps["water:light"]
    );
    const lightTemperature = getNext(
      waterLight,
      parsedInput.maps["light:temperature"]
    );
    const tempHumidity = getNext(
      lightTemperature,
      parsedInput.maps["temperature:humidity"]
    );

    const humidityLocation = getNext(
      tempHumidity,
      parsedInput.maps["humidity:location"]
    );

    if (typeof res === "undefined") res = humidityLocation;
    if (humidityLocation < res) res = humidityLocation;

    // if (!res.some((n) => n < humidityLocation)) {
    // res.push(humidityLocation);
    // }
  }
  return res;
});

console.log(hej.flat());
