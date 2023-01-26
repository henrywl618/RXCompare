import { Grid } from "@mui/material";
import { useContext } from "react";
import MedicationContext from "./medicationCount";
import PriceListContainer from "./PriceListContainer";


const PriceList = ( {results } ) => {

    const {zip, drugName } = useContext(MedicationContext);

    return (
            <Grid container justifyContent="center" xs={12} lg={10} xl={9}>
                <PriceListContainer prices={results.WellRx} name={'WellRx'} url={`https://www.wellrx.com/prescriptions/${drugName}/${zip}/?freshSearch=true`}/>
                <PriceListContainer prices={results.DiscountDrugNetwork} name={'Discount Drug Network'} url={`https://www.discountdrugnetwork.com/get-discount?drugName=${drugName}&zip=${zip}`}/>
            </Grid>
    )
};

export default PriceList;