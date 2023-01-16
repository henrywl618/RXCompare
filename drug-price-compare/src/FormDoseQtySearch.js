import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Select, InputLabel, FormControl, MenuItem, Container, FormLabel } from "@mui/material";


const FormDoseQtySearch = ( {drugName, forms, doses, qtys, medication, handleFormChange, updateDoseQty} ) => {

    const [formData, setFormData] = useState({forms:forms[0], doses:doses[0], qtys:qtys[0]});


    return (
        <Container>
            <h4>{drugName}</h4>
            <FormControl>
                <FormLabel htmlFor="form">Form</FormLabel>
                <Select name="form" id="form" value={medication.form} onChange={handleFormChange}>
                    {forms?.map( form => <MenuItem value={form}>{form}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="dose">Dose</FormLabel>
                <Select name="dose" id="dose" value={medication.dose} onChange={updateDoseQty}>
                    {doses?.map( dose => <MenuItem value={dose}>{dose}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="qty">Quantity</FormLabel>
                <Select name="qty" id="qty" value={medication.qty} onChange={updateDoseQty}>
                    {qtys?.map( qty => <MenuItem value={qty}>{qty}</MenuItem>)}
                </Select>
            </FormControl>
                <Button variant="contained" size="small">Get prices</Button>
        </Container>
    )
};

export default FormDoseQtySearch;