import React from 'react';
import styles from './SaludBienestar.module.css';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'item',
    item: { id: item.id, text: item.text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag} 
      className={styles.draggableItem} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {item.text}
    </div>
  );
};

const LeftPanel = () => {
  const [habitosOpen, setHabitosOpen] = React.useState(false);
  const [accionesOpen, setAccionesOpen] = React.useState(false);
  
  const handleHabitosClick = () => {
    setHabitosOpen((open) => {
      if (!open) setAccionesOpen(false);
      return !open;
    });
  };
  const handleAccionesClick = () => {
    setAccionesOpen((open) => {
      if (!open) setHabitosOpen(false);
      return !open;
    });
  };

  const habitos = [
    { id: 'h1', text: 'Comer fruta 🍎' },
    { id: 'h2', text: 'Dormir bien 😴' },
    { id: 'h3', text: 'Hacer ejercicio 💪' },
  ];
  const acciones = [
    { id: 'a1', text: 'Fumar 🚬' },
    { id: 'a2', text: 'Beber alcohol 🍺' },
  ];

  return (
    <aside className={styles.leftPanel}>
      <button onClick={handleHabitosClick} className={styles.interactionButton}>Hábitos ▼</button>
      <div className={`${styles.dropdown} ${habitosOpen ? styles.show : ''}`}>
        {habitos.map(h => <DraggableItem key={h.id} item={h} />)}
      </div>
      <button onClick={handleAccionesClick} className={styles.interactionButton}>Acciones ▼</button>
      <div className={`${styles.dropdown} ${accionesOpen ? styles.show : ''}`}>
        {acciones.map(a => <DraggableItem key={a.id} item={a} />)}
      </div>
    </aside>
  );
};

export default LeftPanel; 