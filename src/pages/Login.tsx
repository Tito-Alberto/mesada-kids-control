
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Users, User, ArrowLeft } from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get("type") || "parent";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login - em produção conectar com backend
    if (userType === "parent") {
      navigate("/parent");
    } else {
      navigate("/child");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

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
              {userType === "parent" ? "Acesso dos Pais" : "Acesso das Crianças"}
            </CardTitle>
            <CardDescription>
              {userType === "parent" 
                ? "Gerencie as mesadas e tarefas dos seus filhos"
                : "Veja sua mesada e complete tarefas divertidas"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full text-white hover:shadow-lg ${
                  userType === "parent" ? "task-gradient" : "money-gradient"
                }`}
              >
                Entrar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Primeiro acesso?</p>
              <Button variant="outline" className="w-full">
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
