import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';

import './user_test.css';
import {Button} from '@mui/material';
import {useQuery} from 'react-query';
import {FetchApi} from '../../utils';
import {AppLoadingView, AppModalService} from '../../components';
import QuestionTestUser from './items/QuestionTestUser';
import {FormProvider, useForm} from 'react-hook-form';
import {ModalResultTest} from './items/ModalResultTest';
import {useAppAccount, useAppLanguage} from '../../hooks';

function UserTestCountTime({title, totalTime = 60}) {
  const [mins, setMinutes] = useState(totalTime);
  const [secs, setSeconds] = useState(0);
  useEffect(() => {
    let sampleInterval = setInterval(() => {
      if (secs > 0) {
        setSeconds(secs - 1);
      }
      if (secs === 0) {
        if (mins === 0) {
          clearInterval(sampleInterval);
        } else {
          setMinutes(mins - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(sampleInterval);
    };
  });
  return (
    <h2 style={{color: '#253f8e', paddingLeft: '5%'}}>
      {title}- {mins}:{secs < 10 ? `0${secs}` : secs}
    </h2>
  );
}

export default function UserTest() {
  const value = useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const idTest = searchParams.get('idTest');
  const {account} = useAppAccount();
  const [loading, setLoading] = useState(false);
  const {data, isLoading} = useQuery(`userTest-${idTest}`, () => {
    if (!account.accessToken) {
      return FetchApi.getDetailExamPublic({examId: idTest});
    }
    return FetchApi.getDetailExamUser({examId: idTest});
  });
  const totalQuestion = data?.dto?.questions?.length;
  const {Strings} = useAppLanguage();
  const onSubmit = async data => {
    const questionReq = Object.keys(data).map(ques => {
      if (data[ques]?.type === 'FILL') {
        return {
          questionId: ques,
          content: data[ques].val,
          answerIds: [],
          examId: idTest,
          examResultId: location.state.data.id,
          type: data[ques].type,
        };
      }

      const answerIds = Object.keys(data[ques]).filter(ans => {
        return data[ques][ans] === 1;
      });
      return {
        questionId: ques,
        answerIds: answerIds,
        examId: idTest,
        examResultId: location.state.data.id,
        type: data[ques].type,
      };
    });
    setLoading(true);
    const result = await FetchApi.userSubmitExam({
      id: location.state.data.id,
      examId: idTest,
      questionResultRequests: questionReq,
    });
    setLoading(false);

    if (result?.statusCode === 'OK') {
      AppModalService.set({
        title: Strings.congrats,
        noFooter: true,
        onAfterClose: () => navigate(-1),
        children: (
          <ModalResultTest
            navigate={navigate}
            totalQuestion={totalQuestion}
            totalRightAnswer={result.dto.points / 10}
            totalScore={result.dto.points}
          />
        ),
      });
    }
  };
  if (isLoading) {
    return <AppLoadingView />;
  }
  return (
    <FormProvider {...value}>
      <div className="contentTest" style={{paddingBottom: 50}}>
        <UserTestCountTime
          title={data?.dto?.title}
          totalTime={data?.dto?.totalTime}
        />

        <QuestionTestUser questionList={data?.dto?.questions} idTest={idTest} />
        <Button
          style={{
            border: '1px solid black',
            width: 250,
            background: loading ? 'gray' : '#253f8e',
            color: '#fff',
            float: 'right',
            marginBottom: 50,
            marginRight: '20.5%',
          }}
          disabled={loading}
          color={'secondary'}
          onClick={value.handleSubmit(onSubmit)}>
          Nộp bài
        </Button>
      </div>
    </FormProvider>
  );
}
