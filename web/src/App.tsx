import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Pokemon } from './pages/Pokemon';
import { createContainer } from "unstated-next"
import { Login } from './pages/Login';

function useAppState(initialState = false) {
  let [isLoggedIn, setIsLoggedIn] = useState(initialState)

  let setLoggedInStatus = (val: boolean) => setIsLoggedIn(val)

  let [pokemonName, setPokemonName] = useState<string>("")
  let [pokemonGif, setPokemonGif] = useState<string>("https://media.giphy.com/media/9DavVitIZ26jH0aK7s/giphy.gif")

  return { isLoggedIn, setLoggedInStatus, pokemonName, setPokemonName, pokemonGif, setPokemonGif }
}

export let AppState = createContainer(useAppState)

const Routes = () => {
  let appState = AppState.useContainer()



  // if (!appState.isLoggedIn) {
  //   return (
  //     <Router>
  //       <div>
  //         <button onClick={() => { appState.setLoggedInStatus(true) }}>Login</button>
  //         <nav>
  //           <ul>
  //             <li>
  //               <Link to="/login">Login</Link>
  //             </li>
  //           </ul>
  //         </nav>

  //         <Switch>
  //           <Route path="/">
  //             <Login />
  //           </Route>
  //         </Switch>
  //       </div>
  //     </Router >)
  // }



  return (<Router>
    <div>
      <nav>
        <button onClick={() => { appState.setLoggedInStatus(false) }}>Logout</button>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/pokemon">Pokemon</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
    renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/pokemon">
          <Pokemon />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </div>
  </Router>)


}


function App() {
  return (
    <AppState.Provider>
      <div className="App">
        <Routes />
      </div>
    </AppState.Provider>
  );
}

export default App;
