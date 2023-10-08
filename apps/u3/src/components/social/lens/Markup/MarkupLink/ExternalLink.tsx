export interface MarkupLinkProps {
  href?: string;
  title?: string;
}

export default function ExternalLink({ href, title = href }: MarkupLinkProps) {
  if (!href) {
    return null;
  }

  if (!href.includes('://')) {
    href = `https://${href}`;
  }

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      target={href.includes(window.location.host) ? '_self' : '_blank'}
      rel="noopener noreferrer"
    >
      {title}
    </a>
  );
}
