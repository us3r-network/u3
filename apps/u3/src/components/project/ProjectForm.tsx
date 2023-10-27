import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import InputBase from '../common/input/InputBase';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import Switch from '../common/switch/Switch';
import useConfigsTopics from '../../hooks/shared/useConfigsTopics';
import {
  UpdateProjectData,
  UniprojectStatus,
} from '../../services/shared/types/project';
import TextareaBase from '../common/input/TextareaBase';
import MultiSelect from '../common/select/MultiSelect';
import UploadImage from '../common/upload/UploadImage';
import ButtonRefresh from '../common/button/ButtonRefresh';

export const PROJECT_ADMIN_PLUS_SCORE_STEP = 10;

type Props = {
  initialValues: UpdateProjectData;
  disabled?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: UpdateProjectData) => void;
  displayReset?: boolean;
  displayCancel?: boolean;
};
export default forwardRef(function ProjectForm(
  {
    initialValues,
    disabled,
    loading,
    onSubmit,
    onCancel,
    displayReset,
    displayCancel,
  }: Props,
  ref
) {
  const { topics } = useConfigsTopics();
  const typeOptions = useMemo(
    () =>
      topics.projectTypes.map((item) => ({
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
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string()
        .transform((value) => value || '')
        .required('Required'),
      description: Yup.string()
        .transform((value) => value || '')
        .required('Required'),
      image: Yup.string()
        .transform((value) => value || '')
        .required('Required')
        .url('Please upload project logo'),
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
    }),
    onSubmit: (values) => {
      onSubmit(values);
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
    <ProjectFormWrapper>
      <FormGroupLabel>Information</FormGroupLabel>
      <FormField>
        <FormLabel htmlFor="name">Project name</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Project name"
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
          {renderFieldError('image')}
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
              checked ? UniprojectStatus.VERIFIED : UniprojectStatus.VISIBLE
            )
          }
          checked={formik.values.status === UniprojectStatus.VERIFIED}
        />
      </FormField>
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
    </ProjectFormWrapper>
  );
});
const ProjectFormWrapper = styled.div`
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
  width: 80px;
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
