import {useEffect, useState} from "react";
import axios from "axios"; 
import FormDoseQtySearch from "./FormDoseQtySearch";
import SearchDropdownMenu from "./SearchDropdownMenu";

const DrugSearch = () => {
    
    const [ formData, setFormData ] = useState({ drugName: "", zip: "", form: "", dose: "", qty: ""});
    const [ nameInput, setNameInput] = useState("");
    const [ results, setResults ] = useState( [] );

    const handleChange = (evt) => {
        const target = evt.target;
        setFormData(oldData =>({...oldData, [target.name]: target.value}));
    };

    const searchName = async () => {
            const response = await axios.get(`http://localhost:3001/drugs/names/${nameInput}`);
            if(response.data.error === 404) {
                setResults(null);
            } else {
                setResults(response.data.names);
            }
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const response = await axios.get(`http://localhost:3001/drugs/names/${formData.drugName}`)
        console.log(response)
        setResults(response.data.names)
    };

    useEffect(()=>{
        if(nameInput && nameInput.length >= 3){
            const getDrugNames = setTimeout( searchName, 600);
            return ()=> clearTimeout(getDrugNames)
        }
    },[nameInput]);

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="drugName">Drug Name</label>
            <input type="text" id="drugName" name="drugName" onChange={(evt)=>setNameInput(evt.target.value)} value={nameInput}></input>
            <label htmlFor="zip">Zip Code</label>
            <input type="text" id="zip" name="zip" onChange={handleChange} value={formData.zip}></input>
            <button >Submit</button>
        </form>
        <SearchDropdownMenu results={results}/>
        <FormDoseQtySearch drugName={"AMOXICILLIN"}></FormDoseQtySearch>
        </>
    )
};

export default DrugSearch;