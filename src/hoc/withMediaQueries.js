import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const withMediaQuery = Component => {
    function WrapComponent(props) {
        const theme = useTheme();
        const isXs = useMediaQuery(theme.breakpoints.down('xs'));
        const isSm = useMediaQuery(theme.breakpoints.down('sm'));
        const isMd = useMediaQuery(theme.breakpoints.down('md'));
        const isLg = useMediaQuery(theme.breakpoints.down('lg'));
        const isXl = useMediaQuery(theme.breakpoints.down('xl'));
        const xProps = {
            ...props,
            mq:
                (isXs && { minWidth: 0, break: 'xs' }) ||
                (isSm && { minWidth: 600, break: 'sm' }) ||
                (isMd && { minWidth: 960, break: 'md' }) ||
                (isLg && { minWidth: 1280, break: 'lg' }) ||
                (isXl && { minWidth: 1920, break: 'xl' })
        };

        return <Component {...xProps} />;
    }

    return WrapComponent;
};

export default withMediaQuery;
