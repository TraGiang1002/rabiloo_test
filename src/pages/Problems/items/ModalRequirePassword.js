import {Box, Button} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useForm} from 'react-hook-form';
import Modal from 'react-modal';
import {AppModalService, AppTextField} from '../../../components';
import {FetchApi} from '../../../utils';

function ModalRequirePassword({exam, navigate}) {
  const {enqueueSnackbar} = useSnackbar();

  const {control, handleSubmit} = useForm({mode: 'all'});
  const onSubmit = async data => {
    const result = await FetchApi.userStartExam({
      examId: exam.id,
      code: data.code,
    });
    if (result?.statusCode === 'OK') {
      navigate(`/user-test?idTest=${exam.id}`, {
        state: {data: {...exam, id: result?.dto?.id}},
      });
      AppModalService.close();
      return;
    }
    enqueueSnackbar(result?.message || 'Lỗi server', {
      variant: 'error',
    });
  };
  return (
    <Box>
      <AppTextField
        sx={{width: '100%'}}
        name="code"
        control={control}
        fullWidth={true}
        required
        // rules={{
        //   pattern: {
        //     value: REGREX.email,
        //     message: 'email_is_not_valid',
        //   },
        // }}
        label={'Code'}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{my: 2}}
        onClick={handleSubmit(onSubmit)}>
        {'Bắt đầu làm bài'}
      </Button>
    </Box>
  );
}

export default ModalRequirePassword;
