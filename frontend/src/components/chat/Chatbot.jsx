
import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Bot } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de viajes de COOTRANS Hacaritama. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre rutas, horarios, precios y reservas.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

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
      // Respuesta simulada
      setTimeout(() => {
        const responses = [
          "Para reservar un pasaje, dirígete a la sección 'Reservar Pasaje' en el menú principal. También puedes hacerlo desde el dashboard.",
          "Nuestros horarios de atención en terminal son de lunes a domingo de 5:00 AM a 10:00 PM. Las reservas online están disponibles 24/7.",
          "Contamos con rutas a diferentes municipios de Norte de Santander: Cúcuta, Ocaña, Ábrego, Pamplona, Chinácota, entre otros. ¿A qué destino te gustaría viajar?",
          "El precio de los pasajes varía según el destino y la temporada. Para consultar tarifas actualizadas, visita la sección 'Tarifas' o pregunta por una ruta específica.",
          "Para consultar disponibilidad de asientos, selecciona la ruta y fecha deseada en la sección de reservas. Allí podrás ver los asientos disponibles en tiempo real.",
          "Sí, aceptamos diferentes métodos de pago: efectivo en terminal, tarjeta débito/crédito y PSE (Pagos Seguros en Línea).",
          "La política de cancelación es la siguiente: Cancelaciones con más de 48 horas: 90% de reembolso. Cancelaciones con 24-48 horas: 50% de reembolso. Cancelaciones con menos de 24 horas: No hay reembolso.",
          "Cada pasajero puede llevar 1 maleta grande (hasta 25kg) y 1 equipaje de mano. El equipaje extra tiene un costo adicional."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: randomResponse
        }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
      }]);
      setIsLoading(false);
    }
  };

  // Sugerencias rápidas
  const quickQuestions = [
    "¿Cómo reservar un pasaje?",
    "¿Cuáles son los horarios?",
    "¿Precio a Cúcuta?",
    "¿Política de equipaje?"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Área de mensajes - Más grande para página completa */}
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
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Asistente virtual de COOTRANS Hacaritama • Respuestas simuladas
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Para atención personalizada: Teléfono 318 000 0000
          </p>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;