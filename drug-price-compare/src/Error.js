import { Grid, Typography } from "@mui/material";

const Error = ( { message, status } ) => {

    return (
        <Grid item>
            <Typography variant="p"> {message} </Typography>
        </Grid>
    )
};

export default Error;