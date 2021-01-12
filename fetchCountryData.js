const fetch = require('node-fetch');

const fetchCountries = () => {
    let dataPr;
    fetch('https://restcountries.eu/rest/v2/all')
        .then(response => response.json())
        .then(json => dataPr(json))
    return new Promise(resolve => { dataPr = resolve })
}

const fetchCountry = (name) => {
    let countryPr;
    fetch(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
    .then(response => response.json())
    .then(json => countryPr(json[0]))
    return new Promise(resolve => { countryPr = resolve })
}


module.exports = {
    fetchCountries,
    fetchCountry,
}