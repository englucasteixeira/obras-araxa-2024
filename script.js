let map;
let markers = [];
let infoWindows = [];

async function initMap() {
    try {
        // Importa as bibliotecas necessárias
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        
        // Inicializa o mapa
        map = new Map(document.getElementById("map"), {
            zoom: 12,
            center: data.markers[0].position,
            mapId: "DEMO_MAP_ID",
        });

        // Cria os marcadores
        data.markers.forEach((markerData) => {
            // Cria um pin personalizado com a cor especificada
            const pin = new PinElement({
                background: markerData.color,
                borderColor: "#000000",
                glyphColor: "#FFFFFF",
            });

            // Cria o AdvancedMarkerElement
            const marker = new AdvancedMarkerElement({
                map: map,
                position: markerData.position,
                title: markerData.info.proprietario,
                content: pin.element,
            });

            // Cria a janela de informações
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px;">
                        <p><strong>Responsável pelo Projeto:</strong> ${markerData.info.responsavel_projeto}</p>
                        <p><strong>Responsável pela Execução:</strong> ${markerData.info.responsavel_execucao}</p>
                        <p><strong>Proprietário:</strong> ${markerData.info.proprietario}</p>
                        <p><strong>Área:</strong> ${markerData.info.area} m²</p>
                        <p><strong>Destinação:</strong> ${markerData.info.destinacao}</p>
                    </div>
                `,
            });

            // Adiciona o evento de clique
            marker.addListener("click", () => {
                // Fecha todas as outras janelas de informação
                infoWindows.forEach(iw => iw.close());
                
                // Abre a janela de informação deste marcador
                infoWindow.open({
                    anchor: marker,
                    map: map,
                });
            });

            // Armazena as referências
            markers.push(marker);
            infoWindows.push(infoWindow);
        });
    } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
    }
}

// Adiciona tratamento de erro para carregamento da API
window.initMap = initMap;
window.gm_authFailure = function() {
    console.error('Erro de autenticação na API do Google Maps');
    alert('Erro ao carregar o mapa. Por favor, verifique sua chave de API.');
};