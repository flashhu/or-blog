import { useEffect, useState } from 'react'
// https://github.com/umijs/umi-request/issues/211
// 目前未导出
import AbortController from 'umi-request'
import { get, post } from '@util/request'

/**
 * 可取消请求的数据请求
 * @param {*} type get / post
 * @param {*} url 
 * @param {*} params 
 */
export function useRequest(type, url, params) {
    const controller = new AbortController(); // 创建一个控制器
    const { signal } = controller; // 返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 DOM 请求。
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState();
    console.log(type, url, params);

    useEffect(() => {
        setLoading(true);
        switch (type) {
            case 'get':
                get(url, { ...params, signal })
                    .then((res) => setResult(res))
                    .finally(() => setLoading(false))
                break;
            case 'post':
                post(url, { ...params, signal })
                    .then((res) => setResult(res))
                    .finally(() => setLoading(false))
                break;
            default:
                setResult(null)
                setLoading(false)
                break;
        }
    }, [url, params])

    useEffect(() => {
        return () => controller.abort()
    }, [])

    return [ result, loading ]
}