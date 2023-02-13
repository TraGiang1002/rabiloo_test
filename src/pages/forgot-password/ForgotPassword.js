import {useEffect, useRef, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import {LockOutlined} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useForm} from 'react-hook-form';
import {AppCheckbox, AppPassword, AppTextField} from '../../components';
import {useAppAccount, useAppLanguage, useOnKeyPress} from '../../hooks';
import {useNavigate} from 'react-router-dom';
import {FetchApi, REGREX} from '../../utils';
import {ButtonGroup} from '@mui/material';
import {useSnackbar} from 'notistack';

export default function ForgotPassword() {
  const {control, handleSubmit} = useForm({mode: 'all'});
  const {Strings} = useAppLanguage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const onReset = async e => {
    if (loading) {
      return;
    }
    setLoading(true);
    const result = await FetchApi.forgotPassword({
      email: e.email,
    });
    setLoading(false);
    if (result?.statusCode === 'OK') {
      enqueueSnackbar('Đặt lại mật khẩu thành công, hãy vào mail xác nhận', {
        variant: 'success',
      });
      return;
    }
    enqueueSnackbar(result?.message, {variant: 'error'});
  };

  // useOnKeyPress('Enter', handleSubmit(onReset));

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {'Quên mật khẩu'}
        </Typography>

        <AppTextField
          sx={{m: 2, width: '100%'}}
          name="email"
          control={control}
          fullWidth={true}
          required
          rules={{
            pattern: {
              value: REGREX.email,
              message: 'email_is_not_valid',
            },
          }}
          label={Strings.email}
        />

        <Button
          disabled={loading}
          onClick={handleSubmit(onReset)}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}>
          {'Lấy lại mật khẩu'}
        </Button>
        <Grid container>
          <Grid item xs sx={{cursor: 'pointer'}}>
            <Link onClick={() => navigate('/login')} variant="body2">
              {'Đăng nhập'}
            </Link>
          </Grid>
          <Grid item>
            <Link
              onClick={() => navigate('/sign-up-email')}
              sx={{cursor: 'pointer'}}
              variant="body2">
              {Strings.dont_have_account}
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Grid
        container
        sx={{my: 4, justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography>
          {'Copyright © '} <Link>Rabiloo</Link> {new Date().getFullYear()}
        </Typography>

        {/* <ButtonGroup variant="contained" size="small">
          <Button
            color={language === 'EN' ? 'secondary' : 'disabled'}
            onClick={() => setLanguage('EN')}>
            {Strings.english}
          </Button>
          <Button
            color={language === 'VI' ? 'secondary' : 'disabled'}
            onClick={() => setLanguage('VI')}>
            {Strings.vietnamese}
          </Button>
        </ButtonGroup> */}
      </Grid>
    </Container>
  );
}
