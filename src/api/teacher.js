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

export function deleteTeacher(id_list){
    return request({
        url: '/admin/deleteTeachers',
        method: 'post',
        data: {
            'ids': id_list
        }
            
    })

    return request({
        url: '/admin/deleteTeachers',
        methos: 'post',
        data: {
            'id_list': 'id_list'
        }
    })
}