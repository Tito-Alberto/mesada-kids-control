
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, LogOut, DollarSign, Wallet, ArrowRight, ShoppingCart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChildren } from "@/contexts/ChildrenContext";
import { useToast } from "@/hooks/use-toast";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const { 
    getChild, 
    addMoneyRequest, 
    getTasksByChild, 
    updateTask, 
    updateChild,
    getMoneyRequestsByChild 
  } = useChildren();
  
  // Usar o ID da criança logada baseado no usuário autenticado
  // Em produção, isso deveria vir do contexto de autenticação
  const childId = 1; // Por enquanto usar ID fixo, mas em produção usar user.id
  const child = getChild(childId);
  const childTasks = getTasksByChild(childId);
  const childRequests = getMoneyRequestsByChild(childId);

  const [availableTasks, setAvailableTasks] = useState([
    { id: 1, title: "Organizar o quarto", reward: 5.00, xp: 20, difficulty: "Fácil", icon: "🛏️" },
    { id: 2, title: "Ajudar na cozinha", reward: 7.50, xp: 30, difficulty: "Médio", icon: "👨‍🍳" },
    { id: 3, title: "Estudar matemática", reward: 10.00, xp: 40, difficulty: "Médio", icon: "📚" },
  ]);

  // Estados para formulário de compra
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado!",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/login");
  };

  const handleAcceptTask = (taskId: number) => {
    const task = availableTasks.find(t => t.id === taskId);
    if (task && child) {
      // Remove a tarefa da lista de disponíveis
      setAvailableTasks(prev => prev.filter(t => t.id !== taskId));
      
      // Atualiza o saldo da criança
      updateChild(child.id, {
        balance: child.balance + task.reward,
        tasksCompleted: child.tasksCompleted + 1
      });

      toast({
        title: "Tarefa aceita! 🎉",
        description: `Você ganhou R$ ${task.reward.toFixed(2)} por "${task.title}"`,
      });
    }
  };

  const handlePurchaseRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amount = parseFloat(purchaseAmount);
      
      if (amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor maior que zero.",
          variant: "destructive",
        });
        return;
      }

      if (!child) {
        toast({
          title: "Erro",
          description: "Dados do usuário não encontrados.",
          variant: "destructive",
        });
        return;
      }

      // Adicionar solicitação de compra
      addMoneyRequest({
        childId: child.id,
        amount: amount,
        description: purchaseDescription,
        status: 'pending'
      });

      // Atualizar contador de solicitações pendentes
      updateChild(child.id, {
        pendingRequests: child.pendingRequests + 1
      });

      toast({
        title: "Solicitação enviada! 📱",
        description: `Pedido de R$ ${amount.toFixed(2)} enviado para aprovação dos pais.`,
      });

      // Limpar formulário
      setPurchaseAmount("");
      setPurchaseDescription("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Dados do usuário não encontrados</p>
            <Button onClick={() => navigate("/login")} className="mt-4">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = 75; // Valor fixo para demonstração

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Olá, {user?.name || child.name}! 👋</h1>
                <p className="text-sm text-muted-foreground">{child.age} anos</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Balance and Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="money-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Seu Saldo</p>
                  <p className="text-3xl font-bold">R$ {child.balance.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>Mesada mensal</span>
                <span>R$ {child.monthlyAllowance.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="achievement-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Tarefas Completadas</p>
                  <p className="text-2xl font-bold">{child.tasksCompleted}</p>
                </div>
                <div className="text-3xl">🏆</div>
              </div>
              <Progress value={progressPercentage} className="mb-2 bg-white/20" />
              <p className="text-sm text-white/80">
                Continue completando tarefas!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Tarefas Disponíveis
              </CardTitle>
              <CardDescription>Complete tarefas para ganhar dinheiro!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <span className="text-4xl mb-4 block">🎉</span>
                  <p>Parabéns! Você completou todas as tarefas disponíveis!</p>
                  <p className="text-sm mt-2">Novas tarefas aparecerão em breve.</p>
                </div>
              ) : (
                availableTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-xl border bg-gradient-to-r from-card to-muted/10 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{task.icon}</div>
                        <div>
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge variant="outline" className="text-xs">{task.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">R$ {task.reward.toFixed(2)}</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full task-gradient text-white"
                      onClick={() => handleAcceptTask(task.id)}
                    >
                      Aceitar Tarefa
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Purchase Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Fazer Compra
              </CardTitle>
              <CardDescription>Solicite aprovação para uma compra</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePurchaseRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">O que você quer comprar?</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Brinquedo, livro, lanche..."
                    value={purchaseDescription}
                    onChange={(e) => setPurchaseDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full money-gradient text-white"
                  disabled={isSubmitting || !purchaseAmount || !purchaseDescription}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar Compra"}
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 Dica: Sua solicitação será enviada aos seus pais para aprovação
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions/Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Minhas Solicitações
              </CardTitle>
              <CardDescription>Suas solicitações de compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {childRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma solicitação ainda</p>
                  <p className="text-sm mt-1">Use o formulário ao lado para fazer uma solicitação</p>
                </div>
              ) : (
                childRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        request.status === "approved" ? "bg-success/20" :
                        request.status === "rejected" ? "bg-destructive/20" : "bg-warning/20"
                      }`}>
                        <span className="text-xs">
                          {request.status === "approved" ? "✅" :
                           request.status === "rejected" ? "❌" : "⏳"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{request.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          <Badge 
                            variant={
                              request.status === "approved" ? "default" :
                              request.status === "rejected" ? "destructive" : "secondary"
                            } 
                            className="text-xs"
                          >
                            {request.status === "approved" ? "Aprovado" :
                             request.status === "rejected" ? "Rejeitado" : "Aguardando"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        R$ {request.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {childRequests.length > 5 && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate("/allowance-history")}
                >
                  Ver Todas as Solicitações
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  className="money-gradient text-white p-6 h-auto flex-col gap-2"
                  onClick={() => navigate("/request-money")}
                >
                  <span className="text-2xl">💸</span>
                  <span>Pedir Dinheiro</span>
                  <span className="text-xs opacity-80">Solicitar aprovação para gastar</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="p-6 h-auto flex-col gap-2"
                  onClick={() => navigate("/achievements")}
                >
                  <span className="text-2xl">🏆</span>
                  <span>Minhas Conquistas</span>
                  <span className="text-xs opacity-60">Ver medalhas e prêmios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChildDashboard;
