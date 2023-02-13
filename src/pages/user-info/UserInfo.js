import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
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

export default function UserInfo() {
  const {Strings, setLanguage, language} = useAppLanguage();
  const {control, handleSubmit, trigger, getValues} = useForm({
    mode: 'all',
  });
  const {data, isLoading} = useQuery('userInfo', () => FetchApi.getUserInfo());
  const dataUser = data?.dto || {};

  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState();

  const onSignUp = async e => {
    setLoading(true);
    const result = await FetchApi.updateInfoUser({
      firstName: e.firstName,
      lastName: e.lastName,
      userName: e.userName,
      city: e.city,
      birthDay: new Date(e.birthDay).getTime(),
      gender: e.gender,
      id: dataUser.id,
    });
    setLoading(false);
    if (result?.statusCode === 'OK') {
      enqueueSnackbar('Cập nhập thông tin thành công', {variant: 'success'});
      return;
    }
    enqueueSnackbar(`${result?.message}`, {variant: 'error'});
  };

  const FIELDS = [
    {
      name: 'userName',
      label: Strings.email,
      defaultValue: dataUser.userName,
      disabled: true,
      required: true,
      rules: {
        pattern: {
          value: REGREX.email,
          message: 'email_is_not_valid',
        },
      },
      xs: 12,
    },
    {
      name: 'firstName',
      defaultValue: dataUser.firstName,
      label: Strings.first_name,
      required: true,
      autoFocus: true,
      xs: 12,
      sm: 6,
    },
    {
      name: 'lastName',
      label: Strings.last_name,
      defaultValue: dataUser.lastName,

      required: true,
      xs: 12,
      sm: 6,
    },
  ];
  if (isLoading) {
    return <AppLoadingView />;
  }
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
          {Strings.user_info}
        </Typography>
        <Box sx={{mt: 3}}>
          <Grid container spacing={2}>
            {FIELDS.map(field => (
              <AppTextField
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

            <AppSelect
              item
              xs={12}
              sm={6}
              label={Strings.city}
              control={control}
              name="city"
              defaultValue={dataUser.city}
              required>
              <MenuItem value={'newyork'}>New York</MenuItem>
              <MenuItem value={'london'}>London</MenuItem>
              <MenuItem value={'hanoi'}>Ha Noi</MenuItem>
            </AppSelect>
            <AppDatePicker
              item
              sm={6}
              xs={12}
              required
              control={control}
              name="birthDay"
              defaultValue={moment(dataUser.birthDay)}
              label={Strings.dob}
            />
            <AppRadio
              item
              row
              label={Strings.gender}
              control={control}
              defaultValue={dataUser.gender}
              name="gender">
              <FormControlLabel
                value="male"
                control={<Radio />}
                label={Strings.male}
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label={Strings.female}
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label={Strings.other}
              />
            </AppRadio>
          </Grid>

          <Button
            disabled={loading}
            onClick={handleSubmit(onSignUp)}
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}>
            {Strings.update}
          </Button>
        </Box>
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
