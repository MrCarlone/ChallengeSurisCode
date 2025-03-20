using System.Text.Json.Serialization;

namespace Service.Model
{
    public class Reserva
    {

        public int idServicio { get; set; }
        public int idHora { get; set; }

        public string cliente { get; set; }
    }
}
