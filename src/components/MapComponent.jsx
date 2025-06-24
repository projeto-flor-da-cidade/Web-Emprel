// Caminho do Arquivo: src/components/MapComponent.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import { 
    FiCompass, FiLoader, FiAlertTriangle, FiArrowRight, FiFilter, FiMaximize, FiMinimize, 
    FiSearch, FiNavigation, FiX, FiMenu, FiChevronDown 
} from 'react-icons/fi'; // Removidos ícones não usados, FiLayers, FiHome, FiBriefcase, FiAward
import { useNavigate } from 'react-router-dom';
import screenfull from 'screenfull';

import api, { BACKEND_URL } from '../services/api';

// --- ÍCONES E CONFIGURAÇÕES DO MAPA ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const normalizeTipoNome = (nome) => {
    if (!nome) return 'DEFAULT';
    // Converte para maiúsculas, substitui espaços e caracteres especiais por underscore
    return nome.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
};

const Icons = {
    DEFAULT: new L.Icon({ iconUrl: '../assets/icons/horta-default.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    HORTA_COMUNITARIA: new L.Icon({ iconUrl: '../assets/icons/horta-comunitaria.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    HORTA_INSTITUCIONAL: new L.Icon({ iconUrl: '../assets/icons/horta-institucional.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    HORTAS_ESCOLARES: new L.Icon({ iconUrl: '../assets/icons/hortas-escolares.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }), // Corrigido nome do arquivo
    SEAU: new L.Icon({ iconUrl: '../assets/icons/seau.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    TERREIRO: new L.Icon({ iconUrl: '../assets/icons/terreiro.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    UNIDADE_DE_SAUDE: new L.Icon({ iconUrl: '../assets/icons/unidade-de-saude.svg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
};

// --- COMPONENTES AUXILIARES ---
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
                    <button 
                        onClick={() => navigate(`/hortas/${horta.idHorta}`)}
                        className="w-full text-xs py-1.5 px-2 text-center font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md flex items-center justify-center gap-1"
                    >
                        Ver Detalhes <FiArrowRight size={14}/>
                    </button>
                    <button 
                        onClick={() => onSetAsDestination(horta)}
                        className="w-full text-xs py-1.5 px-2 text-center font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center gap-1"
                    >
                        Destino <FiNavigation size={14}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ 
    tiposDeHorta, activeFilters, onToggleFilter, onSelectAllFilters,
    searchTerm, onSearchTermChange, onSearchSubmit,
    startPoint, onStartPointChange, destinationPoint, 
    onCalculateRoute, onClearRoute, isCalculatingRoute 
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(true);
    
    const allFiltersActuallySelected = tiposDeHorta.length > 0 && activeFilters.length === tiposDeHorta.length;
    // Considera "Todos" selecionado se nenhum filtro específico estiver ativo OU se todos estiverem explicitamente selecionados
    const isEffectivelyAllSelected = activeFilters.length === 0 || allFiltersActuallySelected;


    return (
        <div className="w-full sm:w-80 md:w-96 h-full bg-white shadow-2xl flex flex-col"> {/* Removido absolute e z-index daqui, controlado pelo pai */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-green-700">Unidades Produtivas</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                <section>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Buscar Horta</h3>
                    <form onSubmit={onSearchSubmit} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Nome ou endereço..." 
                            value={searchTerm}
                            onChange={onSearchTermChange}
                            className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button type="submit" className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            <FiSearch />
                        </button>
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
                                <input type="checkbox" 
                                    checked={isEffectivelyAllSelected}
                                    onChange={() => onSelectAllFilters(!allFiltersActuallySelected)} // Se todos estão selecionados, deseleciona (ativa []), senão seleciona todos
                                    disabled={tiposDeHorta.length === 0}
                                    className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <span className="text-gray-700">Todos os Tipos</span>
                            </label>
                            {tiposDeHorta.map(tipo => (
                                <label key={tipo.idTipoDeHorta} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-md cursor-pointer">
                                    <input type="checkbox"
                                        checked={activeFilters.includes(tipo.nome)}
                                        onChange={() => onToggleFilter(tipo.nome)}
                                        className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
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
                                <input type="text" id="startPoint" placeholder="Meu local ou endereço" 
                                    value={startPoint} onChange={onStartPointChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="destinationPoint" className="block text-xs font-medium text-gray-600 mb-0.5">Destino (Horta)</label>
                                <input type="text" id="destinationPoint" placeholder="Selecione uma horta no mapa" 
                                    value={destinationPoint} readOnly
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={onCalculateRoute} disabled={isCalculatingRoute || !startPoint || !destinationPoint}
                                    className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                                    {isCalculatingRoute ? <FiLoader className="animate-spin"/> : <FiNavigation size={16}/>}
                                    Calcular
                                </button>
                                <button onClick={onClearRoute}
                                    className="py-2 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                    <FiX size={16}/>
                                </button>
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
    const locateUser = () => map.locate({ setView: true, maxZoom: 15 });
    
    useMapEvents({ resize: () => { map.invalidateSize(); } });

    return (
        <div className="leaflet-top leaflet-right mr-2 mt-2 space-y-2 z-[1000]">
             <button onClick={onToggleSidebar} title="Mostrar/Ocultar Painel" className="leaflet-control leaflet-bar p-2.5 bg-white hover:bg-gray-100 rounded shadow block sm:hidden">
                <FiMenu className="w-5 h-5 text-gray-700" />
            </button>
            <div className="leaflet-control leaflet-bar bg-white rounded shadow">
                <button onClick={locateUser} title="Achar minha localização" className="p-2.5 hover:bg-gray-100 block">
                    <FiCompass className="w-5 h-5 text-gray-700" />
                </button>
            </div>
            {screenfull.isEnabled && (
                <div className="leaflet-control leaflet-bar bg-white rounded shadow">
                    <button onClick={onToggleFullScreen} title={isFullScreen ? "Sair da Tela Cheia" : "Tela Cheia"} className="p-2.5 hover:bg-gray-100 block">
                        {isFullScreen ? <FiMinimize className="w-5 h-5 text-gray-700" /> : <FiMaximize className="w-5 h-5 text-gray-700" />}
                    </button>
                </div>
            )}
        </div>
    );
};

const MapComponent = () => {
    const [allHortas, setAllHortas] = useState([]);
    const [filteredHortas, setFilteredHortas] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);
    const [tiposDeHortaOptions, setTiposDeHortaOptions] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const mapContainerRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
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
        setAllHortas([]); // Limpa hortas anteriores antes de nova busca/geocodificação
        setFilteredHortas([]);
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
                setLoadingMessage(term ? 'Nenhuma horta encontrada para sua busca.' : 'Nenhuma horta ativa encontrada.');
                return;
            }
            setLoadingMessage(`Geocodificando ${hortasParaGeocodificar.length} endereços...`);
            const geocodePromises = hortasParaGeocodificar.map(async (horta) => {
                const query = encodeURIComponent(`${horta.endereco}, Recife, PE, Brasil`);
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
                try {
                    // Pequeno delay para não sobrecarregar Nominatim em rajadas
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50)); 
                    const geoResponse = await fetch(url, { headers: { 'Accept': 'application/json' } });
                    if (!geoResponse.ok) return null;
                    const data = await geoResponse.json();
                    if (data && data[0]) {
                        return { ...horta, latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
                    }
                    return null;
                } catch (err) { 
                    console.warn(`Falha ao geocodificar: ${horta.endereco}`, err);
                    return null; 
                }
            });
            const results = await Promise.all(geocodePromises);
            const validHortas = results.filter(h => h !== null && typeof h.latitude === 'number' && typeof h.longitude === 'number');
            setAllHortas(validHortas);

             if (validHortas.length === 0 && hortasParaGeocodificar.length > 0) {
                setError(term ? "Não foi possível localizar as hortas da busca." : "Não foi possível geocodificar os endereços.");
            } else if (validHortas.length > 0) {
                setError(null); // Limpa erro anterior se hortas foram encontradas
            }
        } catch (err) {
            setError("Não foi possível carregar os dados das hortas.");
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
    };
    
    const handleCalculateRoute = useCallback(async () => {
        if (!mapRef.current || !startPoint || !destinationHorta?.latitude || !destinationHorta?.longitude) {
            alert("Por favor, defina um ponto de partida e selecione uma horta como destino.");
            return;
        }
        setIsCalculatingRoute(true);
        if (routingControl) { 
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null); // Garante que o estado seja limpo
        }
        
        let startLatLngValue;

        const geocodeAndRoute = async (point, isCurrentLocation = false) => {
            if (isCurrentLocation) {
                mapRef.current.locate({setView: false, maxZoom: 16, watch: false, enableHighAccuracy: true})
                .on('locationfound', function(e) { 
                    startLatLngValue = e.latlng;
                    proceedWithRouting(startLatLngValue); 
                })
                .on('locationerror', function(e){ 
                    alert("Não foi possível obter sua localização atual. Verifique as permissões.");
                    setIsCalculatingRoute(false); 
                });
                return; // Sai para esperar o evento de localização
            } else if (typeof point === 'string' && point.trim() !== '') {
                const query = encodeURIComponent(`${point}, Recife, PE, Brasil`);
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
                try {
                    const geoResponse = await fetch(url, { headers: { 'Accept': 'application/json' } });
                    const data = await geoResponse.json();
                    if (data && data[0]) {
                        startLatLngValue = L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
                    } else {
                        alert("Não foi possível encontrar o ponto de partida. Tente um endereço mais específico.");
                        setIsCalculatingRoute(false); return;
                    }
                } catch (e) { 
                    alert("Erro ao geocodificar ponto de partida."); 
                    setIsCalculatingRoute(false); return; 
                }
            } else if (point.lat && point.lng) { // Se já for um objeto LatLng (não é o caso comum para startPoint string)
                 startLatLngValue = L.latLng(point.lat, point.lng);
            }

            if (!startLatLngValue) {
                 alert("Ponto de partida inválido."); 
                 setIsCalculatingRoute(false); 
                 return;
            }
            proceedWithRouting(startLatLngValue);
        };
        
        const proceedWithRouting = (sLatLng) => {
            if (!mapRef.current || !destinationHorta?.latitude || !destinationHorta?.longitude) {
                 setIsCalculatingRoute(false); return; // Checagem de segurança
            }
            const newRoutingControl = L.Routing.control({
                waypoints: [ sLatLng, L.latLng(destinationHorta.latitude, destinationHorta.longitude)],
                routeWhileDragging: true, 
                geocoder: L.Control.Geocoder.nominatim(), 
                language: 'pt-BR',
                lineOptions: { styles: [{ color: '#059669', opacity: 0.8, weight: 6 }] },
                createMarker: function(i, wp) {
                    const label = i === 0 ? 'Partida' : 'Destino';
                    const markerIcon = L.divIcon({
                        html: `<div style="background-color: ${i === 0 ? '#3B82F6' : '#10B981'}; color: white; padding: 5px 8px; border-radius: 50%; font-size: 14px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${i === 0 ? 'A' : 'B'}</div>`,
                        className: 'custom-route-marker',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    });
                    return L.marker(wp.latLng, { draggable: true, icon: markerIcon }).bindTooltip(label, {permanent: false, direction: 'top'});
                }
            }).addTo(mapRef.current);
            setRoutingControl(newRoutingControl);
            setIsCalculatingRoute(false);
        };

        if (startPoint.toLowerCase() === 'meu local') {
            geocodeAndRoute(null, true); // Passa null e flag de localização atual
        } else {
            geocodeAndRoute(startPoint);
        }

    }, [mapRef, startPoint, destinationHorta, routingControl]);

    const handleClearRoute = () => {
        if (routingControl && mapRef.current) {
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null);
        }
        setStartPoint("");
        setDestinationHorta(null);
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
        <div className="flex h-screen w-screen overflow-hidden">
            <div className={`fixed sm:relative h-full z-[1001] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}> {/* Ajuste para mobile */}
                 <Sidebar
                    tiposDeHorta={tiposDeHortaOptions} activeFilters={activeFilters}
                    onToggleFilter={(tipoNome) => setActiveFilters(prev => prev.includes(tipoNome) ? prev.filter(f => f !== tipoNome) : [...prev, tipoNome])}
                    onSelectAllFilters={(selectAll) => setActiveFilters(selectAll ? tiposDeHortaOptions.map(t => t.nome) : [])}
                    searchTerm={searchTerm} onSearchTermChange={(e) => setSearchTerm(e.target.value)} onSearchSubmit={handleSearchSubmit}
                    startPoint={startPoint} onStartPointChange={(e) => setStartPoint(e.target.value)}
                    destinationPoint={destinationHorta ? destinationHorta.nomeHorta : ""}
                    onCalculateRoute={handleCalculateRoute} onClearRoute={handleClearRoute} isCalculatingRoute={isCalculatingRoute}
                />
            </div>
            <div ref={mapContainerRef} className="flex-grow relative z-0 bg-gray-200">
                <MapContainer 
                    ref={mapRef} // Usando a ref para obter a instância do mapa
                    center={initialPosition} 
                    zoom={12} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
                    // whenCreated removido, usamos a ref agora
                >
                    <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <MarkerClusterGroup key={JSON.stringify(activeFilters) + searchTerm + allHortas.length}> {/* Chave mais robusta */}
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
                    <MapControls 
                        onToggleFullScreen={handleToggleFullScreen} 
                        isFullScreen={isFullScreen}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                </MapContainer>
                {(loadingMessage || error) && !filteredHortas.length && !allHortas.length && ( // Condição de overlay mais precisa
                     <div className="absolute inset-0 flex items-center justify-center z-[500] bg-gray-200/80 backdrop-blur-sm pointer-events-none">
                        <div className="text-center p-4">
                            {loadingMessage && !error && <FiLoader className="animate-spin text-4xl text-green-600 mx-auto mb-2" />}
                            {error && <FiAlertTriangle className="text-4xl text-red-500 mx-auto mb-2" />}
                            <p className={`font-medium ${error ? 'text-red-600' : 'text-gray-700'}`}>
                                {error || loadingMessage}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapComponent;