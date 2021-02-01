import { observer } from 'mobx-react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getArticleDetail } from '@api/article';
import { checkResponse } from '@util/request';
import { formatUTCDate } from '@util/date';
import { useUserStore } from '@hooks/useStore';
import CodeBlock from './codeHight';
import './index.less';

function Article() {
  const { id } = useParams();
  const [aritrcleDetail, setAritrcleDetail] = useState({});
  const userStore = useUserStore();

  useEffect(() => {
    (async () => {
      const res = await getArticleDetail(id);
      if (checkResponse(res)) {
        setAritrcleDetail(res.data);
      }
    })();
  }, []);

  return (
    <div className="detail">
      <div className="detail-wrapper">
        <h1>{aritrcleDetail.title}</h1>
        <p className="detail-time">
          {formatUTCDate(aritrcleDetail.time)}
          {userStore.user && <Link to={`/edit/${id}`}>编辑</Link>}
        </p>
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

export default observer(Article);
