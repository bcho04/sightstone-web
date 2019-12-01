const path = require('path');
const express = require('express');
const process = require("process");

const app = express();
const distPath = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3000;

app.use(express.static(distPath));
app.get('/', (req, res) => {
   res.sendFile(path.join(distPath, 'index.html'));
});
app.listen(port, () => {
   console.log('Server is up.');
});