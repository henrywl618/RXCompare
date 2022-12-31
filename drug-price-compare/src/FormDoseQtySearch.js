import { useEffect, useState } from "react";
import axios from "axios";


const FormDoseQtySearch = ( {drugName, form} ) => {

    const [forms, setForms] = useState([]);

    useEffect(()=>{
        const fetchForms = async (name) => {
            const response = await axios( { url: "http://localhost:5000/drugs/forms", params: { name: drugName, zip: "11416" }})
            setForms(response.data.forms)
        };
        
        fetchForms(drugName);
    },[]);

    return (
        <>
            <h4>{drugName}</h4>
            <label htmlFor="forms">Form</label>
            <select name="forms" id="forms">
                {forms?.map( form => <option value={form}>{form}</option>)}
            </select>
        </>
    )
};

export default FormDoseQtySearch;