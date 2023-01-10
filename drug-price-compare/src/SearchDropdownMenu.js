import { List, ListItemButton, ListItemText, Container } from "@mui/material";

const SearchDropdownMenu = ({results}) => {

    return (
        <Container>
            <List>
                { results 
                    ? results.map(result => <ListItemButton>{result}</ListItemButton>)
                    : <ListItemText>No results found</ListItemText>
                }
            </List>
        </Container>
    )
};

export default SearchDropdownMenu;