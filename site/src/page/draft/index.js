import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useArticleStore } from '@hooks/useStore';
import { formatUTCDate } from '@util/date';
import './index.less';

const { confirm } = Modal;

function showDeleteConfirm(title, id, handleDelete) {
  confirm({
    title: `您确认删除草稿《${title}》吗？`,
    icon: <ExclamationCircleOutlined />,
    content: '草稿删除后不可恢复',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      handleDelete(id);
    },
    onCancel() {
      // console.log('取消删除');
    },
  });
}

function Draft() {
  const articleStore = useArticleStore();
  const [draftList, setDraftList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await articleStore.getDraftList();
      if (res) {
        setDraftList(res);
      }
    })();
  }, [articleStore]);

  const handleDelete = async (id) => {
    await articleStore.deleteArticle(id);
    const newDraftList = draftList.filter((v) => v.id !== id);
    setDraftList(newDraftList);
    message.success('删除成功');
  };

  return (
    <div className="draft-list card-wrapper">
      <p className="card-title">草稿箱（{draftList.length}）</p>
      {draftList.map((item) =>
        (<div className="list-item" key={item.id}>
          <Link className="item-title" to={`/edit/${item.id}`}>{item.title}</Link>
          <div className="item-oper">
            <span className="oper-preview">预览 </span> |
            <span
              className="oper-delete"
              onClick={() => showDeleteConfirm(item.title, item.id, handleDelete)}
            >
              删除
            </span>
          </div>
          <div>{formatUTCDate(item.time)}</div>
         </div>))}
    </div>
  );
}

export default observer(Draft);
