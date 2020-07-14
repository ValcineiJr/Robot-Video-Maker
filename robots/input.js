const { question, keyInSelect } = require("readline-sync");
const state = require("./state");

const robot = () => {
  const content = {
    maximumSentences: 7,
  };

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
  state.save(content);
};

module.exports = robot;
