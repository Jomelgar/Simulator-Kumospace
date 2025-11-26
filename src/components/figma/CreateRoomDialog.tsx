import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import type { Room } from "./VirtualOfficeView";

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRoom: (roomData: {
    name: string;
    type: Room["type"];
    capacity: number;
    isLocked: boolean;
  }) => void;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  onCreateRoom,
}: CreateRoomDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Room["type"]>("office");
  const [capacity, setCapacity] = useState("8");
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateRoom({
        name: name.trim(),
        type,
        capacity: parseInt(capacity, 10),
        isLocked,
      });
      // Reset form
      setName("");
      setType("office");
      setCapacity("8");
      setIsLocked(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Oficina Virtual</DialogTitle>
          <DialogDescription>
            Configura los detalles de tu nueva sala o oficina virtual
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la oficina</Label>
              <Input
                id="name"
                placeholder="Ej: Oficina - Equipo de Diseño"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de espacio</Label>
              <Select
                value={type}
                onValueChange={(value: string) => setType(value as Room["type"])}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Oficina Privada</SelectItem>
                  <SelectItem value="meeting">Sala de Reunión</SelectItem>
                  <SelectItem value="conference">Sala de Conferencia</SelectItem>
                  <SelectItem value="lounge">Área de Descanso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad (personas)</Label>
              <Select value={capacity} onValueChange={setCapacity}>
                <SelectTrigger id="capacity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 personas</SelectItem>
                  <SelectItem value="6">6 personas</SelectItem>
                  <SelectItem value="8">8 personas</SelectItem>
                  <SelectItem value="10">10 personas</SelectItem>
                  <SelectItem value="12">12 personas</SelectItem>
                  <SelectItem value="15">15 personas</SelectItem>
                  <SelectItem value="20">20 personas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="locked">Sala privada</Label>
                <p className="text-sm text-slate-500">
                  Requiere permiso para acceder
                </p>
              </div>
              <Switch
                id="locked"
                checked={isLocked}
                onCheckedChange={setIsLocked}
              />
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
            <Button type="submit">Crear Oficina</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
