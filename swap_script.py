import os

js_append = '''

// ── Chatbot Assistente Peixaria Mancha (Supabase Edge Function) ──
document.addEventListener('DOMContentLoaded', () => {
    const toggleChatBtn = document.getElementById('toggle-chat-btn');
    const chatWidget = document.getElementById('ai-chat-widget');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    
    if (toggleChatBtn && chatWidget) {
        let chatHistory = [];
        const _supabaseUrl = "https://kgyhrapfhfkwgejquyjx.supabase.co/functions/v1/chat-handler";
        
        // Toggle UI
        function toggleChat() {
            const isClosed = chatWidget.classList.contains('opacity-0');
            if (isClosed) {
                chatWidget.classList.remove('opacity-0', 'pointer-events-none', 'scale-95', 'translate-y-8');
                chatWidget.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
                chatInput.focus();
            } else {
                chatWidget.classList.add('opacity-0', 'pointer-events-none', 'scale-95', 'translate-y-8');
                chatWidget.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
            }
        }
        
        toggleChatBtn.addEventListener('click', toggleChat);
        closeChatBtn.addEventListener('click', toggleChat);
        
        // Formatar Respostas
        function addMessageUI(text, isUser = false) {
            const wrapper = document.createElement('div');
            wrapper.className = `max-w-[85%] p-3 text-sm leading-relaxed shadow-sm ${isUser ? 'self-end bg-tertiary text-white rounded-2xl rounded-tr-sm' : 'self-start bg-white/10 border border-white/5 text-white/90 rounded-2xl rounded-tl-sm backdrop-blur-md'}`;
            const formatted = text.replace(/\\n/g, '<br>').replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');
            wrapper.innerHTML = formatted;
            chatMessages.appendChild(wrapper);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return wrapper;
        }
        
        function showLoaderUI() {
            const wrapper = document.createElement('div');
            wrapper.id = "chat-loader";
            wrapper.className = "self-start max-w-[85%] bg-white/10 border border-white/5 p-3 rounded-2xl rounded-tl-sm backdrop-blur-md shadow-sm";
            wrapper.innerHTML = `<div class="flex gap-1.5 items-center h-4 px-2"><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></div><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style="animation-delay: 0.15s"></div><div class="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style="animation-delay: 0.3s"></div></div>`;
            chatMessages.appendChild(wrapper);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function hideLoaderUI() {
            const loader = document.getElementById('chat-loader');
            if (loader) loader.remove();
        }
        
        // Chamada Segura para Supabase Edge Function
        async function handleSend() {
            const text = chatInput.value.trim();
            if (!text) return;
            
            chatInput.value = '';
            sendChatBtn.disabled = true;
            chatInput.disabled = true;
            
            addMessageUI(text, true);
            showLoaderUI();
            
            chatHistory.push({ role: "user", content: text });
            
            try {
                const response = await fetch(_supabaseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        history: chatHistory.slice(0, -1),
                        userMessage: text
                    })
                });
                
                hideLoaderUI();
                const data = await response.json();
                
                if (!response.ok) {
                    console.error("Erro da Inteligência Artificial:", data);
                    throw new Error(data.error || "Ocorreu um erro no servidor Inteligente.");
                }
                
                const botReply = data.reply;
                chatHistory.push({ role: "assistant", content: botReply });
                addMessageUI(botReply, false);
                
            } catch (error) {
                hideLoaderUI();
                console.error("Supabase Func Fetch Error:", error);
                addMessageUI("⚠️ Nossa assistente está sobrecarregada no momento. Tente novamente mais tarde.", false);
            } finally {
                sendChatBtn.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            }
        }
        
        sendChatBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
});
'''

with open('e:\\PROJETOS BREMER\\Peixaria Mancha\\script.js', 'a', encoding='utf-8') as f:
    f.write(js_append)
