const app = require("./app");
const config = require("./config");

const PORT = config.PORT;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
