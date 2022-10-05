const axios = require('axios');
const router = require('express').Router();

let peopleList = [];
let peopleResults = [];


(async () => {
    try {
        //get all urls
        for (let i = 0; i < 9; i++) {
            let url = 'https://swapi.dev/api/people/?page=' + (i + 1);
            peopleList = peopleList.concat(url);
        };
        // get all results
        const peopleArr1 = await Promise.all(peopleList.map(async page => {

            return axios.get(page).then((response) => response.data.results)

        }));
        // take out page breaks
        let peopleArr2 = peopleArr1.reduce((prev, current) => [...prev, ...current]);

        scopeChange(peopleArr2)

    } catch (error) {
        console.log(error);
    }
})();

function scopeChange(data) {
    peopleResults = peopleResults.concat(data);
    return peopleResults
}

router.get('/', (req, res) => {
    let results = peopleResults;
    res.send(results);
})

//works
router.get('/name', (req, res) => {
    let results = peopleResults.sort((a, b) => a.name.localeCompare(b.name));
    res.send(results);

})

// works
router.get('/height', (req, res) => {
    let unknowns = peopleResults.filter(person => (person.height === "unknown"));
    let normies = peopleResults.filter(person => (person.height !== "unknown"));


    let sortNorm = normies.sort((a, b) => {
        return parseInt(a.height) - parseInt(b.height);
    });

    let results = sortNorm.concat(unknowns);

    res.send(results);
})

// works
router.get('/mass', (req, res) => {
    let unknowns = peopleResults.filter(person => (person.mass === "unknown"));
    let normies = peopleResults.filter(person => (person.mass !== "unknown")).map((person) => {
        let weight = person.mass;
        return {...person, mass: weight.replaceAll(",","")}
    });

    let sortNorm = normies.sort((a, b) => { return parseInt(a.mass) - parseInt(b.mass); });

    let results = sortNorm.concat(unknowns);
    res.send(results);
})



module.exports = router;