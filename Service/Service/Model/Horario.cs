namespace Service.Model
{
    public class Horario
    {
        public int Id { get; set; }
        public int Hora { get; set; }
        public bool Disponible { get; set; }

        public Horario(int id, int hora, bool disp)
        {
            Id = id;
            Hora = hora;
            Disponible = disp;
        }
    }
}
