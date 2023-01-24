import { Grid, Typography } from "@mui/material";

const NotFoundPage = () => {
    return (
        <Grid container justifyContent="center" direction="column">
            <Typography variant="h1" align="center">404</Typography>
            <Typography variant="h5" align="center"> Page not found </Typography>
        </Grid>
    )
};

export default NotFoundPage;