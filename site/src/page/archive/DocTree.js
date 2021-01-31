import React, { useEffect, useRef, useState } from 'react';
import { Divider, Typography, Button, Menu, Dropdown, Modal, Input } from 'antd';
import './DocTree.less';
import { useArticleStore, useUserStore } from '@hooks/useStore';
import { ReadOutlined, LockOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { renameArticle } from '@api/article';
import Preview from './components/preview';
import Edit from './components/edit';
import { formatUTCDate } from '@util/date';

const { Title } = Typography;

const ArticleIcon = ({ status }) => {
  switch (status) {
    case 0:
      return <EyeInvisibleOutlined />;
    case 1:
      return <LockOutlined />;
    case 2:
      return <ReadOutlined />;
    default:
      return null;
  }
};

function DocTree() {
  const articleStore = useArticleStore();
  const userStore = useUserStore();
  const [mode, setMode] = useState('preview');
  const [treeData, setTreeData] = useState([]);
  const [action, setAction] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      // if (!articleStore.user) {
      //   setMode('preview');
      // }
      await articleStore.loadTreeData(!!(userStore.user && userStore.user.role === 1));
      const tData = transToTree(toJS(articleStore.typeList), toJS(articleStore.articleList));
      articleStore.setTreeData(tData);
      setTreeData(tData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, action, userStore.user, articleStore]);

  const transToTree = (types, articles) => {
    const treeData = [];
    const map = new Map();
    if (!types) {
      return null;
    }
    for (const item of types) {
      const node = {
        title: item.name,
        key: item.id,
        children: [],
        isLeaf: false,
        expanded: true,
      };
      if (item.pid === 0) {
        treeData.push(node);
      } else {
        map.get(item.pid).children.push(node);
      }
      map.set(node.key, node);
    }
    if (!articles) {
      return treeData;
    }
    for (const article of articles) {
      const art = {
        title: (
          <Dropdown
            key={article.id}
            overlay={() => contextMenu(article)}
            trigger={['contextMenu']}
            data={article}
            className="leaf-title"
            disabled={mode === 'preview'}
          >
            <span>
              <span>{article.title}</span>
              <span className="updated-date">{formatUTCDate(article.time)}</span>
            </span>
          </Dropdown>
        ),
        key: `${article.tid}-${article.id}`,
        isLeaf: true,
        expanded: true,
        icon: <ArticleIcon status={article.status} />,
      };
      if (map.get(article.tid)) {
        map.get(article.tid).children.push(art);
      }
    }
    return treeData;
  };

  const viewDetail = async (article) => {
    window.location.href = `/#/article/${article.id}`;
  };

  const rename = async (article) => {
    Modal.confirm({
      title: '修改标题',
      content: <Input placeholder="请输入新标题" ref={inputRef} />,
      async onOk() {
        await renameArticle({
          id: article.id,
          newTitle: inputRef.current.state.value,
        });
        Modal.success({ title: '修改成功' });
        setAction(!action);
      },
    });
  };

  const contextMenu = (article) => (
    <Menu>
      <Menu.Item key="1" onClick={viewDetail.bind(this, article)}>
        查看
      </Menu.Item>
      <Menu.Item key="2" onClick={rename.bind(this, article)}>
        重命名
      </Menu.Item>
    </Menu>
  );

  const modeChange = () => {
    if (mode === 'preview') {
      setMode('edit');
    } else {
      setMode('preview');
    }
  };

  const EditButton = () => {
    return (
      <div>
        <Button disabled={!(userStore.user && userStore.user.role)} onClick={modeChange}>
          {mode === 'preview' ? '预览' : '编辑'}
        </Button>
      </div>
    );
  };

  return (
    <div className="doc-wrapper">
      <EditButton />
      <Title level={3} className="doc-title">
        知识库
      </Title>
      <Divider />
      {mode === 'preview' ? (
        <Preview className="doc-tree-preview" />
      ) : (
        <Edit className="doc-tree-edit" transToTree={transToTree} />
      )}
    </div>
  );
}

export default observer(DocTree);
