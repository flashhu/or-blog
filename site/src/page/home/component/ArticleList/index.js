import { Link } from 'react-router-dom';
import { Tag, Card } from 'antd';
import { useState, useEffect } from 'react';
import { getArticleListAll, getArticleListPublic } from '../../../../api/article';
import { getTagList } from '../../../../api/tag'
import { formatUTCDate } from '@util/date';
import { SmileOutlined } from '@ant-design/icons';
import './index.less';

const { Meta } = Card;

function ArticleList() {
  const [aritrcleList, setAritrcleList] = useState([]);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    (async () => {
      let res = [];
      if (!window.localStorage.getItem("token")){
        res = await getArticleListPublic();
      } else {
        res = await getArticleListAll();
      }
      if (res) {
        setAritrcleList(res.data);
      }
      const tagRes = await getTagList();
      if (tagRes) {
        // console.log(tagRes.data);
        setTagList(tagRes.data)
      }
    })();
  }, []);
  for (let i of aritrcleList) {
    for ( let j of tagList) {
      if (i.tid === j.id) {
        i.tag = j.name
      }
    }
  }
  // console.log(aritrcleList);
  return (
    <div className="article-list">
      <p className="card-title">文档列表</p>
      {
        aritrcleList.map((item) =>
          (<Card
            hoverable
            className="article-item"
            key={item.id}
            cover={
              <img
                className="item-cover"
                src={`https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`}
              />
            }
          >
            <Link to={`/article/${ item.id}`}>
              <Meta title={item.title} description={formatUTCDate(item.time)} />
              <Tag
                icon={<SmileOutlined />}
                className="item-type"
                color="#87d068"
              >
                {item.tag || '草稿'}
              </Tag>
            </Link>
           </Card>))
      }
    </div>
  );
}

export default ArticleList;
