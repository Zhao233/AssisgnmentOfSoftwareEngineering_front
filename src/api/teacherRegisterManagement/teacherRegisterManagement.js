import request from '@/utils/request'
/**
 * for teacher register management
 */
export function getNotAuthorizedTeacherList(search, page, size){
    return request({
        url: '/admin/teacherRegister/getAllNotAuthorizedTeacherList',
        method: 'post',
        data: {
            'search': search,
            'page': page-1,
            'size': size
        }
    })
}

export function agreeTeacherRegister(ids){
    return request({
        url: '/admin/teacherRegister/agreeTeacherRegister',
        method: 'post',
        data: {
            'ids': ids
        }
    })
}

export function refuseTeacherRegister(ids){
    return request({
        url: '/admin/teacherRegister/refuseTeacherRegister',
        method: 'post',
        data: {
            'ids': ids
        }
    })
}