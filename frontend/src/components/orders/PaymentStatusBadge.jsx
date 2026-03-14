const PaymentStatusBadge = ({ totalPrice, totalPayments}) => {
  let status;
  let bgClass = "";
  let textClass = "";

  if (totalPayments === 0) {
    status = "Not Paid";
    bgClass = "bg-red-100";
    textClass = "text-red-900";
  } else if (totalPayments < totalPrice) {
    status = "Partial";
    bgClass = "bg-blue-100";
    textClass = "text-blue-900";
  } else {
    status = "Paid";
    bgClass = "bg-green-100";
    textClass = "text-green-900";
  }

  return (
    <div className={`px-2 py-1 rounded-md text-center ${bgClass} ${textClass}`}>
      {status}
    </div>
  );
};

export default PaymentStatusBadge
