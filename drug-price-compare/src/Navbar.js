import { AppBar, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <Grid container sx={{ mb:4 }}>
        <AppBar position="static" sx={{ backgroundColor:"rgb(66, 135, 245)"}}>
            <Grid container justifyContent="center" sx={{ my:2}}>
                <Grid item container sx={{ maxWidth:'1980px' }} >
                    <Link to='/' style={{ textDecoration:'none', color: 'inherit'}}>
                        <Grid container sx={{ mx:1}}>
                            <Grid item xs={1} sx={{ mx:1}}><i class="fa-solid fa-prescription"></i></Grid>
                            <Grid item xs={1}> <Typography>Compare</Typography></Grid>
                        </Grid>
                    </Link>
                    <Grid item container xs={1}>
                    </Grid>
                </Grid>
            </Grid>
        </AppBar>
        </Grid>
    )
};

export default Navbar;