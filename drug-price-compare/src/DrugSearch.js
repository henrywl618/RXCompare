import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; 
import FormDoseQtySearch from "./FormDoseQtySearch";
import SearchDropdownMenuList from "./SearchDropdownMenuList";
import { backendURL } from "./helper";

const DrugSearch = () => {

    const { drugName, zip } = useParams();
    const [ formData, setFormData ] = useState({ drugName, zip, form: "", dose: "", qty: ""});
    const [ nameInput, setNameInput] = useState("");
    const [ results, setResults ] = useState( [] );

    const handleChange = (evt) => {
        const target = evt.target;
        console.log(target.name||target.getAttribute('name'))
        console.log(target.value||target.getAttribute('value'))
        setFormData(oldData =>({...oldData, [target.getAttribute('name')]: target.getAttribute('value')}));
    };

    const searchName = async () => {
            const response = await axios.get(`${backendURL}/names/${nameInput}`);
            if(response.data.error === 404) {
                setResults(null);
            } else {
                setResults(response.data.names);
            }
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const response = await axios.get(`${backendURL}/names/${formData.drugName}`)
        console.log(response)
        setResults(response.data.names)
    };

    //Added debounce to drug name searches, utilizing useEffects cleanup function
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
        <SearchDropdownMenuList results={results} handleChange={handleChange}/>
        <FormDoseQtySearch drugName={formData.drugName}></FormDoseQtySearch>
        </>
    )
};

export default DrugSearch;