import MedicationSearch from "./MedicationSearch";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import FormDoseQtySearch from "./FormDoseQtySearch";
import PriceList from "./PriceList";
import axios from "axios";
import { Grid } from "@mui/material";

const MedicationPage = () => {

    const { drugName, zip } = useParams();
    const [medication, setMedication] = useState({ drugName, zip, form: "", dose: "", qty: "", search:false});
    const [results, setResults] = useState(null);
    const [forms, setForms] = useState([]);
    const [doses, setDoses] = useState([]);
    const [qtys, setQtys] = useState([]);

    const fetchPrices = async({drugName, zip, form, dose, qty})=>{
        const response = await axios( {url:"http://localhost:3001/drugs/prices", method:"post", data: {name:drugName, form, zip, dose, qty}});
        const results = response.data
        setResults(results)
    };

    const fetchDoseQty = async (name, form, search=false) => {
        const response = await axios( { url: "http://localhost:3001/drugs/doseqty", method: "post", data: { name, form}});
        const doses = response.data.doses;
        const qtys = response.data.qtys;
        setDoses(doses);
        setQtys(qtys);
        setMedication({ drugName, zip, form, dose:doses[0], qty:qtys[0], search});
    }; 

    const fetchForms = async (name, search=true) => {
        const response = await axios( { url: "http://localhost:3001/drugs/forms", method: 'post', data: { name }});
        const form = response.data.forms[0];
        fetchDoseQty(drugName, form, search);
        setForms(response.data.forms);
    };

    const handleFormChange = (evt) => {
        const target = evt.target;
        fetchDoseQty( drugName, target.value);
    };

    const updateDoseQty = (evt) => {
        const target = evt.target;
        setMedication( oldData => ({...oldData, [target.name]: target.value}))
    }

    const handleClick = (evt) => {
        const target = evt.target;
        setResults(null);
        fetchPrices(medication);
    };

    useEffect(()=>{    
        setResults(null); 
        fetchForms(drugName);
    },[drugName]);
    
    useEffect(()=>{
        if(medication.search) fetchPrices(medication)
    },[medication]);

    return (
        <Grid container flexDirection="column" sx={{m:2}}>
            <Grid item>
                <MedicationSearch drugName={drugName} zip={zip}></MedicationSearch>
            </Grid>
            <Grid container item justifyContent="center">
                <FormDoseQtySearch drugName={drugName} 
                                    forms={forms} 
                                    doses={doses} 
                                    qtys={qtys} 
                                    medication={medication}
                                    setMedication={setMedication} 
                                    handleFormChange={handleFormChange}
                                    updateDoseQty={updateDoseQty}
                                    handleClick={handleClick}
                ></FormDoseQtySearch>
            </Grid>
            <Grid item container justifyContent="center" sx={{ my:2 }}>
                {results 
                    ? <PriceList results={results}></PriceList>
                    : <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                }
            </Grid>
        </Grid>
    )
};

export default MedicationPage;