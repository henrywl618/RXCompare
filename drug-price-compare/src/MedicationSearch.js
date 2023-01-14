import { Button, Grid, TextField, Popover } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SearchDropdownMenuList from "./SearchDropdownMenuList";
import axios from "axios";
import debounce from "lodash.debounce";
import "./MedicationSearch.css";

const MedicationSearch = () => {
    
    const [formData, setFormData] = useState({drugName:"", zip:"", search:true})
    const [results, setResults] = useState([]);
    const [anchor, setAnchor] = useState(null);
    const nameInput = useRef();
    let open = Boolean(anchor);
    let search = true;

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
        setAnchor(null);
    };


    const handleClick = (evt) => {
        const target = evt.target;
        console.log(target)
        console.log(target.value)
        search = false;
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
            <Grid container alignItems="center" justifyContent="center" spacing={1}>
                <Grid item>
                    <TextField
                        id="drug-input"
                        name="drugName"
                        label="Medication"
                        type="text"
                        inputRef={nameInput}
                        value={formData.drugName}
                        onChange={(evt)=>handleChange(evt,true)}/>
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        id="zip-input"
                        name="zip"
                        label="Zip"
                        type="text"
                        inputProps={ {pattern: "[0-9]{5}", maxLength:5, inputMode:"numeric"} }
                        value={formData.zip}
                        onChange={(evt)=>handleChange(evt,false)}/>
                </Grid>
                <Grid>
                    <Button>
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </Button>
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
        </form>
        </>
    )
};

export default MedicationSearch;