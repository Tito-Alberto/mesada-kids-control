
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, DollarSign, Plus, X, Check, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useChildren } from "@/contexts/ChildrenContext";

const ManageChild = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const { toast } = useToast();
  const { 
    getChild, 
    updateChild, 
    addTask, 
    getTasksByChild, 
    getMoneyRequestsByChild, 
    updateMoneyRequest,
    addBalance 
  } = useChildren();
  
  const child = getChild(parseInt(childId || "1"));
  const childTasks = getTasksByChild(parseInt(childId || "1"));
  const childRequests = getMoneyRequestsByChild(parseInt(childId || "1")).filter(r => r.status === 'pending');

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    reward: "",
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState("");

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Filho não encontrado</p>
            <Button onClick={() => navigate("/parent")} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApproveRequest = (requestId: number) => {
    const request = childRequests.find(r => r.id === requestId);
    if (request) {
      updateChild(child.id, {
        balance: child.balance - request.amount,
        pendingRequests: child.pendingRequests - 1
      });
      
      updateMoneyRequest(requestId, { status: 'approved' });
      
      toast({
        title: "Solicitação aprovada!",
        description: `Gasto de R$ ${request.amount.toFixed(2)} aprovado para ${child.name}`,
      });
    }
  };

  const handleRejectRequest = (requestId: number) => {
    updateMoneyRequest(requestId, { status: 'rejected' });
    updateChild(child.id, {
      pendingRequests: child.pendingRequests - 1
    });
    
    toast({
      title: "Solicitação rejeitada",
      description: "A solicitação foi rejeitada",
      variant: "destructive",
    });
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.reward) {
      addTask({
        childId: child.id,
        title: newTask.title,
        description: newTask.description,
        reward: parseFloat(newTask.reward),
        status: "pending"
      });
      
      setNewTask({ title: "", description: "", reward: "" });
      setShowAddTask(false);
      
      toast({
        title: "Tarefa adicionada!",
        description: `Nova tarefa "${newTask.title}" foi criada para ${child.name}`,
      });
    }
  };

  const handleUpdateAllowance = (newAmount: number) => {
    updateChild(child.id, {
      monthlyAllowance: newAmount
    });
    
    toast({
      title: "Mesada atualizada!",
      description: `Nova mesada mensal: R$ ${newAmount.toFixed(2)}`,
    });
  };

  const handleAddBalance = () => {
    const amount = parseFloat(balanceAmount);
    if (amount > 0) {
      addBalance(child.id, amount);
      setBalanceAmount("");
      
      toast({
        title: "Saldo adicionado!",
        description: `R$ ${amount.toFixed(2)} adicionados ao saldo de ${child.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/parent")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Gerenciar {child.name}</h1>
                <p className="text-sm text-muted-foreground">{child.age} anos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Atual</p>
                  <p className="text-2xl font-bold">R$ {child.balance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mesada Mensal</p>
                  <p className="text-2xl font-bold">R$ {child.monthlyAllowance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Solicitações</p>
                  <p className="text-2xl font-bold">{child.pendingRequests}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>Aprovações de gastos solicitadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {childRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Nenhuma solicitação pendente</p>
              ) : (
                childRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{request.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-bold text-lg">R$ {request.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-success hover:bg-success/80 text-white"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tasks Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tarefas</CardTitle>
                  <CardDescription>Gerencie as tarefas do seu filho</CardDescription>
                </div>
                <Button onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddTask && (
                <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
                  <div>
                    <Label htmlFor="taskTitle">Título da Tarefa</Label>
                    <Input
                      id="taskTitle"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Organizar o quarto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskDescription">Descrição (opcional)</Label>
                    <Textarea
                      id="taskDescription"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva a tarefa..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="taskReward">Recompensa (R$)</Label>
                    <Input
                      id="taskReward"
                      type="number"
                      step="0.50"
                      value={newTask.reward}
                      onChange={(e) => setNewTask(prev => ({ ...prev, reward: e.target.value }))}
                      placeholder="5.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTask} className="flex-1">
                      Adicionar Tarefa
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddTask(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {childTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.status === "completed" ? `Completada ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : ''}` : `Criada ${new Date(task.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">R$ {task.reward.toFixed(2)}</p>
                      <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                        {task.status === "completed" ? "Completada" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Balance and Allowance Management */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Add Balance */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Saldo</CardTitle>
              <CardDescription>Adicione dinheiro extra ao saldo do seu filho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="balanceAmount">Valor (R$)</Label>
                  <Input
                    id="balanceAmount"
                    type="number"
                    step="0.50"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button 
                  className="money-gradient text-white self-end"
                  onClick={handleAddBalance}
                  disabled={!balanceAmount || parseFloat(balanceAmount) <= 0}
                >
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Allowance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Mesada</CardTitle>
              <CardDescription>Ajuste a mesada mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="allowance">Mesada Mensal (R$)</Label>
                  <Input
                    id="allowance"
                    type="number"
                    step="0.50"
                    defaultValue={child.monthlyAllowance}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 0) {
                        handleUpdateAllowance(value);
                      }
                    }}
                  />
                </div>
                <Button 
                  className="money-gradient text-white"
                  onClick={() => {
                    addBalance(child.id, child.monthlyAllowance);
                    toast({
                      title: "Mesada liberada!",
                      description: `R$ ${child.monthlyAllowance.toFixed(2)} adicionados ao saldo de ${child.name}`,
                    });
                  }}
                >
                  Liberar Mesada Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageChild;
