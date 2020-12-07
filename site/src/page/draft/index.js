import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useArticleStore } from '@hooks/useStore'
import { formatDate } from '@util/date'
import './index.less'

function Draft() {
    const articleStore = useArticleStore();
    const [draftList, setDraftList] = useState([]);

    useEffect(async ()=>{
        const res = await articleStore.getDraftList();
        if(res) {
            setDraftList(res);
        }
    }, [])

    return (
        <div className="draft-list card-wrapper">
            <p className="card-title">草稿箱（{draftList.length}）</p>
            {draftList.map(item =>
                <div className="list-item" key={item.id}>
                    <a className="item-title">{item.title}</a>
                    <div className="item-oper">
                        <span className="oper-preview">预览 </span> |
                        <span className="oper-delete"> 删除</span>
                    </div>
                    <div>{formatDate(item.time)}</div>
                </div>
            )}
        </div>
    )
}

export default observer(Draft);