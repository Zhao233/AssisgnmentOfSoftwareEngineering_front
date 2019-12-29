import request from '@/utils/request'

export function getTeacherList(search, page, size){
    return request({
        url: '/admin/getTeacherList',
        method: 'post',
        data: {
            'search': search,
            'page': page-1,
            'size': size
        }
    })
}