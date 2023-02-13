import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useEffect, useState} from 'react';
import {
  useFormContext,
  FormProvider,
  useForm,
  Controller,
} from 'react-hook-form';
import {useQueryClient} from 'react-query';
import {FetchApi} from '../../../utils';
import CreateQuestionUploadImage from './CreateQuestionUploadImage';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {useAppLanguage} from '../../../hooks';
import {AppSelect} from '../../../components';
function RenderAnswer({typeQuestion}) {
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const {control, setValue, getValues} = useFormContext();
  const [listAnswer, setListAnswer] = useState([1]);

  useEffect(() => {
    setValue('listAnswer', listAnswer);
  }, [listAnswer]);

  if (typeQuestion === 'SELECT') {
    return (
      <div>
        <RadioGroup>
          {listAnswer.map((item, index) => {
            return (
              <div
                key={`${item}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 10,
                  paddingLeft: '8.8%',
                }}>
                <FormControlLabel
                  value={`${item}`}
                  control={<Radio />}
                  onChange={() => {
                    setValue(`${typeQuestion}-rightAnswer`, item);
                  }}
                  label={
                    <Controller
                      name={`${typeQuestion}-answer${item}`}
                      control={control}
                      render={({field: {onChange, value}}) => {
                        return (
                          <TextField
                            value={value || ''}
                            multiline
                            inputProps={{style: {minWidth: '35vw'}}}
                            onChange={e => {
                              onChange(e.target.value);
                            }}
                          />
                        );
                      }}
                    />
                  }
                />
                {index !== 0 && (
                  <Button
                    onClick={() => {
                      const newArr = listAnswer.filter(
                        (i, indx) => indx !== index,
                      );
                      setListAnswer([...newArr]);
                    }}
                    startIcon={<DeleteForeverIcon />}></Button>
                )}
              </div>
            );
          })}
        </RadioGroup>
        <AddCircleIcon
          onClick={() => {
            setListAnswer([...listAnswer, listAnswer.length + 1]);
          }}
          style={{paddingLeft: '8.5%', paddingTop: 10}}
        />
      </div>
    );
  }
  if (typeQuestion === 'MULTIPLE_SELECT') {
    return (
      <div>
        {listAnswer.map((item, index) => {
          return (
            <div
              key={`${item}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingLeft: '8.8%',
              }}>
              <FormControlLabel
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                value={`${item}`}
                control={<Checkbox />}
                onChange={e => {
                  setValue(
                    `${typeQuestion}-rightAnswer-${item}`,
                    e.target.checked,
                  );
                }}
                label={
                  <Controller
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingTop: 10,
                    }}
                    name={`${typeQuestion}-answer${item}`}
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <TextField
                          multiline
                          inputProps={{style: {minWidth: '35vw'}}}
                          value={value || ''}
                          onChange={e => {
                            onChange(e.target.value);
                          }}
                        />
                      );
                    }}
                  />
                }
              />
              {index !== 0 && (
                <Button
                  onClick={() => {
                    const newArr = listAnswer.filter(
                      (i, indx) => indx !== index,
                    );
                    setListAnswer([...newArr]);
                  }}
                  startIcon={<DeleteForeverIcon />}></Button>
              )}
            </div>
          );
        })}
        <AddCircleIcon
          onClick={() => {
            setListAnswer([...listAnswer, listAnswer.length + 1]);
          }}
          style={{paddingLeft: '8.5%', paddingTop: 10}}
        />
      </div>
    );
  }
  if (typeQuestion === 'FILL') {
    return (
      <div style={{paddingTop: 10, paddingLeft: '8.8%'}}>
        <Controller
          name={`${typeQuestion}-rightAnswer`}
          control={control}
          render={({field: {onChange, value}}) => {
            return (
              <TextField
                placeholder={'Nhập câu trả lời'}
                value={value || ''}
                multiline
                inputProps={{style: {minWidth: '35vw'}}}
                onChange={e => {
                  onChange(e.target.value);
                }}
              />
            );
          }}
        />
      </div>
    );
  }
  return null;
}

export default function CreateQuestion({idTest, setShowForm, showForm}) {
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const {Strings} = useAppLanguage();

  const [typeQuestion, setTypeQuestion] = useState();
  const value = useForm({
    initialValue: {
      listAnswer: [1],
    },
  });
  const {getValues, control} = value;
  const listTypeQuestion = [
    {
      type: 'SELECT',
      title: Strings.one_answer,
      onChange: () => setTypeQuestion('SELECT'),
    },
    {
      type: 'MULTIPLE_SELECT',
      title: Strings.many_answer,
      onChange: () => setTypeQuestion('MULTIPLE_SELECT'),
    },
    {
      type: 'FILL',
      title: Strings.text_answer,
      onChange: () => setTypeQuestion('FILL'),
    },
  ];
  const onAddQuestion = async () => {
    const inputValue = getValues();

    let answers = [];
    if (typeQuestion === 'SELECT') {
      for (let i = 1; i < inputValue.listAnswer.length + 1; i++) {
        answers.push({
          content: inputValue[`SELECT-answer${i}`],
          isResult: inputValue[`SELECT-rightAnswer`] === i ? 1 : 0,
        });
      }
    }
    if (typeQuestion === 'MULTIPLE_SELECT') {
      for (let i = 1; i < inputValue.listAnswer.length + 1; i++) {
        answers.push({
          content: inputValue[`MULTIPLE_SELECT-answer${i}`],
          isResult: inputValue[`MULTIPLE_SELECT-rightAnswer-${i}`] ? 1 : 0,
        });
      }
    }
    if (typeQuestion === 'FILL') {
      answers.push({
        content: inputValue['FILL-rightAnswer'],
        isResult: 1,
      });
    }
    const result = await FetchApi.createQuestion({
      type: typeQuestion,
      examId: idTest,
      level: Number(inputValue.level),
      content: inputValue.content,
      answers: answers,
      images: inputValue.images?.map?.(i => {
        return {path: i.uri, type: 'image'};
      }),
    });
    if (result?.statusCode === 'OK') {
      value.reset();
      setShowForm(false);
      queryClient.refetchQueries(`listQuestion-${idTest}`);
      enqueueSnackbar('Tạo câu hỏi thành công', {variant: 'success'});
      return;
    }
    enqueueSnackbar(`${result?.message}`, {variant: 'error'});
  };
  return (
    <div
      key={`${showForm}`}
      style={{
        width: '55%',
        marginLeft: '22.5%',
        border: '1px solid #253f8e',
        color: '#253f8e',
        paddingBottom: '90px',
        paddingTop: 0,
        marginTop: 0,
      }}
      className="createQuestion">
      <FormProvider {...value}>
        <div>
          <CreateQuestionUploadImage />
          <div
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
              paddingTop: 20,
            }}>
            <h4 style={{paddingRight: 20}}>{Strings.name_question}:</h4>
            <Controller
              style={{
                width: '100%',
                height: '25px',
                border: '1px solid #253f8e',
              }}
              control={control}
              name="content"
              render={({field: {onChange, value}}) => {
                return (
                  <TextField
                    inputProps={{style: {minWidth: 350}}}
                    fullWidth
                    multiline
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
              alignItems: 'center',
              display: 'flex',
              paddingTop: 20,
            }}>
            <h4 style={{paddingRight: 20}}>{Strings.level}:</h4>
            <AppSelect
              item
              xs={12}
              sm={6}
              label={Strings.level}
              control={control}
              name="level"
              required>
              <MenuItem value={'1'}>Dễ</MenuItem>
              <MenuItem value={'2'}>Vừa</MenuItem>
              <MenuItem value={'3'}>Trung bình</MenuItem>
              <MenuItem value={'4'}>Khó</MenuItem>
            </AppSelect>
          </div>
          <div
            style={{
              paddingLeft: '8%',
              paddingTop: 15,
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
            }}>
            {listTypeQuestion.map(item => {
              return (
                <div
                  key={item.type}
                  style={{
                    padding: '10px 0px 10px 0px',
                    marginRight: 30,
                  }}>
                  <input
                    style={{
                      margin: '8px',
                      height: 20,
                      width: 20,
                      verticalAlign: 'middle',
                    }}
                    type="radio"
                    onChange={item.onChange}
                    checked={typeQuestion === item.type}
                  />
                  {item.title}
                </div>
              );
            })}
          </div>
          <RenderAnswer typeQuestion={typeQuestion} />
        </div>
        <button
          style={{
            border: '1px solid #253f8e',
            backgroundColor: '#253f8e',
            color: '#fff',
            marginTop: '20px',
            float: 'right',
          }}
          onClick={onAddQuestion}>
          Ghi nhận
        </button>
      </FormProvider>
    </div>
  );
}
