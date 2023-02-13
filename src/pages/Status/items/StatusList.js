import {Button} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {useQueryClient} from 'react-query';
import {AppModalService} from '../../../components';
import {useAppLanguage} from '../../../hooks';
import {FetchApi} from '../../../utils';
import {ModalUpdateNotification} from './ModalUpdateNotification';

function StatusListItem(props) {
  const {Strings} = useAppLanguage();
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {id, title, description, isAdmin} = props;

  return (
    <div
      style={{
        width: '55%',
        margin: '20px 10%',
        border: '1px solid #253f8e',
        color: '#253f8e',
        paddingBottom: 10,
        marginLeft: '18%',
      }}
      className="statusList">
      <h4
        style={{
          marginTop: '10px',
          marginBottom: '10px',
          fontSize: '24px',
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        Thông báo:
      </h4>
      <p>Tiêu đề: {title}</p>
      <p style={{whiteSpace: 'break-spaces'}}>Mô tả: {description}</p>
      {!!isAdmin && (
        <div
          style={{
            width: 120,
            flexDirection: 'row',
            display: 'flex',
            right: '22%',
          }}>
          <Button
            fullWidth
            style={{marginBottom: 0}}
            variant="contained"
            sx={{mt: 2, mb: 2}}
            onClick={() => {
              AppModalService.set({
                title: 'Update Notification',
                noFooter: true,
                children: (
                  <ModalUpdateNotification notificationDetail={props} />
                ),
              });
            }}>
            {Strings.edit}
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const resultDelete = await FetchApi.deleteNoti(id);
              setLoading(false);
              if (resultDelete?.statusCode === 'OK') {
                queryClient.refetchQueries(`listNotifications`);
                enqueueSnackbar('Delete notif success', {
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
            sx={{mt: 2, mb: 2}}
            style={{color: 'red', marginBottom: 0}}>
            {Strings.delete}
          </Button>
        </div>
      )}
    </div>
  );
}
export function StatusList({notifications = [], isAdmin}) {
  return notifications.map(item => {
    return (
      <StatusListItem
        key={item.id}
        id={item.id}
        title={item.title}
        description={item.description}
        isAdmin={isAdmin}
      />
    );
  });
}
