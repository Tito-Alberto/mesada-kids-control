
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RequestAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    childName: "",
    parentEmail: "",
    age: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulação de envio de solicitação - em produção conectar com backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação enviada!",
        description: `Uma solicitação de acesso foi enviada para ${formData.parentEmail}. Aguarde a aprovação dos seus pais.`,
      });
      
      navigate("/login?type=child");
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="gradient-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-secondary/20">
                <User className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-secondary">
              Pedir Acesso
            </CardTitle>
            <CardDescription>
              Solicite acesso aos seus pais para usar o MesadaKids
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="childName">Seu Nome</Label>
                <Input
                  id="childName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.childName}
                  onChange={(e) => handleInputChange("childName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Sua Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 12"
                  min="6"
                  max="17"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email dos Pais</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  placeholder="email@dospais.com"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Input
                  id="message"
                  type="text"
                  placeholder="Oi, gostaria de usar o MesadaKids!"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full text-white hover:shadow-lg money-gradient"
                disabled={isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isLoading}
                onClick={() => navigate("/login?type=child")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestAccess;
