
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Calendar, DollarSign, TrendingDown } from "lucide-react";

const SpendingHistory = () => {
  const navigate = useNavigate();
  
  const [parentSpendings] = useState([
    { id: 1, date: "2024-06-10", child: "Ana", category: "Mesada", description: "Mesada mensal - Ana", amount: 25.00 },
    { id: 2, date: "2024-06-10", child: "Pedro", category: "Mesada", description: "Mesada mensal - Pedro", amount: 35.00 },
    { id: 3, date: "2024-06-08", child: "Ana", category: "Tarefa Extra", description: "Bônus por boas notas", amount: 10.00 },
    { id: 4, date: "2024-06-05", child: "Pedro", category: "Recompensa", description: "Completou todas as tarefas", amount: 15.00 },
    { id: 5, date: "2024-06-03", child: "Ana", category: "Ajuste", description: "Correção de saldo", amount: 5.00 },
    { id: 6, date: "2024-05-30", child: "Pedro", category: "Bônus", description: "Ajudou a organizar a casa", amount: 8.00 },
    { id: 7, date: "2024-05-28", child: "Ana", category: "Mesada", description: "Mesada mensal - Ana", amount: 25.00 },
    { id: 8, date: "2024-05-28", child: "Pedro", category: "Mesada", description: "Mesada mensal - Pedro", amount: 35.00 },
  ]);

  const [selectedPeriod] = useState("Últimos 30 dias");

  const totalSpent = parentSpendings.reduce((sum, s) => sum + s.amount, 0);
  const spentOnAna = parentSpendings.filter(s => s.child === "Ana").reduce((sum, s) => sum + s.amount, 0);
  const spentOnPedro = parentSpendings.filter(s => s.child === "Pedro").reduce((sum, s) => sum + s.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulação de download do relatório
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Data,Filho,Categoria,Descrição,Valor\n" +
      parentSpendings.map(s => 
        `${s.date},${s.child},${s.category},${s.description},${s.amount}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historico_gastos_pais.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "Mesada": return "default";
      case "Tarefa Extra": return "secondary";
      case "Recompensa": return "outline";
      case "Bônus": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold">Histórico de Gastos dos Pais</h1>
                <p className="text-sm text-muted-foreground">Relatório de investimentos nas mesadas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                  <p className="text-2xl font-bold text-primary">R$ {totalSpent.toFixed(2)}</p>
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
                  <p className="text-sm text-muted-foreground">Gasto com Ana</p>
                  <p className="text-2xl font-bold text-secondary">R$ {spentOnAna.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gasto com Pedro</p>
                  <p className="text-2xl font-bold text-success">R$ {spentOnPedro.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="text-lg font-bold">{selectedPeriod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Investimentos</CardTitle>
            <CardDescription>
              Todos os valores investidos nas mesadas e recompensas dos filhos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Filho</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentSpendings.map((spending) => (
                  <TableRow key={spending.id}>
                    <TableCell>{new Date(spending.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{spending.child}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryVariant(spending.category)}>
                        {spending.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{spending.description}</TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      R$ {spending.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpendingHistory;
