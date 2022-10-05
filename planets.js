const axios = require('axios');
const router = require('express').Router();

let planetList = [];
let planetResponse = [];

(async () => {
    try {
        // get all URLs
        for (let i = 0; i < 6; i++) {
            let url = 'https://swapi.dev/api/planets/?page=' + (i + 1);
            planetList = planetList.concat(url);
        };
        // get all results
        const planetsArr = await Promise.all(planetList.map(async planetPage => {

            return axios.get(planetPage).then((response) => response.data.results)

        }));
        // take out page breaks
        let planetArr = planetsArr.reduce((prev, current) => [...prev, ...current]);
        // create residents array and assign key value pairs for planets in planet array
        const allResidentURLs = planetArr.map((planet, index) => {
            return planet.residents.map(
                (resident) => ({
                    planetIndex: index,
                    residentURL: resident
                }))
        })
            // flatten array
            .reduce((prev, current) => [...prev, ...current]);
        // fetch URLs, returns resident's names
        const allResidentResults = await Promise.all(allResidentURLs.map(resident =>
            axios.get(resident.residentURL)
                //implicit return of the name via spread operator
                .then((result) => ({
                    ...resident, residentName: result.data.name
                }))
        ));
        // maps through planets, replaces resident url with resident names from allResidentsResults array using the planet index key value pairs
        const finalPlanets = planetArr.map((planet, IndexofPlanet) => {
            planet.residents = allResidentResults
                .filter((resident) =>
                    (resident.planetIndex === IndexofPlanet)
                )
                .map((resident) => resident.residentName)

            return planet;
        });
        print(finalPlanets);
        
    } catch (error) {
        console.debug(error)
    }
})();

function print(result){
    planetResponse = planetResponse.concat(result);
    return planetResponse;
}

router.get('/', (req, res) => {
    const result = planetResponse;
    res.send(result);
})

module.exports = router;