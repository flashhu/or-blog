import { makeAutoObservable, runInAction } from 'mobx'
import { message } from 'antd'
import { get, post } from '@util/request'
import { API_ARTICLE_SAVE, API_DRAFT_LIST } from '@constant/urls'

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
}

export default new ArticleStore()