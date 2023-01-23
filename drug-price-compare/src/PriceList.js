import { Grid } from "@mui/material";
import PriceListContainer from "./PriceListContainer";


const PriceList = ( {results} ) => {

    return (
        <Grid container justifyContent="center" xs={12} sm={10} md={8} lg={7}>
            <PriceListContainer prices={results.WellRx} name={'WellRx'}/>
            <PriceListContainer prices={results.DiscountDrugNetwork} name={'Discount Drug Network'}/>
        </Grid>
    )
};

export default PriceList;