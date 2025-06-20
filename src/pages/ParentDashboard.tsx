import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Wallet, User, LogOut, DollarSign, ArrowRight, FileText, Check, X, Plus, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useChildren } from "@/contexts/ChildrenContext";
import { useToast } from "@/hooks/use-toast";
import NotificationBadge from "@/components/NotificationBadge";
import RequestCommunication from "@/components/RequestCommunication";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const { 
    getChildrenByParent, 
    getMoneyRequestsByChild, 
    updateMoneyRequest, 
    updateChild, 
    addBalance 
  } = useChildren();
  
  // Get children for current parent (using user.id or default)
  const children = getChildrenByParent(user?.id || "parent1");
  
  // Get all pending requests for all children
  const allPendingRequests = children.flatMap(child => 
    getMoneyRequestsByChild(child.id).filter(r => r.status === 'pending')
  );

  // Get all requests for communication view
  const allRequests = children.flatMap(child => 
    getMoneyRequestsByChild(child.id)
  );

  const [recentActivity] = useState([
    { id: 1, child: "Ana", action: "Completou tarefa", amount: 5.00, time: "2 horas atrás", type: "task" },
    { id: 2, child: "Pedro", action: "Solicitou gasto", amount: -12.00, time: "1 dia atrás", type: "request" },
    { id: 3, child: "Ana", action: "Mesada recebida", amount: 15.00, time: "3 dias atrás", type: "allowance" },
  ]);

  const [balanceInputs, setBalanceInputs] = useState<{[key: number]: string}>({});
  const [showCommunication, setShowCommunication] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApproveRequest = (requestId: number) => {
    const request = allPendingRequests.find(r => r.id === requestId);
    if (request) {
      const child = children.find(c => c.id === request.childId);
      if (child) {
        // Verificar se o filho tem saldo suficiente
        if (child.balance < request.amount) {
          toast({
            title: "Saldo insuficiente!",
            description: `${child.name} não tem saldo suficiente. Saldo atual: Kz ${child.balance.toFixed(2)}`,
            variant: "destructive",
          });
          return;
        }

        // Aprovar a solicitação e descontar do saldo
        updateChild(child.id, {
          balance: child.balance - request.amount,
          pendingRequests: Math.max(0, child.pendingRequests - 1)
        });
        
        updateMoneyRequest(requestId, { status: 'approved' });
        
        toast({
          title: "Solicitação aprovada!",
          description: `Gasto de Kz ${request.amount.toFixed(2)} aprovado para ${child.name}`,
        });
      }
    }
  };

  const handleRejectRequest = (requestId: number) => {
    const request = allPendingRequests.find(r => r.id === requestId);
    if (request) {
      const child = children.find(c => c.id === request.childId);
      if (child) {
        updateMoneyRequest(requestId, { status: 'rejected' });
        updateChild(child.id, {
          pendingRequests: Math.max(0, child.pendingRequests - 1)
        });
        
        toast({
          title: "Solicitação rejeitada",
          description: `Solicitação de Kz ${request.amount.toFixed(2)} foi rejeitada`,
          variant: "destructive",
        });
      }
    }
  };

  const handleAddBalance = (childId: number) => {
    const amount = parseFloat(balanceInputs[childId] || "0");
    const child = children.find(c => c.id === childId);
    
    if (amount > 0 && child) {
      addBalance(childId, amount);
      setBalanceInputs(prev => ({ ...prev, [childId]: "" }));
      
      toast({
        title: "Saldo adicionado!",
        description: `Kz ${amount.toFixed(2)} adicionados ao saldo de ${child.name}`,
      });
    }
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
                <p className="text-sm text-muted-foreground">
                  Bem-vindo, {user?.name || 'Pai/Mãe'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCommunication(!showCommunication)}
                className="relative"
              >
                <NotificationBadge count={allPendingRequests.length} />
                <span className="ml-2">Comunicação</span>
              </Button>
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
        {/* Communication Panel */}
        {showCommunication && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Central de Comunicação
              </CardTitle>
              <CardDescription>
                Converse com seus filhos sobre as solicitações
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allRequests.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {allRequests.map((request) => (
                    <RequestCommunication 
                      key={request.id} 
                      requestId={request.id} 
                      isParent={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma solicitação para conversar</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
                  <p className="text-2xl font-bold">Kz {children.reduce((acc, child) => acc + child.balance, 0).toFixed(2)}</p>
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
                  <p className="text-2xl font-bold">Kz {children.reduce((acc, child) => acc + child.monthlyAllowance, 0).toFixed(2)}</p>
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
                  <p className="text-2xl font-bold">{allPendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Children Overview with Quick Balance Add */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seus Filhos
              </CardTitle>
              <CardDescription>Gerencie as mesadas e atividades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {children.length > 0 ? (
                children.map((child) => {
                  const childPendingRequests = getMoneyRequestsByChild(child.id).filter(r => r.status === 'pending').length;
                  return (
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
                          <p className="text-lg font-bold text-success">Kz {child.balance.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Saldo atual</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex gap-4">
                          <span>Mesada: Kz {child.monthlyAllowance}</span>
                          <span>Tarefas: {child.tasksCompleted}</span>
                        </div>
                        {childPendingRequests > 0 && (
                          <Badge variant="destructive">{childPendingRequests} solicitação{childPendingRequests > 1 ? 'ões' : ''}</Badge>
                        )}
                      </div>

                      {/* Quick Add Balance */}
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1">
                          <Input
                            type="number"
                            step="0.50"
                            placeholder="Valor (Kz)"
                            value={balanceInputs[child.id] || ""}
                            onChange={(e) => setBalanceInputs(prev => ({ ...prev, [child.id]: e.target.value }))}
                          />
                        </div>
                        <Button 
                          size="sm"
                          className="money-gradient text-white"
                          onClick={() => handleAddBalance(child.id)}
                          disabled={!balanceInputs[child.id] || parseFloat(balanceInputs[child.id]) <= 0}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => navigate(`/manage-child/${child.id}`)}
                      >
                        Gerenciar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Nenhum filho cadastrado ainda</p>
                </div>
              )}
              
              <Button 
                className="w-full task-gradient text-white"
                onClick={() => navigate("/add-child")}
              >
                <User className="w-4 h-4 mr-2" />
                Adicionar Filho
              </Button>
            </CardContent>
          </Card>

          {/* Pending Requests with Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Solicitações Pendentes
                {allPendingRequests.length > 0 && (
                  <Badge variant="destructive">{allPendingRequests.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>Aprove ou rejeite gastos dos seus filhos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {allPendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
                </div>
              ) : (
                allPendingRequests.map((request) => {
                  const child = children.find(c => c.id === request.childId);
                  const hasInsufficientBalance = child && child.balance < request.amount;
                  
                  return (
                    <div key={request.id} className="p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{request.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {child?.name} • {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                          {hasInsufficientBalance && (
                            <p className="text-xs text-destructive mt-1">
                              Saldo insuficiente: Kz {child.balance.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-lg">Kz {request.amount.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-success hover:bg-success/80 text-white"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={hasInsufficientBalance}
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
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
