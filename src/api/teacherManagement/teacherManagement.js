import request from '@/utils/request'

/**
 * for teacher management
 */
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