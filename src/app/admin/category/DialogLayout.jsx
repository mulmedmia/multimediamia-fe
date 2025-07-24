import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogCreateCategory({ open, onOpenChange, children }) {
  return (
    <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto" open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah Kategori</DialogTitle>
      </DialogHeader>
      <div className="py-2">{children}</div>
    </DialogContent>
  );
}

export function DialogEditCategory({ open, onOpenChange, children }) {
  return (
    <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto" open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Kategori</DialogTitle>
      </DialogHeader>
      <div className="py-2">{children}</div>
    </DialogContent>
  );
}

export function DialogDeleteCategory({ open, onOpenChange, onDelete, isLoading }) {
  return (
    <DialogContent className="w-[95vw] max-w-md" open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Hapus Kategori</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-muted-foreground mb-4">
          Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <DialogFooter className="flex-col sm:flex-row pt-2 gap-2 sm:gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}