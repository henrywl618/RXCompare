import Button from "@mui/material/Button";
import { Select, InputLabel, FormControl, MenuItem, Typography, Grid } from "@mui/material";


const FormDoseQtySearch = ( {drugName, forms, doses, qtys, medication, handleFormChange, updateDoseQty, handleClick, results} ) => {

    return (
        <Grid container item xs={11} md={8} lg={5} sx={{ my:2, mt:4 }}>
            <Grid container item justifyContent="left" >
                <Typography variant="h5" fontWeight={"bold"} sx={{ color:"rgb(66, 135, 245)", textTransform:"uppercase"}}>{drugName}</Typography>
            </Grid>
            <Grid container justifyContent="space-between" direction="row">
                <Grid container item xs={6} md={3} sx={{ my:1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="form-label">Form</InputLabel>
                        <Select name="form" 
                                id="form" 
                                labelId="form-label"
                                label="Form"
                                value={medication.form} 
                                onChange={(evt)=>handleFormChange(evt,false)}>
                            {forms?.map( form => <MenuItem value={form}>{form}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container item xs={6} md={3} sx={{ my:1}}>
                    <FormControl fullWidth>
                        <InputLabel id="dose-label">Dose</InputLabel>
                        <Select name="dose" 
                                id="dose" 
                                labelId="dose-label"
                                label="Dose"
                                value={medication.dose} 
                                onChange={updateDoseQty}>
                            {doses?.map( dose => <MenuItem value={dose}>{dose}</MenuItem>)}
                        </Select>
                    </FormControl>                    
                </Grid>
                <Grid container item xs={6} md={3} sx={{ my:1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="qty-label">Quantity</InputLabel>
                        <Select name="qty" 
                                id="qty" 
                                labelId="qty-label"
                                label="Quantity"
                                value={medication.qty} 
                                onChange={updateDoseQty}>
                            {qtys?.map( qty => <MenuItem value={qty}>{qty}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container item alignItems="center" justifyContent="center" xs={6} md={3} sx={{ my:1 }}>
                        <Button variant="contained" size="small" disabled={!results} onClick={handleClick}>
                            <Typography fontWeight={"bold"}>
                                Get Prices
                            </Typography>
                        </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default FormDoseQtySearch;