import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Modal from 'react-modal';
import ModalUpdateTest from './ModalUpdateTest';
import ModalRequirePassword from './ModalRequirePassword';
import {Button} from '@mui/material';
import {FetchApi} from '../../../utils';
import {useQueryClient} from 'react-query';
import moment from 'moment';
import {useSnackbar} from 'notistack';
import {useAppAccount, useAppLanguage} from '../../../hooks';
import {AppModalService} from '../../../components';

function ExamItem({exam = {}}) {
  const {Strings} = useAppLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenModalPassword, setIsOpenModalPassword] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const {account} = useAppAccount();
  const isAdmin = account?.roles?.[0] === 'ROLE_ADMIN';
  const updateTest = async () => {
    const newData = {
      title: document.getElementsByClassName('testName')[0].value,
      description: document.getElementsByClassName('testDescription')[0].value,
    };
    setLoading(true);
    const resultEdit = await FetchApi.editExam({id: exam.id, ...newData});
    setLoading(false);

    if (resultEdit?.statusCode === 'OK') {
      queryClient.refetchQueries('listExam');
      enqueueSnackbar('Chỉnh sửa test thành công', {
        variant: 'success',
      });
      setIsOpen(false);

      return;
    }
    enqueueSnackbar(`${resultEdit?.message}`, {
      variant: 'error',
    });
  };

  return (
    <div
      style={{
        width: '80%',
        marginLeft: '5.5%',
        border: '1px solid #253f8e',
        color: '#253f8e',
      }}>
      <h2>{exam.title}</h2>
      <p>
        {moment(exam.modifiedDate).isValid()
          ? moment(exam.modifiedDate).format('DD/MM/YYYY  HH:mm')
          : moment().format('DD/MM/YYYY  HH:mm')}
      </p>
      <p>{exam.description}</p>
      <p>Số lần làm bài: {exam.totalExamResult || 0}</p>
      {!!exam.code && isAdmin && <p>Code bài thi: {exam.code}</p>}
      {<p>Thời gian làm bài: {exam.totalTime || 60} phút</p>}
      <div>
        <p>{exam.status}</p>
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}>
        {!!isAdmin && (
          <Button
            style={{
              padding: '8px 16px',
              width: 'fit-content',
              background: '#25408f',
              color: '#fff',
              marginBottom: 10,
            }}
            fullWidth
            variant="contained"
            onClick={async () => {
              await FetchApi.downloadExamExcel({examId: exam.id});
            }}>
            {Strings.excel_export}
          </Button>
        )}
        <Button
          style={{padding: '8px 16px', width: 'fit-content', marginBottom: 10}}
          fullWidth
          variant="contained"
          onClick={async () => {
            if (isAdmin) {
              navigate(`/content-test?idTest=${exam.id}`, {
                state: {data: {...exam}},
              });
              return;
            }
            if (exam.requireCode) {
              AppModalService.set({
                title: 'Nhập code bài thi',
                noFooter: true,
                children: (
                  <ModalRequirePassword exam={exam} navigate={navigate} />
                ),
              });
              return;
            }

            const result = await FetchApi.userStartExam({
              examId: exam.id,
            });
            navigate(`/user-test?idTest=${exam.id}`, {
              state: {data: {...exam, id: result?.dto?.id}},
            });
          }}>
          {isAdmin ? 'Sửa câu hỏi' : Strings.start}
        </Button>
        {isAdmin && (
          <Button
            fullWidth
            variant="contained"
            sx={{mt: 2, mb: 2, width: 'fit-content'}}
            style={{marginBottom: 10}}
            onClick={() => {
              setIsOpen(true);
            }}>
            {Strings.edit}
          </Button>
        )}
        {isAdmin && (
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const resultDelete = await FetchApi.deleteExam({id: exam.id});
              setLoading(false);
              if (resultDelete?.statusCode === 'OK') {
                queryClient.refetchQueries('listExam');
                enqueueSnackbar('Xóa test thành công', {
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
            sx={{mt: 2, mb: 2, width: 'fit-content'}}
            style={{color: 'red', marginBottom: 10}}>
            {Strings.delete}
          </Button>
        )}
      </div>
      <ModalUpdateTest
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={exam.title}
        description={exam.description}
        updateTest={updateTest}
      />
    </div>
  );
}
function ExamList({listExam = []}) {
  return listExam.map(exam => {
    return <ExamItem key={`${exam.id}`} exam={exam} />;
  });
}

export default ExamList;
