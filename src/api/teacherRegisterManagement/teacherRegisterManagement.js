import request from '@/utils/request'

export function getTeacherList(search, page, size){
    return request({
        url: '/admin/teacherManage/getTeacherList',
        method: 'post',
        data: {
            'search': search,
            'page': page-1,
            'size': size
        }
    })
}

export function updateTeacher(teacher){
    return request({
        url: '/admin/teacherManage/updateTeacher',
        method: 'post',
        data: {
            'id': teacher.id,
            'name': teacher.name,
            'email': teacher.email,
            'phone': teacher.phone
        }
            
    })
}

export function deleteTeacher(id_list){
    return request({
        url: '/admin/teacherManage/deleteTeachers',
        method: 'post',
        data: {
            'ids': id_list
        }  
    })
}

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