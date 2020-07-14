const state = require("./state");
const { google } = require("googleapis");
const customSearch = google.customsearch("v1");
const { GoogleAPIKEY, SearchID } = require("../credentials/api_key");

const robot = async () => {
  const content = state.load();

  const fetchGoogleAndReturnImagesLink = async (query) => {
    const response = await customSearch.cse.list({
      auth: GoogleAPIKEY,
      cx: SearchID,
      q: query,
      searchType: "image",
      num: 2,
    });

    const imagesUrl = response.data.items.map((item) => {
      return item.link;
    });

    return imagesUrl;
  };

  const fetchImagesOfAllSentences = async (content) => {
    for (const sentence of content.sentences) {
      const query = `${content.searchTerm} ${sentence.keywords[0]}`;
      sentence.images = await fetchGoogleAndReturnImagesLink(query);

      sentence.googleSearchQuery = query;
    }
  };

  await fetchImagesOfAllSentences(content);

  state.save(content);
};

module.exports = robot;
