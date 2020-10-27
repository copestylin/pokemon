import React, { useState } from "react";
import { AppState } from "../App";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { promises } from "fs";

interface GetPokemonResponse {
  forms: [
    {
      name: string;
    }
  ];
  sprites: {
    front_default: string;
  };
}

interface GetCountResponse {
  count: number;
}

export const Pokemon = () => {
  //set some local state variables
  const [numberOfPokemon, setNumberOfPokemon] = useState<number>(1050);
  const [loading, setLoading] = useState<boolean>(false);

  //set for routing
  let match = useRouteMatch();
  //set for appState
  let appState = AppState.useContainer();

  //select a random pokemon
  const randomPokemon = async () => {
    //get a random pokemon's name
    const getPokemon = async () => {
      await getCount(); // sets numberOfPokemon

      let randomNumber = Math.floor(Math.random() * numberOfPokemon);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
        );
        if (response.status !== 200) {
          console.log("Error: Couldn't Get Pokemon Data");
          return;
        } else {
          const result: GetPokemonResponse = await response.json();
          appState.setPokemonName(result.forms[0].name);
          appState.setPokemonGif(result.sprites.front_default);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    //update the total count of pokemon
    const getCount = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
      if (response.status !== 200) {
        console.log("Error: Couldn't access API.");
        return;
      } else {
        const result: GetCountResponse = await response.json();
        setNumberOfPokemon(result.count);
      }
    };

    //start loading gif
    setLoading(true);

    await getPokemon();

    //end loading gif
    setLoading(false);
  };

  return (
    <div>
      <h1>Random Pokemon Generator</h1>

      <Link to={`../pokemon`}>
        <button
          onClick={async () => {
            await randomPokemon();
          }}
        >
          I choose you...
        </button>
        <br />
      </Link>
      {(loading && (
        <div>
          <br />
          <img
            src="https://media.giphy.com/media/sSgvbe1m3n93G/giphy.gif"
            height="38px"
          />
        </div>
      )) || (
        <>
          <Link to={`../pokemon/${appState.pokemonName}`}>
            <h1>{appState.pokemonName}</h1>
            <img src={appState.pokemonGif} />
            <br />
          </Link>
        </>
      )}

      <Switch>
        <Route path={`${match.path}/:pokemonName`}>
          <Character />
        </Route>
      </Switch>
    </div>
  );
};

function Character() {
  let { pokemonName } = useParams();
  return (
    <div>
      <h3>More about {pokemonName}!</h3>
    </div>
  );
}
