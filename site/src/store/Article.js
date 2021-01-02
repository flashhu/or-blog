import { makeAutoObservable, runInAction } from 'mobx'
import { message } from 'antd'
import { get, post } from '@util/request'
import { 
    API_ARTICLE_SAVE, 
    API_DRAFT_LIST, 
    API_ARTICLE_DETAIL, 
    API_ARTICLE_DELETE 
} from '@constant/urls'

class ArticleStore {
    constructor() {
        makeAutoObservable(this)
    }

    async save(id, params) {
        return await post(API_ARTICLE_SAVE, id === 'new' ? params: {id, ...params});
    }

    async getDraftList() {
        return await get(API_DRAFT_LIST);
    }

    async getArticleDetail(id) {
        return await get(`${API_ARTICLE_DETAIL}${id}`);
    }

    async deleteArticle(id) {
        return await get(`${API_ARTICLE_DELETE}${id}`);
    }
}

export default new ArticleStore()