import { useEffect, useState } from "react";
import api from "../api/api";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const load = async () => {
    const res = await api.get("/restaurants");
    setRestaurants(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Restaurants</h1>

      {restaurants.map((r: any) => (
        <div key={r._id} className="border p-4 mt-3">
          <h2>{r.restaurantName}</h2>
          <p>{r.address}</p>
        </div>
      ))}
    </div>
  );
}

export default Restaurants;