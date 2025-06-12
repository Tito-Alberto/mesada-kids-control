
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Star, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Achievements = () => {
  const navigate = useNavigate();

  const achievements = [
    {
      id: 1,
      title: "Primeira Tarefa",
      description: "Complete sua primeira tarefa",
      icon: "🎯",
      unlocked: true,
      unlockedAt: "Hoje",
      points: 10
    },
    {
      id: 2,
      title: "Organizador",
      description: "Complete 5 tarefas de organização",
      icon: "🧹",
      unlocked: true,
      unlockedAt: "Ontem",
      points: 25
    },
    {
      id: 3,
      title: "Estudioso",
      description: "Complete 3 tarefas de estudo",
      icon: "📚",
      unlocked: false,
      progress: 2,
      total: 3,
      points: 30
    },
    {
      id: 4,
      title: "Chef Junior",
      description: "Ajude na cozinha 5 vezes",
      icon: "👨‍🍳",
      unlocked: false,
      progress: 1,
      total: 5,
      points: 40
    },
    {
      id: 5,
      title: "Econômico",
      description: "Economize R$ 50,00",
      icon: "💰",
      unlocked: false,
      progress: 25.50,
      total: 50,
      points: 50
    },
    {
      id: 6,
      title: "Super Responsável",
      description: "Complete 20 tarefas no total",
      icon: "⭐",
      unlocked: false,
      progress: 8,
      total: 20,
      points: 100
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/child")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Minhas Conquistas</h1>
              <p className="text-sm text-muted-foreground">Veja todas suas medalhas e progresso</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="achievement-gradient text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
              <p className="text-white/80 text-sm">Conquistas Desbloqueadas</p>
            </CardContent>
          </Card>

          <Card className="money-gradient text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-white/80 text-sm">Pontos Totais</p>
            </CardContent>
          </Card>

          <Card className="task-gradient text-white">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-2xl font-bold">{achievements.length - unlockedAchievements.length}</p>
              <p className="text-white/80 text-sm">Em Progresso</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements List */}
        <div className="space-y-6">
          {/* Unlocked Achievements */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Conquistas Desbloqueadas
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="border-success/20 bg-success/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-xs text-success">Desbloqueado {achievement.unlockedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* In Progress Achievements */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Em Progresso
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.filter(a => !a.unlocked).map((achievement) => (
                <Card key={achievement.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl opacity-50">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <Badge variant="outline">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        
                        {achievement.progress !== undefined && achievement.total && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{achievement.progress} / {achievement.total}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.total) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <Card className="mt-8 gradient-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌟</span>
              Continue assim!
            </CardTitle>
            <CardDescription>
              Você está indo muito bem! Continue completando tarefas para desbloquear mais conquistas.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;
