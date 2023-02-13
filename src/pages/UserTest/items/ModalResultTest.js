import {Typography, Button} from '@mui/material';
import React from 'react';
import {AppModalService} from '../../../components';
import {useAppLanguage} from '../../../hooks';

export function ModalResultTest({
  totalQuestion,
  totalRightAnswer,
  totalScore,
  navigate,
}) {
  const {Strings} = useAppLanguage();
  return (
    <div>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          mr: 2,
          cursor: 'pointer',
          // display: {xs: 'none', md: 'flex'},
        }}>
        {Strings.score}: {totalScore}
      </Typography>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          mr: 2,
          cursor: 'pointer',
          // display: {xs: 'none', md: 'flex'},
        }}>
        {Strings.right_answer}: ({totalRightAnswer}/{totalQuestion})
      </Typography>
      <div style={{textAlignLast: 'center', paddingTop: 30, paddingBottom: 20}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            AppModalService.close();
            navigate(-1);
          }}>
          {Strings.submit}
        </Button>
      </div>
    </div>
  );
}
