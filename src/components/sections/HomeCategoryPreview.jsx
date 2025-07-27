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
import { ArrowRight, Calendar, Users, User, Clock, Trophy } from "lucide-react";
import Link from "next/link";

function PreviewCard({ category }) {
  const isDeadlineSoon = () => {
    const deadline = new Date(category.deadline);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const getTeamTypeColor = () => {
    return category.team_type === "GROUP" 
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-gray-800 hover:-translate-y-1 relative flex flex-col">
      
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img
          src={category.image || "/placeholder-image.jpg"}
          alt={category.category_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category Badge on Image */}
        <div className="absolute bottom-2 left-2 z-20">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
            <Trophy className="h-2 w-2 mr-1" />
            {category.category_name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        {/* Title */}
        <div>
          <CardTitle className="text-sm font-bold line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300 mb-2">
            {category.title || category.category_name}
          </CardTitle>
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {category.description && category.description.length > 80
              ? category.description.slice(0, 80) + "..."
              : category.description}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-2">
          {/* Organizer */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{category.organizer}</p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDeadlineSoon() 
                ? "bg-red-100 dark:bg-red-900/30" 
                : "bg-green-100 dark:bg-green-900/30"
            }`}>
              <Calendar className={`h-3 w-3 ${
                isDeadlineSoon() 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-green-600 dark:text-green-400"
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold truncate ${
                isDeadlineSoon() 
                  ? "text-red-600 dark:text-red-400" 
                  : "text-gray-900 dark:text-gray-100"
              }`}>
                {new Date(category.deadline).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Team Type */}
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTeamTypeColor()}`}>
                {category.team_type === "GROUP" ? "Tim" : "Individu"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full group-hover:bg-red-50 group-hover:text-red-600 dark:group-hover:bg-red-900/20 dark:group-hover:text-red-400 transition-all duration-300 font-medium text-xs h-8"
          >
            Detail
            <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
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
    <section className="py-12">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-4">
            Kategori Lomba Populer
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Temukan tantangan yang paling sesuai untukmu dan raih prestasi terbaikmu
          </p>
          <div id="lomba" className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-700 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <div className="space-y-3 px-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
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
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/category">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl text-white px-8 py-3 text-base rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Lihat Semua Kategori
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}