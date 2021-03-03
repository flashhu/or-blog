import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Select, Tooltip, Radio, Input, AutoComplete, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTagList } from '@api/tag';
import { postArticle } from '@api/article';
import { getTypeListByPid } from '@api/type';
import { checkResponse } from '@util/request';
import { usePrevious } from '@hooks/usePrevious';
import './index.less';

const { Option } = Select;

const tip = {
  tag: '结合文章内容添加关键词作为标签,有利于日后检索哦~',
  pwd: '设置后无需登录，答对密码即可查看文章',
  type: '用于组织文档树，层级最大为三层，根据你习惯的分类方式定义吧~',
};

// 用于设置 AutoComplete 的 placeholder
const acPlaceHolder = ['一级类别', '二级类别', '三级类别'];
// 用于表示待处理类别, 对应 L162 表述情况
const prefixTag = '- [ ]';

const checkTypeId = (val) => {
  return val && typeof (val) === 'object';
};

const getExistedLevel = (value) => {
  // 取最小层级，用于后端判断 pid => level为0，表示三层都是新建
  // 当值为对象{id, name}时，表示为新建层级
  const types = [0, ...value];
  const level = checkTypeId(value[2]) ? 3 : checkTypeId(value[1]) ? 2 : checkTypeId(value[0]) ? 1 : 0;
  const pid = types[level].id || 0;
  const child = types.filter((item, index) => (index > level) && item);
  return { pid, level: level + 1, child };
};

// 将数据加 value 以符合组件 AutoComplete 要求
const formatAcOption = (data) => {
  return data.map((v) => {
    v.value = v.name;
    return v;
  });
};

const OptionTitle = ({ title, tipMsg }) => (
  <p>
    {title}
    {
      tipMsg &&
      <Tooltip placement="bottom" title={tipMsg}>
        <QuestionCircleOutlined className="option-icon" />
      </Tooltip>
    }
  </p>
);

function PostArticleModal({ defaultTags, defaultTypes }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 文章状态 => 0：草稿；1：私密发布；2：公开发布（包含带密码发布）
  const [status, setStatus] = useState(2);
  const [secretKey, setSecretKey] = useState('');
  // type => 如为{id, name}, 表示选中已有项；如为字符串，表示新类
  const [types, setTypes] = useState(new Array(3).fill(''));
  const [tags, setTags] = useState([]);
  // 存放下拉框数据
  const [typeOptions, setTypeOptions] = useState(new Array(3).fill([]));
  const [tagOptions, setTagOptions] = useState([]);
  const history = useHistory();
  const prevTypes = usePrevious(types);

  useEffect(() => {
    (async () => {
      // 获取可选标签列表
      const tagRes = await getTagList();
      if (checkResponse(tagRes)) {
        setTagOptions(tagRes.data);
      }
      // 获取可取一级类别列表
      const ftRes = await getTypeListByPid(0);
      if (checkResponse(ftRes)) {
        const tmp = formatAcOption(ftRes.data);
        setTypeOptions(typeOptions.map((item, index) => (index === 0 ? tmp : item)));
      }
    })();
  }, []);

  useEffect(() => {
    if (defaultTags.length) {
      // 自动填入已选标签，设为默认选中项
      setTags(defaultTags);
    }
  }, [defaultTags]);

  useEffect(() => {
    (async () => {
      if (defaultTypes.length) {
        // 自动填入已选类别
        const newTypes = types.map((item, index) => {
          return defaultTypes.length > index ? defaultTypes[index] : item;
        });
        setTypes(newTypes);
      }
    })();
  }, [defaultTypes]);

  useEffect(() => {
    (async () => {
      // 使用 Promise.all 所以此时是错位的，如第一位放的为获取到的第二列表的选项
      const newTypeOptions = await Promise.all(types.map(async (item, i) => {
        if (i < 2 && (!prevTypes || prevTypes[i] !== item)) {
          if (typeof types[i] === 'object') {
            // 1. 变为已有某一选项
            const res = await getTypeListByPid(types[i].id);
            if (checkResponse(res)) {
              return formatAcOption(res.data);
            }
          } else {
            // 2. 变为新建项，清空后续
            return [];
          }
        }
        // 3. 未改变，保留原有选项
        return typeOptions[i + 1];
      }));
      newTypeOptions.unshift(typeOptions[0]);
      newTypeOptions.pop();
      setTypeOptions(newTypeOptions);
    })();
  }, [types]);

  const handleOk = async () => {
    // 1. 校验输入, 如为密码保护形式，密码必填
    if (status === 3 && secretKey.length < 4) {
      message.error('密码保护模式下，文章密码至少4位！');
    }
    // 2. 组织请求数据格式 => status 2：公开发布（包含带密码发布）
    const { pathname } = history.location;
    const articleId = pathname.slice(pathname.lastIndexOf('/') + 1);
    const data = {
      id: articleId,
      status: status === 3 ? 2 : status,
      secretKey: status === 3 ? secretKey : '',
      tag: tags,
      type: getExistedLevel(types),
    };
    const res = await postArticle(data);
    if (checkResponse(res)) {
      message.success('发布成功');
      history.push('/');
    }
    setIsModalVisible(false);
  };

  // 三个 AutoComplete 组件共用 level 区分对应哪一层级 0 => 一级类别
  const onChangeType = (level, data) => {
    // key 和 value 都需要唯一：https://github.com/ant-design/ant-design/issues/12334
    let selectItem = null;
    for (let i = 0; i < typeOptions[level].length; i++) {
      if (typeOptions[level][i].value === data) {
        selectItem = { name: data, id: typeOptions[level][i].id };
        break;
      }
    }
    let newTypes = [];
    if (level < 2 && selectItem) {
      // 1. 选中已有类别, 之后层级的值清空
      newTypes = types.map((item, index) => (index === level ? selectItem : index < level ? item : ''));
    } else if (level < 2) {
      // 2. 新增类别时，清空后续层级中已选中类别
      newTypes = types.map((item, index) => (index === level ? data : index < level ? item : ''));
    } else {
      // 3. 最后一层级类别
      newTypes = types.map((item, index) => (index === level ? selectItem || data : item));
    }
    setTypes(newTypes);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => { setIsModalVisible(true); }}
      >
        发布文章
      </Button>
      <Modal
        title="发布文章"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => { setIsModalVisible(false); }}
      >
        <div className="edit-post-modal">
          <div className="post-option">
            <OptionTitle title="发布形式" />
            <Radio.Group
              className="option-input"
              onChange={(e) => { setStatus(e.target.value); }}
              value={status}
            >
              <Radio value={2}>公开可见</Radio>
              <Radio value={3}>密码保护</Radio>
              <Radio value={1}>仅自己可见</Radio>
            </Radio.Group>
          </div>
          {status === 3 &&
          <div className="post-option">
            <OptionTitle title="文章密码" tipMsg={tip.pwd} />
            <Input.Password
              className="option-input"
              onChange={(e) => { setSecretKey(e.target.value); }}
              value={secretKey}
            />
          </div>}
          <div className="post-option">
            <OptionTitle title="文章标签" tipMsg={tip.tag} />
            <Select
              mode="tags"
              className="option-input"
              placeholder="回车，新建标签"
              defaultValue={defaultTags}
              onChange={(value) => { setTags(value); }}
            >
              {tagOptions.map((v) =>
                (<Option key={v.id}>
                  {v.name}
                 </Option>))}
            </Select>
          </div>
          <div className="post-option">
            <OptionTitle title="所属类别" tipMsg={tip.type} />
            <div className="option-input">
              {typeOptions.map((item, index) =>
                (<AutoComplete
                  className="option-input-type"
                  value={typeof types[index] === 'object' ? types[index].name : types[index]}
                  key={acPlaceHolder[index]}
                  options={item}
                  placeholder={acPlaceHolder[index]}
                  disabled={!index || types[index - 1] || defaultTypes.length > index + 1 ? '' : '0'}
                  onChange={(val) => onChangeType(index, val)}
                  defaultValue={defaultTypes.length > index ? defaultTypes[index].name : ''}
                  filterOption={(inputValue, option) =>
                    option.length && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PostArticleModal;
