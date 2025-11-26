import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";

interface CreateRoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateRoom: (roomData: {
        name: string;
        type: "meeting" | "office" | "lounge" | "conference";
        capacity: number;
        isLocked: boolean;
    }) => void;
}

export function CreateRoomDialog({ open, onOpenChange, onCreateRoom }: CreateRoomDialogProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"meeting" | "office" | "lounge" | "conference">("meeting");
    const [capacity, setCapacity] = useState("10");
    const [isLocked, setIsLocked] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateRoom({
            name,
            type,
            capacity: parseInt(capacity) || 0,
            isLocked,
        });
        // Reset form
        setName("");
        setType("meeting");
        setCapacity("10");
        setIsLocked(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Oficina</DialogTitle>
                    <DialogDescription>
                        Configura los detalles de la nueva sala o espacio de trabajo.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipo
                            </Label>
                            <div className="col-span-3">
                                <Select value={type} onValueChange={(val: any) => setType(val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="meeting">Sala de Reuniones</SelectItem>
                                        <SelectItem value="office">Oficina</SelectItem>
                                        <SelectItem value="lounge">Sala de Descanso</SelectItem>
                                        <SelectItem value="conference">Conferencia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">
                                Capacidad
                            </Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="col-span-3"
                                min="1"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="locked" className="text-right">
                                Privado
                            </Label>
                            <div className="col-span-3 flex items-center space-x-2">
                                <Switch
                                    id="locked"
                                    checked={isLocked}
                                    onCheckedChange={setIsLocked}
                                />
                                <Label htmlFor="locked" className="font-normal text-slate-500">
                                    {isLocked ? "Solo con invitación" : "Acceso libre"}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Crear Sala</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
