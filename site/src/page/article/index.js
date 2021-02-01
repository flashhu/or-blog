import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getArticleDetail } from '@api/article';
import { checkResponse } from '@util/request';
import { formatUTCDate } from '@util/date';
import CodeBlock from './codeHight';
import './index.less';

function Article() {
  const { id } = useParams();
  const [aritrcleDetail, setAritrcleDetail] = useState({});

  useEffect(() => {
    (async () => {
      const res = await getArticleDetail(id);
      if (checkResponse(res)) {
        setAritrcleDetail(res.data);
      }
    })();
  }, []);
  // const data1 = window.localStorage.getItem("token");
  // console.log(data1);

  return (
    <div className="detail">
      <div className="detail-wrapper">
        <h1>{aritrcleDetail.title}</h1>
        <p className="detail-time">{formatUTCDate(aritrcleDetail.time)}</p>
        <ReactMarkdown
          source={aritrcleDetail.text}
          renderers={{
            code: CodeBlock,
          }}
          escapeHtml={false}
        />
      </div>
    </div>
  );
}

export default Article;
