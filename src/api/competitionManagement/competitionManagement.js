import request from '@/utils/request'

export function getCompetitionList(token, search, page, size){
    return request({
        url: '/teacher/competitionManagement/getAllCompetition',
        method: 'post',
        data: {
            'search': search,
            'token': token, 
            'page': page-1,
            'size': size
        }
    })
}

export function getClassifyList(){
    return request({
        url: '/teacher/getClassifyList/getClassifyList',
        method: 'post',
    })
}

export function getItemListeacherIdt(fatherIdForItem){
    return request({
        url: '/teacher/getteacherIdItemList/getItemList',
        method: 'post',
    })
}

export function addCompetition(classifyId, itemId, token, name){
    return request({
        url: '/teacher/addCompetition/addCompetition',
        method: 'post',
        data: {
            'classifyId': classifyId,
            'itemId': itemId,
            'token': token,
            'name': name,

        }
    })
}