
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RequestMoney = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Solicitação enviada! 📱",
        description: `Pedido de R$ ${parseFloat(amount).toFixed(2)} enviado para aprovação dos pais.`,
      });

      // Limpar formulário e voltar
      setAmount("");
      setDescription("");
      navigate("/child");
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
              <h1 className="text-xl font-bold">Pedir Dinheiro</h1>
              <p className="text-sm text-muted-foreground">Solicite aprovação dos seus pais</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="money-gradient text-white mb-6">
            <CardContent className="p-6 text-center">
              <div className="p-4 rounded-full bg-white/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solicitar Dinheiro</h2>
              <p className="text-white/80">
                Faça uma solicitação e aguarde a aprovação dos seus pais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nova Solicitação</CardTitle>
              <CardDescription>
                Preencha os detalhes da sua solicitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Para que você precisa?</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Comprar um livro, lanche na escola, brinquedo..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full money-gradient text-white"
                    disabled={isSubmitting || !amount || !description}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">💡 Dicas para sua solicitação:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Seja específico sobre o que você quer comprar</li>
              <li>• Explique por que é importante para você</li>
              <li>• Lembre-se de ser responsável com o dinheiro</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMoney;
