"use client";

import React from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Card sederhana untuk preview
function PreviewCard({ category }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-40 overflow-hidden">
        <img
          src={category.image || "/placeholder-image.jpg"}
          alt={category.category_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-md line-clamp-2">
          {category.title || category.category_name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function HomeCategoryPreview() {
  // Ambil hanya 3 kategori untuk ditampilkan di homepage
  const { data, isLoading } = useUserCategories({ limit: 3, page: 1, status: "VERIFIED" });

  const categories = data?.categories || [];

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Kategori Lomba Populer</h2>
        <p className="text-muted-foreground mt-2">Temukan tantangan yang paling sesuai untukmu.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Link key={category.category_id} href={`/category/${category.category_id}`}>
              <PreviewCard category={category} />
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/category">
          <Button size="lg">
            Lihat Semua Kategori
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}