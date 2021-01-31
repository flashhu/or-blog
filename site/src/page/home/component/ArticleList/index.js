import './index.less';
import { Link, useParams } from 'react-router-dom';
import { Tag, Card } from 'antd';
import { useState, useEffect } from 'react'
import { getArticleListAll } from '../../../../api/article'
import './formatData'
import {
  SmileOutlined,
} from '@ant-design/icons';


const { Meta } = Card;
function ArticleList() {
  const [aritrcleList, setAritrcleList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await getArticleListAll();
      if (res) {
        setAritrcleList(res.data);
      }
    })();
  }, []);
  console.log(aritrcleList);
  return (
    <div className="article-list card-wrapper">
      <p className="card-title">文档列表</p>
      <ul>
        {
        aritrcleList.map((item) =>
          (<Card
            hoverable
            className="article-item"
            key={item.id}
            cover={<img src={`https://picsum.photos/id/${item.id}/60`} />}
          >
            <Link to={`/article/${ item.id}`}>
              {/* <span className="item-time" >{item.date}</span>
            <span className="hvr-underline item-title">{item.title}</span> */}
              <Meta title={item.title} description={formatDate(item.time)} />
              <Tag
                icon={<SmileOutlined />}
                className="item-type"
                color="#87d068"
              >{item.tid === 1 ? 'react' : 'vue'}
              </Tag>
            </Link>
           </Card>))
        }
      </ul>
    </div>
  );
}

export default ArticleList;
