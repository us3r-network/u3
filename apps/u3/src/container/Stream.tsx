import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Network, Stream } from '../services/types/activity';

import CardBase from '../components/common/card/CardBase';
import PageTitle from '../components/common/PageTitle';
import { MainWrapper } from '../components/layout/Index';
import { getStreamInfo } from '../services/api/activity';

import StreamTable from '../components/activity/StreamTable';

const network = 'TESTNET' as Network;

function StreamPage() {
  const { streamId } = useParams();
  const [stream, setStream] = useState<Stream>();
  const [serverErrMsg, setServerErrMsg] = useState<{
    status: number;
    msg: string;
  }>();
  const [unknownErr, setUnknownErr] = useState<string>();

  const loadStreamInfo = async (
    paramNetwork: Network,
    paramStreamId: string
  ) => {
    try {
      const resp = await getStreamInfo(paramNetwork, paramStreamId);
      setStream(resp.data.data);
    } catch (err) {
      // const err = error as any;
      if (err.response) {
        setServerErrMsg({
          status: err.response.status,
          msg: err.response.data.msg,
        });
      } else {
        setUnknownErr(err.message);
      }
    }
  };

  useEffect(() => {
    if (!streamId || !network) return;
    loadStreamInfo(network, streamId);
  }, [streamId, network]);

  if (unknownErr) {
    return (
      <Wrapper>
        <PageTitle>Stream</PageTitle>
        <div className="err">
          <p>{unknownErr}</p>
          <p>
            <Link to="/">Go to the home page</Link>
          </p>
        </div>
      </Wrapper>
    );
  }

  if (serverErrMsg) {
    return (
      <Wrapper>
        <PageTitle>Stream</PageTitle>
        <div className="err">
          <h3>{serverErrMsg.status}</h3>

          <p className="msg">{serverErrMsg.msg}</p>
          <p>
            <Link to="/">Go to the home page</Link>
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageTitle>Stream</PageTitle>
      {stream && <StreamTable data={stream} network={network} />}
    </Wrapper>
  );
}
export default StreamPage;

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
