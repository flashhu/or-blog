import { Input, Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory } from "react-router-dom";
import './index.less'

function TopBar() {
    let history = useHistory();

    const goBack = () =>{
        history.goBack()
    }

    return (
        <div className="top-bar">
            <LeftOutlined className="icon-back" onClick={goBack}/>
            <Input className="edit-title" placeholder="请输入文章标题..." />
            <div className="right-box">
                <div className="article-status">
                    已保存至
                    <Button className="btn-draft" type="default">草稿箱</Button>
                </div>
                <Button className="btn-upload">一键上传</Button>
                <Button className="btn-submit" type="primary">发布文章</Button>
            </div>
        </div>
    )
}

export default TopBar;