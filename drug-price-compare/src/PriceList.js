import { useEffect, useState } from "react";
import { Grid, Typography, List } from "@mui/material";
import PharmacyCard from "./PharmacyCard";


const PriceList = ( {prices} ) => {

    return (
        <Grid container justifyContent="center">
        <Grid item xs={11} md={4}>
            <Typography variant="h5" fontWeight="bold" sx={{ mt:3 }}>Discount Drug Network</Typography>
            <List>
                {prices.DiscountDrugNetwork?.map(prices => <PharmacyCard name={prices.name} address={prices.address} price={prices.price}/>)}
            </List>
        </Grid>
        <Grid item xs={11} md={4}>
            <Typography variant="h5" fontWeight="bold" sx={{ mt:3 }}>WellRx</Typography>
            <List>
                {prices.WellRx?.map(prices => <PharmacyCard name={prices.name} address={prices.address} price={prices.price}/>)}
            </List>
        </Grid>
        </Grid>
    )
};

export default PriceList;