
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wallet, User, LogOut, DollarSign, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [children] = useState([
    { id: 1, name: "Ana", age: 8, balance: 25.50, monthlyAllowance: 15, tasksCompleted: 3, pendingRequests: 1 },
    { id: 2, name: "Pedro", age: 12, balance: 48.75, monthlyAllowance: 25, tasksCompleted: 5, pendingRequests: 0 },
  ]);

  const [recentActivity] = useState([
    { id: 1, child: "Ana", action: "Completou tarefa", amount: 5.00, time: "2 horas atrás", type: "task" },
    { id: 2, child: "Pedro", action: "Solicitou gasto", amount: -12.00, time: "1 dia atrás", type: "request" },
    { id: 3, child: "Ana", action: "Mesada recebida", amount: 15.00, time: "3 dias atrás", type: "allowance" },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MesadaKids</h1>
                <p className="text-sm text-muted-foreground">Dashboard dos Pais</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/spending-history")}>
                <FileText className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filhos</p>
                  <p className="text-2xl font-bold">{children.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <DollarSign className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total em Saldos</p>
                  <p className="text-2xl font-bold">R$ {children.reduce((acc, child) => acc + child.balance, 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Wallet className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mesadas Mensais</p>
                  <p className="text-2xl font-bold">R$ {children.reduce((acc, child) => acc + child.monthlyAllowance, 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <User className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Solicitações</p>
                  <p className="text-2xl font-bold">{children.reduce((acc, child) => acc + child.pendingRequests, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Children Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seus Filhos
              </CardTitle>
              <CardDescription>Gerencie as mesadas e atividades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {children.map((child) => (
                <div key={child.id} className="p-4 rounded-xl border bg-gradient-to-r from-card to-muted/10 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">{child.age} anos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">R$ {child.balance.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Saldo atual</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span>Mesada: R$ {child.monthlyAllowance}</span>
                      <span>Tarefas: {child.tasksCompleted}</span>
                    </div>
                    {child.pendingRequests > 0 && (
                      <Badge variant="destructive">{child.pendingRequests} solicitação</Badge>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    variant="outline"
                    onClick={() => navigate(`/manage-child/${child.id}`)}
                  >
                    Gerenciar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
              
              <Button 
                className="w-full task-gradient text-white"
                onClick={() => navigate("/add-child")}
              >
                <User className="w-4 h-4 mr-2" />
                Adicionar Filho
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas transações e atividades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "task" ? "bg-primary/20" :
                      activity.type === "request" ? "bg-warning/20" : "bg-success/20"
                    }`}>
                      <span className="text-xs">
                        {activity.type === "task" ? "🎯" : 
                         activity.type === "request" ? "💰" : "💵"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.child}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      activity.amount > 0 ? "text-success" : "text-warning"
                    }`}>
                      {activity.amount > 0 ? "+" : ""}R$ {Math.abs(activity.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
