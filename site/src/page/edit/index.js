import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Input, Button, message } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { debounce } from 'lodash';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import { useArticleStore } from '@hooks/useStore';
import { formateJSDate } from '@util/date';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import './index.less';

hljs.registerLanguage('javascript', javascript);

// markdown to html转换器 (设置代码高亮)
const mdParser = new MarkdownIt({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(lang, str, true).value
          }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${ mdParser.utils.escapeHtml(str) }</code></pre>`;
  },
});

const QINIU_SERVER = 'http://upload.qiniup.com/putb64/-1';
const FILE_SERVER = 'http://file.flashhu.site/';

function Edit() {
  const titleInput = useRef();
  const contentEditor = useRef();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const articleStore = useArticleStore();
  const history = useHistory();
  const { id } = useParams();

  const debounceAutoSave = debounce(() => autoSave(content, title), 3000);

  useEffect(() => {
    (async () => {
      if (id !== 'new') {
        // 再编辑，填入原有内容
        const res = await articleStore.getArticleDetail(id);
        setTitle(res.title);
        setContent({
          html: res.html,
          text: res.text,
        });
        debounceAutoSave.cancel();
      }
      if (!articleStore.qiniuToken) {
        // 获取七牛上传 token
        await articleStore.getQiniuToken();
      }
    })();
    // 设置监听， ctrl + s 自动保存
    const editorDom = document.getElementById('md-editor');
    editorDom.addEventListener('keydown', handleKeyDown);

    return () => {
      editorDom.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (content || title) {
      debounceAutoSave();
    }
    return debounceAutoSave.cancel();
  }, [content, title, debounceAutoSave]);

  const handleKeyDown = (e) => {
    if (e.key.toLowerCase() === 's' && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      // 只捕获渲染时所用值，直接使用 state，传入的为初始值，故使用 ref 获取最新值
      const currTitle = titleInput.current.state.value;
      const currContent = {
        html: contentEditor.current.state.html,
        text: contentEditor.current.state.text,
      };
      autoSave(currContent, currTitle);
      debounceAutoSave.cancel();
    }
  };

  const goBack = () => {
    history.goBack();
  };

  const goToDraft = () => {
    history.push('/draft');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value || '');
  };

  const handleEditorChange = ({ html, text }) => {
    setContent({
      html,
      text,
    });
  };

  // 挂载时设置了监听，受函数组件特性影响，此处传参取值，非直接取 state
  const autoSave = async (currContent, curTitle) => {
    if (!(currContent || curTitle)) return;
    const data = {
      title: curTitle || '无标题',
      text: currContent ? currContent.text : '',
      html: currContent ? currContent.html : '',
    };
    setLoading(true);
    const res = await articleStore.save(id, data);
    if (res && res.id) {
      // 首次编辑，获取到 id 后变路由
      history.push(`/edit/${res.id}`);
    }
    if (res && !res.error_code) {
      message.success('已保存至草稿箱');
    }
    setLoading(false);
  };

  const urlSafeBase64Encode = (str) => {
    // https://developer.qiniu.com/kodo/1276/data-format
    return btoa(encodeURI(str)).replace(/\//g, '_').replace(/\+/g, '-');
  };

  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        const base64 = data.target.result.slice(data.target.result.indexOf(',') + 1);
        const fileName = `image/${formateJSDate(new Date())}`;
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          const res = JSON.parse(xhr.responseText);
          resolve(`${FILE_SERVER}${res.key}`);
          message.success('图片上传成功');
        });
        xhr.addEventListener('error', () => {
          resolve('');
          message.error('上传异常，请重试！');
        });
        xhr.open('POST', `${QINIU_SERVER}/key/${urlSafeBase64Encode(fileName)}`, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Authorization', `UpToken ${articleStore.qiniuToken}`);
        xhr.send(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="edit">
      <div className="top-bar">
        <LeftOutlined className="icon-back" onClick={goBack} />
        <Input ref={titleInput} value={title} onChange={handleTitleChange} className="edit-title" placeholder="请输入文章标题..." />
        <div className="right-box">
          <div className="article-status">
            {loading ? '正保存到' : '已保存至'}
            <Button className="btn-draft" type="default" onClick={goToDraft}>草稿箱</Button>
          </div>
          <Button className="btn-upload">一键上传</Button>
          <Button className="btn-submit" type="primary">发布文章</Button>
        </div>
      </div>
      <MdEditor
        id="md-editor"
        ref={contentEditor}
        value={content ? content.text : ''}
        style={{ minWidth: '800px', height: 'calc(100vh - 55px)' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}

export default observer(Edit);
