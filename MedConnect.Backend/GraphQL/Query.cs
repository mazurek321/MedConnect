using MedConnect.Backend.Models;
using MedConnect.Backend.Services;

namespace MedConnect.Backend.GraphQL;

public class Query
{
    public Task<IEnumerable<Patient>> GetPatients([Service] PatientService patientService) 
        => patientService.GetAllPatientsAsync();
}