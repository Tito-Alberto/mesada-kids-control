
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Wallet, DollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary">
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            MesadaKids
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ensine educação financeira de forma divertida! Gerencie mesadas, tarefas e conquistas dos seus filhos.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="gradient-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Para os Pais</CardTitle>
                  <CardDescription>Controle total da educação financeira</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Gerenciar mesadas e saldos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Criar tarefas com recompensas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Aprovar gastos e transferências</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm">Relatórios e histórico completo</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/login?type=parent")} 
                className="w-full mt-4 task-gradient text-white hover:shadow-lg"
              >
                Acesso dos Pais
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-secondary">Para as Crianças</CardTitle>
                  <CardDescription>Aprender brincando com dinheiro</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm">Ver saldo e mesada atual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm">Completar tarefas divertidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm">Pedir aprovação para gastos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm">Conquistas e recompensas</span>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/login?type=child")} 
                className="w-full mt-4 money-gradient text-white hover:shadow-lg"
              >
                Acesso das Crianças
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Por que usar o MesadaKids?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Educação Financeira</h3>
              <p className="text-sm text-muted-foreground">Ensine seus filhos sobre dinheiro, poupança e responsabilidade financeira de forma prática.</p>
            </div>
            <div className="p-6 rounded-xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">Motivação</h3>
              <p className="text-sm text-muted-foreground">Sistema de tarefas e recompensas que torna o aprendizado divertido e motivador.</p>
            </div>
            <div className="p-6 rounded-xl bg-card border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="font-semibold mb-2">Controle Parental</h3>
              <p className="text-sm text-muted-foreground">Supervisão completa com aprovações necessárias para gastos e transferências.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
