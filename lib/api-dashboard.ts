import api from "@/lib/api"

export const getPrincipalStats = async () => {
    const response = await api.get("/dashboard/principal")
    return response.data
}
