const fetch = require('node-fetch');

fetch('http://localhost:3000/').then(result => {
    return result.json();
}).then(data => console.log(data));