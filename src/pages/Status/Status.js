import {useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {AddStatus} from './items/AddStatus';
import {StatusList} from './items/StatusList';

import './status.css';
import {useAppAccount, useAppLanguage} from '../../hooks';
import {Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils';
import {AppLoadingView} from '../../components';
export default function Status() {
  const {Strings} = useAppLanguage();
  const [showForm, setShowForm] = useState(false);

  const {data, isLoading, refetch} = useQuery(
    'listNotifications',
    FetchApi.listNotifications,
  );
  const {account} = useAppAccount();
  const isAdmin = account?.roles?.[0] === 'ROLE_ADMIN';
  if (isLoading) {
    return <AppLoadingView />;
  }
  return (
    <div
      style={{
        color: '#253f8e',
      }}
      className="status">
      <h2 style={{paddingLeft: '18%'}}>{Strings.status}</h2>
      {!!isAdmin && (
        <div
          style={{
            textAlignLast: 'center',
            width: 120,
            marginLeft: '18%',
            border: '1px solid #253f8e',
            color: '#fff',
            backgroundColor: '#253f8e',
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowForm(!showForm);
          }}>
          {!showForm ? (
            <Typography
              style={{
                textAlignLast: 'center',
              }}>
              Thêm thông báo
            </Typography>
          ) : (
            <Typography
              style={{
                textAlignLast: 'center',
              }}>
              Bỏ thông báo
            </Typography>
          )}
        </div>
      )}
      {showForm && <AddStatus refetch={refetch} />}
      <StatusList notifications={data?.dtos || []} isAdmin={isAdmin} />
    </div>
  );
}
