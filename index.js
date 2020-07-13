const { question, keyInSelect } = require("readline-sync");
const robots = {
  text: require("./robots/text.js"),
};

const start = async () => {
  const content = {};

  const askAndReturnSearchTerm = () => {
    return question("Type a Wikipedia search term: ");
  };

  const askAndReturnPrefix = () => {
    const prefixes = ["Who is", "What is", "The history of"];
    const selectedPrefixIndex = keyInSelect(prefixes, "Choose one option: ");
    return prefixes[selectedPrefixIndex];
  };

  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  await robots.text(content);

  console.log(content);
};

start();
