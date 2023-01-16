import { Grid } from "@mui/material";
import MedicationSearch from "./MedicationSearch";

const Homepage = () => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <h1>Drug Price Comparer</h1>
            </Grid>
            <Grid item xs={12} alignItems="center">
                <MedicationSearch drugName="" zip=""/>
            </Grid>
        </Grid>
    )
};

export default Homepage;