import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from 'react-router-dom';
// import Data from './data_dump';

import Home from './components/Home';
import Story from './components/Story';

function App() {
    // const temp = Data[0];
    return (
        // <Router>
        <div className="App">
            <h1>Project Title</h1>
            <nav className="nav">
                <ul>
                    <li>
                        <NavLink
                            exact
                            activeClassName="activeNav"
                            to="/app/home"
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            exact
                            activeClassName="activeNav"
                            to="/app/story"
                        >
                            Story
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact activeClassName="activeNav" to="/temp">
                            Page 3
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/app/story">
                    <Story />
                </Route>
                <Route path="/app/home">
                    <Home />
                </Route>
            </Switch>
        </div>
        // </Router>
    );
}

export default App;
// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
