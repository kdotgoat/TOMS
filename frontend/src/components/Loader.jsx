import { LoaderCircle } from "lucide-react"
import clsx from "clsx"

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
}

const Loader = ({ size = "md", className }) => {
  return (
    <LoaderCircle
      className={clsx(
        "animate-spin",
        sizeMap[size],
        className
      )}
    />
  )
}

export default Loader