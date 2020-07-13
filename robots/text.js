const algorithmia = require("algorithmia");
const {
  AlgorithmiaiKEY,
  WatsonKEY,
  WatsonURL,
} = require("../credentials/api_key");
const sentenceBoundaryDetection = require("sbd");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2019-07-12",
  authenticator: new IamAuthenticator({
    apikey: WatsonKEY,
  }),
  url: WatsonURL,
});

const robot = async (content) => {
  const fetchContentFromWikipedia = async (content) => {
    const algorithmiaAuthenticated = algorithmia(AlgorithmiaiKEY);
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
  };

  const limitMaximumSentences = (content) => {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  };

  const fetchWatsonAndReturnKeywords = async (sentence) => {
    return new Promise((resolve, reject) => {
      naturalLanguageUnderstanding.analyze(
        {
          text: sentence,
          features: {
            keywords: {},
          },
        },
        (error, response) => {
          if (error) throw error;
          const keywords = response.result.keywords.map((keyword) => {
            return keyword.text;
          });
          resolve(keywords);
        }
      );
    });
  };

  const fetchKeyworsOfAllSentences = async (content) => {
    for (const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
    }
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
  limitMaximumSentences(content);
  await fetchKeyworsOfAllSentences(content);
};

module.exports = robot;
