import './index.less';
import { Link, useParams } from 'react-router-dom';
import { Tag, Card } from 'antd';
import { useState, useEffect } from 'react'
import { getArticleList } from '../../../../api/article'

import {
  SmileOutlined,
} from '@ant-design/icons';
const { Meta } = Card;

function ArticleList() {
  const mock = [];
  let count = 1;  
  const [aritrcleList, setAritrcleList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await getArticleList();
      if (res) {
        setAritrcleList(res.data);
      }
    })();
  },[]);
  console.log(aritrcleList);
  for (let i = 0; i < 30; i++) {
    mock.push({
      id: count++,
      title: '这是一个文章标题占位测试',
      date: '2020-11-27',
      type: '前端',
    });
  }
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
          >
            <Link to={`/article/${ item.id}`}>
              {/* <span className="item-time" >{item.date}</span>
            <span className="hvr-underline item-title">{item.title}</span> */}
              <Meta title={item.title} description={item.text} />
              <Tag
                icon={<SmileOutlined />}
                className="item-type"
                color="magenta"
              >{item.type}
              </Tag>
            </Link>
           </Card>))
        }
      </ul>
    </div>
  );
}

export default ArticleList;
