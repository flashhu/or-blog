import { makeAutoObservable } from 'mobx';
import { getArticleListPublic, getArticleListAll } from '@api/article';
import { getTypeList } from '@api/type';


class ArticleStore {
  constructor() {
    makeAutoObservable(this);
  }

  qiniuToken = '';

  updateQiniuToken(token) {
    this.qiniuToken = token;
  }

  typeList = [];
  articleList = [];
  treeData = [];

  async loadTreeData(status = false){
    const typeData = await getTypeList();
    let articleData;
    if(status){
      articleData = await getArticleListAll();
    }else{
      articleData = await getArticleListPublic();
    }
    this.typeList = typeData ? typeData.data : null;
    this.articleList = articleData ? articleData.data : null;
  }

  setTreeData(treeData){
    this.treeData = treeData
  }
}

export default new ArticleStore();
