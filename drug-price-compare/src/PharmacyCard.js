
const PharmacyCard = ({ name, address, price}) => {
    
    return (
        <>
            <p>
                <bold>Name: </bold><span> {name} </span>
            </p>
            <p>
                <bold>Address: </bold><span> {address} </span>
            </p>
            <p>
                <bold>Price: </bold><span> {price} </span>
            </p>
        </>
    )
};

export default PharmacyCard;