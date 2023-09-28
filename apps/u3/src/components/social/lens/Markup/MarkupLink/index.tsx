import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';

export interface MarkupLinkProps {
  href?: string;
  title?: string;
}

export default function MarkupLink({ href, title = href }: MarkupLinkProps) {
  if (!href) {
    return null;
  }

  // Hashtags
  if (href.startsWith('#')) {
    return <Hashtag href={href} title={title} />;
  }

  return <ExternalLink href={href} title={title} />;
}
