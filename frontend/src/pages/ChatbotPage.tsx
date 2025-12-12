import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Bot, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import imagotipo from "@/assets/imagotipo.png";
import { AccessibilityControls } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { generateChatbotResponse } from "@/services/geminiService";



const ChatbotPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
    const handleLogout = async () => {
      try {
        await signOut();
        toast.success("Sesión cerrada exitosamente");
        navigate("/login");
      } catch (error) {
        toast.error("Error al cerrar sesión");
      }
    };

  // Estado para el chatbot
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de viajes de COOTRANS Hacaritama. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre rutas, horarios, precios y reservas.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim() || isLoading) return;

  const userMessage = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    // Usar Gemini para generar respuesta
    const aiResponse = await generateChatbotResponse(input);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: aiResponse
    }]);
  } catch (error) {
    console.error('Error con Gemini:', error);
    
    // Respuesta de respaldo
    const backupResponses = [
    "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal o desde el dashboard. También puedes llamar al 314 2157928 para asistencia telefónica.",
      
   "Nuestros horarios de atención en terminal son de lunes a sábado de 5:00 AM a 7:00 PM. Las reservas online están disponibles 24/7.",
      
   "El precio del pasaje a Ocaña es de $13,000 pesos colombianos (precio actualizado 2025).",
      
    "Sí, aceptamos pagos en línea a través de PSE (Pagos Seguros en Línea), tarjetas débito/crédito. En terminal aceptamos efectivo y tarjetas.",
      
    "Política de cancelación: • Más de 48h: 90% reembolso • 24-48h: 50% reembolso • Menos de 24h: Sin reembolso",
      
   "Política de equipaje: • 1 maleta grande (25kg) incluida • 1 equipaje de mano • Equipaje extra: $5,000 por pieza"
    ];
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: backupResponses[Math.floor(Math.random() * backupResponses.length)]
    }]);
  } finally {
    setIsLoading(false);
  }
};

  // Sugerencias rápidas
  const quickQuestions = [
    "¿Cómo reservar un pasaje?",
    "¿Cuáles son los horarios?",
    "¿Precio a Ocaña?",
    "¿Aceptan pagos en linea?",
    "¿Politica de cancelación de pasajes?",
    "¿Politica de equipaje?"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={imagotipo} alt="Hacaritama" className="h-10 w-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Asistente de Viajes</h1>
                  <p className="text-sm text-gray-600">COOTRANS Hacaritama</p>
                </div>
              </div>
            <div className="flex items-center justify-end">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center">
                          <AccessibilityControls />
                          <Button variant="ghost" size="sm" onClick={handleLogout}>
                            Cerrar Sesión
                          </Button>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chatbot Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border h-[calc(100vh-300px)] min-h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">¡Hola! Soy tu asistente virtual</h2>
                  <p className="mt-2 opacity-90">
                    Puedo ayudarte con información sobre rutas, horarios, precios y reservas.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            {/* Chatbot Component - Directamente aquí */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl px-6 py-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-white rounded-br-none shadow-lg'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-lg border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === 'assistant' ? (
                          <Bot className="h-4 w-4 text-primary" />
                        ) : null}
                        <span className="text-xs font-semibold opacity-80">
                          {message.role === 'assistant' ? 'Asistente Hacaritama' : 'Tú'}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-6 py-4 rounded-2xl rounded-bl-none shadow-lg border border-gray-100">
                      <div className="flex space-x-2 items-center">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200" />
                        <span className="text-sm text-gray-600 ml-3">Escribiendo respuesta...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Sugerencias rápidas */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preguntas rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="px-4 py-2 bg-white text-sm text-gray-700 rounded-full border border-gray-300 hover:bg-gray-50 hover:border-primary transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input del chat */}
              <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta sobre rutas, horarios, precios..."
                    className="flex-1 px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-4 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    <span className="hidden sm:inline">Enviar</span>
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    Asistente virtual de COOTRANS Hacaritama • Respuestas simuladas
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Para atención personalizada: Teléfono 314 2157928
                  </p>
                </div>
              </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;