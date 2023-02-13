import Modal from 'react-modal';
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useState} from 'react';
import {
  useFormContext,
  FormProvider,
  useForm,
  Controller,
} from 'react-hook-form';
import {useQueryClient} from 'react-query';
import {FetchApi} from '../../../utils';
import CreateQuestionUploadImage from './CreateQuestionUploadImage';
import {Button} from '@mui/material';
import {AppModalService, AppSelect} from '../../../components';
import {useAppLanguage} from '../../../hooks';
import {ModalUpdateQuestionImages} from './ModalUpdateQuestionImages';

function RenderAnswer({typeQuestion, question}) {
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const {control, setValue, getValues} = useFormContext();
  if (typeQuestion === 'SELECT') {
    return (
      <RadioGroup
        defaultValue={question.answers?.find(i => i.isResult === 1)?.id}>
        {question.answers?.map?.((item, index) => {
          return (
            <div
              key={`${item.id}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingLeft: '7.3%',
              }}>
              <FormControlLabel
                value={`${item.id}`}
                control={<Radio defaultChecked={item.isResult === 1} />}
                onChange={() => {
                  setValue(`${typeQuestion}-rightAnswer`, index + 1);
                }}
                label={
                  <Controller
                    name={`${typeQuestion}-answer${index + 1}`}
                    control={control}
                    render={({field: {onChange, value}}) => {
                      return (
                        <TextField
                          defaultValue={item.content}
                          multiline
                          inputProps={{style: {minWidth: '30vw'}}}
                          onChange={e => {
                            onChange(e.target.value);
                          }}
                        />
                      );
                    }}
                  />
                }
              />
            </div>
          );
        })}
      </RadioGroup>
    );
  }
  if (typeQuestion === 'MULTIPLE_SELECT') {
    return (
      <div>
        {question.answers?.map?.((item, index) => {
          return (
            <FormControlLabel
              style={{paddingTop: 10, paddingLeft: '7.3%'}}
              key={`${item.id}`}
              value={`${item.id}`}
              control={<Checkbox defaultChecked={item.isResult === 1} />}
              onChange={e => {
                setValue(
                  `${typeQuestion}-rightAnswer-${index + 1}`,
                  e.target.checked,
                );
              }}
              label={
                <Controller
                  name={`${typeQuestion}-answer${index + 1}`}
                  control={control}
                  render={({field: {onChange, value}}) => {
                    return (
                      <TextField
                        multiline
                        inputProps={{style: {minWidth: '30vw'}}}
                        defaultValue={item.content}
                        onChange={e => {
                          onChange(e.target.value);
                        }}
                      />
                    );
                  }}
                />
              }
            />
          );
        })}
      </div>
    );
  }
  if (typeQuestion === 'FILL') {
    return (
      <div style={{paddingLeft: '11%'}}>
        <Controller
          name={`${typeQuestion}-rightAnswer`}
          control={control}
          render={({field: {onChange, value}}) => {
            return (
              <TextField
                multiline
                inputProps={{style: {minWidth: '30vw'}}}
                defaultValue={question.answers?.[0]?.content}
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

export function ModalUpdateQuestion({question, idTest}) {
  const {Strings} = useAppLanguage();
  const {enqueueSnackbar} = useSnackbar();
  const queryClient = useQueryClient();
  const listAnswer = question.answers;
  let valueInitial = {};
  const numberAnswer = question?.answers?.length;
  if (question.type === 'SELECT') {
    valueInitial = {
      [`SELECT-rightAnswer`]: listAnswer?.findIndex(i => i.isResult === 1) + 1,
    };
    for (let i = 0; i < numberAnswer; i++) {
      valueInitial[`${question.type}-answer-${i + 1}`] =
        listAnswer?.[i]?.content;
    }
  } else if (question.type === 'MULTIPLE_SELECT') {
    for (let i = 0; i < numberAnswer; i++) {
      valueInitial[`MULTIPLE_SELECT-rightAnswer-${i + 1}`] =
        listAnswer?.[i]?.isResult;
      valueInitial[`${question.type}-answer${i + 1}`] =
        listAnswer?.[i]?.content;
    }
    // valueInitial = {
    //   [`MULTIPLE_SELECT-rightAnswer-1`]: listAnswer?.[0]?.isResult,
    //   [`MULTIPLE_SELECT}-rightAnswer-2`]: listAnswer?.[1]?.isResult,
    //   [`MULTIPLE_SELECT-rightAnswer-3`]: listAnswer?.[2]?.isResult,
    //   [`MULTIPLE_SELECT-rightAnswer-4`]: listAnswer?.[3]?.isResult,
    //   [`MULTIPLE_SELECT-rightAnswer-5`]: listAnswer?.[4]?.isResult,
    //   [`MULTIPLE_SELECT-rightAnswer-6`]: listAnswer?.[5]?.isResult,
    // };
  } else if (question.type === 'FILL') {
    valueInitial = {
      [`FILL-rightAnswer`]: listAnswer?.[0]?.content,
    };
  }
  const value = useForm({
    defaultValues: {
      content: question.content,
      [`${question.type}-answer${1}`]: listAnswer?.[0]?.content,
      [`${question.type}-answer${2}`]: listAnswer?.[1]?.content,
      [`${question.type}-answer${3}`]: listAnswer?.[2]?.content,
      [`${question.type}-answer${4}`]: listAnswer?.[3]?.content,
      [`${question.type}-answer${5}`]: listAnswer?.[4]?.content,
      [`${question.type}-answer${6}`]: listAnswer?.[5]?.content,
      images: question.images?.map?.(i => {
        return {...i, uploaded: true};
      }),
      level: question.level || 1,
      ...valueInitial,
    },
  });

  const {control, getValues} = value;
  const updateQuestion = async () => {
    const inputValue = getValues();
    const typeQuestion = question.type;

    let answers = [];
    if (typeQuestion === 'SELECT') {
      for (let i = 1; i < numberAnswer + 1; i++) {
        answers.push({
          content: inputValue[`SELECT-answer${i}`],
          isResult: inputValue[`SELECT-rightAnswer`] === i ? 1 : 0,
        });
      }
    }

    if (typeQuestion === 'MULTIPLE_SELECT') {
      for (let i = 1; i < numberAnswer + 1; i++) {
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
    const result = await FetchApi.updateQuestion({
      type: typeQuestion,
      examId: idTest,
      content: inputValue.content,
      answers: answers,
      id: question.id,
      images: inputValue.images?.map?.(i => {
        return {path: i.path, type: 'image'};
      }),
      level: inputValue.level,
    });
    if (result?.statusCode === 'OK') {
      queryClient.refetchQueries(`listQuestion-${idTest}`);
      AppModalService.close();
      enqueueSnackbar('Cập nhật câu hỏi thành công', {variant: 'success'});
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
          width: 900,
          overflowY: 'scroll',
          height: 500,
        }}>
        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
          }}>
          <h4 style={{paddingRight: 15, minWidth: 75}}>
            {Strings.name_question}:
          </h4>

          <Controller
            control={control}
            name="content"
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
            alignItems: 'center',
            display: 'flex',
            paddingTop: 20,
          }}>
          <h4 style={{paddingRight: 15, minWidth: 75}}>{Strings.level}:</h4>
          <AppSelect
            item
            xs={12}
            sm={5.65}
            label={Strings.level}
            control={control}
            name="level"
            defaultValue={question.level || 1}
            required>
            <MenuItem value={'1'}>Dễ</MenuItem>
            <MenuItem value={'2'}>Vừa</MenuItem>
            <MenuItem value={'3'}>Trung bình</MenuItem>
            <MenuItem value={'4'}>Khó</MenuItem>
          </AppSelect>
        </div>
        <ModalUpdateQuestionImages
          defaultValue={question.images?.map?.(i => {
            return {...i, uploaded: true};
          })}
        />
        <div style={{paddingTop: 20, paddingBottom: 20}}>
          <RenderAnswer typeQuestion={question.type} question={question} />
        </div>
        <Button
          fullWidth
          variant="contained"
          style={{width: 120, float: 'right', marginTop: 10, marginRight: 10}}
          onClick={updateQuestion}>
          {Strings.update_test}
        </Button>
      </div>
    </FormProvider>
  );
}
