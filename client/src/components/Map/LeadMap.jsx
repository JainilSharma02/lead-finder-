import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Star, MapPin, Navigation, Info, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/messageTemplate';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const createTealIcon = () => {
  return new L.DivIcon({
    className: 'custom-teal-icon',
    html: `<div class="w-8 h-8 rounded-full bg-[#22D3D8] border-4 border-[#0A0A0B] shadow-[0_0_15px_rgba(34,211,216,0.4)] flex items-center justify-center text-background">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const MapController = ({ center, zoom, focusLead }) => {
  const map = useMap();
  
  useEffect(() => {
    if (focusLead && focusLead.coordinates && focusLead.coordinates.lat) {
      map.flyTo([focusLead.coordinates.lat, focusLead.coordinates.lon], 16, {
        duration: 1.5
      });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, focusLead, map]);
  
  return null;
};

const LeadMap = ({ leads, focusLead, className = '' }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); 
  const [zoom, setZoom] = useState(5);
  
  const validLeads = leads.filter(l => l.coordinates && l.coordinates.lat && l.coordinates.lon);
  
  useEffect(() => {
    if (validLeads.length > 0 && !focusLead) {
      const bounds = L.latLngBounds(validLeads.map(l => [l.coordinates.lat, l.coordinates.lon]));
      setMapCenter(bounds.getCenter());
      setZoom(13);
    }
  }, [leads.length, focusLead]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(14);
      });
    }
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border border-surface-border bg-[#0A0A0B] shadow-2xl ${className}`}>
      {/* Map Overlay Stats - Moved to prevent modal overlap */}
      <div className="absolute bottom-6 left-6 z-[800] flex flex-col gap-2">
        <div className="px-4 py-2 bg-background/80 backdrop-blur-md border border-surface-border rounded-lg flex items-center gap-2 shadow-xl">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">
            {validLeads.length} Interactive Markers
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[800] flex flex-col gap-3">
        <button 
          onClick={handleGetCurrentLocation}
          className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-md border border-surface-border flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-xl active:scale-95"
          title="Current Location"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={mapCenter} zoom={zoom} focusLead={focusLead} />

        {validLeads.map((lead) => (
          <Marker 
            key={lead.placeId || lead._id} 
            position={[lead.coordinates.lat, lead.coordinates.lon]}
            icon={createTealIcon()}
          >
            <Popup className="custom-dark-popup">
              <div className="p-1 w-64">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-foreground leading-tight">{lead.businessName}</h4>
                    <p className="text-[10px] font-medium text-foreground-muted/70 mt-1 uppercase tracking-tight">{lead.category}</p>
                  </div>
                  {lead.rating && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold h-fit">
                      <Star className="w-2.5 h-2.5 fill-primary" />
                      {lead.rating}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 mb-4 text-[11px] text-foreground-muted">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{lead.address}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={buildWhatsAppUrl(lead.phone, `Hi ${lead.businessName}, found you on Lead Finder Pro.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-primary !h-9 !text-[10px] gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a 
                    href={lead.mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-9 rounded-lg bg-surface-raised border border-surface-border flex items-center justify-center text-foreground-muted hover:text-primary transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .leaflet-container {
          background: #0A0A0B !important;
        }
        .custom-dark-popup .leaflet-popup-content-wrapper {
          background: #141416 !important;
          color: #F2F2F0 !important;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 0;
        }
        .custom-dark-popup .leaflet-popup-tip {
          background: #141416 !important;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .custom-dark-popup .leaflet-popup-content {
          margin: 12px;
        }
        .leaflet-bar {
          border: 1px solid rgba(255,255,255,0.06) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important;
        }
        .leaflet-bar a {
          background-color: #141416 !important;
          color: #F2F2F0 !important;
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        }
        .leaflet-bar a:hover {
          background-color: #1A1A1D !important;
          color: #22D3D8 !important;
        }
        .leaflet-popup-close-button {
          color: #9A9A9F !important;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default LeadMap;
