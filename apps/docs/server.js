const express = require("express");
const path = require("path");

const app = express();

// Serve the static files from the VitePress build output directory
app.use(express.static(path.join(__dirname, ".vitepress/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, ".vitepress/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
