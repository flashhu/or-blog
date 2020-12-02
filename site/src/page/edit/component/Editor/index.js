import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

function handleEditorChange({ html, text }) {
    // console.log('handleEditorChange', html, text)
}

function Editor() {
    return (
        <MdEditor
            style={{ width: '100%', height: 'calc(100vh - 55px)' }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
        />
    )
}

export default Editor