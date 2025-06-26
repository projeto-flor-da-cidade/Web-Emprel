import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import {
    FiCompass, FiLoader, FiAlertTriangle, FiArrowRight, FiMaximize, FiMinimize,
    FiSearch, FiNavigation, FiX, FiMenu, FiChevronDown, FiPlus, FiMinus
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import screenfull from 'screenfull';

import api, { BACKEND_URL } from '../services/api';

// Ícones importados como módulos
import HortaComunitariaIcon from '../assets/icons/horta-comunitaria.svg';
import HortaDefaultIcon from '../assets/icons/horta-default.svg';
import HortaEscolarIcon from '../assets/icons/horta-escolar.svg';
import HortaInstitucionalIcon from '../assets/icons/horta-institucional.svg';
import SeauIcon from '../assets/icons/seau.svg';
import TerreiroIcon from '../assets/icons/terreiro.svg';
import UnidadeDeSaudeIcon from '../assets/icons/unidade-de-saude.svg';

// --- ÍCONES E CONFIGURAÇÕES DO MAPA ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Função de normalização CORRIGIDA para lidar com acentos
const normalizeTipoNome = (nome) => {
    if (!nome) return 'DEFAULT';
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
};

// Objeto Icons ATUALIZADO para corresponder aos nomes normalizados do banco de dados
const Icons = {
    DEFAULT: new L.Icon({ iconUrl: HortaDefaultIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    ESCOLAR: new L.Icon({ iconUrl: HortaEscolarIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),           // De "Escolar"
    SAUDE: new L.Icon({ iconUrl: UnidadeDeSaudeIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),         // De "Saúde"
    INSTITUCIONAL: new L.Icon({ iconUrl: HortaInstitucionalIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),// De "Institucional"
    COMUNITARIA: new L.Icon({ iconUrl: HortaComunitariaIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),  // De "Comunitária"
    SEAU: new L.Icon({ iconUrl: SeauIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),                  // De "Seau" (se existir no BD)
    TERREIRO: new L.Icon({ iconUrl: TerreiroIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),            // De "Terreiro" (se existir no BD)
};


// --- COMPONENTES AUXILIARES (código completo) ---
const HortaPopup = ({ horta, onSetAsDestination }) => {
    const navigate = useNavigate();
    const imageUrl = horta.imagemCaminho && horta.imagemCaminho !== 'folhin.png'
        ? `${BACKEND_URL}/uploads/imagem/${horta.imagemCaminho}`
        : '/placeholder-horta.png';

    return (
        <div className="w-60 font-sans">
            {horta.imagemCaminho && <img src={imageUrl} alt={horta.nomeHorta} className="w-full h-32 object-cover rounded-t-md" />}
            <div className="p-3">
                <h3 className="font-bold text-gray-800 mb-1 text-base truncate">{horta.nomeHorta}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{horta.endereco}</p>
                <div className="space-y-1.5">
                    <button onClick={() => navigate(`/hortas/${horta.idHorta}`)} className="w-full text-xs py-1.5 px-2 text-center font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md flex items-center justify-center gap-1"> Ver Detalhes <FiArrowRight size={14}/> </button>
                    <button onClick={() => onSetAsDestination(horta)} className="w-full text-xs py-1.5 px-2 text-center font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center gap-1"> Destino <FiNavigation size={14}/> </button>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({
    tiposDeHorta, activeFilters, onToggleFilter, onSelectAllFilters,
    searchTerm, onSearchTermChange, onSearchSubmit,
    startPoint, onStartPointChange, destinationPoint,
    onCalculateRoute, onClearRoute, isCalculatingRoute, onClose
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(true);
    const allFiltersActuallySelected = tiposDeHorta.length > 0 && activeFilters.length === tiposDeHorta.length;
    const isEffectivelyAllSelected = activeFilters.length === 0 || allFiltersActuallySelected;

    return (
        <div className="w-full sm:w-80 md:w-96 h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-green-700">Unidades Produtivas</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><FiX size={20} /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Buscar Horta</h3>
                    <form onSubmit={onSearchSubmit} className="flex gap-2">
                        <input type="text" placeholder="Nome ou endereço..." value={searchTerm} onChange={onSearchTermChange} className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"/>
                        <button type="submit" className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"><FiSearch /></button>
                    </form>
                </section>
                <section>
                    <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="flex items-center justify-between w-full py-2 text-left font-semibold text-gray-700">
                        <span className="text-sm uppercase text-gray-500">Filtrar por Tipo</span>
                        <FiChevronDown className={`transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isFiltersOpen && (
                        <div className="mt-2 space-y-1.5 text-sm">
                            <label className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-md cursor-pointer">
                                <input type="checkbox" checked={isEffectivelyAllSelected} onChange={() => onSelectAllFilters(!allFiltersActuallySelected)} disabled={tiposDeHorta.length === 0} className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <span className="text-gray-700">Todos os Tipos</span>
                            </label>
                            {tiposDeHorta.map(tipo => (
                                <label key={tipo.idTipoDeHorta} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-md cursor-pointer">
                                    <input type="checkbox" checked={activeFilters.includes(tipo.nome)} onChange={() => onToggleFilter(tipo.nome)} className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                    <span className="text-gray-700">{tipo.nome}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </section>
                <section>
                     <button onClick={() => setIsRoutePlannerOpen(!isRoutePlannerOpen)} className="flex items-center justify-between w-full py-2 text-left font-semibold text-gray-700">
                        <span className="text-sm uppercase text-gray-500">Planejar Rota</span>
                        <FiChevronDown className={`transform transition-transform ${isRoutePlannerOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isRoutePlannerOpen && (
                        <div className="mt-2 space-y-3 text-sm">
                            <div>
                                <label htmlFor="startPoint" className="block text-xs font-medium text-gray-600 mb-0.5">Ponto de Partida</label>
                                <input type="text" id="startPoint" placeholder="Meu local ou endereço" value={startPoint} onChange={onStartPointChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="destinationPoint" className="block text-xs font-medium text-gray-600 mb-0.5">Destino (Horta)</label>
                                <input type="text" id="destinationPoint" placeholder="Selecione uma horta no mapa" value={destinationPoint} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={onCalculateRoute} disabled={isCalculatingRoute || !startPoint || !destinationPoint} className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                                    {isCalculatingRoute ? <FiLoader className="animate-spin"/> : <FiNavigation size={16}/>}
                                    Calcular
                                </button>
                                <button onClick={onClearRoute} className="py-2 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"><FiX size={16}/></button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const MapControls = ({ onToggleFullScreen, isFullScreen, onToggleSidebar }) => {
    const map = useMap();

    const zoomIn = () => map.zoomIn();
    const zoomOut = () => map.zoomOut();

    const locateUser = () => {
        map.locate({ setView: true, maxZoom: 16 });
    };

    useEffect(() => {
        const handleLocationFound = (e) => {
            const radius = e.accuracy;
            L.marker(e.latlng).addTo(map)
              .bindPopup(`Você está a um raio de ${radius.toFixed(0)} metros deste ponto`).openPopup();
            L.circle(e.latlng, radius).addTo(map);
        };

        const handleLocationError = (e) => {
            alert(e.message);
        };

        map.on('locationfound', handleLocationFound);
        map.on('locationerror', handleLocationError);

        return () => {
            map.off('locationfound', handleLocationFound);
            map.off('locationerror', handleLocationError);
        };
    }, [map]);

    return (
        <>
            <div className="leaflet-top leaflet-left">
                <div className="leaflet-control leaflet-bar mt-2 ml-2">
                    <button onClick={onToggleSidebar} title="Unidades Produtivas" className="p-2.5 bg-white hover:bg-gray-100">
                        <FiMenu className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="leaflet-top leaflet-right">
                 <div className="leaflet-control leaflet-bar mt-2 mr-2">
                    <button onClick={zoomIn} title="Aproximar" className="p-2.5 bg-white hover:bg-gray-100"><FiPlus className="w-5 h-5 text-gray-700"/></button>
                    <button onClick={zoomOut} title="Afastar" className="p-2.5 bg-white hover:bg-gray-100 border-t border-gray-200"><FiMinus className="w-5 h-5 text-gray-700"/></button>
                 </div>
                 <div className="leaflet-control leaflet-bar mt-2 mr-2">
                    <button onClick={locateUser} title="Achar minha localização" className="p-2.5 bg-white hover:bg-gray-100">
                        <FiCompass className="w-5 h-5 text-gray-700" />
                    </button>
                    {screenfull.isEnabled && (
                        <button onClick={onToggleFullScreen} title={isFullScreen ? "Sair da Tela Cheia" : "Tela Cheia"} className="p-2.5 bg-white hover:bg-gray-100 border-t border-gray-200">
                            {isFullScreen ? <FiMinimize className="w-5 h-5 text-gray-700" /> : <FiMaximize className="w-5 h-5 text-gray-700" />}
                        </button>
                    )}
                 </div>
            </div>
        </>
    );
};

const MapComponent = ({ isEmbedded = false }) => {
    const [allHortas, setAllHortas] = useState([]);
    const [filteredHortas, setFilteredHortas] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);
    const [tiposDeHortaOptions, setTiposDeHortaOptions] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const mapContainerRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [startPoint, setStartPoint] = useState("");
    const [destinationHorta, setDestinationHorta] = useState(null);
    const [routingControl, setRoutingControl] = useState(null);
    const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
    const mapRef = useRef(null);

    const initialPosition = [-8.05428, -34.8813];

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await api.get('/hortas/tipo');
                setTiposDeHortaOptions(response.data || []);
            } catch (err) { console.error("Erro ao buscar tipos de horta:", err); }
        };
        fetchTipos();
    }, []);

    const fetchAndGeocodeHortas = useCallback(async (term = "") => {
        setLoadingMessage('Carregando lista de hortas...');
        setError(null);
        setAllHortas([]); // Limpa as hortas atuais para evitar mostrar dados antigos durante o carregamento
        try {
            const response = await api.get('/hortas/public/ativas');
            let hortasParaGeocodificar = response.data;

            if (term) {
                const lowerTerm = term.toLowerCase();
                hortasParaGeocodificar = hortasParaGeocodificar.filter(
                    horta => horta.nomeHorta?.toLowerCase().includes(lowerTerm) ||
                             horta.endereco?.toLowerCase().includes(lowerTerm)
                );
            }

            if (!hortasParaGeocodificar || hortasParaGeocodificar.length === 0) {
                setLoadingMessage(term ? 'Nenhuma horta encontrada com o termo pesquisado.' : 'Nenhuma horta ativa encontrada no momento.');
                return;
            }
            setLoadingMessage(`Geocodificando ${hortasParaGeocodificar.length} endereços... Isso pode levar alguns instantes.`);

            const geocodePromises = hortasParaGeocodificar.map(async (horta) => {
                const fullAddress = `${horta.endereco}, Recife, PE, Brasil`;
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;

                try {
                    // Adiciona um pequeno delay aleatório para não sobrecarregar o Nominatim
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));

                    const geoResponse = await fetch(url);
                    if (!geoResponse.ok) {
                        // Não tratar como erro fatal para toda a lista, apenas logar
                        console.warn(`Erro na geocodificação (HTTP ${geoResponse.status}): ${horta.endereco}`);
                        return null;
                    }
                    const data = await geoResponse.json();

                    if (data && data[0]) {
                        return { ...horta, latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
                    }
                    console.warn(`Endereço não encontrado ou geocodificação falhou para: ${horta.endereco}`);
                    return null;
                } catch (err) {
                    console.error(`Falha ao geocodificar o endereço: ${horta.endereco}`, err);
                    return null; // Retorna null para esta horta, mas continua com as outras
                }
            });
            const results = await Promise.all(geocodePromises);
            const validHortas = results.filter(h => h !== null && typeof h.latitude === 'number' && typeof h.longitude === 'number');
            setAllHortas(validHortas);

             if (validHortas.length === 0 && hortasParaGeocodificar.length > 0) {
                setError(term ? "Não foi possível localizar as hortas com o termo pesquisado." : "Não foi possível geocodificar os endereços das hortas ativas.");
            } else if (validHortas.length > 0) {
                setError(null); // Limpa erro se hortas válidas foram encontradas
            }
        } catch (err) {
            setError("Erro crítico: Não foi possível carregar os dados das hortas. Verifique sua conexão ou tente mais tarde.");
            console.error("Erro ao buscar/geocodificar hortas:", err);
        } finally {
            setLoadingMessage('');
        }
    }, []);


    useEffect(() => {
        fetchAndGeocodeHortas();
    }, [fetchAndGeocodeHortas]);

    useEffect(() => {
        let hortasToShow = allHortas;
        if (activeFilters.length > 0) {
            hortasToShow = hortasToShow.filter(horta =>
                horta.tipoDeHorta && activeFilters.includes(horta.tipoDeHorta.nome)
            );
        }
        setFilteredHortas(hortasToShow);
    }, [activeFilters, allHortas]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchAndGeocodeHortas(searchTerm);
    };

    const handleSetAsDestination = (horta) => {
        setDestinationHorta(horta);
        if (isEmbedded || !isSidebarOpen) { // Abre a sidebar se estiver embutido ou se não estiver já aberta
            setIsSidebarOpen(true);
        }
    };

    const handleCalculateRoute = useCallback(async () => {
        if (!mapRef.current || !startPoint || !destinationHorta) return;

        setIsCalculatingRoute(true);
        if (routingControl) {
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null);
        }

        try {
            // Tenta geocodificar o ponto de partida se não for "Minha Localização" (ou similar)
            let startLatLng;
            if (startPoint.toLowerCase().includes('minha localização') || startPoint.toLowerCase().includes('local atual')) {
                 await new Promise((resolve, reject) => {
                    mapRef.current.locate({
                        setView: false, // Não centraliza o mapa no usuário automaticamente
                        maxZoom: 16,
                        watch: false, // Não continua assistindo
                        enableHighAccuracy: true,
                        timeout: 10000 // 10 segundos
                    });
                    mapRef.current.once('locationfound', (e) => {
                        startLatLng = e.latlng;
                        resolve();
                    });
                    mapRef.current.once('locationerror', (e) => {
                         console.error("Erro ao obter localização do usuário:", e);
                         alert("Não foi possível obter sua localização atual. Verifique as permissões e tente novamente.");
                         reject(new Error("Erro de localização"));
                    });
                });
            } else {
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startPoint)}&limit=1`);
                const geoData = await geoResponse.json();
                if (geoData && geoData[0]) {
                    startLatLng = L.latLng(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
                } else {
                    alert("Ponto de partida não encontrado.");
                    setIsCalculatingRoute(false);
                    return;
                }
            }

            if (!startLatLng) {
                 setIsCalculatingRoute(false);
                 return;
            }

            const destLatLng = L.latLng(destinationHorta.latitude, destinationHorta.longitude);

            // Usando OSRM para roteamento (exemplo, substitua pela sua instância ou serviço)
            // Certifique-se que o OSRM está configurado para o perfil desejado (car, foot, bike)
            const osrmBaseUrl = 'https://router.project-osrm.org/route/v1'; // Servidor público de demonstração do OSRM
            const profile = 'driving'; // ou 'foot', 'bike'
            const osrmUrl = `${osrmBaseUrl}/${profile}/${startLatLng.lng},${startLatLng.lat};${destLatLng.lng},${destLatLng.lat}?overview=full&geometries=geojson`;

            const routeResponse = await fetch(osrmUrl);
            const routeData = await routeResponse.json();

            if (routeData.routes && routeData.routes.length > 0) {
                const routeCoordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // L.Polyline espera [lat, lng]
                const polyline = L.polyline(routeCoordinates, { color: 'blue', weight: 5 });

                const newRoutingControl = L.layerGroup([
                    L.marker(startLatLng).bindPopup("Ponto de Partida"),
                    L.marker(destLatLng).bindPopup(destinationHorta.nomeHorta),
                    polyline
                ]).addTo(mapRef.current);

                mapRef.current.fitBounds(polyline.getBounds());
                setRoutingControl(newRoutingControl);
            } else {
                alert("Não foi possível calcular a rota.");
            }
        } catch (error) {
            console.error("Erro ao calcular rota:", error);
            alert("Ocorreu um erro ao tentar calcular a rota.");
        } finally {
            setIsCalculatingRoute(false);
        }
    }, [mapRef, startPoint, destinationHorta, routingControl]); // Adicionado routingControl às dependências


    const handleClearRoute = () => {
        if (routingControl && mapRef.current) {
            mapRef.current.removeControl(routingControl); // Correto para LayerGroup
        }
        setRoutingControl(null);
        setDestinationHorta(null); // Limpa o destino selecionado
        // Opcional: setStartPoint(""); // Limpa o ponto de partida
    };


    const handleToggleFullScreen = useCallback(() => {
        if (screenfull.isEnabled && mapContainerRef.current) {
            screenfull.toggle(mapContainerRef.current);
        }
    }, []);

    useEffect(() => {
        if (screenfull.isEnabled) {
            const handleChange = () => setIsFullScreen(screenfull.isFullscreen);
            screenfull.on('change', handleChange);
            return () => screenfull.off('change', handleChange);
        }
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className={`relative w-full ${isEmbedded ? "h-[600px] rounded-xl overflow-hidden" : "h-screen"}`}
        >
            <div
                className={`absolute inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <div className={`absolute top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <Sidebar
                    onClose={() => setIsSidebarOpen(false)}
                    tiposDeHorta={tiposDeHortaOptions}
                    activeFilters={activeFilters}
                    onToggleFilter={(tipoNome) => setActiveFilters(prev => prev.includes(tipoNome) ? prev.filter(f => f !== tipoNome) : [...prev, tipoNome])}
                    onSelectAllFilters={(selectAll) => setActiveFilters(selectAll ? tiposDeHortaOptions.map(t => t.nome) : [])}
                    searchTerm={searchTerm}
                    onSearchTermChange={(e) => setSearchTerm(e.target.value)}
                    onSearchSubmit={handleSearchSubmit}
                    startPoint={startPoint}
                    onStartPointChange={(e) => setStartPoint(e.target.value)}
                    destinationPoint={destinationHorta ? destinationHorta.nomeHorta : ""}
                    onCalculateRoute={handleCalculateRoute}
                    onClearRoute={handleClearRoute}
                    isCalculatingRoute={isCalculatingRoute}
                />
            </div>

            <MapContainer
                ref={mapRef}
                center={initialPosition}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                zoomControl={false} // Desabilita o controle de zoom padrão do Leaflet, pois temos um customizado
            >
                <MapControls
                    onToggleFullScreen={handleToggleFullScreen}
                    isFullScreen={isFullScreen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {/* 
                  Adicionar uma chave ao MarkerClusterGroup que muda quando filteredHortas muda
                  pode forçar a recriação do cluster, o que pode ser útil se os marcadores não
                  estiverem atualizando corretamente após a filtragem.
                  A chave abaixo usa os IDs das hortas para tentar ser mais específica.
                */}
                <MarkerClusterGroup key={filteredHortas.map(h => h.idHorta).join('-')}>
                    {filteredHortas.map(horta => (
                        <Marker
                            key={horta.idHorta}
                            position={[horta.latitude, horta.longitude]}
                            icon={Icons[normalizeTipoNome(horta.tipoDeHorta?.nome)] || Icons.DEFAULT}
                        >
                            <Popup>
                                <HortaPopup horta={horta} onSetAsDestination={handleSetAsDestination} />
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {(loadingMessage || error) && (!filteredHortas.length && !allHortas.length || error) && ( // Mostrar se houver erro ou se estiver carregando e não houver hortas
                 <div className="absolute inset-0 flex items-center justify-center z-[500] bg-gray-200/80 backdrop-blur-sm pointer-events-none">
                    <div className="text-center p-4 bg-white/80 rounded-lg shadow-lg max-w-sm">
                        {loadingMessage && !error && <FiLoader className="animate-spin text-4xl text-green-600 mx-auto mb-2" />}
                        {error && <FiAlertTriangle className="text-4xl text-red-500 mx-auto mb-2" />}
                        <p className={`font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
                            {error || loadingMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;