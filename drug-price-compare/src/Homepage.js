import { Grid } from "@mui/material";
import MedicationSearch from "./MedicationSearch";

const Homepage = () => {

    return (
        <Grid container sx={{ m:0 }}>
            <Grid item xs={12} alignItems="center">
                <MedicationSearch drugName="" zip=""/>
            </Grid>
        </Grid>
    )
};

export default Homepage;