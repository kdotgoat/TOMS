import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterDropdown = ({ title, field, items, onSelect }) => {
  return (
    <div className="grid items-center gap-1 py-3 border-t border-primary-20 ">
        <p>{title}</p>
      <Select onValueChange={(value) => onSelect(field, value)}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => (
              <SelectItem
                className="text-left" 
                key={index} 
                value={item.value}
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterDropdown;
