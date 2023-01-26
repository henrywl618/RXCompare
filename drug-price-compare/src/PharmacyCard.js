import { ListItem, Typography, Grid, Link, Divider } from "@mui/material";
import { useContext } from "react";
import MedicationContext from "./medicationCount";

const PharmacyCard = ({ name, address, price}) => {

    const {zip} = useContext(MedicationContext);
    return (
        <>
        <ListItem>
            <Grid container justifyContent="space-between">
                <Grid item xs={9}>
                    <Grid>
                        <Typography fontWeight={'bold'} > {name} </Typography>
                    </Grid>
                    <Grid>
                        {
                            address
                                ? <Typography fontSize={'0.75rem'} sx={{color:"rgb(66, 135, 245)"}}>  {address} </Typography>
                                : <Typography fontSize={'0.75rem'} sx={{color:"rgb(66, 135, 245)"}}>  <Link target="_blank" href={`http://www.google.com/search?q=${name} near ${zip}`}>Find nearest location</Link> </Typography>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid>
                        <Typography textAlign='right'
                                    fontWeight='bold'
                                    sx={{ color:"rgb(66, 135, 245)"}}>
                                    {price}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
        <Divider sx={{backgroundColor:"rgb(66, 135, 245)"}}/>
        </>
    )
};

export default PharmacyCard;