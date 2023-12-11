import * as fs from "fs";
const input = fs.readFileSync("./input.txt", "utf8").trim();
// const input = `
// 32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483
// `.trim();

const parsedInput = input
  .split("\n")
  .map((v) => v.split(" "))
  .map(([hand, bid]) => ({ hand: hand.split(""), bid: Number(bid) }));

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const cards_2 = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

const fiveOfAKind = (hand: Array<string>) => hand.every((c) => c === hand[0]);
const fourOfAKind = (hand: Array<string>) =>
  Object.values(
    hand.reduce(
      (acc, curr) => ({ ...acc, [curr]: acc[curr] ? acc[curr] + 1 : 1 }),
      {}
    )
  ).includes(4);

const fullHouse = (hand: Array<string>) =>
  Object.keys(
    hand.reduce(
      (acc, curr) => ({ ...acc, [curr]: acc[curr] ? acc[curr] + 1 : 1 }),
      {}
    )
  ).length === 2;

const threeOfAKind = (hand: Array<string>) =>
  Object.values(
    hand.reduce(
      (acc, curr) => ({ ...acc, [curr]: acc[curr] ? acc[curr] + 1 : 1 }),
      {}
    )
  ).includes(3);

const twoPair = (hand: Array<string>) =>
  Object.values(
    hand.reduce((acc, a) => ({ ...acc, [a]: acc[a] ? acc[a] + 1 : 1 }), {})
  ).filter((x) => x === 2).length === 2;

const pair = (hand: Array<string>) =>
  Object.values(
    hand.reduce((acc, a) => ({ ...acc, [a]: acc[a] ? acc[a] + 1 : 1 }), {})
  ).filter((x) => x === 2).length === 1;

const highCard = (hand: Array<string>) =>
  Array.from(new Set(hand)).length === 5;

const mapHandStrength = (hand: Array<string>) => {
  const js = hand.join("").replace(/[^J]/g, "").length;
  if (fiveOfAKind(hand)) {
    return 7;
  }
  if (fourOfAKind(hand)) {
    return hand.includes("J") ? 7 : 6;
  }

  if (fullHouse(hand)) {
    if (js === 3) return 7;
    if (js === 2) return 7;
    if (js === 1) return 6;
    return 5;
  }

  if (threeOfAKind(hand)) {
    if (js === 3) return 6;
    if (js === 2) return 7;
    if (js === 1) return 6;
    return 4;
  }

  if (twoPair(hand)) {
    if (js === 1) return 5;
    if (js === 2) return 6;
    return 3;
  }

  if (pair(hand)) {
    if (js === 1) return 4;
    if (js === 2) return 4;
    return 2;
  }
  if (highCard(hand)) {
    if (js === 1) return 2;
    return 1;
  }
};

const getHandStrength = (hand: Array<string>) => {
  return mapHandStrength(hand);
};

type InGameHand = { hand: Array<string>; bid: number; strength: number };

const sortByStrength = (a: InGameHand, b: InGameHand) => {
  const a_strength = getHandStrength(a.hand);
  const b_strength = getHandStrength(b.hand);

  if (a_strength !== b_strength) {
    return b_strength < a_strength ? -1 : 1;
  }

  const [a_1, a_2, a_3, a_4, a_5] = a.hand;
  const [b_1, b_2, b_3, b_4, b_5] = b.hand;
  if (cards_2.indexOf(a_1) > cards_2.indexOf(b_1)) return 1;
  if (cards_2.indexOf(b_1) > cards_2.indexOf(a_1)) return -1;
  if (cards_2.indexOf(a_2) > cards_2.indexOf(b_2)) return 1;
  if (cards_2.indexOf(b_2) > cards_2.indexOf(a_2)) return -1;
  if (cards_2.indexOf(a_3) > cards_2.indexOf(b_3)) return 1;
  if (cards_2.indexOf(b_3) > cards_2.indexOf(a_3)) return -1;
  if (cards_2.indexOf(a_4) > cards_2.indexOf(b_4)) return 1;
  if (cards_2.indexOf(b_4) > cards_2.indexOf(a_4)) return -1;
  if (cards_2.indexOf(a_5) > cards_2.indexOf(b_5)) return 1;
  if (cards_2.indexOf(b_5) > cards_2.indexOf(a_5)) return -1;
  // console.log("compare", { a, b, a_cardsum, b_cardsum });
  // if (a_cardsum < b_cardsum) return -1;
  // else return 1;
};

const game = (hands: Array<{ hand: Array<string>; bid: number }>) => {
  const strength = hands.map((d) => ({
    ...d,
    strength: getHandStrength(d.hand),
  }));

  return Array.from(strength).sort(sortByStrength).reverse();
};

const part1 = game(parsedInput);
console.log(
  part1

    .map((x, i) => ({ ...x, rank: i + 1 }))
    .map((x) => x.bid * x.rank)
    .reduce((a, b) => a + b, 0)
);
