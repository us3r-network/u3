import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import InputBase from '../common/input/InputBase';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import Switch from '../common/switch/Switch';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { UpdateDappData, DappStatus } from '../../services/types/dapp';
import TextareaBase from '../common/input/TextareaBase';
import MultiSelect from '../common/select/MultiSelect';
import UploadImage from '../common/upload/UploadImage';
import ProjectAsyncSelect from '../business/form/ProjectAsyncSelect';
import ButtonRefresh from '../common/button/ButtonRefresh';
import UploadImages from '../common/upload/UploadImages';

export const PROJECT_ADMIN_PLUS_SCORE_STEP = 10;

type Props = {
  initialValues: UpdateDappData;
  disabled?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: UpdateDappData, isCreateProject?: boolean) => void;
  displayReset?: boolean;
  displayCancel?: boolean;
  displayCreateProject?: boolean;
};
export default forwardRef(function DappForm(
  {
    initialValues,
    disabled,
    loading,
    onSubmit,
    onCancel,
    displayReset,
    displayCancel,
    displayCreateProject,
  }: Props,
  ref
) {
  const { topics } = useConfigsTopics();
  const typeOptions = useMemo(
    () =>
      topics.dappTypes.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    [topics]
  );
  const chainOptions = useMemo(
    () =>
      topics.chains.map((item) => ({
        value: item.chainEnum,
        label: item.name,
      })),
    [topics]
  );
  const formik = useFormik({
    initialValues: { ...initialValues, isCreateProject: false },
    validationSchema: Yup.lazy((values) => {
      return Yup.object({
        name: Yup.string()
          .transform((value) => value || '')
          .required('Required'),
        description: Yup.string()
          .transform((value) => value || '')
          .required('Required'),
        image: Yup.string()
          .transform((value) => value || '')
          .required('Required')
          .url('Please upload dapp logo'),
        headerPhoto: Yup.string()
          .transform((value) => value || '')
          .required('Required')
          .url('Please upload dapp logo'),
        screenshots: Yup.array(),
        isCreateProject: Yup.boolean()
          .transform((value) => !!value)
          .nullable(),
        uniProjectId:
          !displayCreateProject || !values.isCreateProject
            ? Yup.number()
                .transform((value) => value || '')
                .required('Required')
            : Yup.number().transform((value) => value || ''),
        types: Yup.array(),
        url: Yup.string()
          .transform((value) => value || '')
          .nullable()
          .url('Please enter a regular url'),
        status: Yup.string()
          .transform((value) => value || '')
          .nullable(),
        chains: Yup.array(),
        mediaLinks: Yup.object({
          twitter: Yup.string()
            .transform((value) => value || '')
            .nullable()
            .url('Please enter a regular url'),
          discord: Yup.string()
            .transform((value) => value || '')
            .nullable()
            .url('Please enter a regular url'),
          facebook: Yup.string()
            .transform((value) => value || '')
            .nullable()
            .url('Please enter a regular url'),
          telegram: Yup.string()
            .transform((value) => value || '')
            .nullable()
            .url('Please enter a regular url'),
        }),
        editorScore: Yup.number()
          .transform((value) => value || 0)
          .nullable(),
      });
    }),
    onSubmit: (values) => {
      onSubmit(values, values.isCreateProject);
    },
  });
  useImperativeHandle(
    ref,
    () => ({
      resetForm: formik.resetForm,
    }),
    []
  );

  const renderFieldError = useCallback(
    (fieldStr: string) => {
      const fields = fieldStr.split('.');
      let touched = { ...formik.touched };
      let errors = { ...formik.errors };
      let errorText = '';
      for (const field of fields) {
        if (touched[field]) {
          touched = touched[field];
        }
        if (errors[field]) {
          errors = errors[field];
        }

        if (touched && typeof errors === 'string') {
          errorText = errors;
        }
      }
      return errorText ? <FieldErrorText>{errorText}</FieldErrorText> : null;
    },
    [formik.touched, formik.errors]
  );

  return (
    <DappFormWrapper>
      <FormGroupLabel>Information</FormGroupLabel>
      <FormField>
        <FormLabel htmlFor="name">Dapp name</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Dapp name"
            onChange={(e) => formik.setFieldValue('name', e.target.value)}
            value={formik.values.name}
          />
          {renderFieldError('name')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="image">Image</FormLabel>
        <FormValueBox>
          <UploadImage
            url={formik.values.image}
            onSuccess={(url) => formik.setFieldValue('image', url)}
          />
          <ImageUrlInput
            placeholder="Image"
            onChange={(e) => formik.setFieldValue('image', e.target.value)}
            value={formik.values.image}
          />
          {renderFieldError('image')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="headerPhoto">Header photo</FormLabel>
        <FormValueBox>
          <UploadImage
            url={formik.values.headerPhoto}
            onSuccess={(url) => formik.setFieldValue('headerPhoto', url)}
          />
          <ImageUrlInput
            placeholder="Header photo"
            onChange={(e) =>
              formik.setFieldValue('headerPhoto', e.target.value)
            }
            value={formik.values.headerPhoto}
          />
          {renderFieldError('headerPhoto')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="screenshots">Screenshots</FormLabel>
        <FormValueBox>
          <UploadImages
            showInput
            urls={formik.values.screenshots ?? []}
            onSuccess={(urls) => formik.setFieldValue('screenshots', urls)}
          />
          {renderFieldError('screenshots')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormValueBox>
          <TextareaBase
            rows={3}
            placeholder="Description"
            onChange={(e) =>
              formik.setFieldValue('description', e.target.value)
            }
            value={formik.values.description}
          />
          {renderFieldError('description')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Url</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Url"
            onChange={(e) => formik.setFieldValue('url', e.target.value)}
            value={formik.values.url}
            onBlur={() => {
              if (
                !formik.values?.url.startsWith('http') &&
                formik.values.url.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values.url}`;
                formik.setFieldValue('url', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('url')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="supportIframe">Verify</FormLabel>
        <Switch
          onChange={(checked) =>
            formik.setFieldValue(
              'status',
              checked ? DappStatus.VERIFIED : DappStatus.VISIBLE
            )
          }
          checked={formik.values.status === DappStatus.VERIFIED}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor="type">Project</FormLabel>
        <FormValueBox>
          <ProjectAsyncSelect
            disabled={formik.values.isCreateProject}
            placeholder="Select"
            value={formik.values.uniProjectId}
            onChange={(value) => formik.setFieldValue('uniProjectId', value)}
          />
          {renderFieldError('uniProjectId')}
        </FormValueBox>
      </FormField>
      {displayCreateProject && (
        <FormField>
          <FormLabel htmlFor="supportIframe">Create Project</FormLabel>
          <Switch
            onChange={(checked) =>
              formik.setFieldValue('isCreateProject', checked)
            }
            checked={formik.values.isCreateProject}
          />
        </FormField>
      )}

      <FormField>
        <FormLabel htmlFor="type">Type</FormLabel>
        <FormValueBox>
          <MultiSelect
            options={typeOptions}
            onChange={(value) => formik.setFieldValue('types', value)}
            value={formik.values.types}
          />
          {renderFieldError('types')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="chain">Chain</FormLabel>
        <FormValueBox>
          <MultiSelect
            options={chainOptions}
            onChange={(value) => formik.setFieldValue('chains', value)}
            value={formik.values.chains}
          />
          {renderFieldError('chains')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="supportIframe">Iframe Display</FormLabel>
        <SwitchRow>
          <Switch
            onChange={(checked) =>
              formik.setFieldValue('supportIframe', checked)
            }
            checked={formik.values.supportIframe}
          />
          <SwitchText>Iframe supports the website display 👉</SwitchText>
        </SwitchRow>
      </FormField>

      <FormGroupLabel>Social Network</FormGroupLabel>
      <FormField>
        <FormLabel>Facebook</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Facebook"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.facebook', e.target.value)
            }
            value={formik.values?.mediaLinks?.facebook}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.facebook.startsWith('http') &&
                formik.values?.mediaLinks?.facebook.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.facebook}`;
                formik.setFieldValue('mediaLinks.facebook', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.facebook')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Twitter</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Twitter"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.twitter', e.target.value)
            }
            value={formik.values?.mediaLinks?.twitter}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.twitter.startsWith('http') &&
                formik.values?.mediaLinks?.twitter.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.twitter}`;
                formik.setFieldValue('mediaLinks.twitter', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.twitter')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Discord</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Discord"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.discord', e.target.value)
            }
            value={formik.values?.mediaLinks?.discord}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.discord.startsWith('http') &&
                formik.values?.mediaLinks?.discord.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.discord}`;
                formik.setFieldValue('mediaLinks.discord', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.discord')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Telegram</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Telegram"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.telegram', e.target.value)
            }
            value={formik.values?.mediaLinks?.telegram}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.telegram.startsWith('http') &&
                formik.values?.mediaLinks?.telegram.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.telegram}`;
                formik.setFieldValue('mediaLinks.telegram', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.telegram')}
        </FormValueBox>
      </FormField>

      <FormGroupLabel>Editor Score</FormGroupLabel>
      <FormField>
        <InputBase
          placeholder="score"
          type="number"
          min={0}
          step={PROJECT_ADMIN_PLUS_SCORE_STEP}
          value={formik.values.editorScore as unknown as string}
          onChange={(e) =>
            formik.setFieldValue('editorScore', Number(e.target.value))
          }
        />
      </FormField>

      <FormButtons>
        {displayCancel && (
          <ButtonPrimaryLine disabled={disabled || loading} onClick={onCancel}>
            Cancel
          </ButtonPrimaryLine>
        )}
        {displayReset && (
          <ButtonRefresh
            disabled={disabled || loading}
            onClick={() => formik.resetForm()}
          />
        )}

        <ButtonPrimary
          disabled={disabled || loading}
          onClick={() => formik.submitForm()}
        >
          Submit
        </ButtonPrimary>
      </FormButtons>
    </DappFormWrapper>
  );
});
const DappFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroupLabel = styled.label`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  text-transform: 'capitalize';
`;
const FormField = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;
const FormLabel = styled.label`
  width: 100px;
  font-size: 14px;
  line-height: 24px;
  color: #ffffff;
  text-transform: 'capitalize';
  & + input,
  & + textarea {
    flex: 1;
  }
`;
const FormValueBox = styled.div`
  flex: 1;
`;
const FieldErrorText = styled.div`
  margin-top: 5px;
  color: red;
`;
const FormButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const SwitchText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e5a6e;
`;
const ImageUrlInput = styled(InputBase)`
  margin-top: 10px;
`;
