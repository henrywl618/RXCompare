import { Button, Grid, TextField, Popover } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SearchDropdownMenuList from "./SearchDropdownMenuList";
import axios from "axios";
import "./MedicationSearch.css";
import { Link } from "react-router-dom";

const MedicationSearch = ( { drugName, zip} ) => {
    
    const [formData, setFormData] = useState({drugName, zip, search:false})
    const [results, setResults] = useState([]);
    const [anchor, setAnchor] = useState(null);
    const nameInput = useRef();
    let open = Boolean(anchor);
    const controller = new AbortController();

    const handleChange = (evt, search) => {
        const target = evt.target;
        setFormData( oldData => ({ ...oldData, [target.name]: target.value, search}) );
    };

    const searchName = async () => {
        setResults([]);
        setAnchor(nameInput);
        const response = await axios.get(`http://localhost:3001/drugs/names/${formData.drugName}`);
        if(response.data.error === 404) {
            setResults(null);
        } else {
            setResults(response.data.names);
        }
    }

    const handleClose = () => {
        //cancel any pending api calls
        controller.abort();
        setAnchor(null);
    };


    const handleClick = (evt) => {
        const target = evt.target;
        console.log(target)
        console.log(target.value)
        setFormData( oldData => ({ ...oldData, drugName: target.getAttribute("value"), search:false}));
        handleClose(null);
    };

    useEffect(()=>{
        if(formData.drugName && formData.drugName.length >= 3 && formData.search){
            const getDrugNames = setTimeout( searchName, 600);
            return ()=> clearTimeout(getDrugNames)
        }   
    },[formData.drugName]);

    return (
        <>
        <form>
            <Grid container justifyContent="center">
                <Grid container alignItems="center" justifyContent="center" spacing={1} padding={2} sx={{ border:1, borderRadius:'5px' }} xs={11} md={8} lg={5}>
                    <Grid item xs={11} sm={6} md={7} lg={8}>
                        <TextField
                            id="drug-input"
                            name="drugName"
                            label="Medication"
                            type="text"
                            autoComplete="off"
                            fullWidth
                            inputRef={nameInput}
                            value={formData.drugName}
                            onChange={(evt)=>handleChange(evt,true)}/>
                    </Grid>
                    <Grid item xs={11} sm={3} md={2}>
                        <TextField
                            id="zip-input"
                            name="zip"
                            label="Zip"
                            type="text"
                            autoComplete="off"
                            fullWidth
                            inputProps={ {pattern: "[0-9]{5}", maxLength:5, inputMode:"numeric"} }
                            value={formData.zip}
                            onChange={(evt)=>handleChange(evt,false)}/>
                    </Grid>
                    <Grid item xs={8} sm={2}>
                        
                        <Link to={`/prices/${formData.drugName}/${formData.zip}`} style={{ textDecoration:'none'}}>
                            <Button variant="contained">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </Button>
                        </Link>
                    </Grid>
                        <Popover
                            open={open}
                            anchorEl={nameInput.current}
                            onClose={handleClose}
                            className="paper"
                            anchorOrigin={{
                                    vertical:"bottom",
                                    horizontal:"left"
                            }}>
                            <SearchDropdownMenuList results={results} handleClick={handleClick}/>
                        </Popover>
                </Grid>
            </Grid>

        </form>
        </>
    )
};

export default MedicationSearch;