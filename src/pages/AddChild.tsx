
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChildren } from "@/contexts/ChildrenContext";
import { useAuth } from "@/contexts/AuthContext";

const AddChild = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addChild, children } = useChildren();
  const { user } = useAuth();
  
  const [childData, setChildData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    ticketNumber: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    monthlyAllowance: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setChildData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Gerar nome completo automaticamente (remover espaços extras)
      if (field === "firstName" || field === "lastName") {
        const firstName = updated.firstName.trim();
        const lastName = updated.lastName.trim();
        updated.fullName = `${firstName} ${lastName}`.trim();
      }
      
      return updated;
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se as senhas coincidem
    if (childData.password !== childData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem. Verifique e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    // Validar senha mínima
    if (childData.password.length < 4) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 4 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o número do bilhete já existe
    const ticketExists = children.find(child => child.ticketNumber === childData.ticketNumber);
    if (ticketExists) {
      toast({
        title: "Número do bilhete já existe",
        description: "Este número do bilhete já está sendo usado. Escolha outro.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!childData.firstName || !childData.lastName || !childData.ticketNumber || !childData.birthDate || !childData.password || !childData.monthlyAllowance) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const age = calculateAge(childData.birthDate);
      
      // Limpar espaços extras dos nomes
      const firstName = childData.firstName.trim();
      const lastName = childData.lastName.trim();
      const fullName = `${firstName} ${lastName}`;
      
      // Add child to context
      addChild({
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        age: age,
        ticketNumber: childData.ticketNumber,
        birthDate: childData.birthDate,
        password: childData.password,
        monthlyAllowance: parseFloat(childData.monthlyAllowance),
        parentId: user?.id || "parent1"
      });
      
      console.log("Filho adicionado:", {
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        password: childData.password
      });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Filho adicionado com sucesso!",
        description: `${fullName} foi adicionado à sua conta. Pode fazer login com "${firstName}" ou "${fullName}" e a senha definida.`,
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
                Preencha as informações para criar a conta. O filho poderá fazer login com o primeiro nome ou nome completo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Nome"
                    value={childData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Sobrenome"
                    value={childData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nome completo (gerado automaticamente)"
                    value={childData.fullName}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ticketNumber">Número do Bilhete *</Label>
                  <Input
                    id="ticketNumber"
                    type="text"
                    placeholder="Ex: 123456789"
                    value={childData.ticketNumber}
                    onChange={(e) => handleInputChange("ticketNumber", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={childData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
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
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={childData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  {childData.password && childData.confirmPassword && childData.password !== childData.confirmPassword && (
                    <p className="text-sm text-destructive">As senhas não coincidem</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowance">Mesada mensal (Kz) *</Label>
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
                  disabled={isLoading || (childData.password && childData.confirmPassword && childData.password !== childData.confirmPassword)}
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
