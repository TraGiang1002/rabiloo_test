import {CircularProgress} from '@mui/material';

export function AppLoadingView({style, ...props}) {
  return (
    <CircularProgress
      style={{marginLeft: '46%', marginTop: 60, ...style}}
      {...props}
    />
  );
}
