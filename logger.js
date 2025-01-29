export default {
  info: (message) => console.log(`\x1b[32m[INFO]\x1b[0m ${message}`),
  error: (message) => console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`),
};
