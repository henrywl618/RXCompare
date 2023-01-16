import { useEffect, useState } from "react";
import PharmacyCard from "./PharmacyCard";
import axios from "axios";


const PriceList = ( {prices} ) => {

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