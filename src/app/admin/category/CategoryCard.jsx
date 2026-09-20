import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm line-clamp-2">
                {category.name || category.category_name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {category.slug || category.category_name}
              </p>
            </div>
            <div className="flex flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500"
                onClick={() => onDelete(category.category_id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Singkatan / Slug:</span>
              <p className="font-mono font-medium truncate">
                {category.slug || category.category_name || "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="font-medium">{category.status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Organizer:</span>
              <p className="font-medium truncate">
                {category.organizer || "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Karya Sementara:</span>
              <p className="font-medium">
                {category.preliminary_deadline
                  ? format(new Date(category.preliminary_deadline), "dd MMM yyyy HH:mm")
                  : category.deadline
                    ? format(new Date(category.deadline), "dd MMM yyyy")
                    : "-"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Karya Final:</span>
              <p className="font-medium">
                {category.final_deadline
                  ? format(new Date(category.final_deadline), "dd MMM yyyy HH:mm")
                  : category.deadline
                    ? format(new Date(category.deadline), "dd MMM yyyy")
                    : "-"}
              </p>
            </div>
          </div>
          {category.description && (
            <div className="text-xs">
              <span className="text-muted-foreground">Deskripsi:</span>
              <p className="line-clamp-2">{category.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}