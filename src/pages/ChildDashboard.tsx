
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, LogOut, Money, Wallet, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const [childData] = useState({
    name: "Ana",
    balance: 25.50,
    monthlyAllowance: 15.00,
    nextAllowance: "5 dias",
    level: 3,
    xp: 250,
    nextLevelXp: 500,
  });

  const [availableTasks] = useState([
    { id: 1, title: "Organizar o quarto", reward: 5.00, xp: 20, difficulty: "Fácil", icon: "🛏️" },
    { id: 2, title: "Ajudar na cozinha", reward: 7.50, xp: 30, difficulty: "Médio", icon: "👨‍🍳" },
    { id: 3, title: "Estudar matemática", reward: 10.00, xp: 40, difficulty: "Médio", icon: "📚" },
  ]);

  const [recentTransactions] = useState([
    { id: 1, description: "Tarefa: Organizar quarto", amount: 5.00, date: "Hoje", type: "earned" },
    { id: 2, description: "Compra: Brinquedo", amount: -12.00, date: "Ontem", type: "spent", status: "pending" },
    { id: 3, description: "Mesada mensal", amount: 15.00, date: "3 dias atrás", type: "allowance" },
  ]);

  const handleLogout = () => {
    navigate("/");
  };

  const progressPercentage = (childData.xp / childData.nextLevelXp) * 100;

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
                <h1 className="text-xl font-bold">Olá, {childData.name}! 👋</h1>
                <p className="text-sm text-muted-foreground">Nível {childData.level} • {childData.xp} XP</p>
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
                  <p className="text-3xl font-bold">R$ {childData.balance.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>Próxima mesada em {childData.nextAllowance}</span>
                <span>R$ {childData.monthlyAllowance.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="achievement-gradient text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm">Nível {childData.level}</p>
                  <p className="text-2xl font-bold">{childData.xp} / {childData.nextLevelXp} XP</p>
                </div>
                <div className="text-3xl">🏆</div>
              </div>
              <Progress value={progressPercentage} className="mb-2 bg-white/20" />
              <p className="text-sm text-white/80">
                {childData.nextLevelXp - childData.xp} XP para o próximo nível
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Tarefas Disponíveis
              </CardTitle>
              <CardDescription>Complete tarefas para ganhar dinheiro e XP!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl border bg-gradient-to-r from-card to-muted/10 hover:shadow-lg transition-all cursor-pointer">
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
                      <p className="text-xs text-muted-foreground">{task.xp} XP</p>
                    </div>
                  </div>
                  <Button className="w-full task-gradient text-white">
                    Aceitar Tarefa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Money className="w-5 h-5" />
                Histórico
              </CardTitle>
              <CardDescription>Suas últimas transações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "earned" ? "bg-success/20" :
                      transaction.type === "spent" ? "bg-warning/20" : "bg-primary/20"
                    }`}>
                      <span className="text-xs">
                        {transaction.type === "earned" ? "💰" :
                         transaction.type === "spent" ? "🛒" : "💵"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        {transaction.status === "pending" && (
                          <Badge variant="secondary" className="text-xs">Aguardando aprovação</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.amount > 0 ? "text-success" : "text-warning"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                Ver Histórico Completo
              </Button>
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
                <Button className="money-gradient text-white p-6 h-auto flex-col gap-2">
                  <span className="text-2xl">💸</span>
                  <span>Pedir Dinheiro</span>
                  <span className="text-xs opacity-80">Solicitar aprovação para gastar</span>
                </Button>
                <Button variant="outline" className="p-6 h-auto flex-col gap-2">
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
