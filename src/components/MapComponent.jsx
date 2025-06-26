import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import {
    FiCompass, FiLoader, FiAlertTriangle, FiArrowRight, FiMaximize, FiMinimize,
    FiSearch, FiNavigation, FiX, FiMenu, FiChevronDown, FiPlus, FiMinus
} from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom'; // REMOVIDO: Não vamos usar useNavigate aqui por enquanto
import screenfull from 'screenfull';

import api, { BACKEND_URL } from '../services/api';

import HortaComunitariaIcon from '../assets/icons/horta-comunitaria.svg';
import HortaDefaultIcon from '../assets/icons/horta-default.svg';
import HortaEscolarIcon from '../assets/icons/horta-escolar.svg';
import HortaInstitucionalIcon from '../assets/icons/horta-institucional.svg';
import SeauIcon from '../assets/icons/seau.svg';
import TerreiroIcon from '../assets/icons/terreiro.svg';
import UnidadeDeSaudeIcon from '../assets/icons/unidade-de-saude.svg';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const normalizeTipoNome = (nome) => {
    if (!nome) return 'DEFAULT';
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
};

const Icons = {
    DEFAULT: new L.Icon({ iconUrl: HortaDefaultIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    ESCOLAR: new L.Icon({ iconUrl: HortaEscolarIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    SAUDE: new L.Icon({ iconUrl: UnidadeDeSaudeIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    INSTITUCIONAL: new L.Icon({ iconUrl: HortaInstitucionalIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    COMUNITARIA: new L.Icon({ iconUrl: HortaComunitariaIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    SEAU: new L.Icon({ iconUrl: SeauIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
    TERREIRO: new L.Icon({ iconUrl: TerreiroIcon, iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] }),
};

// --- HortaPopup MODIFICADO ---
const HortaPopup = ({ horta, onSetAsDestination }) => {
    // const navigate = useNavigate(); // REMOVIDO

    const imageUrl = horta.imagemCaminho && horta.imagemCaminho !== 'folhin.png'
        ? `${BACKEND_URL}/uploads/imagem/${horta.imagemCaminho}`
        : '/placeholder-horta.png';

    const nomeHorta = horta.nomeHorta || "Nome não disponível";
    const endereco = horta.endereco || "Endereço não disponível";
    const tipoHortaNome = horta.tipoDeHorta?.nome || "Tipo não especificado";
    const nomeResponsavel = horta.usuario?.pessoa?.nome || "Responsável não informado";

    const handleVerDetalhesClick = () => {
        // Ação placeholder. Substitua pela lógica desejada (ex: abrir modal).
        alert(`Implementar visualização de detalhes para: ${nomeHorta} (ID: ${horta.idHorta})`);
        console.log("Dados da horta para detalhes:", horta);
        // Se você tiver uma função para abrir um modal de detalhes, chame-a aqui:
        // onOpenDetailsModal(horta); 
    };

    return (
        <div className="w-64 font-sans text-sm">
            <img 
                src={imageUrl} 
                alt={nomeHorta} 
                className="w-full h-32 object-cover rounded-t-md bg-gray-200"
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = '/placeholder-horta.png'; 
                }}
            />
            <div className="p-3">
                <h3 className="font-bold text-gray-800 text-base mb-1 truncate" title={nomeHorta}>
                    {nomeHorta}
                </h3>
                <p className="text-xs text-gray-600 mb-0.5" title={endereco}>
                    <span className="font-semibold">Endereço:</span> {endereco}
                </p>
                <p className="text-xs text-gray-600 mb-0.5">
                    <span className="font-semibold">Tipo:</span> {tipoHortaNome}
                </p>
                {horta.usuario?.pessoa?.nome && (
                    <p className="text-xs text-gray-600 mb-2"> 
                        <span className="font-semibold">Responsável:</span> {nomeResponsavel}
                    </p>
                )}
                
                <div className="space-y-2 mt-3">
                    <button 
                        onClick={handleVerDetalhesClick} // MODIFICADO
                        className="w-full text-xs py-2 px-3 text-center font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-150"
                    >
                        Ver Detalhes <FiArrowRight size={14}/>
                    </button>
                    <button 
                        onClick={() => {
                            onSetAsDestination(horta);
                        }} 
                        className="w-full text-xs py-2 px-3 text-center font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md flex items-center justify-center gap-1.5 transition-colors duration-150"
                    >
                        Definir como Destino <FiNavigation size={14}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sidebar, MapControls, e a definição principal de MapComponent permanecem os mesmos da última versão ---
// (Lembre-se de que o MapComponent principal deve ter a importação correta dos hooks do React,
// como import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';)

const Sidebar = ({
    tiposDeHorta, activeFilters, onToggleFilter, onSelectAllFilters,
    searchTerm, onSearchTermChange, onSearchSubmit,
    startPoint, onStartPointChange,
    allHortasForSearch,
    currentDestinationHorta,
    onDestinationHortaSelected,
    onCalculateRoute, onClearRoute, isCalculatingRoute, onClose
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(true);
    const allFiltersActuallySelected = tiposDeHorta.length > 0 && activeFilters.length === tiposDeHorta.length;
    const isEffectivelyAllSelected = activeFilters.length === 0 || allFiltersActuallySelected;

    const [destinationSearchTerm, setDestinationSearchTerm] = useState('');
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    const destinationInputRef = useRef(null);

    useEffect(() => {
        if (currentDestinationHorta) {
            setDestinationSearchTerm(currentDestinationHorta.nomeHorta);
            setShowDestinationSuggestions(false);
        } else {
            setDestinationSearchTerm('');
        }
    }, [currentDestinationHorta]);

    const handleDestinationSearchChange = (e) => {
        const query = e.target.value;
        setDestinationSearchTerm(query);
        if (query.length > 1) {
            const filteredHortas = allHortasForSearch.filter(horta =>
                horta.nomeHorta.toLowerCase().includes(query.toLowerCase())
            );
            setDestinationSuggestions(filteredHortas.slice(0, 5));
            setShowDestinationSuggestions(true);
        } else {
            setDestinationSuggestions([]);
            setShowDestinationSuggestions(false);
        }
    };

    const handleSuggestionClick = (horta) => {
        onDestinationHortaSelected(horta);
        setDestinationSearchTerm(horta.nomeHorta);
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
    };

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (destinationInputRef.current && !destinationInputRef.current.contains(event.target)) {
                 setShowDestinationSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [destinationInputRef]);

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
                                <input 
                                    type="text" 
                                    id="startPoint" 
                                    placeholder="Meu local ou endereço" 
                                    value={startPoint} 
                                    onChange={onStartPointChange} 
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                />
                            </div>
                            <div className="relative" ref={destinationInputRef}>
                                <label htmlFor="destinationPoint" className="block text-xs font-medium text-gray-600 mb-0.5">Destino (Horta)</label>
                                <input 
                                    type="text" 
                                    id="destinationPoint" 
                                    placeholder="Digite o nome da horta..." 
                                    value={destinationSearchTerm} 
                                    onChange={handleDestinationSearchChange}
                                    onFocus={() => { if (destinationSearchTerm.length > 1 && destinationSuggestions.length > 0) setShowDestinationSuggestions(true);}}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                />
                                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                        {destinationSuggestions.map(horta => (
                                            <li 
                                                key={horta.idHorta} 
                                                onClick={() => handleSuggestionClick(horta)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            >
                                                {horta.nomeHorta}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={onCalculateRoute} 
                                    disabled={isCalculatingRoute || !currentDestinationHorta}
                                    className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
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
    const [locationMarker, setLocationMarker] = useState(null);
    const [accuracyCircle, setAccuracyCircle] = useState(null);

    const zoomIn = () => map.zoomIn();
    const zoomOut = () => map.zoomOut();

    const locateUser = () => {
        if (locationMarker) {
            map.removeLayer(locationMarker);
            setLocationMarker(null);
        }
        if (accuracyCircle) {
            map.removeLayer(accuracyCircle);
            setAccuracyCircle(null);
        }

        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };

    useEffect(() => {
        const handleLocationFound = (e) => {
            const radius = e.accuracy;
            const latlng = e.latlng;

            if (locationMarker && map.hasLayer(locationMarker)) map.removeLayer(locationMarker);
            if (accuracyCircle && map.hasLayer(accuracyCircle)) map.removeLayer(accuracyCircle);
            
            const newMarker = L.marker(latlng).addTo(map);
            let popupMessage = `Você está aqui (precisão de ${radius.toFixed(0)} m).`;
            if (radius > 1000) {
                popupMessage = `Sua localização é aproximada (raio de ${radius.toFixed(0)} m). Para maior precisão, tente em um local aberto ou verifique as configurações do seu dispositivo.`;
            }
            newMarker.bindPopup(popupMessage).openPopup();
            setLocationMarker(newMarker);

            const newCircle = L.circle(latlng, radius).addTo(map);
            setAccuracyCircle(newCircle);
        };

        const handleLocationError = (e) => {
            let message = "Erro ao obter localização: ";
            switch (e.code) {
                case 1: 
                    message += "Permissão negada. Verifique as configurações de localização do seu navegador e sistema.";
                    break;
                case 2: 
                    message += "Localização indisponível no momento. Tente novamente.";
                    break;
                case 3: 
                    message += "Tempo esgotado ao tentar obter a localização. Tente novamente.";
                    break;
                default:
                    message += e.message;
            }
            alert(message);
        };

        map.on('locationfound', handleLocationFound);
        map.on('locationerror', handleLocationError);

        return () => {
            map.off('locationfound', handleLocationFound);
            map.off('locationerror', handleLocationError);
        };
    }, [map, locationMarker, accuracyCircle]);

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
        setAllHortas([]);
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
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
                    const geoResponse = await fetch(url);
                    if (!geoResponse.ok) {
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
                    return null;
                }
            });
            const results = await Promise.all(geocodePromises);
            const validHortas = results.filter(h => h !== null && typeof h.latitude === 'number' && typeof h.longitude === 'number');
            setAllHortas(validHortas);

             if (validHortas.length === 0 && hortasParaGeocodificar.length > 0) {
                setError(term ? "Não foi possível localizar as hortas com o termo pesquisado." : "Não foi possível geocodificar os endereços das hortas ativas.");
            } else if (validHortas.length > 0) {
                setError(null);
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
        if (isEmbedded || !isSidebarOpen) {
            setIsSidebarOpen(true);
        }
    };

    const handleCalculateRoute = useCallback(async () => {
        if (!mapRef.current || !destinationHorta) {
            alert("Por favor, selecione uma horta de destino.");
            return;
        }
        
        const isUsingCurrentLocationAsStart = !startPoint.trim(); 

        setIsCalculatingRoute(true);
        if (routingControl) {
            mapRef.current.removeControl(routingControl);
            setRoutingControl(null);
        }

        try {
            let startLatLng;

            if (isUsingCurrentLocationAsStart || startPoint.toLowerCase().includes('minha localização') || startPoint.toLowerCase().includes('local atual')) {
                if (isUsingCurrentLocationAsStart) {
                    console.log("Ponto de partida não definido, usando localização atual.");
                }
                await new Promise((resolve, reject) => {
                    mapRef.current.locate({
                        setView: false,
                        maxZoom: 16,
                        watch: false,
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 0
                    });
                    mapRef.current.once('locationfound', (e) => {
                        const accuracy = e.accuracy;
                        console.log(`Precisão da localização para rota: ${accuracy} metros`);
                        if (accuracy > 2000) {
                            if (!window.confirm(`Sua localização inicial tem uma precisão de ${accuracy.toFixed(0)} metros. A rota pode não ser exata. Deseja continuar?`)) {
                                reject(new Error("Localização com baixa precisão, cálculo de rota cancelado pelo usuário."));
                                return;
                            }
                        }
                        startLatLng = e.latlng;
                        resolve();
                    });
                    mapRef.current.once('locationerror', (e) => {
                         console.error("Erro ao obter localização do usuário para rota:", e);
                         let message = "Não foi possível obter sua localização atual para a rota. ";
                         switch (e.code) {
                             case 1: message += "Permissão negada."; break;
                             case 2: message += "Localização indisponível."; break;
                             case 3: message += "Tempo esgotado."; break;
                             default: message += "Erro desconhecido.";
                         }
                         alert(message + " Verifique as permissões e tente novamente, ou digite um endereço de partida.");
                         reject(new Error("Erro de localização para rota: " + e.message));
                    });
                });
            } else {
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startPoint)}&limit=1`);
                const geoData = await geoResponse.json();
                if (geoData && geoData[0]) {
                    startLatLng = L.latLng(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
                } else {
                    alert("Ponto de partida digitado não encontrado.");
                    setIsCalculatingRoute(false);
                    return;
                }
            }

            if (!startLatLng) {
                 setIsCalculatingRoute(false);
                 return;
            }

            const destLatLng = L.latLng(destinationHorta.latitude, destinationHorta.longitude);
            const osrmBaseUrl = 'https://router.project-osrm.org/route/v1';
            const profile = 'driving';
            const osrmUrl = `${osrmBaseUrl}/${profile}/${startLatLng.lng},${startLatLng.lat};${destLatLng.lng},${destLatLng.lat}?overview=full&geometries=geojson`;

            const routeResponse = await fetch(osrmUrl);
            const routeData = await routeResponse.json();

            if (routeData.routes && routeData.routes.length > 0) {
                const routeCoordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                const polyline = L.polyline(routeCoordinates, { color: 'blue', weight: 5 });

                const newRoutingControl = L.layerGroup([
                    L.marker(startLatLng).bindPopup(isUsingCurrentLocationAsStart ? "Minha Localização Atual" : "Ponto de Partida"),
                    L.marker(destLatLng).bindPopup(destinationHorta.nomeHorta),
                    polyline
                ]).addTo(mapRef.current);

                mapRef.current.fitBounds(polyline.getBounds());
                setRoutingControl(newRoutingControl);
            } else {
                alert("Não foi possível calcular a rota. Verifique os pontos ou tente novamente.");
            }
        } catch (error) {
            if (error.message && !error.message.startsWith("Erro de localização") && !error.message.startsWith("Localização com baixa precisão")) {
                console.error("Erro ao calcular rota:", error);
                alert("Ocorreu um erro ao tentar calcular a rota: " + error.message);
            }
        } finally {
            setIsCalculatingRoute(false);
        }
    }, [mapRef, startPoint, destinationHorta, routingControl]);


    const handleClearRoute = () => {
        if (routingControl && mapRef.current) {
            if (mapRef.current.hasLayer(routingControl)) {
                mapRef.current.removeControl(routingControl);
            }
        }
        setRoutingControl(null);
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
                    allHortasForSearch={allHortas}
                    currentDestinationHorta={destinationHorta}
                    onDestinationHortaSelected={setDestinationHorta}
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
                zoomControl={false}
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

            {(loadingMessage || error) && (!filteredHortas.length && !allHortas.length || error) && (
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