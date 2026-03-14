import * as orderService from "@/services/orderService"
import { useOrderStore } from "@/zustand/ordersStore"

export const useSearchOrder = () => {
    const {setLoading, setOrders, clearOrders, clearPagination, setPagination} = useOrderStore()

    const searchOrders = async(query) => {
        setLoading(true)
        clearOrders()
        clearPagination()
        try{
            const res = await orderService.searchOrders(query)
            if(res.orders) setOrders(res.orders)
            if(res.pagination) setPagination(res.pagination)
        } catch(error) {
            const message = error.response?.data?.message || error.message
            return { error: message }
        } finally {
            setLoading(false)
        }
    }

    return {searchOrders}
}