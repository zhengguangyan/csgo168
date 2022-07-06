import originAxios from 'axios'
import { Message } from 'element-ui'

const baseURL = process.env.VUE_APP_BASE_URL
export default function axios(option) {
	return new Promise((resolve, reject) => {
		const instance = originAxios.create({
			baseURL: baseURL,
			timeout: 10000
		});	
		//拦截
		instance.interceptors.request.use(config => {
			sessionStorage.getItem('token') && (config.headers.Authorization = sessionStorage.getItem('token'))
			return config
		}, err => {
			return err
		})
		// 接口错误拦截
		instance.interceptors.response.use(res => {
			res.status != 200 && (res.data = { code: 0, message: '网络错误' })
			
			if (res.data.code == 200){
				return res
			}
			else if (res.data.code == 401){
			}
			else{
				Message({
				  message:res.data.message,
				  type:'error'
				})
			}
			return Promise.reject(res)

		})

		//传入对象进行网络请求
		instance(option).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}


export function Axios(option) {
	return new Promise((resolve, reject) => {
		const instance = originAxios.create({
			baseURL: baseURL,
			timeout: 10000
		});

		//拦截
		instance.interceptors.request.use(config => {
			sessionStorage.getItem('token') && (config.headers.Authorization = sessionStorage.getItem('token'))
			return config
		}, err => {
			return err
		})

		// 接口错误拦截
		instance.interceptors.response.use(res => {
			res.status != 200 && (res.data = { code: 0, message: '网络错误' })
			if (res.data.code == 200)
				return res.data.data
			else
				return Promise.reject(res.data)
		})

		//传入对象进行网络请求
		instance(option).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}