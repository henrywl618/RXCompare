import  { Switch, Route } from "react-router-dom";
import DrugSearch from "./DrugSearch";
import Homepage from "./Homepage";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/prices">
                <DrugSearch/>
            </Route>
            <Route exact path="/">
                <Homepage/>
            </Route>
        </Switch>
    )
};

export default Routes;