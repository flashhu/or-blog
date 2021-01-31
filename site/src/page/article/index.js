import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticleDetail } from '../../api/article';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './codeHight';
import './index.less';
import { markdown } from 'react-syntax-highlighter/dist/esm/languages/prism';

function Article() {
  const { id } = useParams();
  const [aritrcleDetail, setAritrcleDetail] = useState({});
  useEffect(() => {
    (async () => {
      const res = await getArticleDetail(id);
      console.log(res);
      if (res) {
        setAritrcleDetail(res.data);
      }
    })();
  }, []);

  return (
    <div className="markdown">
      <div>
        <ReactMarkdown
          source={aritrcleDetail.text}
          renderers={{
            code: CodeBlock,
          }}
          escapeHtml={false}
        />
      </div>
      <div
        className="wrapper"
      />
    </div>
  );
}

export default Article;
