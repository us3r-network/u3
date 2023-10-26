import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ScrollBox from '../components/common/box/ScrollBox';
import { ButtonPrimary } from '../components/common/button/ButtonBase';
import CardBase from '../components/common/card/CardBase';
import InputBase from '../components/common/input/InputBase';
import Select from '../components/common/select/Select';
import Switch from '../components/common/switch/Switch';
import { MainWrapper } from '../components/layout/Index';
import CrownImg from '../components/imgs/crown.svg';
import {
  contentParse,
  getContent,
  saveContent,
  updateContent,
} from '../services/api/contents';
import {
  ContentLang,
  ContentStatus,
  ContentType,
} from '../services/types/contents';
import { Close } from '../components/icons/close';
import { ProjectAsyncSelectV2 } from '../components/business/form/ProjectAsyncSelect';
import {
  ContentBox,
  ContentShowerTabs,
  LoadingBox,
  Tab,
} from '../components/contents/ContentShowerBox';
import { useAppSelector } from '../store/hooks';
import { selectWebsite } from '../features/website/websiteSlice';
import Loading from '../components/common/loading/Loading';
import isUrl from '../utils/isUrl';
// import { store } from '../store/store';
import { messages } from '../utils/message';
import CreatableMultiSelect from '../components/common/select/CreatableMultiSelect';
import ButtonRefresh from '../components/common/button/ButtonRefresh';
import useConfigsTopics from '../hooks/useConfigsTopics';
import useLinkSubmit from '../hooks/useLinkSubmit';
import useLogin from '../hooks/useLogin';

function ContentCreate() {
  const { createContentLink, updateContentLinkData } = useLinkSubmit();
  const navigate = useNavigate();
  const { user, isAdmin } = useLogin();
  const [parsing, setParsing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [tab, setTab] = useState<Tab>(
    u3ExtensionInstalled ? 'original' : 'readerView'
  );

  const [loading, setLoading] = useState(false);

  const [urlContent, setUrlContent] = useState({
    title: '',
    content: '',
  });

  const formik = useFormik({
    initialValues: {
      id: null,
      title: '',
      url: searchParams.get('url') || '',
      lang: ContentLang.English,
      uniProjectIds: [],
      supportReaderView: true,
      supportIframe: true,
      editorScore: null,
      status: ContentStatus.VISIBLE,
      tags: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      url: Yup.string().required('Required').url('Please enter a regular url'),
    }),
    onSubmit: (values) => {
      submitContent(values);
    },
  });

  useEffect(() => {
    if (isAdmin) {
      formik.setFieldValue('editorScore', 10);
    }
  }, [isAdmin]);

  const reset = useCallback(() => {
    formik.resetForm();
    setUrlContent({
      title: '',
      content: '',
    });
  }, []);

  useEffect(() => {
    if (!formik.values.url) return;
    loadUrlContent(formik.values.url);
  }, [formik.values.url]);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || !user?.token) return;
    getContent(id, user?.token)
      .then((resp) => {
        formik.setValues(resp.data.data as any);
        formik.setFieldValue('url', resp.data.data.link);
        formik.setFieldValue('type', ContentType[resp.data.data.type]);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [searchParams.get('id'), user?.token]);

  const loadUrlContent = useCallback(async (url: string) => {
    if (!url) return;
    if (!isUrl(url)) return;
    setParsing(true);
    try {
      const { data } = await contentParse(url);
      setUrlContent({
        title: data.data.title,
        content: data.data.content,
      });
      formik.setFieldValue('title', data.data.title);
    } catch (error) {
      toast.error(error.msg);
    } finally {
      setParsing(false);
    }
  }, []);

  const submitContent = useCallback(
    async (data: {
      id?: number;
      title: string;
      url: string;
      tags: string[];
      lang: ContentLang;
      uniProjectIds: { id: number }[];
      supportReaderView: boolean;
      supportIframe: boolean;
      editorScore: number | null;
      linkStreamId?: string;
    }) => {
      if (loading) return;
      setLoading(true);
      try {
        if (!data.id) {
          const resp = await saveContent(
            {
              title: data.title,
              url: data.url,
              tags: data.tags,
              lang: data.lang,
              uniProjectIds: data.uniProjectIds.map((item) => item.id),
              supportReaderView: data.supportReaderView,
              supportIframe: data.supportIframe,
              editorScore: data.editorScore,
            },
            user?.token
          );
          if (resp.data.code === 0) {
            const respData = resp.data.data;
            navigate(`/contents/${respData.id}`);
            toast.success(messages.content.admin_submit);
            const linkData = {
              title: data.title,
              tags: data.tags,
              lang: data.lang,
              supportReaderView: data.supportReaderView,
              supportIframe: data.supportIframe,

              author: respData.author,
              value: respData.value,
              description: respData.description,
              platform: respData.platform,
              chain: respData.chain,
              createdAt: respData.createdAt,
            };
            createContentLink(data.url, linkData);
          }
        } else {
          await updateContent(
            {
              id: data.id,
              title: data.title,
              url: data.url,
              tags: data.tags,
              lang: data.lang,
              uniProjectIds: data.uniProjectIds.map((item) => item.id),
              supportReaderView: data.supportReaderView,
              supportIframe: data.supportIframe,
              editorScore: data.editorScore,
            },
            user?.token
          );
          const linkData = {
            title: data.title,
            tags: data.tags,
            lang: data.lang,
            supportReaderView: data.supportReaderView,
            supportIframe: data.supportIframe,
          };
          updateContentLinkData(data.linkStreamId, linkData);
          toast.success(messages.content.admin_update);
        }
        reset();
      } catch (error) {
        toast.error(error.message || error.msg || messages.common.error);
      } finally {
        setLoading(false);
      }
    },
    [user?.token, createContentLink, updateContentLinkData]
  );

  const renderFieldError = useCallback(
    (field: string) => {
      return formik.touched[field] && formik.errors[field] ? (
        <FieldErrorText>{formik.errors[field]}</FieldErrorText>
      ) : null;
    },
    [formik.touched, formik.errors]
  );
  const { topics } = useConfigsTopics();
  const [tagOptions, setTagOptions] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    if (topics.contentTags) {
      setTagOptions(
        topics.contentTags.map((tag) => ({
          value: tag.value,
          label: tag.name,
        }))
      );
    }
  }, [topics.contentTags]);
  return (
    <ScrollBox>
      <ContentCreateWrapper>
        <CreateBox>
          <FormField>
            <FormLabel htmlFor="original-url">Original URL</FormLabel>
            <InputBase
              onChange={(e) => formik.setFieldValue('url', e.target.value)}
              value={formik.values.url}
              placeholder="original url"
              onBlur={() => {
                if (formik.values.url.startsWith('http')) {
                  loadUrlContent(formik.values.url);
                } else if (formik.values.url.length > 4) {
                  const urlWithProtocol = `https://${formik.values.url}`;
                  formik.setFieldValue('url', urlWithProtocol);
                  loadUrlContent(urlWithProtocol);
                }
              }}
            />
            {renderFieldError('url')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <InputBase
              onChange={(e) => formik.setFieldValue('title', e.target.value)}
              value={formik.values.title}
              placeholder="title"
            />
            {renderFieldError('title')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="content-type">Content Tag</FormLabel>
            <CreatableMultiSelect
              options={tagOptions}
              onChange={(value) => formik.setFieldValue('tags', value)}
              value={formik.values.tags}
              onCreateOption={(value) => {
                const newTag = {
                  value,
                  label: value,
                };
                setTagOptions([...tagOptions, newTag]);
                formik.setFieldValue('tags', [...formik.values.tags, value]);
              }}
            />
            {renderFieldError('types')}
            {/* <Select
              options={Object.values(ContentType).map((item) => {
                return {
                  value: item,
                  label: item,
                };
              })}
              onChange={(value) =>
                formik.setFieldValue('type', value as ContentType)
              }
              value={formik.values.type}
            />
            {renderFieldError('type')} */}
          </FormField>

          <FormField>
            <FormLabel htmlFor="content-lang">Content Lang</FormLabel>
            <Select
              defaultValue={ContentLang.English}
              options={Object.keys(ContentLang)
                .slice(1)
                .map((item) => {
                  return {
                    value: ContentLang[item],
                    label: item,
                  };
                })}
              onChange={(value) =>
                formik.setFieldValue('lang', value as ContentLang)
              }
              value={formik.values.lang}
            />
            {/* {renderFieldError('lang')} */}
          </FormField>

          <FormField>
            <FormLabel htmlFor="support-reader">Reader View</FormLabel>
            <SwitchRow>
              <Switch
                onChange={(checked) =>
                  formik.setFieldValue('supportReaderView', checked)
                }
                checked={formik.values.supportReaderView}
              />
              <SwitchText>Readability</SwitchText>
            </SwitchRow>
          </FormField>

          <FormField>
            <FormLabel htmlFor="support-iframe">Iframe Display</FormLabel>
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

          <FormField>
            <FormLabel htmlFor="project">Tag Project</FormLabel>
            <div className="proj-list">
              {formik.values.uniProjectIds.map((item, idx) => {
                return (
                  <div key={item.id}>
                    <div>
                      <img src={item.image} alt="" />
                      {item.name}{' '}
                    </div>
                    <span
                      className="close"
                      onClick={() => {
                        formik.setFieldValue('uniProjectIds', [
                          ...formik.values.uniProjectIds.slice(0, idx),
                          ...formik.values.uniProjectIds.slice(idx + 1),
                        ]);
                      }}
                    >
                      <Close />
                    </span>
                  </div>
                );
              })}
            </div>
            <ProjectAsyncSelectV2
              value=""
              onChange={(value) => {
                if (
                  !formik.values.uniProjectIds.find(
                    (item) => item.id === value.id
                  )
                ) {
                  formik.setFieldValue('uniProjectIds', [
                    ...formik.values.uniProjectIds,
                    value,
                  ]);
                }
                // setSelectProjects([...selectProjects, value]);
              }}
            />
          </FormField>

          {isAdmin && (
            <FormField>
              <FormLabel htmlFor="admin-sore">Admin Score</FormLabel>
              <InputBase
                type="number"
                min={0}
                step={10}
                onChange={(e) => {
                  if (Number.isNaN(Number(e.target.value))) return;
                  formik.setFieldValue('editorScore', Number(e.target.value));
                }}
                value={`${formik.values.editorScore || '0'}`}
                placeholder="admin score"
              />
            </FormField>
          )}

          <FormButtons>
            <ButtonRefresh disabled={loading} onClick={reset} />
            <FormButtonSubmit
              type="submit"
              disabled={loading}
              onClick={() => formik.submitForm()}
            >
              Submit
            </FormButtonSubmit>
          </FormButtons>
        </CreateBox>
        <ShowBox>
          <ContentBox>
            <ContentShowerTabsBox>
              <ContentShowerTabs tab={tab} setTab={(t) => setTab(t)} />
            </ContentShowerTabsBox>

            {(() => {
              if (tab === 'original') {
                return (
                  <div className="iframe-container">
                    {isUrl(formik.values.url) && (
                      <iframe title="daylight" src={formik.values.url} />
                    )}
                  </div>
                );
              }
              if (parsing) {
                return (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                );
              }
              return (
                <div className="reader-view">
                  <h3>{urlContent.title}</h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: urlContent.content }}
                  />
                </div>
              );
            })()}
          </ContentBox>
        </ShowBox>
      </ContentCreateWrapper>
    </ScrollBox>
  );
}
export default ContentCreate;
const ContentCreateWrapper = styled(MainWrapper)`
  display: flex;
  gap: 24px;
`;

const CreateBox = styled(CardBase)`
  width: 360px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: scroll;

  > div {
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      width: 100%;
      background: inherit;
      outline: none;
      color: #fff;
      border: 1px solid #39424c;
      height: 40px;
      border-radius: 10px;
    }
    select {
      padding-left: 5px;
      margin-top: 10px;
      appearance: none;
      background-image: url(${CrownImg});
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
    }
    input[type='checkbox'] {
      width: initial;
    }
  }

  & .proj-list {
    display: flex;
    flex-direction: column;
    gap: 5px;

    > div {
      padding: 3px;
      padding: 10px;
      border: 1px solid #39424c;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      > div {
        display: flex;
        align-items: center;
      }

      & img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    & .close {
      cursor: pointer;
    }
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const FormLabel = styled.label`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-transform: 'capitalize';
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
const ShowBox = styled.div`
  flex-grow: 1;
  height: 100%;
  border: 1px solid #39424c;
  border-radius: 20px;
  /* padding: 10px; */
  overflow: scroll;
  color: white;
  width: calc(100% - 360px);

  & img {
    max-width: 100%;
  }
  & pre {
    overflow: scroll;
  }

  & .reader-view {
    padding: 10px;
    overflow: scroll;
    height: calc(100% - 60px);
    background: #1b1e23;
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 20px;
`;
const FormButtonSubmit = styled(ButtonPrimary)`
  flex: 1;
`;
const FormButtonIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const FieldErrorText = styled.div`
  color: red;
`;
const ContentShowerTabsBox = styled.div`
  width: 100%;
  height: 60px;
  padding: 14px;
  box-sizing: border-box;
  background: #1b1e23;
  border-bottom: 1px solid #39424c;
  display: flex;
  justify-content: center;
  align-items: center;
`;
