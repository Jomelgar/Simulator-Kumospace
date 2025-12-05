import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageWithFallback } from "./ImageWithFallback";
import { JoinByUrlDialog } from "./JoinByUrlDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Edit,
  Mail,
  Briefcase,
  Building2,
  Settings as SettingsIcon,
  Link
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  role: "Administrador" | "Supervisor" | "Miembro";
}

interface UserProfileProps {
  onJoinSpace: (spaceId: string) => void;
}

// Mock data
const currentUser = {
  name: "María González López",
  email: "maria.gonzalez@empresa.com",
  position: "Desarrolladora Frontend Senior",
  department: "Tecnología",
  initials: "MG",
};

const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Oficina Principal - Tecnología",
    url: "https://oficina.empresa.com/tecnologia",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
    role: "Miembro",
  },
  {
    id: "2",
    name: "Espacio Diseño UX/UI",
    url: "https://oficina.empresa.com/design",
    thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600",
    role: "Administrador",
  },
  {
    id: "3",
    name: "Sala de Proyectos",
    url: "https://oficina.empresa.com/proyectos",
    thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
    role: "Supervisor",
  },
];

export function UserProfile({ onJoinSpace }: UserProfileProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isJoinByUrlDialogOpen, setIsJoinByUrlDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedEmail, setEditedEmail] = useState(currentUser.email);
  const [editedPosition, setEditedPosition] = useState(currentUser.position);

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar el perfil
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <h1 className="text-slate-900">Perfil</h1>
            <Button variant="ghost" size="sm">
              Ayuda
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del perfil */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-slate-900">Información Personal</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-28 h-28 mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                Editar Perfil
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-600 text-sm mb-1 block">Nombre</Label>
                <p className="text-slate-900">{currentUser.name}</p>
              </div>

              <div>
                <Label className="text-slate-600 text-sm mb-1 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <p className="text-slate-900">{currentUser.email}</p>
              </div>

              <div>
                <Label className="text-slate-600 text-sm mb-1 block flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Puesto
                </Label>
                <p className="text-slate-900">{currentUser.position}</p>
              </div>

              <div>
                <Label className="text-slate-600 text-sm mb-1 block flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Departamento
                </Label>
                <p className="text-slate-900">{currentUser.department}</p>
              </div>
            </div>
          </Card>

          {/* Rol y permisos */}
          <Card className="p-6">
            <h2 className="text-slate-900 mb-4">Rol y Acceso</h2>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-600 text-sm mb-2 block">Rol actual</Label>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {currentUser.position}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <Label className="text-slate-600 text-sm mb-3 block">Permisos</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">Crear espacios</span>
                    <Badge variant="secondary" className="text-xs">Habilitado</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">Invitar usuarios</span>
                    <Badge variant="secondary" className="text-xs">Habilitado</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700">Gestionar salas</span>
                    <Badge variant="secondary" className="text-xs">Habilitado</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Espacios de trabajo */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-slate-900">Tus Espacios</h2>
              <p className="text-sm text-slate-600 mt-1">
                Espacios de trabajo a los que tienes acceso
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsJoinByUrlDialogOpen(true)}
              >
                <Link className="w-4 h-4 mr-2" />
                Unirse por URL
              </Button>
              <Button variant="outline" size="sm">
                Ver Recientes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {workspaces.map((workspace) => (
              <Card key={workspace.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-56 h-40 sm:h-auto bg-slate-200 overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={workspace.thumbnail}
                      alt={workspace.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-2">{workspace.name}</h3>
                        <p className="text-sm text-slate-500 mb-3">{workspace.url}</p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${workspace.role === "Administrador"
                            ? "bg-blue-100 text-blue-700"
                            : workspace.role === "Supervisor"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                            }`}
                        >
                          {workspace.role}
                        </Badge>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-2">
                        <Button
                          onClick={() => onJoinSpace(workspace.id)}
                          className="flex-1 sm:flex-none"
                        >
                          Unirse al Espacio
                        </Button>
                        {(workspace.role === "Administrador" || workspace.role === "Supervisor") && (
                          <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                          >
                            <SettingsIcon className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Gestionar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Dialog para editar perfil */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Actualiza tu información personal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Puesto</Label>
              <Input
                id="position"
                value={editedPosition}
                onChange={(e) => setEditedPosition(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para unirse por URL */}
      <JoinByUrlDialog
        open={isJoinByUrlDialogOpen}
        onOpenChange={setIsJoinByUrlDialogOpen}
        onJoinByUrl={onJoinSpace}
      />
    </div>
  );
}