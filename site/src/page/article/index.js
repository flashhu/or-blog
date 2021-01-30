import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import articleStore from '../../store/Article';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './codeHight';
import './index.less';

function Article() {
  const { id } = useParams();
  const [aritrcleDetail, setAritrcleDetail] = useState({});
  useEffect(() => {
    (async () => {
      const res = await articleStore.getArticleDetail(id);
      console.log(res);
      if (res) {
        setAritrcleDetail(res.data);
      }
    })();
  }, []);

  return (
    <div>
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
