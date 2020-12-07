import { useState, useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { Input, Button, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory, useParams } from "react-router-dom"
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { debounce } from 'lodash'
import { useArticleStore } from '@hooks/useStore'
import 'react-markdown-editor-lite/lib/index.css'
import './index.less'

// markdown to html转换器
const mdParser = new MarkdownIt();

function Edit() {
  const title = useRef(null);
  const [contentInHtml, setContentInHtml] = useState('');
  const [contentInText, setContentInText] = useState('');
  const [loading, setLoading] = useState(false);
  const articleStore = useArticleStore();
  const history = useHistory();
  const { id } = useParams();

  const goBack = () => {
    history.goBack()
  }

  const goToDraft = () => {
    history.push('/draft')
  }

  const handleEditorChange = ({ html, text }) => {
    setContentInHtml(html);
    setContentInText(text);
  }

  const autoSave = async () =>{
    if(!contentInText) return
    const data = {
      title: title.current.state.value || '无标题',
      text: contentInText,
      html: contentInHtml
    }
    setLoading(true);
    const res = await articleStore.save(id, data);
    if(res.id) {
      history.push(`/edit/${res.id}`)
    }
    message.success('已保存至草稿箱');
    setLoading(false);
    console.log('autosave', res);
  }

  const debounceAutoSave = debounce(autoSave, 3000);

  useEffect(()=>{
    debounceAutoSave();
    return debounceAutoSave.cancel;
  }, [contentInText])

  return (
    <div className="edit">
      <div className="top-bar">
        <LeftOutlined className="icon-back" onClick={goBack} />
        <Input ref={title} className="edit-title" placeholder="请输入文章标题..." />
        <div className="right-box">
          <div className="article-status">
            {loading ? '正保存到':'已保存至'}
            <Button className="btn-draft" type="default" onClick={goToDraft}>草稿箱</Button>
          </div>
          <Button className="btn-upload">一键上传</Button>
          <Button className="btn-submit" type="primary">发布文章</Button>
        </div>
      </div>
      <MdEditor
        style={{ minWidth: '800px', height: 'calc(100vh - 55px)' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
    </div>
  )
}

export default observer(Edit);