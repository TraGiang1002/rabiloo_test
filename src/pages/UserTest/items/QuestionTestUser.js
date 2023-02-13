import {useState} from 'react';
import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useQueryClient} from 'react-query';
import {FetchApi} from '../../../utils';
import {Controller, useFormContext} from 'react-hook-form';
import {Box} from '@mui/system';

function QuestionsList({number, question, idTest}) {
  const {control, setValue, getValues} = useFormContext();
  const {content, id, type: typeQuestion, images} = question;

  const renderImages = () => {
    return (
      <Grid container>
        {(images || []).map((item, index) => {
          return (
            <div key={`${index}`} style={{position: 'relative'}}>
              <Grid item style={{marginRight: 10, marginBottom: 10}}>
                <img alt="not found" width={250} src={item.path} />
              </Grid>
            </div>
          );
        })}
      </Grid>
    );
  };

  const renderResult = () => {
    if (question.type === 'SELECT') {
      return (
        <RadioGroup>
          {question.answers?.map?.((item, index) => {
            return (
              <FormControlLabel
                sx={{m: 1}}
                key={`${item.id}`}
                value={`${item.id}`}
                control={<Radio />}
                onChange={() => {
                  setValue(`${question.id}`, {
                    [`${item.id}`]: 1,
                    type: 'SELECT',
                  });
                }}
                label={
                  <TextField
                    multiline
                    defaultValue={item.content}
                    disabled
                    sx={{width: {xs: '62vw', lg: '40vw'}}}
                  />
                }
              />
            );
          })}
        </RadioGroup>
      );
    }
    if (question.type === 'MULTIPLE_SELECT') {
      return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          {question.answers?.map?.(item => {
            return (
              <FormControlLabel
                sx={{m: 1}}
                key={`${item.id}`}
                value={`${item.id}`}
                control={<Checkbox />}
                onChange={e => {
                  const answerCheckbox = getValues(`${question.id}`);
                  setValue(`${question.id}`, {
                    ...answerCheckbox,
                    [`${item.id}`]: e.target.checked ? 1 : 0,
                    type: 'MULTIPLE_SELECT',
                  });
                }}
                label={
                  <TextField
                    multiline
                    sx={{width: {xs: '62vw', lg: '40vw'}}}
                    defaultValue={item.content}
                    disabled
                  />
                }
              />
            );
          })}
        </Box>
      );
    }
    return (
      <TextField
        multiline
        sx={{width: {xs: '64vw', lg: '40vw'}, ml: 3}}
        placeholder={'Nhập câu trả lời'}
        onChange={e => {
          setValue(`${question.id}`, {type: 'FILL', val: e.target.value});
        }}
      />
    );
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        sx={{
          p: 2,
          border: '1px solid #253f8e',
          width: {xs: '90%', lg: '55%', alignSelf: 'center'},
        }}>
        <Typography variant="h5" sx={{mb: 2}}>
          Câu {number}: {content}
        </Typography>
        {renderImages()}
        {renderResult()}
      </Grid>
    </Grid>
  );
}
export default function QuestionTestUser({questionList = [], idTest}) {
  return questionList.map((question, index) => {
    return (
      <QuestionsList
        key={`${question.id}`}
        question={question}
        number={index + 1}
        idTest={idTest}
      />
    );
  });
}
