import { ListItem, Typography, Grid } from "@mui/material";

const PharmacyCard = ({ name, address, price}) => {
    
    return (
        <ListItem>
            <Grid container justifyContent="space-between">
                <Grid item xs={8}>
                    <Grid>
                        <Typography fontWeight={'bold'}
                                    > {name} </Typography>
                    </Grid>
                    <Grid>
                        <Typography fontSize={'0.75rem'}>  {address} </Typography>
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