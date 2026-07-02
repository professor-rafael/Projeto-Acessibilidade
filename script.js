// ==========================================
// 1. ACESSIBILIDADE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const botaoDeAcessibilidade = document.getElementById('botao-acessibilidade');
    const opcoesDeAcessibilidade = document.getElementById('opcoes-acessibilidade');

    botaoDeAcessibilidade.addEventListener('click', function() {
        botaoDeAcessibilidade.classList.toggle('rotacao-botao');
        opcoesDeAcessibilidade.classList.toggle('apresenta-lista');

        const botaoSelecionado = botaoDeAcessibilidade.getAttribute('aria-expanded') === 'true';
        botaoDeAcessibilidade.setAttribute('aria-expanded', !botaoSelecionado);
    });

    const aumentaFonteBotao = document.getElementById('aumentar-fonte');
    const diminuiFonteBotao = document.getElementById('diminuir-fonte');
    const alternaContraste = document.getElementById('alterna-contraste');

    let tamanhoAtualFonte = 1;

    aumentaFonteBotao.addEventListener('click', function() {
        tamanhoAtualFonte += 0.1;
        document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
    });

    diminuiFonteBotao.addEventListener('click', function() {
        if (tamanhoAtualFonte > 0.5) {
            tamanhoAtualFonte -= 0.1;
            document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
        }
    });

    alternaContraste.addEventListener('click', function() {
        document.body.classList.toggle('alto-contraste');
    });
});

// ==========================================
// 2. SCROLL REVEAL
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '50px',
            duration: 1000,
            easing: 'ease-in-out',
            reset: false
        });

        sr.reveal('#inicio', { origin: 'bottom', delay: 200 });
        sr.reveal('#galeria', { origin: 'bottom', delay: 300 });
        sr.reveal('#contato', { origin: 'bottom', delay: 400 });
        sr.reveal('.conversor-container', { origin: 'bottom', delay: 500 });
    }
});

// ==========================================
// 3. CONVERSOR DE TEXTO PARA FALA
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('entrada-de-texto');
    const fileInput = document.getElementById('upload-arquivo');
    const ouvirBtn = document.getElementById('ouvir-btn');
    const baixarBtn = document.getElementById('baixar-texto-btn');
    const vozSelect = document.getElementById('selecao-voz');

    let synth = window.speechSynthesis;
    let utterance = null;
    let vozesDisponiveis = [];

    // Carregar vozes
    function carregarVozes() {
        vozesDisponiveis = synth.getVoices();
        vozSelect.innerHTML = '';
        
        if (vozesDisponiveis.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Nenhuma voz disponível';
            vozSelect.appendChild(option);
            return;
        }

        vozesDisponiveis.forEach((voz, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voz.name} (${voz.lang})`;
            vozSelect.appendChild(option);
        });

        // Selecionar voz em português se disponível
        for (let i = 0; i < vozesDisponiveis.length; i++) {
            if (vozesDisponiveis[i].lang.startsWith('pt')) {
                vozSelect.value = i;
                break;
            }
        }
    }

    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = carregarVozes;
    }
    // Fallback
    setTimeout(carregarVozes, 500);

    // Ler texto
    function falar() {
        const texto = textarea.value.trim();
        if (!texto) {
            alert('Por favor, digite ou carregue um texto primeiro.');
            return;
        }

        // Cancela qualquer fala anterior
        if (synth.speaking) {
            synth.cancel();
        }

        utterance = new SpeechSynthesisUtterance(texto);
        const vozSelecionada = vozesDisponiveis[parseInt(vozSelect.value)];
        if (vozSelecionada) {
            utterance.voice = vozSelecionada;
        }
        utterance.lang = 'pt-BR';
        utterance.rate = 1;
        utterance.pitch = 1;

        synth.speak(utterance);
    }

    ouvirBtn.addEventListener('click', falar);

    // Carregar arquivo .txt
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            textarea.value = event.target.result;
        };
        reader.readAsText(file);
        // Resetar input para permitir carregar o mesmo arquivo novamente
        fileInput.value = '';
    });

    // Baixar texto
    baixarBtn.addEventListener('click', function() {
        const texto = textarea.value.trim();
        if (!texto) {
            alert('Não há texto para baixar.');
            return;
        }
        const blob = new Blob([texto], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'texto_convertido.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });

    // Tecla Enter + Shift para ouvir
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            falar();
        }
    });
});

// ==========================================
// 4. FORMULÁRIO DE CONTATO
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            if (nome && email && mensagem) {
                alert(`Mensagem enviada com sucesso!\n\nNome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`);
                formContato.reset();
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }
});

// ==========================================
// 5. LÂMPADAS (NEWTON LIGHT BULB)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se as bibliotecas necessárias existem
    if (typeof gsap === 'undefined' || typeof MorphSVGPlugin === 'undefined') {
        console.warn('GSAP ou MorphSVGPlugin não carregados. Pulando animação das lâmpadas.');
        return;
    }

    // Tenta encontrar os elementos das lâmpadas
    const BULBS = document.querySelectorAll('.light-bulb__bulb');
    if (!BULBS || BULBS.length === 0) {
        console.warn('Elementos das lâmpadas não encontrados. Pulando animação.');
        return;
    }

    // Configuração para as lâmpadas
    const CONFIG = {
        ROTATION: 30,
        SPEEDS: {
            ON: 0.05,
            STAGGER: 0.05,
            SWING: 0.5,
            EASE: 4
        }
    };

    try {
        const CHORDS = document.querySelectorAll('.light-bulb__chord');
        const GLASSES = document.querySelectorAll('.light-bulb__glass');
        const BLOOMS = document.querySelectorAll('.light-bulb__bloom');
        const FILAMENTS = document.querySelectorAll('g.light-bulb__filament');

        // Verifica se os elementos existem
        if (BULBS.length < 2 || CHORDS.length < 2 || GLASSES.length < 2 || FILAMENTS.length < 2) {
            console.warn('Elementos insuficientes para animação das lâmpadas.');
            return;
        }

        // Configuração inicial
        gsap.set('.wrapper', { display: 'block' });
        gsap.set(BULBS[1], { transformOrigin: '50% -375%', rotate: -CONFIG.ROTATION });
        gsap.set(CHORDS[1], { 
            morphSVG: { 
                d: 'M68.91306296.0087038s.77124463 23.43903799 6.34896852 36.75152668c9.014994 21.51630343 16.57659448 28.05805003 16.57659448 28.05805003' 
            } 
        });
        gsap.set(GLASSES, { '--light-alpha': 0 });
        gsap.set(GLASSES[1], {
            '--light-alpha': 1,
            '--glass-saturation': 100,
            '--glass-lightness': 50
        });
        gsap.set(FILAMENTS[1], { '--filament-lightness': 100 });

        // Animação principal
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

        // Lâmpada da direita apaga
        tl.to(GLASSES[1], {
            '--light-alpha': 0,
            '--glass-saturation': 0,
            '--glass-lightness': 30,
            duration: 0.3,
            delay: 0.5
        })
        .to(FILAMENTS[1], {
            '--filament-lightness': 40,
            duration: 0.3
        }, '-=0.3')
        // Lâmpada da direita acende
        .to(GLASSES[1], {
            '--light-alpha': 1,
            '--glass-saturation': 100,
            '--glass-lightness': 50,
            duration: 0.3
        })
        .to(FILAMENTS[1], {
            '--filament-lightness': 100,
            duration: 0.3
        }, 0);

        // Pisca as outras lâmpadas se existirem
        if (GLASSES.length >= 4 && FILAMENTS.length >= 4) {
            tl.to([GLASSES[2], GLASSES[0], GLASSES[3]], {
                '--light-alpha': 1,
                '--glass-saturation': 100,
                '--glass-lightness': 50,
                duration: 0.15,
                stagger: 0.05
            }, '+=0.3')
            .to([FILAMENTS[2], FILAMENTS[0], FILAMENTS[3]], {
                '--filament-lightness': 100,
                duration: 0.15,
                stagger: 0.05
            }, '-=0.15')
            .to([GLASSES[2], GLASSES[0], GLASSES[3]], {
                '--light-alpha': 0,
                '--glass-saturation': 0,
                '--glass-lightness': 30,
                duration: 0.2,
                stagger: 0.05,
                delay: 0.3
            })
            .to([FILAMENTS[2], FILAMENTS[0], FILAMENTS[3]], {
                '--filament-lightness': 40,
                duration: 0.2,
                stagger: 0.05
            }, '-=0.2');
        }

        // Efeito de brilho (bloom)
        if (BLOOMS.length > 0) {
            tl.to(BLOOMS, {
                scale: 1.3,
                opacity: 0,
                duration: 0.4,
                stagger: 0.05
            }, 0)
            .to(BLOOMS, {
                scale: 0,
                opacity: 1,
                duration: 0.1
            }, '+=0.4');
        }

    } catch (e) {
        console.warn('Erro na animação das lâmpadas:', e);
    }
});