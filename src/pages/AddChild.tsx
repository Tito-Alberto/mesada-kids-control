
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddChild = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    username: "",
    password: "",
    monthlyAllowance: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setChildData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular adição de filho
      console.log("Dados do filho:", childData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Filho adicionado com sucesso!",
        description: `${childData.name} foi adicionado à sua conta.`,
      });
      
      navigate("/parent");
    } catch (error) {
      toast({
        title: "Erro ao adicionar filho",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/parent")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Adicionar Filho</h1>
                <p className="text-sm text-muted-foreground">Cadastre um novo filho</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle>Dados do Filho</CardTitle>
              <CardDescription>
                Preencha as informações para criar a conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome do seu filho"
                    value={childData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Select 
                    value={childData.age} 
                    onValueChange={(value) => handleInputChange("age", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a idade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 13 }, (_, i) => i + 6).map(age => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} anos
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="nome_usuario"
                    value={childData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Senha para a criança"
                    value={childData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowance">Mesada mensal (R$)</Label>
                  <Input
                    id="allowance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={childData.monthlyAllowance}
                    onChange={(e) => handleInputChange("monthlyAllowance", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full task-gradient text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Adicionando..." : "Adicionar Filho"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/parent")}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddChild;
