import React from 'react';
import { Button } from 'primereact/button';
import { useNotificaciones } from '../../services/useNotificaciones';
import { useLocation, useNavigate } from 'react-router-dom';

const apiEndpoint = import.meta.env.VITE_APP_API;

function Notificacion(props) {

    const spanStyle = {fontSize: '14px', fontFamily: 'Roboto', color: 'white'};
    const buttonStyle = {height: '25px', fontSize: '14px', fontWeight: '200', fontFamily: 'Roboto', color: 'white'};
    const iconStyle = {fontSize: '14px', fontWeight: '200', color: 'white'};
    const { notificaciones, error, isLoading, isValidating, refresh } = useNotificaciones(); 
    const navigate = useNavigate();

    // Function to adjust the hora by subtracting 5 hours
    const adjustTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number); // Convert hh:mm string to numbers
        const date = new Date(); // Use current date as the basis
        date.setHours(hours - 5, minutes); // Subtract 5 hours

        // Format back to hh:mm
        const adjustedHours = date.getHours().toString().padStart(2, '0');
        const adjustedMinutes = date.getMinutes().toString().padStart(2, '0');
        return `${adjustedHours}:${adjustedMinutes}`;
    };

    // Example function to perform a PATCH request
    const updateNotification = async () => {
      const url = `${apiEndpoint}/notificacion/${props?.notificacion?.id}`; // Your API endpoint
      try {
          const response = await fetch(`${url}`, { 
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              }
          });

          if (!response.ok) {
              throw new Error(`Error: ${response.statusText}`);
          }

          const updatedNotification = await response.json();
          console.log('Notification updated successfully:', updatedNotification);
          refresh();
      } catch (error) {
          console.error('Failed to update notification:', error);
      } finally {
          navigate('/StraysFinal/view_posts_page', { state: { publicacionId: props?.notificacion?.publicacionId } });  
      }
  };

  const searchInGoogleMaps = () => {
    const { latitud, longitud } = props.notificacion;
    if(latitud && longitud) {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
        window.open(mapsUrl, '_blank');
    }
  };

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: props?.notificacion?.leida ? '#994ce5' : 'rebeccapurple', borderRadius: '10px', padding: '10px 15px', gap: '10px'}}>
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={spanStyle}>{props?.notificacion?.fecha}</span>
              <span style={spanStyle}>{props?.notificacion?.hora ? adjustTime(props.notificacion.hora) : ''}</span>
          </div>
          <div>
            <span style={spanStyle}>{props?.notificacion?.mensaje}</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
              {
                  props?.notificacion?.leida ?
                  <i style={iconStyle} className="pi pi-verified"></i> :
                  <i style={iconStyle} className="pi pi-times-circle"></i>
              }
              <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'end', gap: '10px', alignItems: 'center'}}>
                <Button style={buttonStyle} label="Buscar" icon="pi pi-external-link" size="small" onClick={searchInGoogleMaps}/>
                <Button style={buttonStyle} label="Abrir" icon="pi pi-send" size="small" onClick={updateNotification}/>
              </div>
          </div>
        </div>
    );
}

export default Notificacion;
