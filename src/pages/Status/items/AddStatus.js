import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {AppTextField} from '../../../components';
import {FetchApi} from '../../../utils';
export function AddStatus({refetch, setShowForm}) {
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const onCreateNoti = async data => {
    setLoading(true);
    const result = await FetchApi.createNoti({
      title: data.title,
      description: data.description,
    });
    setLoading(false);
    if (result?.statusCode === 'OK') {
      setShowForm(false);
      enqueueSnackbar('Tạo thông báo thành công', {variant: 'success'});
      refetch();
      return;
    }
    enqueueSnackbar(`${result?.message}`, {variant: 'error'});
  };
  return (
    <div
      style={{
        width: '50%',
        height: '250px',
        marginLeft: '18%',
        marginTop: 5,
        padding: '8px 16px',
        border: '1px solid #253f8e',
        boxShadow: '0 0 5px #253f8e',
        color: '#253f8e',
      }}
      className="addStatus">
      <AppTextField
        sx={{m: 2}}
        name="title"
        control={control}
        fullWidth={true}
        required
        label={'Tiêu đề thông báo'}
      />
      <AppTextField
        multiline
        sx={{m: 2}}
        name="description"
        control={control}
        fullWidth={true}
        required
        label={'Mô tả thông báo'}
      />
      <button
        disabled={loading}
        style={{
          backgroundColor: '#253f8e',
          color: '#fff',
          width: 140,
          height: 45,
          marginRight: '5px',
          float: 'right',
          marginTop: 10,
        }}
        onClick={handleSubmit(onCreateNoti)}>
        Ghi nhận
      </button>
    </div>
  );
}
