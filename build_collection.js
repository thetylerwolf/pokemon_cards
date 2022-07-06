const fs = require("fs");

const dirname = "cards/en/";

const collections = [];

const cardsTotal = 2138;

function addToDeck(filename, content) {
  const collection = JSON.parse(content);
  collections.push(collection);
}

async function readCards(dirname) {
  const filenames = fs.readdirSync(dirname);

  for (const filename of filenames) {
    const content = fs.readFileSync(dirname + filename, "utf-8");
    addToDeck(filename, content);
  }
}

function main() {
  readCards(dirname);

  const allCards = collections.flatMap((c) => c);
  const picks = Array.from({ length: cardsTotal });

  const myCards = picks.map((_, i) => {
    let card = false;

    while (!card) {
      let pickableCards =
        i > cardsTotal * 0.75
          ? allCards.filter((c) => c.supertype === "Energy")
          : allCards;

      const pick = Math.floor(Math.random() * pickableCards.length);
      const picked = pickableCards[pick];

      let factor = 0;
      switch (picked.rarity) {
        case "Rare":
          factor = 0.15;
          break;
        case "Uncommon":
          factor = 0.55;
          break;
        case "Common":
          factor = 0.8;
          break;
        default:
          factor = 0.03;
          break;
      }

      const luck = Math.random() < factor;

      if (luck) card = picked;
    }
    return card;
  });

  fs.writeFileSync(
    "./ash_collection_" + Date.now(),
    JSON.stringify(myCards, null, 4)
  );
}

main();
