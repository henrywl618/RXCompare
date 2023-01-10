import { useEffect, useState } from "react";
import axios from "axios";
import PriceList from "./PriceList";
import Button from "@mui/material/Button";
import { Select, InputLabel, FormControl, MenuItem, Container, FormLabel } from "@mui/material";


const FormDoseQtySearch = ( {drugName} ) => {

    const [formData, setFormData] = useState({forms:"", doses:"", qtys:""});
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
        console.log(evt)
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
        <Container>
            <h4>{drugName}</h4>
            <FormControl>
                <FormLabel htmlFor="forms">Form</FormLabel>
                <Select name="forms" id="forms" value={formData.forms} onChange={handleFormChange}>
                    {forms?.map( form => <MenuItem value={form}>{form}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="doses">Dose</FormLabel>
                <Select name="doses" id="doses" value={formData.doses} onChange={updateDoseQty}>
                    {doses?.map( dose => <MenuItem value={dose}>{dose}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="qtys">Quantity</FormLabel>
                <Select name="qtys" id="qtys" value={formData.qtys} onChange={updateDoseQty}>
                    {qtys?.map( qty => <MenuItem value={qty}>{qty}</MenuItem>)}
                </Select>
            </FormControl>
                <Button variant="contained" size="small">Get prices</Button>

            <br></br>
            { 
                (formData.doses && formData.forms && formData.qtys) 
                ? <PriceList name={drugName} zip="11416" form={formData.forms} dose={formData.doses} qty={formData.qtys}/>
                : null
            }
            
        </Container>
    )
};

export default FormDoseQtySearch;