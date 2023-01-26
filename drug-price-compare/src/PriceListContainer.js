import PharmacyCard from "./PharmacyCard";
import { Grid, Typography, List, Button, Accordion, AccordionSummary, AccordionDetails, Divider, Link } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ThemeProvider } from "@mui/system";;

const PriceListContainer = ({ prices, name, url }) => {

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const handleClick = (evt) => {
        evt.stopPropagation();
    };

    return (
        <Grid item xs={12} sm={5.7} sx={{ m:0.25 }} >
            <Accordion defaultExpanded={true} sx={{ border:1, borderColor:"rgb(66, 135, 245)", backgroundColor:"rgba(66, 135, 245, 0.1)"}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>} >
                    <Grid container sx={{ px:2, py:1 }}>
                        <Grid item container xs={8} sm={12} xl={8}>
                            <ThemeProvider theme={theme}>
                                <Typography noWrap variant="h5" fontWeight="bold" alignContent="center" sx={{ mt:3, textAlign:"left", marginTop:0, color:"rgb(66, 135, 245)"}}>{name}</Typography>
                            </ThemeProvider>
                        </Grid>
                        <Grid item container xs={4} alignItems="center" justifyContent={{xs:'right', sm:'left', xl:'right'}}>
                            <Link target="_blank" href={url} sx={{ textDecoration:"none"}} onClick={handleClick}>
                                <Button size="small" variant="contained">
                                    <Typography sx={{ fontSize:'0.6rem'}}>
                                        Get Coupon
                                    </Typography>
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <Divider/>
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