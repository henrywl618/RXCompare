import { ListItem, Typography, Grid, Link } from "@mui/material";
import { useContext } from "react";
import MedicationContext from "./medicationCount";

const PharmacyCard = ({ name, address, price}) => {

    const {zip} = useContext(MedicationContext);
    return (
        <ListItem>
            <Grid container justifyContent="space-between">
                <Grid item xs={8}>
                    <Grid>
                        <Typography fontWeight={'bold'}
                                    > {name} </Typography>
                    </Grid>
                    <Grid>
                        {
                            address
                                ? <Typography fontSize={'0.75rem'}>  {address} </Typography>
                                : <Typography fontSize={'0.75rem'}>  <Link target="_blank" href={`http://www.google.com/search?q=${name} near ${zip}`}>Find nearest location</Link> </Typography>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Grid>
                        <Typography textAlign='right'
                                    fontWeight='bold'>
                                    {price}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </ListItem>
    )
};

export default PharmacyCard;