import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Input, Button, message } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory, useParams } from "react-router-dom"
import MarkdownIt from 'markdown-it'
import Editor from 'react-markdown-editor-lite'
import { debounce } from 'lodash'
import { useArticleStore } from '@hooks/useStore'
import 'react-markdown-editor-lite/lib/index.css'
import './index.less'

// markdown to html转换器
const mdParser = new MarkdownIt();

function Edit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const articleStore = useArticleStore();
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      if (id !== 'new') {
        const res = await articleStore.getArticleDetail(id);
        console.log(res);
        setTitle(res.title)
        setContent({
          html: res.html,
          text: res.text
        })
      }
    })();
  }, [])

  useEffect(() => {
    if (content || title) {
      debounceAutoSave();
    }
    return debounceAutoSave.cancel;
  }, [content, title])

  const goBack = () => {
    history.goBack()
  }

  const goToDraft = () => {
    history.push('/draft')
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value || '');
  }

  const handleEditorChange = ({ html, text }) => {
    setContent({
      html,
      text
    });
  }

  const autoSave = async () =>{
    if (!(content || title)) return
    const data = {
      title: title || '无标题',
      text: content ? content.text : '',
      html: content ? content.html : ''
    }
    setLoading(true);
    const res = await articleStore.save(id, data);
    if(res && res.id) {
      // 首次编辑，获取到 id 后变路由
      history.push(`/edit/${res.id}`)
    }
    message.success('已保存至草稿箱');
    setLoading(false);
    console.log('autosave', res);
  }

  const debounceAutoSave = debounce(autoSave, 3000);

  return (
    <div className="edit">
      <div className="top-bar">
        <LeftOutlined className="icon-back" onClick={goBack} />
        <Input value={title} onChange={handleTitleChange} className="edit-title" placeholder="请输入文章标题..." />
        <div className="right-box">
          <div className="article-status">
            {loading ? '正保存到':'已保存至'}
            <Button className="btn-draft" type="default" onClick={goToDraft}>草稿箱</Button>
          </div>
          <Button className="btn-upload">一键上传</Button>
          <Button className="btn-submit" type="primary">发布文章</Button>
        </div>
      </div>
      <Editor
        value={content ? content.text : ''}
        style={{ minWidth: '800px', height: 'calc(100vh - 55px)' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
    </div>
  )
}

export default observer(Edit);