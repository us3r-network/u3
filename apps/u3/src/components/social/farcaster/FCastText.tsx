/* eslint-disable react/no-array-index-key */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import isURL from 'validator/lib/isURL';

import { UserData } from 'src/utils/social/farcaster/user-data';
import { FarCast } from '../../../services/social/types';
import { farcasterHandleToBioLinkHandle } from '@/utils/profile/biolink';

export default function FCastText({
  cast,
  farcasterUserDataObj,
}: {
  cast: FarCast;
  farcasterUserDataObj: { [key: string]: UserData } | undefined;
}) {
  const t = useMemo(() => {
    const { text, mentions, mentionsPositions: indices } = cast;
    const segments = splitAndInsert(
      text,
      indices || [],
      (mentions || []).map((mention, index) => {
        const mentionData = farcasterUserDataObj?.[mention];
        if (!mentionData) return null;
        const profileIdentity = mentionData.userName.endsWith('.eth')
          ? mentionData.userName
          : farcasterHandleToBioLinkHandle(mentionData.userName);
        const link = (
          <Link
            to={`/u/${profileIdentity}`}
            key={index}
            className="inline text-[#2594ef] hover:cursor-pointer hover:underline"
          >
            {`@${mentionData.userName}`}
          </Link>
        );
        return (
          <span className="override-nav inline-block" key={index}>
            {link}
          </span>
        );
      }),
      (s, index) => {
        return (
          <span className="inline" key={index}>
            {s.split(/(\s|\n)/).map((part, index_) => {
              if (isURL(part, { require_protocol: false })) {
                const link = !(
                  part.toLowerCase().startsWith('https://') ||
                  part.toLowerCase().startsWith('http://')
                )
                  ? `https://${part}`
                  : part;
                return (
                  <a
                    href={link}
                    key={index_}
                    target="_blank"
                    rel="noreferrer"
                    className="inline text-[#2594ef] hover:cursor-pointer hover:underline"
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </span>
        );
      }
    );
    return segments;
  }, [cast, farcasterUserDataObj]);

  return (
    <div
      onClick={(e) => {
        if (e.target instanceof HTMLAnchorElement) {
          e.stopPropagation();
        }
      }}
    >
      {t}
    </div>
  );
}

function splitAndInsert(
  input: string,
  indices: number[],
  insertions: JSX.Element[],
  elementBuilder: (s: string, key: any) => JSX.Element
) {
  const result = [];
  let lastIndex = 0;

  indices.forEach((index, i) => {
    result.push(
      elementBuilder(
        Buffer.from(input).slice(lastIndex, index).toString(),
        `el-${i}`
      )
    );
    result.push(insertions[i]);
    lastIndex = index;
  });

  result.push(
    elementBuilder(
      Buffer.from(input).slice(lastIndex).toString(),
      `el-${indices.length}`
    )
  ); // get remaining part of string

  return result;
}
