import './index.less';

function ArticleList() {
  const mock = [];

  for (let i = 0; i < 30; i++) {
    mock.push({
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
                    mock.map((item, index) =>
                      (<li className="article-item" key={`${index }3`}>
                        <span className="item-time">{item.date}</span>
                        <span className="hvr-underline item-title">{item.title}</span>
                        <span className="item-type">{item.type}</span>
                      </li>))
                }
      </ul>
    </div>
  );
}

export default ArticleList;
