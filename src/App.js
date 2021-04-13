import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './Components/Header';
import { DfxUserData } from './Components/DfxUserData';
import {Analysis} from './Components/Analysis';
import {BrowserRouter as Router, Switch, Route, HashRouter} from "react-router-dom";


function App() {
  return (
    <>
    <HashRouter basename={process.env.PUBLIC_URL}>
    <Header />
        <Switch>
            <Route exact path="/" component={Analysis} />
            <Route path="/users" component={DfxUserData} />
        </Switch>
    </HashRouter>
    </>
  )
}

export default App;
