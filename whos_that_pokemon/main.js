import {geid} from './utilities.js';

const baseUrl = 'https://pokeapi.co/api/v2/';


// get json
function getJson(url) {
    return fetch(baseUrl + url).then(response => {
        // just because we got a response, doesn't mean it's a good one
        // error check
        if(response.ok) {
            return response.json();
        } else {
            //something went wrong
            console.log('error');
            throw new Error('response not ok');
        }
    }).catch(err => {
        // this executes when there was a problem
        console.log('getJSON', err);
    });
}
// get whole pokedex, for now just gen 1
async function startGame(gen) {
    let genToGet = await getJson(`generation/${gen}`);
    let pokemon = genToGet.pokemon_species;
    let options = [];
    pokemon = sortList(pokemon);

    // choose 1 pokemon for the game and answer
    let ansPokemon = Math.floor(Math.random() * 151);
    options.push(pokemon[ansPokemon]);
    
    // choose 3 pokemon for the other options
    while(options.length < 4) {
        let pokemonId = Math.floor(Math.random() * 151);
        // make sure we don't add duplicate pokemon
        if(!(options.some(pokemon => pokemon['id'] == (pokemonId + 1)))){
            options.push(pokemon[pokemonId]);
        }   
    }
    fillLayout(options);
}
function shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
function fillLayout(options) {
    var randomized = [0, 1, 2, 3];
    randomized = shuffle(randomized);
    
    geid("pokemon_name").setAttribute('PokemonName', options[0].name);
    geid("silhouette").innerHTML = `<img id="ansImg" class="center" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${options[0].id}.png" alt="${options[0].name}">`
    geid("option1").innerHTML = options[randomized[0]].name;
    geid("option2").innerHTML = options[randomized[1]].name;
    geid("option3").innerHTML = options[randomized[2]].name;
    geid("option4").innerHTML = options[randomized[3]].name;
    
}

startGame(1);

let allOptions = document.getElementsByClassName('choice');
for(let i = 0; i < allOptions.length; i++) {
    allOptions[i].addEventListener('click', event => {
        // call function to check selection
        compareAnswer(event.currentTarget.innerText);
    });
}

function compareAnswer(selection) {
    const answer = geid('pokemon_name').getAttribute("PokemonName");

    if(selection == answer) {
        geid("ansImg").style.filter = "brightness(100%)";
        geid("pokemon_name").innerText = answer;
        setTimeout(function() {
            alert("Correct!");
            geid("pokemon_name").innerText = "???";
            startGame(1);
        }, 250);
        
    } else {
        alert("Try again...");
    }
}


function sortList(list) {
    let newList = [];

    // get the info we actually need
    list.forEach(element => {
        let newItem = {
            "id" : element.url.substring(42, (element.url.length - 1)), // this is how the list will be sorted
            "name" : element.name.charAt(0).toUpperCase() + element.name.substring(1),
            "url" : element.url
        }
        newList.push(newItem);
    });
    // sort the new list
    newList.sort((a, b) => {
        return (a.id - b.id);
    });
    // give it back to the game
    return newList;
}

// check if the user's choice was correct