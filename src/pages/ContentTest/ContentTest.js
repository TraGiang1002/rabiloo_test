import {useEffect, useState} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CreateQuestion from './items/CreateQuestion';
import QuestionTest from './items/QuestionTest';
import './content_test.css';
import {Button, Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils';
import {AppLoadingView} from '../../components';
import {useRef} from 'react';
import {useSnackbar} from 'notistack';

export default function ContentTest() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const idTest = searchParams.get('idTest');
  const [showForm, setShowForm] = useState(false);
  const inputRef = useRef();
  const {enqueueSnackbar} = useSnackbar();

  const {data, isLoading, refetch} = useQuery(`listQuestion-${idTest}`, () =>
    FetchApi.getDetailExam({examId: idTest}),
  );
  if (isLoading) {
    return <AppLoadingView />;
  }
  return (
    <div className="contentTest">
      {/* <ContentTestCountTime
        style={{color: '#253f8e'}}
        title={data?.dto?.title}
      /> */}
      <div
        className="contentTest"
        style={{
          flexDirection: 'row',
          display: 'flex',
          paddingLeft: '6%',
          paddingBottom: 0,
          paddingTop: 0,
        }}>
        <div
          style={{
            textAlignLast: 'center',
            // mutiline,
            width: 120,
            border: '1px solid #253f8e',
            color: '#fff',
            backgroundColor: '#253f8e',
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowForm(!showForm);
          }}>
          {/* {!showForm ? <AddIcon /> : <RemoveIcon />} */}
          {!showForm ? (
            <Typography
              style={{
                textAlignLast: 'center',
              }}>
              Thêm câu hỏi
            </Typography>
          ) : (
            <Typography
              style={{
                textAlignLast: 'center',
              }}>
              Bỏ câu hỏi
            </Typography>
          )}
        </div>
        <div
          style={{
            textAlignLast: 'center',
            width: 120,
            float: 'right',
            marginRight: '19%',
            marginLeft: 10,
            // border: '1px solid #253f8e',
            // color: '#fff',
            // backgroundColor: '#253f8e',
            cursor: 'pointer',
          }}
          // onClick={() => {
          //   document.getElementById('myFileInput').click();
          //   inputRef.current?.onChange?.(e => console.log(e));
          // }}
        >
          {/* <input
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
            Tải lên bài thi
          </Typography> */}
        </div>
      </div>
      {showForm && (
        <CreateQuestion
          showForm={showForm}
          idTest={idTest}
          setShowForm={setShowForm}
        />
      )}
      <QuestionTest questionList={data?.dto?.questions} idTest={idTest} />
    </div>
  );
}
