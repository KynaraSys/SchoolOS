import api from "@/lib/api"

export async function getAttendanceOverview() {
    try {
        const response = await api.get('/attendance/overview')
        return response.data
    } catch (error) {
        console.error('Failed to fetch attendance overview:', error)
        throw error
    }
}

export async function getClassAttendance(classId: string, date?: string) {
    try {
        const response = await api.get(`/attendance/class/${classId}`, {
            params: { date }
        })
        return response.data
    } catch (error) {
        console.error('Failed to fetch class attendance:', error)
        throw error
    }
}

export async function submitAttendance(classId: string, date: string, attendances: any[]) {
    try {
        const response = await api.post('/attendance', {
            class_id: classId,
            date,
            attendances
        })
        return response.data
    } catch (error) {
        console.error('Failed to submit attendance:', error)
        throw error
    }
}
