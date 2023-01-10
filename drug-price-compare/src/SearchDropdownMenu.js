import { List, ListItemButton, ListItemText } from "@mui/material";

const SearchDropdownMenu = ({results}) => {

    return (
        <>
            <List>
                { results 
                    ? results.map(result => <ListItemButton>{result}</ListItemButton>)
                    : <ListItemText>No results found</ListItemText>
                }
            </List>
        </>
    )
};

export default SearchDropdownMenu;