import MedicationSearch from "./MedicationSearch";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import FormDoseQtySearch from "./FormDoseQtySearch";
import PriceList from "./PriceList";
import axios from "axios";
import { Grid } from "@mui/material";
import MedicationContext from "./medicationCount";
import Error from "./Error";
import { backendURL } from "./helper";

const MedicationPage = () => {

    const { drugName, zip } = useParams();
    const [medication, setMedication] = useState({ drugName, zip, form: "", dose: "", qty: "", search:false});
    const [results, setResults] = useState(null);
    const [forms, setForms] = useState([]);
    const [doses, setDoses] = useState([]);
    const [qtys, setQtys] = useState([]);

    const fetchPrices = async({drugName, zip, form, dose, qty})=>{  
        try {
            const response = await axios( {url:`${backendURL}/prices`, 
                                           method:"post", 
                                           data: {name:drugName, form, zip, dose, qty}});
            const results = response.data
            setResults(results)
        } catch (err) {
            const results = err.response.data
            setResults(results)
        }
    };

    const fetchDoseQty = async (name, form, search=false) => {
        console.log("fetch price")
        const response = await axios( { url: `${backendURL}/doseqty`, method: "post", data: { name, form}});
        const doses = response.data.doses;
        const qtys = response.data.qtys;
        setDoses(doses);
        setQtys(qtys);
        setMedication({ drugName, zip, form, dose:doses[0], qty:qtys[0], search});
    }; 

    const fetchForms = async (name, search=true) => {
        const response = await axios( { url: `${backendURL}/forms`, method: 'post', data: { name }});
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
        setMedication( oldData => ({...oldData, [target.name]: target.value, search:false}))
    }

    const handleClick = () => {
        setResults(null);
        fetchPrices(medication);
    };

    useEffect(()=>{    
        setResults(null); 
        setForms([]);
        setDoses([]);
        setQtys([]);
        fetchForms(drugName);
    },[drugName, zip]);
    
    useEffect(()=>{
        if(medication.search) fetchPrices(medication)
    },[medication]);

    return (
        <MedicationContext.Provider value={medication}>
        <Grid container flexDirection="column" sx={{m:2}}>
            <Grid item>
                <MedicationSearch drugName={drugName} zip={zip} setMedication={setMedication}></MedicationSearch>
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
                                    results={results}
                ></FormDoseQtySearch>
            </Grid>
            <Grid item container justifyContent="center" sx={{ my:2}}>
                { !results && <i class="fa-solid fa-spinner fa-spin-pulse" style={{color:"rgb(66, 135, 245)"}}></i> }
                { results && !results?.error && <PriceList results={results}></PriceList> }
                { results?.error && <Error message={results.error.message} status={results.error.status}/> }
            </Grid>
        </Grid>
        </MedicationContext.Provider>
    )
};

export default MedicationPage;