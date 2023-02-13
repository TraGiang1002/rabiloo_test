import {useState} from 'react';
import {
  Box,
  Button,
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
import {ModalUpdateQuestion} from './ModalUpdateQuestion';
import {AppModalService} from '../../../components';
import {useAppLanguage} from '../../../hooks';

const level = {
  1: 'Dễ',
  2: 'Vừa',
  3: 'Trung bình',
  4: 'Khó',
};

function QuestionsList({number, question, idTest}) {
  const {Strings} = useAppLanguage();
  const [loading, setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const {content, id, images} = question;
  const renderImages = () => {
    return (
      <Grid container>
        {(images || []).map((item, index) => {
          return (
            <div key={`${index}`} style={{position: 'relative'}}>
              <Grid item style={{marginRight: 10, marginBottom: 10}}>
                <img alt="not fount" width={250} src={item.path} />
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
        <RadioGroup style={{pointerEvents: 'none'}}>
          {question.answers?.map?.(item => {
            return (
              <FormControlLabel
                sx={{m: 1}}
                value={`${item.id}`}
                control={<Radio checked={item.isResult === 1} />}
                label={
                  <TextField
                    multiline
                    sx={{width: {xs: '62vw', lg: '40vw'}}}
                    value={item.content}
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'none',
          }}>
          {question.answers?.map?.(item => {
            return (
              <FormControlLabel
                sx={{m: 1}}
                key={`${item.id}`}
                value={`${item}`}
                control={<Checkbox checked={item.isResult === 1} />}
                label={
                  <TextField
                    multiline
                    sx={{width: {xs: '62vw', lg: '40vw'}}}
                    value={item.content}
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
        sx={{width: {xs: '64vw', lg: '40vw'}, ml: 3, pointerEvents: 'none'}}
        value={question.answers?.[0]?.content}
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
        <div style={{marginBottom: 16}}>
          Độ khó: {level[question.level || 1]}
        </div>

        {renderImages()}
        {renderResult()}
        <div
          style={{
            float: 'right',
            flexDirection: 'row',
            display: 'flex',
          }}>
          <Button
            fullWidth
            variant="contained"
            sx={{m: 2, px: 4, mb: 0}}
            onClick={() => {
              AppModalService.set({
                title: 'Cập nhật câu hỏi',
                noFooter: true,
                children: (
                  <ModalUpdateQuestion question={question} idTest={idTest} />
                ),
              });
            }}>
            {Strings.edit}
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const resultDelete = await FetchApi.deleteQuestion({
                questionId: id,
              });
              setLoading(false);
              if (resultDelete?.statusCode === 'OK') {
                queryClient.refetchQueries(`listQuestion-${idTest}`);
                enqueueSnackbar('Xóa câu hỏi thành công', {
                  variant: 'success',
                });
                return;
              }
              enqueueSnackbar(`${resultDelete?.message}`, {
                variant: 'error',
              });
            }}
            fullWidth
            variant="contained"
            sx={{my: 2, px: 4, mb: 0}}
            color="error">
            {Strings.delete}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
export default function QuestionTest({questionList = [], idTest}) {
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
