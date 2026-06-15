using MedConnect.Backend.DTOs;
using MedConnect.Backend.Models;
using MedConnect.Backend.Services;

namespace MedConnect.Backend.GraphQL;

public class Mutation
{
    public async Task<Patient> RegisterPatient(
        RegisterPatientDto input,
        [Service] PatientService patientService
    )
    {
        return await patientService.AddPatientAsync(input); 
    }
}