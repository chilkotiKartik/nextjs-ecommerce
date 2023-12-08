"use client";

import Gallery from "@/components/gallery/gallery";
import Info from "@/components/gallery/info";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import { type Product } from "@/types";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const ProductItem = () => {
  const { productId } = useParams();

  const [productQuery, relatedQuery] = useQueries({
    queries: [
      {
        queryKey: ["single product"],
        queryFn: async () =>
          await axios.get(`/api/product/${productId}`).then((res) => res.data),
      },
      {
        queryKey: ["related products"],
        queryFn: async () => {
          const response = await axios.get("/api/product/");
          return response.data;
        },
      },
    ],
  });

  if (productQuery.isLoading || relatedQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (productQuery.error || relatedQuery.error) {
    return <div>Something went wrong!</div>;
  }

  const filteredData: Product[] = relatedQuery?.data?.filter(
    (item: Product) => item.category === productQuery?.data?.category
  );

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={productQuery.data?.imageURLs} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={productQuery?.data} />
            </div>
          </div>
          <hr className="my-10" />
          <div className="space-y-4">
            <h3 className="font-semibold text-3xl">Recommended</h3>
            <div className="grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 lg:gird-cols-4 gap-4">
              {filteredData?.map((item: Product) => {
                return <ProductCard key={item.id} data={item} />;
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductItem;
