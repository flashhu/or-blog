import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Tag, Card } from 'antd';
import { useState, useEffect } from 'react';
import { getArticleListPublic, getArticleListAllPost } from '@api/article';
import { getTagList } from '@api/tag';
import { formatUTCDate } from '@util/date';
import { SmileOutlined } from '@ant-design/icons';
import { useUserStore } from '@hooks/useStore';
import './index.less';

const { Meta } = Card;

function ArticleList() {
  const [aritrcleList, setAritrcleList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const userStore = useUserStore();

  useEffect(() => {
    getArticleList();
  }, []);

  useEffect(() => {
    getArticleList();
  }, [userStore.user]);

  for (const i of aritrcleList) {
    for (const j of tagList) {
      if (i.tid === j.id) {
        i.tag = j.name;
      }
    }
  }

  const getArticleList = async () => {
    // 根据是否已登录，取对应的文章列表
    const res = userStore.user ? await getArticleListAllPost() : await getArticleListPublic();
    if (res) {
      setAritrcleList(res.data);
    }
    const tagRes = await getTagList();
    console.log(tagRes);
    // setTagList(tagRes.data)
  };

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

export default observer(ArticleList);
