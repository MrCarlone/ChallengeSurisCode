import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

    /* Var */
    const [nombreCliente, setNombreCliente] = useState("");
    const [servicios, setServicios] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
    
    /* Funciones */

    useEffect(() => {
        // Obtener los servicios
         
        fetch('https://localhost:7240/Services/GetListados?name=sErvicIOS')  // Cambia la URL por la URL correcta de tu API
            .then(response => response.json())
            .then(data => setServicios(data))
            .catch(error => console.error('Error fetching servicios:', error));

        // Obtener los horarios
        fetch('https://localhost:7240/Services/GetListados?name=HorariOS')  // Cambia la URL por la URL correcta de tu API
            .then(response => response.json())
            .then(data => setHorarios(data))
            .catch(error => console.error('Error fetching horarios:', error));
    }, []);

    const SetReserva = () => {
        if (!servicioSeleccionado || !horarioSeleccionado || !nombreCliente) {
            alert('Por favor, complete todos los campos');
            return;
        }

        const reservaData = {
            idHora: horarioSeleccionado.id,
            idServicio: servicioSeleccionado.id,
            cliente: nombreCliente
        };

        fetch('https://localhost:7240/Services/SetReserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservaData)  
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        console.error('Error de validación:', errorData.error);
                        throw new Error(errorData.error);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Reserva exitosa:', data);
                alert('Reserva realizada con éxito');
            })
            .catch(error => {
                console.error('Error al realizar la reserva:', error);
                alert(error);
            });
    };


    /* Front */ 
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

        <h1>Reservas Suris Code</h1>
        <div>
            <p htmlFor="nombre">Cliente: </p>
            <input
                type="text"
                id="nombre"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}/>
        </div>

        <div>
            <p htmlFor="servicio">Servicio: </p>
            <select
                id="servicio"
                onChange={(e) => setServicioSeleccionado(servicios.find(servicio => servicio.id === parseInt(e.target.value)))}
            >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                        {servicio.name}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <p htmlFor="horario">Horario: </p>
            <select
            id="horario"
            onChange={(e) => setHorarioSeleccionado(horarios.find(h => h.id === parseInt(e.target.value)))}
            >
            <option value="">Seleccione un horario</option>
            {horarios.map((horario) => (
                <option key={horario.id} value={horario.id}>
                {horario.hora}
                </option>
            ))}
            </select>
        </div>

        <div className="card">
              <button onClick={SetReserva}>Reservar</button>   
        </div>


         

    </>
  )

    
}

export default App
