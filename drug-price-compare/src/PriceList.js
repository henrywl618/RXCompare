import { useEffect, useState, useRef } from "react";
import PharmacyCard from "./PharmacyCard";
import axios from "axios";


const PriceList = ( {name, form, zip, dose, qty} ) => {

    const [prices, setPrices] = useState({DiscountDrugNetwork:[], WellRx:[]});
    // const dataFetchedRef = useRef(false);

    useEffect(()=>{
        const fetchPrices = async()=>{
            const response = await axios( {url:"http://localhost:3001/drugs/prices", method:"post", data: {name, form, zip, dose, qty}});
            const prices = response.data
            setPrices(prices)
        };
        // if (dataFetchedRef.current) return;
        // dataFetchedRef.current = true;
        fetchPrices();
    },[name, form, zip, dose, qty]);

    return (
        <>
        <span>
        <h4>Discount Drug Network</h4>
            <ul>
                {prices.DiscountDrugNetwork?.map(prices => <PharmacyCard name={prices.name} address={prices.address} price={prices.price}/>)}
            </ul>
        </span>
        <span>
        <h4>WellRX</h4>
            <ul>
                {prices.WellRx?.map(prices => <PharmacyCard name={prices.name} address={prices.address} price={prices.price}/>)}
            </ul>
        </span>

        </>
    )
};

export default PriceList;