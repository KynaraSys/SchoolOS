import api from "@/lib/api"

export interface RetentionJob {
    id: number
    name: string
    target: string
    action: string
    schedule: string
    status: string
    last_run_at: string | null
    last_run_status: string | null
    is_dry_run: boolean
    rules: any[]
}

export interface RetentionLog {
    id: number
    retention_job_id: number
    action: string
    records_affected: number
    is_dry_run: boolean
    initiated_by: string
    status: string
    created_at: string
    job?: RetentionJob
}

export const retentionApi = {
    getJobs: async () => {
        const response = await api.get<RetentionJob[]>('/retention/jobs')
        return response.data
    },

    createJob: async (data: any) => {
        const response = await api.post('/retention/jobs', data)
        return response.data
    },

    runJob: async (id: number, dryRun: boolean) => {
        const response = await api.post(`/retention/jobs/${id}/run`, { dry_run: dryRun })
        return response.data
    },

    deleteJob: async (id: number) => {
        await api.delete(`/retention/jobs/${id}`)
    },

    getLogs: async () => {
        const response = await api.get<RetentionLog[]>('/retention/logs')
        return response.data
    },

    getStats: async () => {
        const response = await api.get('/retention/stats')
        return response.data
    }
}
