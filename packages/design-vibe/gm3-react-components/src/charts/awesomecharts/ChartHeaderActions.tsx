import React from 'react';
import { IconButton } from '../../components/gm3/IconButton.tsx';
import { Icon } from '../../components/Icons.tsx';

export const ChartHeaderActions = () => {
    return (
        <>
            <IconButton size="xsmall" aria-label="Download chart data">
                <Icon>download</Icon>
            </IconButton>
            <IconButton size="xsmall" aria-label="More options">
                <Icon>more_vert</Icon>
            </IconButton>
        </>
    );
};
