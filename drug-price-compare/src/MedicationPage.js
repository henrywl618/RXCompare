import MedicationSearch from "./MedicationSearch";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import FormDoseQtySearch from "./FormDoseQtySearch";
import PriceList from "./PriceList";
import axios from "axios";

const MedicationPage = () => {

    const { drugName, zip } = useParams();
    const [medication, setMedication] = useState({ drugName, zip, form: "", dose: "", qty: "", search:false});
    const [prices, setPrices] = useState(null);
    const [forms, setForms] = useState([]);
    const [doses, setDoses] = useState([]);
    const [qtys, setQtys] = useState([]);

    const fetchPrices = async({drugName, zip, form, dose, qty})=>{
        const response = await axios( {url:"http://localhost:3001/drugs/prices", method:"post", data: {name:drugName, form, zip, dose, qty}});
        const prices = response.data
        setPrices(prices)
    };

    const fetchDoseQty = async (name, form ) => {
        const response = await axios( { url: "http://localhost:3001/drugs/doseqty", method: "post", data: { name, form}});
        const doses = response.data.doses;
        const qtys = response.data.qtys;
        setDoses(doses);
        setQtys(qtys);
        setMedication( oldData => ({...oldData, form, dose:doses[0], qty:qtys[0], search:true}));
    }; 

    const fetchForms = async (name) => {
        const response = await axios( { url: "http://localhost:3001/drugs/forms", method: 'post', data: { name }});
        const form = response.data.forms[0];
        fetchDoseQty(drugName, form);
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

    useEffect(()=>{     
        if(drugName) fetchForms(drugName);
    },[drugName]);
    
    useEffect(()=>{
        if(medication.search) fetchPrices(medication);
    },[medication.search]);

    return (
        <>
            <MedicationSearch drugName={drugName} zip={zip}></MedicationSearch>
            <FormDoseQtySearch drugName={drugName} 
                               forms={forms} 
                               doses={doses} 
                               qtys={qtys} 
                               medication={medication}
                               setMedication={setMedication} 
                               handleFormChange={handleFormChange}
                               updateDoseQty={updateDoseQty}
            ></FormDoseQtySearch>
            {
                prices 
                    ? <PriceList prices={prices}></PriceList>
                    : <i class="fa-solid fa-spinner fa-spin-pulse"></i>
            }
        </>
    )
};

export default MedicationPage;