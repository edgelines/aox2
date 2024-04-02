import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-row': {
                        fontSize: '11px',
                        color: '#efe9e9ed'
                    },
                },
                columnHeader: {
                    fontSize: '9px',
                    color: '#efe9e9ed'
                },
            },
        },
    },
});
