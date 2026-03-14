import { Input } from "../ui/input";

const Mearsurements = ({ selectedItem }) => {
  return (
    <div className="my-3">
      <h3 className="text-lg">Mearsurements</h3>

      {/* ===== trouser ===== */}
      {selectedItem === "trouser" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Fly:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Hips:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Knee Length:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Knee Round:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Bottom:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Length:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">waist:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between items-center gap-2 px-2 border rounded-md">
            <p className="flex-7">Thighs:</p>
            <Input
              className="flex-3 border-none shadow-none focus-visible:border-none focus-visible:ring-0"
              type="number"
              placeholder="0"
            />
          </div>
        </div>
      )}

      {/* ===== shirt ===== */}
      {selectedItem === "shirt" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Input type="number" placeholder="Shoulder" />
          <Input type="number" placeholder="Chest" />
          <Input type="number" placeholder="Waist" />
          <Input type="number" placeholder="Hips" />
          <Input type="number" placeholder="Sleeves" />
          <Input type="number" placeholder="Length" />
        </div>
      )}

      {/* ===== coat ===== */}
      {selectedItem === "coat" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Input type="number" placeholder="Shoulder" />
          <Input type="number" placeholder="Chest" />
          <Input type="number" placeholder="Waist" />
          <Input type="number" placeholder="Hips" />
          <Input type="number" placeholder="Sleeves" />
          <Input type="number" placeholder="Length" />
        </div>
      )}

      {/* ===== dress ===== */}
      {selectedItem === "dress" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Input type="number" placeholder="Shoulder" />
          <Input type="number" placeholder="Burst" />
          <Input type="number" placeholder="Bodies" />
          <Input type="number" placeholder="Breast" />
          <Input type="number" placeholder="Waist" />
          <Input type="number" placeholder="Hips" />
          <Input type="number" placeholder="Sleeves" />
          <Input type="number" placeholder="Length" />
          <Input type="number" placeholder="Ampex" />
          <Input type="number" placeholder="Empire" />
          <Input type="number" placeholder="Knee Round" />
          <Input type="number" placeholder="Knee Length" />
          <Input type="number" placeholder="Hip Line" />
        </div>
      )}

      {/* ===== skirt ===== */}
      {selectedItem === "skirt" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Input type="number" placeholder="Waist" />
          <Input type="number" placeholder="Hips" />
          <Input type="number" placeholder="Length" />
        </div>
      )}
    </div>
  );
};

export default Mearsurements;
