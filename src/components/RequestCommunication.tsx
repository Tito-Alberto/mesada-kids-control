
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { useChildren } from "@/contexts/ChildrenContext";
import { useToast } from "@/hooks/use-toast";

interface RequestCommunicationProps {
  requestId: number;
  isParent?: boolean;
}

const RequestCommunication = ({ requestId, isParent = false }: RequestCommunicationProps) => {
  const { moneyRequests, updateMoneyRequest, children } = useChildren();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const request = moneyRequests.find(r => r.id === requestId);
  const child = request ? children.find(c => c.id === request.childId) : null;

  if (!request || !child) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentMessages = (request as any).messages || [];
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: isParent ? 'parent' : 'child',
      timestamp: new Date().toISOString()
    };

    updateMoneyRequest(requestId, {
      ...request,
      messages: [...currentMessages, newMessage]
    } as any);

    setMessage("");
    
    toast({
      title: "Mensagem enviada!",
      description: isParent ? "Sua mensagem foi enviada para a criança" : "Sua mensagem foi enviada para seus pais",
    });
  };

  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'pending':
        return 'Aguardando resposta';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const messages = (request as any).messages || [];

  return (
    <Card className="mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-base">{request.description}</CardTitle>
              <CardDescription>
                {isParent ? `Solicitação de ${child.name}` : 'Sua solicitação'} • R$ {request.amount.toFixed(2)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'secondary'}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </Badge>
            {messages.length > 0 && (
              <Badge variant="outline">{messages.length} mensagem{messages.length !== 1 ? 's' : ''}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Histórico de mensagens */}
          {messages.length > 0 && (
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {messages.map((msg: any) => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded-lg ${
                    msg.sender === 'parent' 
                      ? 'bg-primary/10 ml-8' 
                      : 'bg-secondary/10 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {msg.sender === 'parent' ? 'Pai/Mãe' : child.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Campo para nova mensagem */}
          <div className="space-y-3">
            <Textarea
              placeholder={isParent ? "Envie uma mensagem para a criança..." : "Envie uma mensagem para seus pais..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensagem
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RequestCommunication;
