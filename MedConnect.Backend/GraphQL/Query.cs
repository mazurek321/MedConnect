using HotChocolate.Authorization;
using MedConnect.Backend.Models;
using MedConnect.Backend.Services;

namespace MedConnect.Backend.GraphQL;

public class Query
{

    
    [Authorize]
    public async Task<IEnumerable<Patient>> BrowsePatients([Service] PatientService patientService) 
    { 
        return await patientService.BrowsePatients(); 
    }

    [Authorize]
    public async Task<Patient> GetPatient(Guid id, [Service] PatientService patientService)
    {
        return await patientService.GetPatient(id);
    }

   [Authorize]
    public async Task<User> GetMyData([Service] UserService userService)
    {
        return await userService.GetMyData();
    }



    public async Task<IEnumerable<Patient>> BrowsePatientsForSimulation([Service] PatientService patientService) 
    { 
        return await patientService.BrowsePatients(); 
    }
}