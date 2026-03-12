import { useEffect, useState } from "react";
import api from "../api/api";

function Foods() {
  const [foods, setFoods] = useState([]);

  const loadFoods = async () => {
    const res = await api.get("/foods");
    setFoods(res.data);
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Foods</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {foods.map((food: any) => (
          <div key={food._id} className="border p-4 rounded">
            <img
              src={`http://localhost:5000/uploads/${food.foodImage}`}
              className="h-40 w-full object-cover"
            />
            <h2 className="font-bold">{food.foodName}</h2>
            <p>{food.foodPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Foods;