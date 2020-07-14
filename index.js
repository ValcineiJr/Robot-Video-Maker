const robots = {
  input: require("./robots/input"),
  text: require("./robots/text.js"),
  state: require("./robots/state"),
};

const start = async () => {
  robots.input();
  await robots.text();
  const content = robots.state.load();
  console.dir(content, { depth: null });
};

start();
