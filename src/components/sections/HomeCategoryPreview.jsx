"use client";

import React from "react";
import { useUserCategories } from "@/hooks/user-use-category";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, User } from "lucide-react";
import Link from "next/link";

function PreviewCard({ category }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-red-600 dark:hover:border-red-400 py-0">
      <div className="relative h-40 overflow-hidden">
        <img
          src={category.image || "/placeholder-image.jpg"}
          alt={category.category_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {category.title || category.category_name}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {category.category_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{category.organizer}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Deadline:{" "}
            {new Date(category.deadline).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground pb-2">
          <Users className="h-4 w-4" />
          <span>{category.team_type === "GROUP" ? "Tim" : "Individu"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomeCategoryPreview() {
  const { data, isLoading } = useUserCategories({
    limit: 3,
    page: 1,
    status: "VERIFIED",
  });
  const categories = data?.categories || [];

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-700 dark:text-red-400">
          Kategori Lomba Populer
        </h2>
        <p className="text-muted-foreground mt-2">
          Temukan tantangan yang paling sesuai untukmu.
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              href={`/category/${category.category_id}`}
              className="block group"
            >
              <PreviewCard category={category} />
            </Link>
          ))}
        </div>
      )}
      <div className="text-center mt-10">
        <Link href="/category">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-700 dark:to-black hover:from-red-700 hover:to-red-800 dark:hover:to-gray-900 shadow-lg text-white px-8 py-3 text-lg rounded-lg"
          >
            Lihat Semua Kategori
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
