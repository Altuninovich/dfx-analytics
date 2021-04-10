import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './Components/Header';
import { DfxUserData } from './Components/DfxUserData';
import {Analysis} from './Components/Analysis';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


function App() {
  return (
    <>
    <Router>
    <Header />
        <Switch>
            <Route exact path="/" component={Analysis} />
            <Route path="/users" component={DfxUserData} />
        </Switch>
    </Router>
    </>
  )
}

export default App;
