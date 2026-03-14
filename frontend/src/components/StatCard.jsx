import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StatCard = ({title, quantity}) => {
  return (
    <Card className="py-3">
      <CardHeader>
        <CardTitle className=" text:lg md:text-xl font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl md:text-3xl font-bold">{quantity}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
