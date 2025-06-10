
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const userType = (searchParams.get("type") as "parent" | "child") || "parent";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password, userType);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo${userType === 'parent' ? '' : 'a'}, ${username}!`,
        });
        
        // Navegação será automática através do AuthenticatedApp
        if (userType === "parent") {
          navigate("/parent");
        } else {
          navigate("/child");
        }
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserType = (type: "parent" | "child") => {
    setSearchParams({ type });
    setUsername("");
    setPassword("");
  };

  const handleCreateAccount = () => {
    if (userType === "parent") {
      navigate("/register-parent");
    } else {
      navigate("/request-access");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="gradient-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${userType === "parent" ? "bg-primary/20" : "bg-secondary/20"}`}>
                {userType === "parent" ? (
                  <Users className={`w-8 h-8 ${userType === "parent" ? "text-primary" : "text-secondary"}`} />
                ) : (
                  <User className={`w-8 h-8 ${userType === "parent" ? "text-primary" : "text-secondary"}`} />
                )}
              </div>
            </div>
            <CardTitle className={userType === "parent" ? "text-primary" : "text-secondary"}>
              MesadaKids - {userType === "parent" ? "Acesso dos Pais" : "Acesso das Crianças"}
            </CardTitle>
            <CardDescription>
              {userType === "parent" 
                ? "Gerencie as mesadas e tarefas dos seus filhos"
                : "Veja sua mesada e complete tarefas divertidas"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex mb-6 p-1 bg-muted rounded-lg">
              <Button
                variant={userType === "parent" ? "default" : "ghost"}
                size="sm"
                className="flex-1"
                onClick={() => switchUserType("parent")}
              >
                Pais
              </Button>
              <Button
                variant={userType === "child" ? "default" : "ghost"}
                size="sm"
                className="flex-1"
                onClick={() => switchUserType("child")}
              >
                Crianças
              </Button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  {userType === "parent" ? "Email" : "Nome de usuário"}
                </Label>
                <Input
                  id="username"
                  type={userType === "parent" ? "email" : "text"}
                  placeholder={userType === "parent" ? "seu@email.com" : "Seu nome"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full text-white hover:shadow-lg ${
                  userType === "parent" ? "task-gradient" : "money-gradient"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Primeiro acesso?</p>
              <Button variant="outline" className="w-full" disabled={isLoading} onClick={handleCreateAccount}>
                {userType === "parent" ? "Criar conta dos pais" : "Pedir acesso aos pais"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
