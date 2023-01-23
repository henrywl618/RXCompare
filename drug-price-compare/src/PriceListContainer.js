import PharmacyCard from "./PharmacyCard";
import { Grid, Typography, List, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ThemeProvider } from "@mui/system";

const PriceListContainer = ({ prices, name, link }) => {

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return (
        <Grid item xs={12} sm={5.7} sx={{ m:0.25 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Grid container sx={{ px:2, py:1 }}>
                        <Grid item container xs={8} sm={12} xl={8}>
                            <ThemeProvider theme={theme}>
                                <Typography noWrap variant="h5" fontWeight="bold" alignContent="center" sx={{ mt:3, textAlign:"left", marginTop:0 }}>{name}</Typography>
                            </ThemeProvider>
                        </Grid>
                        <Grid item container xs={4} alignItems="center" justifyContent={{xs:'right', sm:'left', xl:'right'}}>
                            <Button size="small" variant="contained">
                                <Typography sx={{ fontSize:'0.6rem'}}>
                                    Get Coupon
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid item >
                        <List sx={{ width:'100%' }}>
                            {prices?.map(price => <PharmacyCard name={price.name} address={price.address} price={price.price}/>)}
                        </List>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    )
};

export default PriceListContainer;