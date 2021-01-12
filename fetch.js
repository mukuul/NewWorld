const fetch = require('node-fetch');

const getcountries = (link) => {
    let countryPr;
    fetch('https://restcountries.eu/rest/v2/all')
        .then(response => response.json())
        .then(json => countryPr(json))
    return new Promise(resolve => { countryPr = resolve })
}

module.exports = {
    getcountries,
}