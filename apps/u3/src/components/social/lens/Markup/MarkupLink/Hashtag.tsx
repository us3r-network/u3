import { useNavigate } from 'react-router-dom';

export interface MarkupLinkProps {
  href?: string;
  title?: string;
}

export default function Hashtag({ href, title = href }: MarkupLinkProps) {
  const navigate = useNavigate();
  if (!title) {
    return null;
  }

  return (
    <a
      href={`/social?keyword=${title.slice(1)}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/social?keyword=${title.slice(1)}`);
      }}
    >
      {title}
    </a>
  );
}
