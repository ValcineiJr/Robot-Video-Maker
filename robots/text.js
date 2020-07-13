const algorithmia = require("algorithmia");
const { KEY } = require("../credentials/api_key");
const sentenceBoundaryDetection = require("sbd");
const robot = async (content) => {
  const fetchContentFromWikipedia = async (content) => {
    const algorithmiaAuthenticated = algorithmia(KEY);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
  };

  const breakContentIntoSentences = (content) => {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
    console.log(sentences);
  };

  const sanitizeContent = (content) => {
    const removeBlankLinesAndMarkDown = (text) => {
      const allLines = text.split("\n");

      const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith("="))
          return false;
        return true;
      });

      return withoutBlankLinesAndMarkDown.join(" ");
    };

    const removeDatesInParentheses = (text) => {
      return text
        .replace(/\((?:\([^()]*\)|[^()])*\)/gm, "")
        .replace(/  /g, " ");
    };

    const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(
      content.sourceContentOriginal
    );
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkDown
    );

    content.sourceContentSanitized = withoutDatesInParentheses;

    console.log(withoutDatesInParentheses);
  };

  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
};

module.exports = robot;
