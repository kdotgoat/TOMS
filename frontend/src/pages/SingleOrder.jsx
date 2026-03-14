import OrderInfo from "@/components/singleOrder/OrderInfo"
import OrderItems from "@/components/singleOrder/OrderItems"

const SingleOrder = () => {
  return (
    <div className="grid gap-7">
        <OrderInfo />
        <OrderItems />
    </div>
  )
}

export default SingleOrder