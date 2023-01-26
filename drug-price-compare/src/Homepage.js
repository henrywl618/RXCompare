import { importAll } from "./helper";
import { Grid, Typography } from "@mui/material";
import MedicationSearch from "./MedicationSearch";


const Homepage = () => {

    const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

    return (
        <Grid container sx={{ m:0 }}>
            <Grid item container xs={12} alignItems="center" direction="row">
                <Grid item container xs={12} direction="column" sx={{ border:0, borderRadius:'5px', mx:3, mb:2, backgroundColor:"rgba(66, 135, 245,1)"}}>
                    <Grid item sx={{ py:10, px:5 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color:"rgb(255,255,255)" }}>
                            Find and compare prescription drug prices!
                        </Typography>
                    </Grid>
                    <Grid item>
                        <MedicationSearch drugName="" zip=""/>
                    </Grid>
                    <Grid item container sx={{ p:5 }} justifyContent="center" direction="column">
                        <Typography variant="h5" fontWeight="bold" fontSize="1rem" xs={12} sx={{ color:"rgb(255,255,255)", mb:2}}>
                            Discounts available at most U.S pharmacies including:
                        </Typography>
                        <Grid item container direction="row" justifyContent="center" alignItems="center">
                            {images.map( image => <Grid item sx={{mx:1}}> <img src={image}></img> </Grid>)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Homepage;