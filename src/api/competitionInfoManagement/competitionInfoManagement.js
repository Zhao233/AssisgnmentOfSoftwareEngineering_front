import request from '@/utils/request'

/**
 * for teacher management
 */
export function getClassifyList(){
    return request({
        url: '/admin/competitionInfoManagement/getClassifyList',
        method: 'post',
    })
}

export function getCompetitionInfoList(search, page, size, type, fatherIdForItem){
    fatherIdForItem = fatherIdForItem == undefined ? -1 : fatherIdForItem

    return request({
        url: '/admin/competitionInfoManagement/getCompetitionInfoList',
        method: 'post',
        data: {
            'search': search,
            'page': page-1,
            'size': size,
            'type': type,
            'fatherIdForItem':fatherIdForItem
        }
    })
}

export function createCompetitionInfo(competitionInfo){
    return request({
        url: '/admin/competitionInfoManagement/createCompetitionInfo',
        method: 'post',
        data: {
            'type': competitionInfo.type,
            'name': competitionInfo.name,
            'score': competitionInfo.score,
            'fatherIdForItem': competitionInfo.fatherIdForItem
        }
    })
}

export function updateCompetitionInfo(competitionInfo){
    return request({
        url: '/admin/competitionInfoManagement/updateCompetitionInfo',
        method: 'post',
        data: {
            'id': competitionInfo.id,
            'type': competitionInfo.type,
            'fatherIdForItem': competitionInfo.fatherIdForItem,
            'name': competitionInfo.name,
            'score': competitionInfo.score
        }
    })
}

export function deleteCompetitionInfo(ids){
    return request({
        url: '/admin/competitionInfoManagement/deleteCompetitionInfo',
        method: 'post',
        data: {
            'ids': ids
        }
    })
}