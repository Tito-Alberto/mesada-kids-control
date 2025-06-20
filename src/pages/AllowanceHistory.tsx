
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Calendar, DollarSign } from "lucide-react";

const AllowanceHistory = () => {
  const navigate = useNavigate();
  
  const [transactions] = useState([
    { id: 1, date: "2024-06-10", type: "Mesada", description: "Mesada mensal", amount: 25.00, balance: 73.50 },
    { id: 2, date: "2024-06-08", type: "Gasto", description: "Lanche na escola", amount: -8.50, balance: 48.50 },
    { id: 3, date: "2024-06-05", type: "Tarefa", description: "Arrumou o quarto", amount: 5.00, balance: 57.00 },
    { id: 4, date: "2024-06-03", type: "Gasto", description: "Figurinhas", amount: -12.00, balance: 52.00 },
    { id: 5, date: "2024-06-01", type: "Tarefa", description: "Ajudou na cozinha", amount: 7.00, balance: 64.00 },
    { id: 6, date: "2024-05-30", type: "Gasto", description: "Doces", amount: -5.00, balance: 57.00 },
    { id: 7, date: "2024-05-28", type: "Mesada", description: "Mesada mensal", amount: 25.00, balance: 62.00 },
  ]);

  const [selectedPeriod] = useState("Últimos 30 dias");

  const totalReceived = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulação de download do relatório
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Data,Tipo,Descrição,Valor,Saldo\n" +
      transactions.map(t => 
        `${t.date},${t.type},${t.description},${t.amount},${t.balance}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historico_mesada.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "Mesada": return "default";
      case "Tarefa": return "secondary";
      case "Gasto": return "destructive";
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
                <h1 className="text-xl font-bold">Histórico da Mesada</h1>
                <p className="text-sm text-muted-foreground">Relatório detalhado de transações</p>
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/20">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Recebido</p>
                  <p className="text-2xl font-bold text-success">Kz {totalReceived.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <DollarSign className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="text-2xl font-bold text-destructive">Kz {totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Período</p>
                  <p className="text-lg font-bold">{selectedPeriod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              Todas as movimentações da sua mesada nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      transaction.amount > 0 ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}Kz {Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Kz {transaction.balance.toFixed(2)}
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

export default AllowanceHistory;
