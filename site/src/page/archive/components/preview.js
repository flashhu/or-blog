import React from 'react';
import { Link } from 'react-dom';
import { Tree } from 'antd';
import { observer } from 'mobx-react';
import { useArticleStore } from '@hooks/useStore';

function PreView() {
  const articleStore = useArticleStore();
  const selectHandle = (key, info) => {
    const target = info.node;
    // 如果选中了文章
    if (target.isLeaf) {
      // 跳转到文章详情页面
      const id = target.key.split('-')[1];
      window.location.href = `/#/article/${id}`;
    } 
  };
  return (
    <Tree
      className="doc-tree"
      treeData={articleStore.treeData}
      onSelect={selectHandle}
      blockNode
      showIcon
    />
  );
}

export default observer(PreView);
