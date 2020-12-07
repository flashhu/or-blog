import { makeAutoObservable, runInAction } from 'mobx'
import { message } from 'antd'
import { post } from '@util/request'
import { API_ARTICLE_SAVE } from '@constant/urls'

class ArticleStore {
    constructor() {
        makeAutoObservable(this)
    }

    async save(id, params) {
        return await post(API_ARTICLE_SAVE, id === 'new' ? params: {id, ...params});
    }
}

export default new ArticleStore()