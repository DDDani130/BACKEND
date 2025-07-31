import React, { useState, useEffect } from 'react';
import apiService from '../config/api';

export default function BackendConnection() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [connectionData, setConnectionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      const result = await apiService.checkBackendConnection();
      
      if (result.connected) {
        setConnectionStatus('connected');
        setConnectionData(result.data);
        setError(null);
      } else {
        setConnectionStatus('disconnected');
        setError(result.error);
        setConnectionData(null);
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      setConnectionData(null);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '✅';
      case 'disconnected':
        return '❌';
      case 'checking':
        return '⏳';
      case 'error':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado al Backend';
      case 'disconnected':
        return 'Desconectado del Backend';
      case 'checking':
        return 'Verificando conexión...';
      case 'error':
        return 'Error de conexión';
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: connectionStatus === 'connected' ? '#4CAF50' : 
                  connectionStatus === 'disconnected' ? '#f44336' : '#ff9800',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>{getStatusIcon()}</span>
        <span>{getStatusText()}</span>
      </div>
      
      {connectionStatus === 'connected' && connectionData && (
        <div style={{ marginTop: '5px', fontSize: '12px', opacity: 0.9 }}>
          <div>Backend: {connectionData.message}</div>
          <div>Ambiente: {connectionData.environment}</div>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '5px', fontSize: '12px', opacity: 0.9 }}>
          Error: {error}
        </div>
      )}
      
      <button 
        onClick={checkConnection}
        style={{
          marginTop: '8px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Reintentar
      </button>
    </div>
  );
} 