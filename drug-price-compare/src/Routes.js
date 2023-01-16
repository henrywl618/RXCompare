import  { Switch, Route } from "react-router-dom";
import Homepage from "./Homepage";
import MedicationPage from "./MedicationPage";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/prices/:drugName/:zip">
                <MedicationPage/>
            </Route>
            <Route exact path="/">
                <Homepage/>
            </Route>
        </Switch>
    )
};

export default Routes;