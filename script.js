const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const chatbotShell = document.querySelector("#chatbot-shell");
const chatbotToggle = document.querySelector("#chatbot-toggle");
const chatbotClose = document.querySelector("#chatbot-close");
const chatbotBody = document.querySelector("#chatbot-body");
const chatbotForm = document.querySelector("#chatbot-form");
const chatbotInput = document.querySelector("#chatbot-input");
const suggestionChips = document.querySelectorAll(".suggestion-chip");
const pageLoader = document.querySelector("#page-loader");
const typewriterTargets = document.querySelectorAll("[data-typewriter]");
const revealTargets = document.querySelectorAll(".project-card, .cv-box, .about-img, .about-content, .stack-marquee, .stack-subtitle, .home-img, .home-content, .footer .social-icons, .footer .list, .footer .copyright");

const knowledgeBase = {
    summary: "Leonardo Cardoso é um Desenvolvedor de Software focado em sustentação de aplicações críticas, troubleshooting avançado, backend, APIs e integrações entre sistemas.",
    experience: "Leonardo atua como Desenvolvedor Full Stack com foco em backend, integrações e sustentação de sistemas. Também passou pela Pontal Tech com foco em APIs, SQL, RCS e suporte técnico, e pela Mambo WiFi com atuação forte em redes, autenticação, APIs e infraestrutura corporativa.",
    stack: "As principais tecnologias e ferramentas do Leonardo incluem Node.js, Python, C#, JavaScript, TypeScript, Java, .NET, Django, FastAPI, PostgreSQL, MySQL, MongoDB, Docker, Git, GitHub, Postman e plataformas em nuvem quando necessário.",
    backend: "No backend, Leonardo trabalha com APIs REST, integrações entre sistemas, scripts em Python, ETL, manutenção de serviços em produção, análise de incidentes e sustentação de aplicações distribuídas.",
    projects: "Os projetos em destaque no portfólio incluem Projeto ONG, PulseOS, .NET JWT Auth API, TaskManagerAPI e Chatbot com IA. Eles reforçam experiência com backend, APIs, interfaces web e soluções com aplicação prática.",
    education: "Leonardo é formado em Análise e Desenvolvimento de Sistemas pela UNINOVE e também possui base técnica construída na FIEB, com foco em tecnologia da informação e sistemas.",
    certifications: "Entre os estudos e certificações citados estão Python, lógica de programação, pensamento computacional e fundamentos de Prompt Engineering. O currículo também destaca português nativo e inglês em nível profissional de trabalho.",
    goals: "O objetivo profissional do Leonardo é evoluir continuamente como desenvolvedor, contribuindo com backend, integrações, dados e sustentação em projetos com impacto real no negócio.",
    privacy: "Prefiro manter informações pessoais em sigilo. Posso ajudar com experiência, tecnologias, projetos, formação e objetivos profissionais do Leonardo.",
    fallback: "O chatbot ainda está sendo desenvolvido e alimentado com mais informações. Por enquanto, tente perguntar sobre experiência profissional, tecnologias, projetos, formação, certificações, idiomas ou objetivos de carreira."
};


const sensitiveTerms = [
    "telefone", "celular", "numero", "número", "whatsapp", "endereco", "endereço", "rua", "casa", "bairro", "cep",
    "cpf", "rg", "idade", "data de nascimento", "nascimento", "salario", "salário", "email", "e-mail", "contato pessoal",
    "documento", "estado civil", "familia", "família", "namorada", "namoro", "filho", "filhos", "religiao", "religião",
    "politica", "política"
];



function tokenizeHTML(html) {
    const tokens = [];
    let index = 0;

    while (index < html.length) {
        if (html[index] == "<") {
            const closeIndex = html.indexOf(">", index);
            tokens.push(html.slice(index, closeIndex + 1));
            index = closeIndex + 1;
            continue;
        }

        if (html[index] == "&") {
            const entityEnd = html.indexOf(";", index);
            tokens.push(html.slice(index, entityEnd + 1));
            index = entityEnd + 1;
            continue;
        }

        tokens.push(html[index]);
        index += 1;
    }

    return tokens;
}

function runTypewriter(element) {
    if (!element || element.dataset.typed === "true") return;

    const finalHTML = element.dataset.typewriterHtml || element.innerHTML;
    const tokens = tokenizeHTML(finalHTML);
    const speed = Number(element.dataset.typeSpeed || 16);

    element.dataset.typewriterHtml = finalHTML;
    element.dataset.typed = "true";
    element.classList.add("typewriter-active");
    element.innerHTML = "";

    let html = "";
    let index = 0;

    const tick = () => {
        if (index >= tokens.length) return;
        html += tokens[index];
        element.innerHTML = html;
        index += 1;
        window.setTimeout(tick, speed);
    };

    tick();
}

function setupTypewriterSections() {
    if (!typewriterTargets.length || typeof IntersectionObserver === "undefined") return;

    typewriterTargets.forEach(element => {
        element.classList.add("typewriter-target");
        element.dataset.typewriterHtml = element.innerHTML;
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            runTypewriter(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px"
    });

    typewriterTargets.forEach(element => observer.observe(element));
}


function setupRevealElements() {
    if (!revealTargets.length || typeof IntersectionObserver === "undefined") return;

    revealTargets.forEach(element => element.classList.add("reveal-on-scroll"));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealTargets.forEach(element => observer.observe(element));
}

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function buildMessage(text, type) {
    const wrapper = document.createElement("div");
    wrapper.className = `chatbot-message chatbot-message-${type}`;

    const avatar = document.createElement("div");
    avatar.className = "chatbot-avatar";
    avatar.innerHTML = '<i class="bx bx-bot"></i>';

    const bubble = document.createElement("div");
    bubble.className = "chatbot-bubble";

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    bubble.appendChild(paragraph);

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    return wrapper;
}

function appendMessage(text, type) {
    const node = buildMessage(text, type);
    chatbotBody.appendChild(node);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return node;
}

function appendTyping() {
    const wrapper = document.createElement("div");
    wrapper.className = "chatbot-message chatbot-message-bot chatbot-message-typing";

    const avatar = document.createElement("div");
    avatar.className = "chatbot-avatar";
    avatar.innerHTML = '<i class="bx bx-bot"></i>';

    const bubble = document.createElement("div");
    bubble.className = "chatbot-bubble";
    bubble.appendChild(document.createElement("span"));

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
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
    const waitTime = Math.min(1250, Math.max(520, answer.length * 7));

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

    setupTypewriterSections();
    setupRevealElements();
    window.setTimeout(() => {
        if (pageLoader) pageLoader.classList.add("page-loader-hidden");
        document.body.classList.remove("is-loading");
    }, 950);
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


