import { List, ListItemButton, ListItemText } from "@mui/material";
import "./SearchDropdownMenuList.css";

const SearchDropdownMenuList = ({results, handleClick}) => {

    return (
            <List>
                {
                    results?.length === 0 ? <ListItemText> <i class="fa-solid fa-spinner fa-spin-pulse" style={{color:"rgb(66, 135, 245)"}}></i> </ListItemText> : null
                }
                { results 
                    ? results.map(result => <ListItemButton 
                                                name={"drugName"} 
                                                value={result} 
                                                onClick={handleClick}
                                                >
                                                    {result}
                                            </ListItemButton>)
                    : <ListItemText>    No results found    </ListItemText>
                }
            </List>
    )
};

export default SearchDropdownMenuList;