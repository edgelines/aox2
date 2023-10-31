import React, { useEffect, useState } from 'react';
import { Divider, ListItem, ListItemText } from '@mui/material';

export default function DataTable(props) {
    return (
        <DataGrid hideFooter rowHeight={28}
            {...props}

            sx={{
                '.MuiDataGrid-columnSeparator': {
                    display: 'none',
                },
                '.MuiDataGrid-columnHeaders': {
                    minHeight: '30px !important',  // 원하는 높이 값으로 설정
                    maxHeight: '30px !important',  // 원하는 높이 값으로 설정
                    lineHeight: '30px !important',  // 원하는 높이 값으로 설정
                    backgroundColor: 'rgba(230, 230, 230, 0.3)'
                },
            }} />
    );
}
