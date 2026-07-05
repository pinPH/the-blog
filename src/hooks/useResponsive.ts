import { useMediaQuery, useTheme } from '@mui/material';

export function useResponsive() {
  const theme = useTheme();
  
  return {
    isXS: useMediaQuery(theme.breakpoints.down('sm')),
    isSM: useMediaQuery(theme.breakpoints.down('md')),
    isMD: useMediaQuery(theme.breakpoints.down('lg')),
    isLG: useMediaQuery(theme.breakpoints.down('xl')),
    isDesktop: useMediaQuery(theme.breakpoints.up('md')),
    isTablet: useMediaQuery(theme.breakpoints.between('sm', 'lg')),
    isMobile: useMediaQuery(theme.breakpoints.down('sm')),
  };
}
