import {Grid} from '@mui/material';
import {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {FetchApi} from '../../../utils';
import {AppLoadingView} from '../../../components';

export function ModalUpdateQuestionImages({defaultValue = []}) {
  const {setValue} = useFormContext();
  const [selectedImage, setSelectedImage] = useState(defaultValue);
  return (
    <div style={{paddingTop: 20}}>
      <Grid container>
        {selectedImage.map((item, index) => {
          return (
            <div key={`${index}`} style={{position: 'relative'}}>
              <Grid item style={{marginRight: 10}}>
                <img
                  alt="not fount"
                  width={250}
                  src={
                    item.path
                      ? encodeURI(item.path)
                      : URL.createObjectURL(item.uriLocal || null)
                  }
                  style={{
                    opacity: item.uploaded ? 1 : 0.5,
                    marginBottom: 10,
                  }}
                />
                <br />
                {!item.uploaded && (
                  <AppLoadingView
                    style={{position: 'absolute', marginTop: 0, top: 0}}
                    size={30}
                  />
                )}
              </Grid>
              {!!item.uploaded && (
                <div
                  onClick={() => {
                    const newArr = selectedImage.filter(
                      i => i.path !== item.path,
                    );
                    setSelectedImage(newArr);
                    setValue('imageQuestion', newArr);
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 15,
                    cursor: 'pointer',
                  }}>
                  <DeleteForeverIcon color={'error'} fontSize={'large'} />
                </div>
              )}
            </div>
          );
        })}
      </Grid>
      <br />

      <br />
      <input
        type="file"
        name="myImage"
        multiple
        onChange={async event => {
          // setValue('imageQuestion', [event.target.files[0], ...selectedImage]);

          selectedImage.unshift({
            uriLocal: event.target.files[0],
            uploaded: false,
          });
          setSelectedImage([...selectedImage]);
          const files = event.target.files;
          const result = await FetchApi.uploadImage(files[0]);
          selectedImage[0] = {
            ...selectedImage[0],
            uri: result,
            uploaded: true,
            path: result,
          };
          setSelectedImage([...selectedImage]);
          setValue('images', [...selectedImage]);
        }}
      />
    </div>
  );
}
