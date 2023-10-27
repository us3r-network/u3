import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import linkifyRegex from 'remark-linkify-regex';
import MarkupLink from './MarkupLink';
import trimify from '../../../../utils/shared/trimify';
import { Regex } from './regex';

const plugins = [
  remarkBreaks,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.hashtag),
];

const components = {
  a: MarkupLink,
};

interface MarkupProps {
  children: string;
}

export default function Markup({ children }: MarkupProps) {
  return (
    <ReactMarkdown components={components} remarkPlugins={plugins}>
      {trimify(children)}
    </ReactMarkdown>
  );
}
