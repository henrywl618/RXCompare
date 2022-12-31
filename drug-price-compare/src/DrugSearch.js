import {useState} from "react";
import axios from "axios"; 
import FormDoseQtySearch from "./FormDoseQtySearch";

const DrugSearch = () => {
    
    const [ formData, setFormData ] = useState({ drugName: "", zip: "", form: "", dose: "", qty: ""});
    const [ results, setResults ] = useState( [] );

    const handleChange = (evt) => {
        const target = evt.target;
        setFormData(oldData =>({...oldData, [target.name]: target.value}));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const response = await axios.get(`http://localhost:5000/drugs/names/${formData.drugName}`)
        console.log(response)
        setResults(response.data.names)
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="drugName">Drug Name</label>
            <input type="text" id="drugName" name="drugName" onChange={handleChange} value={formData.drugName}></input>
            <label htmlFor="zip">Zip Code</label>
            <input type="text" id="zip" name="zip" onChange={handleChange} value={formData.zip}></input>
            <button >Submit</button>
        </form>
        <ul>
            {results?.map( result => <li>{result}</li> )}
        </ul>
        <FormDoseQtySearch drugName={"AMOXICILLIN"}></FormDoseQtySearch>
        </>
    )
};

export default DrugSearch;