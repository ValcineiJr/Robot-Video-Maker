const { question, keyInSelect } = require("readline-sync");

const start = () => {
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

  console.log(content);
};

start();
