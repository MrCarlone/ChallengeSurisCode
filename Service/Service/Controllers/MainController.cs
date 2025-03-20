using Microsoft.AspNetCore.Mvc;
using Service.Model;
using Microsoft.Extensions.Options;
using System.Runtime.CompilerServices;
using Microsoft.Extensions.Configuration;

namespace Service.Controllers
{
    [ApiController]
    [Route("Services")]
    public class MainController : ControllerBase
    {
        public static List<Horario> _horarios = new List<Horario>();
        public static List<Reserva> _reservas = new List<Reserva>();

        //Servicio Get generico
        [HttpGet]
        [Route("GetListados")]
        public dynamic GetServicios(string name)
        {
            List<Servicio> servicios = new List<Servicio>();
            List<Horario> horarios = new List<Horario>();
            IConfiguration _configuracion = HttpContext.RequestServices.GetService<IConfiguration>();
            switch (name.ToLower()) 
            { 
                case "servicios":
                    servicios = _configuracion.GetSection("Servicios").Get<List<Servicio>>();
                    break;
                case "horarios":
                    int horaMin = _configuracion.GetValue<int>("HoraMin");
                    int horaMax = _configuracion.GetValue<int>("HoraMax");
                    for(int i = horaMin; i < horaMax;i++)
                    {
                        horarios.Add(new Horario(i, i, true));
                    }
                    _horarios = horarios;
                    break;
                default:
                    break;
            }

            if (servicios.Count() > 0)
                return servicios;
            else if (horarios.Count() > 0)
                return horarios;
            else
                return "No se encontro listado.";
        }

        [HttpPost]
        [Route("SetReserva")]
        public dynamic SetService([FromBody] Reserva reservaRequest)
        { //TODO : Puedo agregar fechas
            if (reservaRequest == null)
                return BadRequest(new { error = "La reserva no es válida." });

            //Validar hora libre
            if (!_horarios.FirstOrDefault(h => h.Id == reservaRequest.idHora).Disponible)
                return BadRequest(new { error = "No se puede reservar en este horario."});
            //Validar cliente ya reservo hoy
            Reserva r = _reservas.FirstOrDefault(h => h.cliente.ToLower() == reservaRequest.cliente.ToLower());
            if (r != null)
                return BadRequest(new { error = reservaRequest.cliente + " ya realizo una reserva hoy." });

            _reservas.Add(reservaRequest);
            _horarios.FirstOrDefault(h => h.Id == reservaRequest.idHora).Disponible = false;
            return Ok(new { message = "Reserva exitosa!"});
        }
    }
}
