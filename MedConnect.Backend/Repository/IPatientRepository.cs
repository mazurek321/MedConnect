using MedConnect.Backend.Models;

namespace MedConnect.Backend.Repository;

public interface IPatientRepository
{
    Task AddAsync(Patient patient); 
    Task<IEnumerable<Patient>> BrowsePatients();
    Task UpdateAsync(Patient patient);
    Task<Patient?> GetPatientById(Guid id);
    Task<Patient?> GetPatientByPesel(string pesel);
    Task DeleteAsync(Patient patient);
}