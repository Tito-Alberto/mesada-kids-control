
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => navigate("/")} className="task-gradient text-white">
            <Home className="w-4 h-4 mr-2" />
            Ir para Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
