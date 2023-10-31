import React, { useEffect, useState, useRef } from 'react';

import { Box } from '@mui/material';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


export default function WeightAvgCheck({ ElwWeightedAvgCheck }) {

    return (
        <Box>
            {ElwWeightedAvgCheck.CTP1 > ElwWeightedAvgCheck.CTP2 ?
                <FileUploadIcon style={{ fontSize: '3rem', color: 'tomato' }} />
                : <FileDownloadIcon style={{ fontSize: '3rem', color: 'deepskyblue' }} />
            }
        </Box>

    )
}


