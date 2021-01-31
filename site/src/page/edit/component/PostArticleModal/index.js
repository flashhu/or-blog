import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Select, Tooltip, Radio, Input, AutoComplete, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getTagList } from '@api/tag';
import { postArticle } from '@api/article';
import { getTypeListByPid } from '@api/type';
import { checkResponse } from '@util/request';
import './index.less';

const { Option } = Select;

const tip = {
  tag: '结合文章内容添加关键词作为标签,有利于日后检索哦~',
  pwd: '设置后无需登录，答对密码即可查看文章',
  type: '用于组织文档树，层级最大为三层，根据你习惯的分类方式定义吧~',
};

const checkTypeId = (val) => {
  return val && typeof (val) === 'number';
};

const getExistedLevel = (first, second, third) => {
  // 取最小层级，用于后端判断 pid => level为0，表示三层都是新建
  // 当值为字符串时，表示为新建层级
  const types = [0, first, second, third];
  const level = checkTypeId(third) ? 3 : checkTypeId(second) ? 2 : checkTypeId(first) ? 1 : 0;
  const pid = types[level];
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

function PostArticleModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 文章状态 => 0：草稿；1：私密发布；2：公开发布（包含带密码发布）
  const [status, setStatus] = useState(2);
  const [secretKey, setSecretKey] = useState('');
  // type => 如为数字，表示选中已有项 id；字符串表示新类
  const [firstType, setFirstType] = useState('');
  const [secondType, setSecondType] = useState('');
  const [thirdType, setThirdType] = useState('');
  const [tags, setTags] = useState([]);
  // 存放下拉框数据
  const [tagOptions, setTagOptions] = useState([]);
  const [firstTypeOptions, setFirstTypeOptions] = useState([]);
  const [secondTypeOptions, setSecondTypeOptions] = useState([]);
  const [thirdTypeOptions, setThirdTypeOptions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const tagRes = await getTagList();
      if (checkResponse(tagRes)) {
        setTagOptions(tagRes.data);
      }
      const ftRes = await getTypeListByPid(0);
      if (checkResponse(ftRes)) {
        const tmp = formatAcOption(ftRes.data);
        setFirstTypeOptions(tmp);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (typeof (firstType) === 'number') {
        const stRes = await getTypeListByPid(firstType);
        if (checkResponse(stRes)) {
          const tmp = formatAcOption(stRes.data);
          setSecondTypeOptions(tmp);
        }
      }
    })();
  }, [firstType]);

  useEffect(() => {
    (async () => {
      if (typeof (secondType) === 'number') {
        const ttRes = await getTypeListByPid(secondType);
        if (checkResponse(ttRes)) {
          const tmp = formatAcOption(ttRes.data);
          setThirdTypeOptions(tmp);
        }
      }
    })();
  }, [secondType]);

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
      type: getExistedLevel(firstType, secondType, thirdType),
    };
    const res = await postArticle(data);
    if (checkResponse(res)) {
      message.success('发布成功');
      history.push('/');
    }
    setIsModalVisible(false);
  };

  const onChangeType = (level, data) => {
    // https://github.com/ant-design/ant-design/issues/12334
    let selectItem = null;
    switch (level) {
      case 1:
        selectItem = firstTypeOptions.filter((v) => v.value === data);
        setFirstType(selectItem.length ? selectItem[0].id : data);
        break;
      case 2:
        selectItem = secondTypeOptions.filter((v) => v.value === data);
        setSecondType(selectItem.length ? selectItem[0].id : data);
        break;
      case 3:
        selectItem = thirdTypeOptions.filter((v) => v.value === data);
        setThirdType(selectItem.length ? selectItem[0].id : data);
        break;
      default:
        break;
    }
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
              <AutoComplete
                className="option-input-type"
                options={firstTypeOptions}
                placeholder="一级类别"
                onChange={(val) => onChangeType(1, val)}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
              <AutoComplete
                className="option-input-type"
                options={secondTypeOptions}
                placeholder="二级类别"
                disabled={firstType ? '' : '0'}
                onChange={(val) => onChangeType(2, val)}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
              <AutoComplete
                className="option-input-type"
                options={thirdTypeOptions}
                placeholder="三级类别"
                disabled={(firstType && secondType) ? '' : '0'}
                onChange={(val) => onChangeType(3, val)}
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PostArticleModal;
