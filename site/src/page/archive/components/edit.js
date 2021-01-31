import { Tree, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { deleteType } from '@api/type';
import { deleteArticleBatch } from '@api/article';
import { toJS } from 'mobx';
import { useArticleStore, useUserStore } from '@hooks/useStore';
import { checkResponse } from '@util/request';
import './edit.less'

function Edit({ transToTree }) {
  const [checked, setChecked] = useState(false);
  const [articleKeys, setArticleKeys] = useState([]);
  const [typeKeys, setTypeKeys] = useState([]);
  const [action, setAction] = useState(false);
  const articleStore = useArticleStore();
  const userStore = useUserStore();

  useEffect(() => {
    (async () => {
      await articleStore.loadTreeData(userStore.user && userStore.user.role === 1);
      articleStore.setTreeData(
        transToTree(toJS(articleStore.typeList), toJS(articleStore.articleList)),
      );
    })();
  }, [action]);

  /**
   * 选中复选框时的操作，保存当前选中的类型节点和文章节点，以便后续的操作
   * @param {*} keys
   */
  const checkHandle = (keys) => {
    const checkedKeys = keys.checked;
    const artkeys = [];
    const tykeys = [];
    if (checkedKeys.length > 0) {
      for (const key of checkedKeys) {
        if (typeof key === 'number') {
          tykeys.push(key);
        } else {
          artkeys.push(Number(key.split('-')[1]));
        }
      }
      setArticleKeys(artkeys);
      setTypeKeys(tykeys);
      setChecked(true);
    } else {
      setArticleKeys([]);
      setTypeKeys([]);
      setChecked(false);
    }
  };

  /**
   * 将选中的节点删除，可能是类型，也可能是文章
   */
  const deleteItem = async () => {
    let res1; let
      res2;
    if (typeKeys.length > 0) {
      res1 = await deleteType(typeKeys.join('-'));
      if (!checkResponse(res1)) {
        Modal.error({
          title: '删除失败',
        });
      }
    }
    if (articleKeys.length > 0) {
      res2 = await deleteArticleBatch(articleKeys.join('-'));
      if (!checkResponse(res2)) {
        Modal.error({
          title: '删除失败',
        });
      }
    }
    Modal.success({
      title: '删除成功',
    });
    setChecked(false);
    setAction(!action);
  };

  /**
   * 将选中的文章均设为私密 TODO
   */
  const secret = () => {};

  /**
   * 选中文档树节点时下方出现的操作框，目前只完成了删除功能
   */
  const TypeOperationGroup = () => {
    return (
      <div style={{ visibility: checked ? 'visible' : 'hidden' }}>
        <Button
          className="btn"
          onClick={() => {
            Modal.confirm({
              title: '你确定要删除吗，删除类型后，类型下的文件也将被删除，且无法恢复',
              okText: '确定',
              cancelText: '取消',
              onOk: () => {
                deleteItem();
              },
            });
          }}
        >
          删除
        </Button>
        {/* </Popconfirm> */}
        <Button onClick={secret}>加密</Button>
      </div>
    );
  };

  return (
    <>
      <Tree
        className="doc-tree"
        treeData={articleStore.treeData}
        blockNode
        showIcon
        showLine
        checkable
        onCheck={checkHandle}
        checkStrictly
        switcherIcon={null}
      />
      <TypeOperationGroup />
    </>
  );
}

export default observer(Edit);
