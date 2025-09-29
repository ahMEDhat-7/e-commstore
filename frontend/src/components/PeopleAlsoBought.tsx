import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const PeopleAlsoBought = () => {
  const { recommended, loading } = useSelector(
    (state: RootState) => state.product
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommended.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
