import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Target, Gift, LogOut, User, Plus, History, Trophy, DollarSign, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChildren } from "@/contexts/ChildrenContext";
import { useToast } from "@/hooks/use-toast";
import NotificationBadge from "@/components/NotificationBadge";
import RequestCommunication from "@/components/RequestCommunication";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const { 
    children,
    getChild, 
    getTasksByChild, 
    updateTask, 
    addMoneyRequest,
    getMoneyRequestsByChild 
  } = useChildren();
  
  // Encontrar a criança pelo ID do usuário autenticado
  const currentChild = children.find(child => child.id.toString() === user?.id);
  
  if (!currentChild) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Criança não encontrada no sistema.</p>
            <Button onClick={() => logout()} className="mt-4">
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const child = currentChild;
  const childTasks = getTasksByChild(child.id);
  const childRequests = getMoneyRequestsByChild(child.id);
  const pendingRequests = childRequests.filter(r => r.status === 'pending');

  const [recentActivity] = useState([
    { id: 1, action: "Completou tarefa", amount: 5.00, time: "2 horas atrás", type: "task" },
    { id: 2, action: "Mesada recebida", amount: 15.00, time: "3 dias atrás", type: "allowance" },
  ]);

  const [showCommunication, setShowCommunication] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCompleteTask = (taskId: number) => {
    updateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    
    toast({
      title: "Tarefa concluída!",
      description: "Aguarde a aprovação dos seus pais para receber a recompensa.",
    });
  };

  const handleRequestMoney = (amount: number, description: string) => {
    if (amount > child.balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para esta solicitação.",
        variant: "destructive",
      });
      return;
    }

    addMoneyRequest({
      childId: child.id,
      amount,
      description,
      status: 'pending'
    });

    toast({
      title: "Solicitação enviada!",
      description: "Seus pais receberão sua solicitação para aprovação.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Olá, {user?.name || child.name}! 👋</h1>
                <p className="text-sm text-muted-foreground">{child.age} anos</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCommunication(!showCommunication)}
                className="relative"
              >
                <NotificationBadge count={pendingRequests.length} />
                <span className="ml-2">Mensagens</span>
              </Button>
              <Button variant="outline" onClick={() => navigate("/achievements")}>
                <Trophy className="w-4 h-4 mr-2" />
                Conquistas
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
        {/* Communication Panel */}
        {showCommunication && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Mensagens dos Pais
              </CardTitle>
              <CardDescription>
                Converse com seus pais sobre suas solicitações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {childRequests.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {childRequests.map((request) => (
                    <RequestCommunication 
                      key={request.id} 
                      requestId={request.id} 
                      isParent={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Você ainda não fez nenhuma solicitação</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Saldo e Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="money-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Meu Saldo</p>
                  <p className="text-3xl font-bold">R$ {child.balance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="task-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Tarefas Concluídas</p>
                  <p className="text-3xl font-bold">{child.tasksCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Gift className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mesada Mensal</p>
                  <p className="text-3xl font-bold text-primary">R$ {child.monthlyAllowance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tarefas Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Minhas Tarefas
              </CardTitle>
              <CardDescription>Complete tarefas para ganhar dinheiro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {childTasks.length > 0 ? (
                childTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border bg-gradient-to-r from-card to-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status === 'pending' ? 'Pendente' : 
                         task.status === 'completed' ? 'Concluída' : 'Aprovada'}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-success">+ R$ {task.reward.toFixed(2)}</span>
                      {task.status === 'pending' && (
                        <Button 
                          size="sm"
                          className="task-gradient text-white"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma tarefa disponível</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Solicitações e Histórico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Minhas Solicitações
              </CardTitle>
              <CardDescription>Histórico de pedidos de compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {childRequests.length > 0 ? (
                childRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg border bg-gradient-to-r from-card to-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{request.description}</h3>
                      <Badge variant={
                        request.status === 'approved' ? 'default' : 
                        request.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {request.status === 'pending' ? 'Pendente' : 
                         request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">R$ {request.amount.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma solicitação ainda</p>
                </div>
              )}
              
              <Button 
                className="w-full money-gradient text-white"
                onClick={() => navigate("/request-money")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Solicitação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildDashboard;
