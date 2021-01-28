import { useParams } from 'react-router-dom';

function Article() {
  const { id } = useParams();

  return (
    <div>Page Article{id}</div>
  );
}

export default Article;
