const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const chatbotShell = document.querySelector("#chatbot-shell");
const chatbotToggle = document.querySelector("#chatbot-toggle");
const chatbotClose = document.querySelector("#chatbot-close");
const chatbotBody = document.querySelector("#chatbot-body");
const chatbotForm = document.querySelector("#chatbot-form");
const chatbotInput = document.querySelector("#chatbot-input");
const suggestionChips = document.querySelectorAll(".suggestion-chip");

const knowledgeBase = {
    summary: "Leonardo Cardoso é um Desenvolvedor de Software focado em sustentação de aplicações críticas, troubleshooting avançado, backend, APIs e integrações entre sistemas.",
    experience: "Leonardo atua na PierServ como Desenvolvedor Full Stack com foco em backend, integrações e sustentação de sistemas. Também passou pela Pontal Tech com foco em APIs, SQL, RCS e suporte técnico, e pela Mambo WiFi com atuação forte em redes, autenticação, APIs e infraestrutura corporativa.",
    stack: "As principais tecnologias e ferramentas do Leonardo incluem Node.js, Python, C#, JavaScript, TypeScript, Java, .NET, Django, FastAPI, PostgreSQL, MySQL, MongoDB, Docker, Git, GitHub, Postman e plataformas em nuvem quando necessário.",
    backend: "No backend, Leonardo trabalha com APIs REST, integrações entre sistemas, scripts em Python, ETL, manutenção de serviços em produção, análise de incidentes e sustentação de aplicações distribuídas.",
    projects: "Os projetos em destaque no portfólio incluem Projeto ONG, PulseOS, .NET JWT Auth API, TaskManagerAPI e Chatbot com IA. Eles reforçam experiência com backend, APIs, interfaces web e soluções com aplicação prática.",
    education: "Leonardo é formado em Análise e Desenvolvimento de Sistemas pela UNINOVE e também possui base técnica construída na FIEB, com foco em tecnologia da informação e sistemas.",
    certifications: "Entre os estudos e certificações citados estão Python, lógica de programação, pensamento computacional e fundamentos de Prompt Engineering. O currículo também destaca português nativo e inglês em nível profissional de trabalho.",
    goals: "O objetivo profissional do Leonardo é evoluir continuamente como desenvolvedor, contribuindo com backend, integrações, dados e sustentação em projetos com impacto real no negócio.",
    privacy: "Prefiro manter informações pessoais em sigilo. Posso te ajudar com experiência, tecnologias, projetos, formação e objetivos profissionais do Leonardo.",
    fallback: "Posso te ajudar com perguntas sobre experiência profissional, tecnologias, projetos, formação, certificações, idiomas e objetivos de carreira do Leonardo."
};

const sensitiveTerms = [
    "telefone", "celular", "numero", "número", "whatsapp", "endereco", "endereço", "rua", "casa", "bairro", "cep",
    "cpf", "rg", "idade", "data de nascimento", "nascimento", "salario", "salário", "email", "e-mail", "contato pessoal",
    "documento", "estado civil", "familia", "família", "namorada", "namoro", "filho", "filhos", "religiao", "religião",
    "politica", "política"
];

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function appendMessage(text, type) {
    const wrapper = document.createElement("div");
    wrapper.className = `chatbot-message ${type}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    wrapper.appendChild(paragraph);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return wrapper;
}

function appendTyping() {
    const wrapper = document.createElement("div");
    wrapper.className = "chatbot-message bot typing";

    const paragraph = document.createElement("p");
    const dotAnchor = document.createElement("span");

    paragraph.appendChild(dotAnchor);
    wrapper.appendChild(paragraph);
    chatbotBody.appendChild(wrapper);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return wrapper;
}

function getAnswer(question) {
    const normalized = normalize(question);

    if (sensitiveTerms.some(term => normalized.includes(normalize(term)))) return knowledgeBase.privacy;
    if (normalized.includes("experiencia") || normalized.includes("trabalhou") || normalized.includes("pierserv") || normalized.includes("pontal") || normalized.includes("mambo")) return knowledgeBase.experience;
    if (normalized.includes("tecnologia") || normalized.includes("stack") || normalized.includes("linguagem") || normalized.includes("ferramenta") || normalized.includes("domina")) return knowledgeBase.stack;
    if (normalized.includes("backend") || normalized.includes("api") || normalized.includes("integracao") || normalized.includes("sql") || normalized.includes("etl")) return knowledgeBase.backend;
    if (normalized.includes("projeto") || normalized.includes("github") || normalized.includes("portfolio") || normalized.includes("portifolio")) return knowledgeBase.projects;
    if (normalized.includes("formacao") || normalized.includes("faculdade") || normalized.includes("curso") || normalized.includes("uninove") || normalized.includes("fieb")) return knowledgeBase.education;
    if (normalized.includes("certificacao") || normalized.includes("ingles") || normalized.includes("idioma")) return knowledgeBase.certifications;
    if (normalized.includes("objetivo") || normalized.includes("vaga") || normalized.includes("busca") || normalized.includes("carreira")) return knowledgeBase.goals;
    if (normalized.includes("quem e") || normalized.includes("quem eh") || normalized.includes("resumo") || normalized.includes("sobre ele")) return knowledgeBase.summary;

    return knowledgeBase.fallback;
}

function handleQuestion(question) {
    if (!question.trim()) return;

    appendMessage(question.trim(), "user");
    const answer = getAnswer(question);
    const typing = appendTyping();
    const waitTime = Math.min(1200, Math.max(500, answer.length * 7));

    window.setTimeout(() => {
        typing.remove();
        appendMessage(answer, "bot");
    }, waitTime);
}

window.addEventListener("load", () => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    if (navigationEntry && navigationEntry.type === "reload" && window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
});

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
    };
}

if (chatbotToggle && chatbotShell) {
    chatbotToggle.addEventListener("click", () => {
        chatbotShell.classList.toggle("chatbot-open");
        if (chatbotShell.classList.contains("chatbot-open") && chatbotInput) {
            window.setTimeout(() => chatbotInput.focus(), 180);
        }
    });
}

if (chatbotClose && chatbotShell) {
    chatbotClose.addEventListener("click", () => chatbotShell.classList.remove("chatbot-open"));
}

if (chatbotForm && chatbotInput) {
    chatbotForm.addEventListener("submit", event => {
        event.preventDefault();
        const question = chatbotInput.value;
        chatbotInput.value = "";
        handleQuestion(question);
    });
}

if (suggestionChips.length) {
    suggestionChips.forEach(chip => chip.addEventListener("click", () => handleQuestion(chip.textContent || "")));
}

document.addEventListener("click", event => {
    if (!chatbotShell || !chatbotShell.classList.contains("chatbot-open")) return;
    if (chatbotShell.contains(event.target)) return;
    chatbotShell.classList.remove("chatbot-open");
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && chatbotShell?.classList.contains("chatbot-open")) {
        chatbotShell.classList.remove("chatbot-open");
    }
});
