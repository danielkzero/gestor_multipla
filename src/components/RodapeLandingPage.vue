<template>
    <footer class="bg-dark text-light py-5">
        <div class="container-sm">
            <div class="row">
                <!-- Instalação e Experimente Grátis -->
                <div class="col-md-4 mb-4">
                    <h5 class="fw-bold">Instale o GestorMobile</h5>
                    <p><a href="#" class="text-decoration-none text-light">Experimente grátis por 1 mês</a></p>
                    <p>
                        <a href="https://play.google.com/store/apps/dev?id=4658704075736141999&pli=1" target="_blank" class="text-decoration-none text-light">
                            <i class="bx bxl-play-store bx-sm"></i> Google Play
                        </a>
                    </p>
                </div>

                <!-- Atendimento e Suporte -->
                <div class="col-md-4 mb-4">
                    <h5 class="fw-bold">Atendimento</h5>
                    <p>Segunda a Sexta das 8h às 17h (horário de Brasília)</p>
                    <p><a href="tel:024999699849" class="text-decoration-none"><i class="bx bx-phone bx-sm"></i> (24) 99969-9849</a></p>
                    <p><a href="https://wa.me/+5524999699849" target="_blank" class="text-decoration-none"><i class="bx bxl-whatsapp bx-sm"></i> (24) 99969-9849</a></p>
                    <p><a href="mailto:contato@hydradigital.com.br" class="text-decoration-none"><i class="bx bx-envelope bx-sm"></i> contato@hydradigital.com.br</a></p>
                </div>

                <!-- Download e Informações -->
                <div class="col-md-4 mb-4">
                    <h5 class="fw-bold">Download suporte</h5>
                    <p>
                        <a href="https://anydesk.com/pt/downloads/thank-you?dv=win_exe" target="_blank" class="text-decoration-none text-light">
                            <i class="bx bxs-download bx-sm"></i> AnyDesk
                        </a>
                    </p>
                    <p>
                        <a href="https://hydradigital.com.br" target="_blank" class="text-decoration-none">
                            <div class="row p-0 m-0">
                                <div class="col-auto p-0 m-0">
                                    <img src="@/assets/logo-hydra.png" height="65" />
                                </div>
                                <div class="col p-0 m-0 ms-3" >
                                    Desenvolvido por<br />
                                    <strong>Hydra Digital</strong><br />
                                    Daniel Ramos
                                </div>
                            </div>
                        </a>
                    </p>

                    <p>
                        <a href="#" class="text-decoration-none text-light">Termos e Condições de Uso</a> |
                        <a href="#" class="text-decoration-none text-light">Política de privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {};
</script>

<style scoped>
/* Custom CSS for footer */
footer a {
    color: #ffffff;
}

footer a:hover {
    text-decoration: underline;
}
</style>