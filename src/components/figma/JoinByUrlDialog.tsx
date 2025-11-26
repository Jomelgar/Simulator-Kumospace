import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface JoinByUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinByUrl: (spaceId: string) => void;
}

export function JoinByUrlDialog({
  open,
  onOpenChange,
  onJoinByUrl,
}: JoinByUrlDialogProps) {
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extraer el ID del espacio de la URL
    try {
      const urlObj = new URL(url);
      const spaceId = urlObj.searchParams.get("space");

      if (spaceId) {
        onJoinByUrl(spaceId);
        setUrl("");
        onOpenChange(false);
      } else {
        alert("URL inválida. Asegúrate de incluir el parámetro 'space'.");
      }
    } catch {
      // Si no es una URL completa, intentar extraer solo el ID
      const match = url.match(/space=([^&]+)/);
      if (match) {
        onJoinByUrl(match[1]);
        setUrl("");
        onOpenChange(false);
      } else {
        alert("URL inválida. Por favor ingresa una URL válida.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Unirse por URL</DialogTitle>
          <DialogDescription>
            Ingresa la URL del espacio al que deseas unirte
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL del espacio</Label>
              <Input
                id="url"
                placeholder="https://oficina.empresa.com?space=1"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500">
                Ejemplo: ?space=1 o https://oficina.empresa.com?space=1
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Unirse</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
