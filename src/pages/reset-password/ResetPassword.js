import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useForm} from 'react-hook-form';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {
  AppCheckbox,
  AppDatePicker,
  AppLoadingView,
  AppPassword,
  AppRadio,
  AppSelect,
  AppSwitch,
  AppTextField,
} from '../../components';
import {FetchApi, REGREX} from '../../utils';
import {useAppLanguage} from '../../hooks';
import {ButtonGroup, FormControlLabel, MenuItem, Radio} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import moment from 'moment';

export default function ResetPassword() {
  const {Strings} = useAppLanguage();
  const {control, handleSubmit, trigger, getValue, watch} = useForm({
    mode: 'all',
  });
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('forgotPasswordToken');
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState();

  const onSignUp = async e => {
    setLoading(true);
    const result = await FetchApi.resetPassword({
      newPassword: e.newPassword,
      email: email,
      token: token,
    });
    setLoading(false);
    if (result?.statusCode === 'OK') {
      enqueueSnackbar('Đặt lại mật khẩu thành công', {variant: 'success'});
      navigate('/login');
      return;
    }
    enqueueSnackbar(`${result?.message}`, {variant: 'error'});
  };

  const FIELDS = [
    {
      name: 'newPassword',
      label: 'Mật khẩu mới',
      required: true,
      rules: {
        minLength: {value: 8, message: 'min_password'},
        maxLength: {value: 32, message: 'max_password'},
        validate: () => {
          trigger('confirmNewPassword');
        },

        pattern: {
          value: REGREX.password,
          message: 'password_invalid',
        },
      },
      xs: 12,
    },
    {
      name: 'confirmNewPassword',
      label: 'Nhập lại mật khẩu mới',
      required: true,
      rules: {
        validate: value => value === watch('newPassword') || 'pass_not_match',
      },
      xs: 12,
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h1" variant="h5">
          Đặt lại mật khẩu
        </Typography>
        <Box sx={{mt: 3}}>
          <Grid container spacing={2}>
            {FIELDS.map(field => (
              <AppPassword
                key={field.name}
                item
                xs={field.xs}
                sm={field.sm}
                control={control}
                name={field.name}
                rules={field.rules}
                defaultValue={field.defaultValue}
                fullWidth
                label={field.label}
                autoFocus={field.autoFocus}
                disabled={field.disabled}
                required
              />
            ))}
          </Grid>

          <Button
            disabled={loading}
            onClick={handleSubmit(onSignUp)}
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}>
            {'Đặt lại'}
          </Button>
        </Box>
        <Grid container>
          <Grid item xs>
            <Link
              sx={{cursor: 'pointer'}}
              onClick={() => navigate('/sign-up-email')}
              variant="body2">
              {Strings.dont_have_account}
            </Link>
          </Grid>
          <Grid item>
            <Link
              onClick={() => navigate('/login')}
              variant="body2"
              sx={{cursor: 'pointer'}}>
              {Strings.already_have_account}
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
            color={language === "EN" ? "secondary" : "disabled"}
            onClick={() => setLanguage("EN")}
          >
            {Strings.english}
          </Button>
          <Button
            color={language === "VI" ? "secondary" : "disabled"}
            onClick={() => setLanguage("VI")}
          >
            {Strings.vietnamese}
          </Button>
        </ButtonGroup> */}
      </Grid>
    </Container>
  );
}
