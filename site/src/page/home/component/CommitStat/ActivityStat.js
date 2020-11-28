import { RiseOutlined, RedoOutlined, BulbOutlined } from '@ant-design/icons'

function ActivityStat() {
    const mockData = [{
        name: '文章标题占位1'
    }, {
        name: '文章标题占位长度长度长度长度长度长度长度测试'
    }]

    return (
        <div className="state-activity">
            <p className="state-title">
                <RedoOutlined className="state-icon" />最近更新
            </p>
            <ul>
                {mockData.map((item, index) =>
                    <li key={index + '1'} className="state-item">
                        <a className="hvr-underline">{item.name}</a>
                    </li>
                )}
            </ul>
            <p className="state-title">
                <RiseOutlined className="state-icon" />最常使用
                </p>
            <ul>
                {mockData.map((item, index) =>
                    <li key={index + '2'} className="state-item">
                        <a className="hvr-underline">{item.name}</a>
                    </li>
                )}
            </ul>
            <p className="state-title">
                <BulbOutlined className="state-icon" />共发布 15 篇文章
            </p>
        </div>
    )
}

export default ActivityStat;