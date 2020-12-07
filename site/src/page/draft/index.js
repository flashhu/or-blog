import './index.less'

function Draft() {
    return (
        <div className="draft-list card-wrapper">
            <p className="card-title">草稿箱（10）</p>
            <div className="list-item">
                <a className="item-title">这个标题超级长</a>
                <div className="item-oper">
                    <span className="oper-preview">预览 </span> | 
                    <span className="oper-delete"> 删除</span>
                </div>
                <div>2020 年 12 月 7 日 19:26</div>
            </div>
        </div>
    )
}

export default Draft;