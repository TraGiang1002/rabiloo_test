import './problem.css';
import {useState} from 'react';
import {AddTest} from './items/AddTest';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils';
import {CircularProgress, Typography} from '@mui/material';
import {AppLoadingView} from '../../components';
import ExamList from './items/ExamList';
import {Box} from '@mui/system';
import {useAppAccount} from '../../hooks';
import {useAppLanguage} from '../../hooks';
import {useRef} from 'react';
import {useSnackbar} from 'notistack';
function Problems() {
  const {Strings} = useAppLanguage();
  const [showForm, setShowForm] = useState(false);
  const {account} = useAppAccount();
  const inputRef = useRef();
  const {enqueueSnackbar} = useSnackbar();
  const isRoleAdmin = account.roles && account.roles[0] === 'ROLE_ADMIN';
  const {data, isLoading, refetch} = useQuery(['listExam'], () => {
    if (isRoleAdmin) {
      return FetchApi.allExam();
    }
    if (!account.accessToken) {
      return FetchApi.allExamPublic();
    }

    return FetchApi.getAllUserExam();
  });
  if (isLoading) {
    return <AppLoadingView />;
  }
  return (
    <div className="problemsBody">
      <h2 style={{color: '#253f8e', paddingLeft: '5.5%'}}>{Strings.problem}</h2>
      {!!isRoleAdmin && (
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            borderWidth: 0,
            paddingBottom: 0,
            paddingTop: 0,
            boxShadow: 'none',
          }}>
          <div
            style={{
              width: 160,
              marginLeft: '4.5%',
              border: '1px solid #253f8e',
              borderRadius: 5,
              color: '#fff',
              backgroundColor: '#253f8e',
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onClick={() => {
              setShowForm(!showForm);
            }}>
            {!showForm ? (
              <Typography
                style={{
                  textAlignLast: 'center',
                }}>
                Thêm bài thi
              </Typography>
            ) : (
              <Typography
                style={{
                  textAlignLast: 'center',
                }}>
                Bỏ bài thi
              </Typography>
            )}
          </div>
          <div
            style={{
              textAlignLast: 'center',
              width: 260,
              marginRight: '19%',
              marginLeft: 10,
              border: '1px solid #253f8e',
              color: '#fff',
              backgroundColor: '#253f8e',
              cursor: 'pointer',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onClick={() => {
              document.getElementById('myFileInput').click();
              inputRef.current?.onChange?.(e => console.log(e));
            }}>
            <input
              type="file"
              ref={inputRef}
              id="myFileInput"
              onChange={async event => {
                console.log('e', event.target);
                const files = event.target.files;
                const result = await FetchApi.uploadExcel(files[0]);
                if (result?.statusCode === 'OK') {
                  enqueueSnackbar('Nhập thành công', {variant: 'success'});
                  refetch();
                }
              }}
              style={{display: 'none'}}
            />

            <Typography
              style={{
                textAlignLast: 'center',
              }}>
              Tải lên bài thi bằng file excel
            </Typography>
          </div>
        </div>
      )}
      {showForm && <AddTest setShowForm={setShowForm} />}

      <ExamList listExam={data?.dtos || []} />
    </div>
  );
}

export default Problems;
