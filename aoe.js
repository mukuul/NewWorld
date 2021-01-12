const got = require('got');

var aoe = async (civil) => {
    console.log("requesting " + "https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations")
    const response1 = await got("https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations")
    var civilizations = JSON.parse(response1.body).civilizations;
    for (var i = 0; i < civilizations.length; i++) {
        if (civilizations[i].name === civil) {
            var civilization = civilizations[i];
            var civ_name = civilization.name;
            var civ = "";
            civ += `${civ_name} have `
            if (civilization.unique_unit.length === 0) { civ += `no unique unit.` }
            for (var j = 0; j < civilization.unique_unit.length; j++) {
                if (j !== 0) {
                    civ = civ.substring(0, civ.length - 1);
                    civ += " and ";
                }
                var unit = civilization.unique_unit[j];
                console.log("requesting " + unit);

                const response = await got(unit);
                var unique_unit = JSON.parse(response.body);
                civ += `${unique_unit.name} in the ${unique_unit.age} age.`;
            }
            return civ;
        }
    }
}

module.exports = {
    aoe
}