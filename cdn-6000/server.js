const express = require('express');
const app = express();
const port = 6001;

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`CDN (StaticHost) is running on http://localhost:${port}`);
});