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

export function updateTeacher(teacher){
    return request({
        url: '/admin/updateTeacher',
        method: 'post',
        data: {
            'id': teacher.id,
            'name': teacher.name,
            'email': teacher.email,
            'phone': teacher.phone
        }
            
    })
}