using MedConnect.Backend.Repository;
using Microsoft.EntityFrameworkCore;
using MedConnect.Backend.Models;
using MedConnect.Backend.Data;

public class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;
    public PatientRepository(
        AppDbContext context
    )
    {
        _context = context;
    }
    public async Task AddAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Patient>> BrowsePatients()
    {
        return await _context.Patients.ToListAsync();
    }

    public async Task UpdateAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }

    public async Task<Patient?> GetPatientById(Guid id)
    {
        return await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task DeleteAsync(Patient patient)
    {
         _context.Patients.Remove(patient);
         await _context.SaveChangesAsync();
    }
}