import PharmacyCard from "./PharmacyCard";
import { Grid, Typography, List, Button } from "@mui/material";

const PriceListContainer = ({ prices, name }) => {

    return (
        <Grid item xs={12} sm={6}>
            <Grid item container sx={{ px:2, py:1 }}>
                <Grid>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt:3 }}>{name}</Typography>
                </Grid>
                <Grid>
                    <Button>{"Get Coupon"}</Button>
                </Grid>
            </Grid>
            <Grid item container >
                <List sx={{ width:'100%' }}>
                    {prices?.map(price => <PharmacyCard name={price.name} address={price.address} price={price.price}/>)}
                </List>
            </Grid>
        </Grid>
    )
};

export default PriceListContainer;