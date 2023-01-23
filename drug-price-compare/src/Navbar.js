import { AppBar, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <Grid container sx={{ mb:4 }}>
        <AppBar position="static" >
            <Grid container sx={{ my:2 }}>
                <Link to='/' style={{ textDecoration:'none', color: 'inherit'}}>
                    <Grid container sx={{ mx:1}}>
                        <Grid item xs={1} sx={{ mx:1}}><i class="fa-solid fa-prescription"></i></Grid>
                        <Grid item xs={1}> <Typography>Compare</Typography></Grid>
                    </Grid>
                </Link>
                <Grid item container xs={1}>
                </Grid>
            </Grid>
        </AppBar>
        </Grid>
    )
};

export default Navbar;