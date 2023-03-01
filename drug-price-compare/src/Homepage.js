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
                            {images.map( image => <Grid item sx={{mx:1}}> <img src={image} alt={"pharmacy-images"}></img> </Grid>)}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container justifyContent="center" sx={{ m:2, mb:4 }}>
                    <Grid item container md={3} direction="column">
                        <Grid sx={{ my:2 }}>
                            <i class="fa-solid fa-prescription-bottle-medical fa-2xl" style={{color:"rgb(66, 135, 245)"}}></i>
                        </Grid>
                        <Grid>
                            <Typography variant="h5" fontWeight="bold" sx={{ color:"rgb(66, 135, 245)"}}> 1. Search for medications </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="p" fontSize={"0.9rem"}> Search for your prescription medication and select your form, dose and quantity.</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container md={3} direction="column">
                        <Grid sx={{ my:2 }}>
                            <i class="fa-solid fa-hand-holding-dollar fa-2xl" style={{color:"rgb(66, 135, 245)"}}></i>
                        </Grid>
                        <Grid>
                            <Typography variant="h5" fontWeight="bold" sx={{ color:"rgb(66, 135, 245)"}}> 2. Compare prices </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="p" fontSize={"0.9rem"}> Compare prices at your local pharmacy.</Typography>
                        </Grid>
                    </Grid>
                    <Grid item container md={3} direction="column">
                        <Grid sx={{ my:2 }}>
                            <i class="fa-solid fa-tag fa-2xl" style={{color:"rgb(66, 135, 245)"}}></i>
                        </Grid>
                        <Grid>
                            <Typography variant="h5" fontWeight="bold" sx={{ color:"rgb(66, 135, 245)"}}> 3. Choose a coupon </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="p" fontSize={"0.9rem"}> Select a coupon that can be used at your local pharmacy.</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default Homepage;