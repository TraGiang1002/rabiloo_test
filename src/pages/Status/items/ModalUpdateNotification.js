import {TextField} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {FormProvider, useForm, Controller} from 'react-hook-form';
import {useQueryClient} from 'react-query';
import {FetchApi} from '../../../utils';
import {Button} from '@mui/material';
import {AppModalService} from '../../../components';
import {useAppLanguage} from '../../../hooks';

export function ModalUpdateNotification({notificationDetail}) {
  const {Strings} = useAppLanguage();
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const value = useForm();
  const [loading, setLoading] = useState(false);

  const updateNotification = async data => {
    setLoading(true);
    const result = await FetchApi.updateNotification({
      title: data.title,
      description: data.description,
      id: notificationDetail.id,
    });
    if (result?.statusCode === 'OK') {
      queryClient.refetchQueries(`listNotifications`);
      AppModalService.close();
      enqueueSnackbar('Cập nhật thông báo thành công', {variant: 'success'});
      return;
    }
    enqueueSnackbar(`${result?.message}`, {variant: 'error'});
  };
  return (
    <FormProvider {...value}>
      <div
        style={{
          paddingTop: 30,
          paddingBottom: 50,
          width: 800,
        }}>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
          }}>
          <h4 style={{paddingRight: 15, minWidth: 75}}>
            {Strings.name_discription}:
          </h4>

          <Controller
            control={value.control}
            name="title"
            defaultValue={notificationDetail.title}
            render={({field: {onChange, value}}) => {
              return (
                <TextField
                  multiline
                  inputProps={{style: {minWidth: 700}}}
                  value={value}
                  fullWidth={true}
                  onChange={e => {
                    onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </div>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
          }}>
          <h4 style={{paddingRight: 15, minWidth: 75}}>
            {Strings.description}:
          </h4>

          <Controller
            control={value.control}
            name="description"
            defaultValue={notificationDetail.description}
            render={({field: {onChange, value}}) => {
              return (
                <TextField
                  multiline
                  inputProps={{style: {minWidth: 700}}}
                  value={value}
                  fullWidth={true}
                  onChange={e => {
                    onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </div>

        <Button
          disabled={loading}
          fullWidth
          variant="contained"
          style={{width: 160, float: 'right', marginTop: 10}}
          onClick={value.handleSubmit(updateNotification)}>
          {Strings.update_notifications}
        </Button>
      </div>
    </FormProvider>
  );
}
