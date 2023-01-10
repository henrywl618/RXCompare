import { useEffect, useState } from "react";
import axios from "axios";
import PriceList from "./PriceList";


const FormDoseQtySearch = ( {drugName} ) => {

    const [formData, setFormData] = useState({});
    const [forms, setForms] = useState([]);
    const [doses, setDoses] = useState([]);
    const [qtys, setQtys] = useState([]);

    const fetchDoseQty = async (name, form ) => {
        const response = await axios( { url: "http://localhost:3001/drugs/doseqty", method: "post", data: { name, form}});
        const doses = response.data.doses;
        const qtys = response.data.qtys;
        setDoses(doses);
        setQtys(qtys);
        setFormData( oldData => ({...oldData, forms:form, doses:doses[0], qtys:qtys[0]}));
    };

    const handleFormChange = (evt) => {
        const target = evt.target;
        fetchDoseQty( drugName, target.value);
    };

    const updateDoseQty = (evt) => {
        const target = evt.target;
        setFormData( oldData => ({...oldData, [target.name]: target.value}))
    }

    useEffect(()=>{
        const fetchForms = async (name) => {
            const response = await axios( { url: "http://localhost:3001/drugs/forms", method: 'post', data: { name }});
            const form = response.data.forms[0];
            fetchDoseQty(drugName, form);
            setForms(response.data.forms);
            setFormData( oldData => ({...oldData, forms:form}));
        };
        
        fetchForms(drugName);
    },[]);

    return (
        <>
            <h4>{drugName}</h4>
            <label htmlFor="forms">Form</label>
            <select name="forms" id="forms" value={formData.forms} onChange={handleFormChange}>
                {forms?.map( form => <option value={form}>{form}</option>)}
            </select>
            <label htmlFor="doses">Dose</label>
            <select name="doses" id="doses" value={formData.doses} onChange={updateDoseQty}>
                {doses?.map( dose => <option value={dose}>{dose}</option>)}
            </select>
            <label htmlFor="qtys">Quantity</label >
            <select name="qtys" id="qtys" value={formData.qtys} onChange={updateDoseQty}>
                {qtys?.map( qty => <option value={qty}>{qty}</option>)}
            </select>
            <button>Get prices</button>
            <br></br>
            { 
                (formData.doses && formData.forms && formData.qtys) 
                ? <PriceList name={drugName} zip="11416" form={formData.forms} dose={formData.doses} qty={formData.qtys}/>
                : null
            }
            
        </>
    )
};

export default FormDoseQtySearch;